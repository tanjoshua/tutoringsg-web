import { NextPageWithLayout } from "../_app";
import { ReactElement, useEffect, useState } from "react";
import Layout from "../../components/layouts/Layout";
import Select from "@/components/shared/Select";
import { useFormik } from "formik";
import Creatable from "@/components/shared/Creatable";
import { RateOptions, TutorType } from "@/utils/enums";
import Head from "next/head";
import { postalCodeToRegion } from "@/utils/postalCode";
import { createTutorRequest } from "@/services/tutorRequest";
import { useRouter } from "next/router";
import { levelOptions } from "@/utils/options/levels";
import ClientViewModal from "@/components/tutor-request/ClientViewModal";
import {
  getSubjectOptions,
  levelToLevelCategory,
} from "@/utils/options/subjects";
import { regionOptions } from "@/utils/options/regions";
import { toast } from "react-hot-toast";
import { ExclamationTriangleIcon } from "@heroicons/react/20/solid";
import { Tooltip } from "react-tooltip";

const MakeTutorRequest: NextPageWithLayout = () => {
  const router = useRouter();
  const [openModal, setOpenModal] = useState(false);
  const origin = process.env.WEB_URL;

  const [clientLink, setClientLink] = useState("");
  const { values, setFieldValue, handleSubmit, handleChange, isSubmitting } =
    useFormik<{
      // types so that i can use .include
      // customer fields
      name: string;
      contactInfo: {
        email: string;
      };
      region: string;

      // tutor fields
      level: { value: string; label: string } | null;
      subject: { value: string; label: string } | null;
      gender: string;
      type: string[];
      pricing: { rate: string; rateOption: string };
      availability: string;
      description: string;
      address: string;
    }>({
      initialValues: {
        name: "",
        contactInfo: {
          email: "",
        },
        region: "",
        level: null,
        subject: null,
        gender: "",
        type: [],
        pricing: { rate: "", rateOption: "" },
        availability: "",
        description: "",
        address: "",
      },
      onSubmit: async (values) => {
        if (
          !values.name ||
          !values.contactInfo.email ||
          !values.region ||
          !values.level ||
          !values.subject ||
          values.type.length === 0 ||
          !values.pricing.rateOption ||
          !values.availability
        ) {
          toast.error("Missing fields");
          return;
        }
        try {
          const data = await createTutorRequest({
            ...values,
            levelCategory: levelToLevelCategory(values.level.value),
            level: values.level.value,
            subject: values.subject.value,
          });
          setClientLink(
            `${origin}/request/client-view/${data.clientAccessToken}`
          );
          setOpenModal(true);
        } catch (e) {
          alert("could not make request");
        }
      },
    });

  useEffect(() => {
    if (router.query.prefill && JSON.parse(router.query.prefill as string)) {
      const prefill = JSON.parse(router.query.prefill as string);
      setFieldValue("level", prefill.level);
      setFieldValue("subject", prefill.subject);
    }
  }, [router, setFieldValue]);

  return (
    <div className="px-4 pt-4 sm:px-6">
      <Head>
        <title>Tutor Request</title>
      </Head>
      <ClientViewModal
        link={clientLink}
        open={openModal}
        setOpen={setOpenModal}
      />
      <form onSubmit={handleSubmit}>
        <div className="min-w-0 flex-1">
          <h2 className="flex items-center space-x-2">
            <div className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
              Tutor Request
            </div>
            <ExclamationTriangleIcon
              data-tooltip-id="warning"
              className="w-6 h-6 text-yellow-400"
            />
            <Tooltip id="warning" place="right" variant="warning">
              We are a new service so we cannot guarantee a satisfactory number
              of applicants.
              <br />
              Please browse tutors at the marketplace if you do not receive
              applicants.
            </Tooltip>
          </h2>
        </div>
        <div className="mt-6">
          <div className="md:grid md:grid-cols-3 md:gap-6">
            <div className="md:col-span-1">
              <div className="px-4 sm:px-0">
                <h3 className="text-lg font-medium leading-6 text-gray-900">
                  Request information
                </h3>
                <p className="mt-1 text-sm text-gray-600">
                  Describe the tutor you&apos;re looking for.
                </p>
              </div>
            </div>
            <div className="mt-5 md:col-span-2 md:mt-0">
              <div className="shadow sm:overflow-hidden sm:rounded-md">
                <div className="space-y-4 bg-white px-4 py-5 sm:p-6">
                  <div>
                    <label className="block mb-2 font-medium text-gray-900">
                      Student level
                    </label>
                    <Select
                      required
                      isClearable
                      name="level"
                      options={levelOptions}
                      onChange={(value: any) => {
                        setFieldValue("level", value);
                        setFieldValue("subjects", null);
                      }}
                      value={values.level}
                    />
                  </div>

                  <div>
                    <label className="block mb-2 font-medium text-gray-900">
                      Subject
                    </label>
                    <Select
                      isClearable
                      required
                      name="subject"
                      onChange={(value: any) => {
                        setFieldValue("subject", value);
                      }}
                      value={values.subject}
                      isDisabled={!values.level}
                      options={getSubjectOptions(values.level?.value || "")}
                    />
                    {/* <p className="mt-2 text-sm text-gray-500">
                      You can also create new options that are not listed.
                    </p> */}
                  </div>

                  <div>
                    <label className="block mb-2 font-medium text-gray-900">
                      Tutor gender
                    </label>
                    <div className="md:grid md:grid-cols-3 ">
                      <div>
                        <input
                          id="gender"
                          name="gender"
                          type="radio"
                          checked={!values.gender}
                          onChange={(e) => setFieldValue("gender", "")}
                        />
                        <label className="w-full ml-2 text-sm text-gray-900 ">
                          Both
                        </label>
                      </div>
                      <div>
                        <input
                          id="gender"
                          name="gender"
                          type="radio"
                          checked={values.gender === "Male"}
                          onChange={() => setFieldValue("gender", "Male")}
                        />
                        <label className="w-full ml-2 text-sm text-gray-900 ">
                          Only Male
                        </label>
                      </div>
                      <div>
                        <input
                          id="gender"
                          name="gender"
                          type="radio"
                          checked={values.gender === "Female"}
                          onChange={() => setFieldValue("gender", "Female")}
                        />
                        <label className="w-full ml-2 text-sm text-gray-900 ">
                          Only Female
                        </label>
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block mb-2 font-medium text-gray-900">
                      Tutor type
                    </label>
                    <div className="">
                      <div>
                        <input
                          type="checkbox"
                          checked={values.type.length === 3}
                          onChange={(e) =>
                            setFieldValue(
                              "type",
                              e.target.checked ? Object.values(TutorType) : []
                            )
                          }
                        />
                        <label className="w-full ml-2 text-sm text-gray-900 ">
                          All types
                        </label>
                      </div>
                      <div>
                        <input
                          type="checkbox"
                          name="type"
                          onChange={handleChange}
                          value={TutorType.PartTime}
                          checked={values.type.includes(TutorType.PartTime)}
                        />
                        <label className="w-full ml-2 text-sm text-gray-900 ">
                          {TutorType.PartTime}
                        </label>
                      </div>
                      <div>
                        <input
                          type="checkbox"
                          name="type"
                          onChange={handleChange}
                          value={TutorType.FullTime}
                          checked={values.type.includes(TutorType.FullTime)}
                        />
                        <label className="w-full ml-2 text-sm text-gray-900 ">
                          {TutorType.FullTime}
                        </label>
                      </div>
                      <div>
                        <input
                          type="checkbox"
                          name="type"
                          onChange={handleChange}
                          value={TutorType.MOE}
                          checked={values.type.includes(TutorType.MOE)}
                        />
                        <label className="w-full ml-2 text-sm text-gray-900 ">
                          {TutorType.MOE}
                        </label>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block mb-2 font-medium text-gray-900">
                      Pricing
                    </label>
                    <div className="flex items-center">
                      <span className="text-sm text-gray-900 mr-2">
                        Rate option
                      </span>
                      <Select
                        className="flex-1"
                        required
                        name="pricing.rateOption"
                        options={Object.values(RateOptions).map(
                          (value: string) => ({
                            label: value,
                            value: value,
                          })
                        )}
                        onChange={(value: any) => {
                          setFieldValue(
                            "pricing.rateOption",
                            value ? value.value : ""
                          );
                        }}
                        value={{
                          label: values.pricing.rateOption,
                          value: values.pricing.rateOption,
                        }}
                      />
                    </div>
                    {values.pricing.rateOption === RateOptions.Max && (
                      <div className="flex items-center mt-2">
                        <span className="text-sm text-gray-900 mr-2">
                          Max rate: $
                        </span>
                        <input
                          type="number"
                          id="pricing.rate"
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none block p-2.5 mr-2"
                          placeholder="0.00"
                          onChange={handleChange}
                          value={values.pricing.rate}
                        />
                        <span className="text-sm text-gray-900">/ hr</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block mb-2 font-medium text-gray-900">
                      Your availability
                    </label>
                    <textarea
                      className="border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 focus:border-indigo-600 focus:outline-none"
                      id="availability"
                      rows={3}
                      placeholder="Available on weekdays after 3pm."
                      onChange={handleChange}
                      value={values.availability}
                      maxLength={1000}
                    />
                  </div>

                  <div>
                    <label className="block mb-2 font-medium text-gray-900">
                      Description
                    </label>
                    <textarea
                      className="border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 focus:border-indigo-600 focus:outline-none"
                      id="description"
                      rows={3}
                      placeholder="For any other information."
                      onChange={handleChange}
                      value={values.description}
                      maxLength={1000}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="hidden sm:block" aria-hidden="true">
          <div className="py-5">
            <div className="border-t border-gray-200" />
          </div>
        </div>

        <div className="mt-10 sm:mt-0">
          <div className="md:grid md:grid-cols-3 md:gap-6">
            <div className="md:col-span-1">
              <div className="px-4 sm:px-0">
                <h3 className="text-lg font-medium leading-6 text-gray-900">
                  Your information
                </h3>
                <p className="mt-1 text-sm text-gray-600">
                  Your email will not be shared with any tutors unless you reach
                  out to a tutor via a contact form.
                </p>
              </div>
            </div>
            <div className="mt-5 md:col-span-2 md:mt-0">
              <div className="shadow sm:rounded-md">
                <div className="space-y-4 bg-white px-4 py-5 sm:p-6">
                  <div>
                    <label className="block mb-2 font-medium text-gray-900">
                      Your name
                    </label>
                    <input
                      type="text"
                      id="name"
                      className="border border-gray-300 text-gray-900 text-sm rounded-lg focus:indigo-blue-500 focus:border-indigo-500 focus:outline-none block w-full p-2.5"
                      onChange={handleChange}
                      value={values.name}
                      required
                    />
                  </div>
                  <div>
                    <label className="block mb-2 font-medium text-gray-900">
                      Email
                    </label>
                    <input
                      type="email"
                      id="contactInfo.email"
                      className="border border-gray-300 text-gray-900 text-sm rounded-lg focus:indigo-blue-500 focus:border-indigo-500 focus:outline-none block w-full p-2.5"
                      onChange={handleChange}
                      value={values.contactInfo.email}
                      required
                    />
                  </div>
                  {/* <div>
                    <label className="block mb-2 font-medium text-gray-900">
                      Postal code
                    </label>
                    <input
                      type="number"
                      id="postalCode"
                      className="border border-gray-300 text-gray-900 text-sm rounded-lg focus:indigo-blue-500 focus:border-indigo-500 focus:outline-none block w-full p-2.5"
                      onChange={(e) => {
                        setFieldValue("postalCode", e.target.value);
                        setFieldValue(
                          "region",
                          postalCodeToRegion(e.target.value)
                        );
                      }}
                      value={values.postalCode}
                      required
                    /> 
                  </div>*/}
                  <div>
                    <label className="block mb-2 font-medium text-gray-900">
                      Region / Online tuition
                    </label>
                    <Select
                      required
                      isClearable
                      name="region"
                      options={regionOptions}
                      onChange={(value: any) => {
                        setFieldValue("region", value ? value.value : "");
                      }}
                      value={{
                        label: values.region,
                        value: values.region,
                      }}
                    />
                    <p className="mt-2 text-sm text-gray-500">Select region</p>
                  </div>

                  <div>
                    <label className="block mb-2 font-medium text-gray-900">
                      Address (optional)
                    </label>
                    <input
                      id="address"
                      className="border border-gray-300 text-gray-900 text-sm rounded-lg focus:indigo-blue-500 focus:border-indigo-500 focus:outline-none block w-full p-2.5"
                      onChange={handleChange}
                      value={values.address}
                    />
                    <p className="mt-2 text-sm text-gray-500">
                      Be as vague or as specific as you like
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="" aria-hidden="true">
          <div className="py-5">
            <div className="border-t border-gray-200" />
          </div>
        </div>

        {false && ( // for future use
          <div className="mt-10 sm:mt-0">
            <div className="md:grid md:grid-cols-3 md:gap-6">
              <div className="md:col-span-1">
                <div className="px-4 sm:px-0">
                  <h3 className="text-lg font-medium leading-6 text-gray-900">
                    Notifications
                  </h3>
                  <p className="mt-1 text-sm text-gray-600">
                    Decide which communications you&apos;d like to receive and
                    how.
                  </p>
                </div>
              </div>
              <div className="mt-5 md:col-span-2 md:mt-0">
                <div className="overflow-hidden shadow sm:rounded-md">
                  <div className="space-y-6 bg-white px-4 py-5 sm:p-6">
                    <fieldset>
                      <legend className="sr-only">By Email</legend>
                      <div
                        className="text-base font-medium text-gray-900"
                        aria-hidden="true"
                      >
                        By Email
                      </div>
                      <div className="mt-4 space-y-4">
                        <div className="flex items-start">
                          <div className="flex h-5 items-center">
                            <input
                              id="comments"
                              name="comments"
                              type="checkbox"
                              className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                            />
                          </div>
                          <div className="ml-3 text-sm">
                            <label
                              htmlFor="comments"
                              className="font-medium text-gray-700"
                            >
                              Comments
                            </label>
                            <p className="text-gray-500">
                              Get notified when someones posts a comment on a
                              posting.
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start">
                          <div className="flex h-5 items-center">
                            <input
                              id="candidates"
                              name="candidates"
                              type="checkbox"
                              className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                            />
                          </div>
                          <div className="ml-3 text-sm">
                            <label
                              htmlFor="candidates"
                              className="font-medium text-gray-700"
                            >
                              Candidates
                            </label>
                            <p className="text-gray-500">
                              Get notified when a candidate applies for a job.
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start">
                          <div className="flex h-5 items-center">
                            <input
                              id="offers"
                              name="offers"
                              type="checkbox"
                              className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                            />
                          </div>
                          <div className="ml-3 text-sm">
                            <label
                              htmlFor="offers"
                              className="font-medium text-gray-700"
                            >
                              Offers
                            </label>
                            <p className="text-gray-500">
                              Get notified when a candidate accepts or rejects
                              an offer.
                            </p>
                          </div>
                        </div>
                      </div>
                    </fieldset>
                    <fieldset>
                      <legend className="contents text-base font-medium text-gray-900">
                        Push Notifications
                      </legend>
                      <p className="text-sm text-gray-500">
                        These are delivered via SMS to your mobile phone.
                      </p>
                      <div className="mt-4 space-y-4">
                        <div className="flex items-center">
                          <input
                            id="push-everything"
                            name="push-notifications"
                            type="radio"
                            className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
                          />
                          <label
                            htmlFor="push-everything"
                            className="ml-3 block text-sm font-medium text-gray-700"
                          >
                            Everything
                          </label>
                        </div>
                        <div className="flex items-center">
                          <input
                            id="push-email"
                            name="push-notifications"
                            type="radio"
                            className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
                          />
                          <label
                            htmlFor="push-email"
                            className="ml-3 block text-sm font-medium text-gray-700"
                          >
                            Same as email
                          </label>
                        </div>
                        <div className="flex items-center">
                          <input
                            id="push-nothing"
                            name="push-notifications"
                            type="radio"
                            className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
                          />
                          <label
                            htmlFor="push-nothing"
                            className="ml-3 block text-sm font-medium text-gray-700"
                          >
                            No push notifications
                          </label>
                        </div>
                      </div>
                    </fieldset>
                  </div>
                  <div className="bg-gray-50 px-4 py-3 text-right sm:px-6">
                    <button
                      type="submit"
                      className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                      Save
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        <div className="mb-4">
          {isSubmitting ? (
            <div className="text-center">
              <button
                disabled
                type="button"
                className="text-white bg-indigo-700 hover:bg-blue-800 focus:ring-4 focus:ring-indigo-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center"
              >
                <svg
                  aria-hidden="true"
                  role="status"
                  className="inline w-4 h-4 mr-3 text-white animate-spin"
                  viewBox="0 0 100 101"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                    fill="#E5E7EB"
                  />
                  <path
                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                    fill="currentColor"
                  />
                </svg>
                Loading...
              </button>
            </div>
          ) : (
            <div className="text-center">
              <button
                type="submit"
                className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                Create request
              </button>
            </div>
          )}
        </div>
      </form>
    </div>
  );
};

MakeTutorRequest.getLayout = (page: ReactElement) => {
  return <Layout>{page}</Layout>;
};

export default MakeTutorRequest;
