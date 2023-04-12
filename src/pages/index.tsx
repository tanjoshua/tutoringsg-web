import Head from "next/head";
import { NextPageWithLayout } from "./_app";
import { ReactElement } from "react";
import Layout from "../components/layouts/Layout";
import { CalendarDaysIcon } from "@heroicons/react/24/outline";
import {
  MagnifyingGlassIcon,
  PencilSquareIcon,
  UserGroupIcon,
  PhoneIcon,
  ClockIcon,
} from "@heroicons/react/20/solid";
import Select from "@/components/shared/Select";
import { levelOptions } from "@/utils/options/levels";
import {
  levelCategoryToSubjectOptions,
  levelToLevelCategory,
} from "@/utils/options/subjects";
import { useFormik } from "formik";
import { useRouter } from "next/router";
import Link from "next/link";
import { useQuery } from "react-query";
import { samplePublicTutorProfiles } from "@/services/tutor";
import SmallProfileCard from "@/components/tutor-profile/SmallProfileCard";

const Home: NextPageWithLayout = () => {
  const router = useRouter();
  const formik = useFormik<{
    level: { value: string; label: string } | null;
    subject: { value: string; label: string } | null;
  }>({
    initialValues: {
      level: null,
      subject: null,
    },
    onSubmit: (values) => {
      if (values.level) {
        // if value
        const levelCategory = levelToLevelCategory(values.level!.value);
        const subjects: any = {};
        subjects[levelCategory] = values.subject ? [values.subject.value] : [];
        console.log(subjects);
        router.push({
          pathname: "/browse",
          query: {
            filters: JSON.stringify({
              levelCategories: [levelCategory],
              subjects,
            }),
          },
        });
      } else {
        router.push("/browse");
      }
    },
  });
  const { isLoading, error, data, refetch, isRefetching } = useQuery(
    ["samplePublicProfiles"],
    () => samplePublicTutorProfiles(),
    { refetchOnWindowFocus: false }
  );

  return (
    <>
      <Head>
        <title>
          Find a Private Tutor - Tutor Marketplace and Matching Service
        </title>
        <meta
          property="og:title"
          content="tutoring.sg - Find a Private Tutor"
        ></meta>
        <meta
          name="description"
          property="og:title"
          content="Commission free tutor marketplace and matching service for Singapore. Use tutoring.sg to find a tutor or look for students"
        ></meta>
        <meta property="og:type" content="website" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <div>
        <div className="absolute inset-x-0 top-[-10rem] -z-10 transform-gpu  blur-3xl sm:top-[-20rem]">
          <svg
            className="relative left-[calc(50%-11rem)] -z-10 h-[21.1875rem] max-w-none -translate-x-1/2 rotate-[30deg] sm:left-[calc(50%-30rem)] sm:h-[42.375rem]"
            viewBox="0 0 1155 678"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill="url(#45de2b6b-92d5-4d68-a6a0-9b9b2abad533)"
              fillOpacity=".3"
              d="M317.219 518.975L203.852 678 0 438.341l317.219 80.634 204.172-286.402c1.307 132.337 45.083 346.658 209.733 145.248C936.936 126.058 882.053-94.234 1031.02 41.331c119.18 108.451 130.68 295.337 121.53 375.223L855 299l21.173 362.054-558.954-142.079z"
            />
            <defs>
              <linearGradient
                id="45de2b6b-92d5-4d68-a6a0-9b9b2abad533"
                x1="1155.49"
                x2="-78.208"
                y1=".177"
                y2="474.645"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#9089FC" />
                <stop offset={1} stopColor="#FF80B5" />
              </linearGradient>
            </defs>
          </svg>
        </div>
        <div className="relative mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="relative isolate text-gray-900 px-6 pt-16 sm:px-16 md:pt-24 lg:flex lg:gap-x-20 lg:px-24 lg:pt-0">
            <div className="mx-auto max-w-md text-center lg:mx-0 lg:flex-auto lg:py-32 lg:text-left">
              <div className="text-4xl sm:text-6xl text-gray-800 font-sans font-semibold tracking-wide">
                tutoring.<span className="text-red-500">sg</span>
              </div>
              <h2 className="mt-6 text-3xl font-bold tracking-tight sm:text-4xl">
                Find the best private tutors{" "}
                <br className="hidden lg:inline-block" />
                in Singapore.
              </h2>
              <p className="mt-6 text-lg leading-8 text-gray-900 text-left">
                100% commission free for both students and tutors. Browse the
                tutor marketplace or make a request. No account necessary.
              </p>
              <div className="mt-6 flex justify-center lg:justify-start">
                <div className="relative rounded-full text-sm leading-6 text-gray-600">
                  If you&apos;re a tutor, join our platform!{" "}
                  <Link
                    href="/for-tutors"
                    className="font-semibold text-indigo-600"
                  >
                    <span className="absolute inset-0" aria-hidden="true" />
                    Read more <span aria-hidden="true">&rarr;</span>
                  </Link>
                </div>
              </div>
            </div>
            <div className="relative my-8 lg:my-16 lg:mt-8 self-center mx-auto">
              <div className="rounded-3xl px-8 lg:px-16 py-8 bg-gray-800 shadow-2xl">
                <h2 className="text-lg md:text-2xl font-bold tracking-tight text-white">
                  What are you looking for?
                </h2>
                <form onSubmit={formik.handleSubmit}>
                  <div className="mt-6 space-y-4 text-sm md:text-base">
                    <div className="">
                      <label className="block mb-2 font-medium text-white">
                        Student&apos;s level
                      </label>
                      <Select
                        isClearable
                        options={levelOptions}
                        name="level"
                        onChange={(value: any) => {
                          formik.setFieldValue("level", value);
                          formik.setFieldValue("subject", null);
                        }}
                        value={formik.values.level}
                        placeholder="Select level"
                      />
                    </div>
                    <div className="">
                      <label className="block mb-2 font-medium text-white">
                        Subject
                      </label>
                      <Select
                        isClearable
                        options={levelCategoryToSubjectOptions(
                          levelToLevelCategory(formik.values.level?.value!)
                        )}
                        name="subject"
                        onChange={(value: any) => {
                          formik.setFieldValue("subject", value);
                        }}
                        value={formik.values.subject}
                        isDisabled={!formik.values.level}
                        placeholder={
                          !formik.values.level
                            ? "Select a level first"
                            : "Select a subject"
                        }
                      />
                    </div>
                    <div className="pt-4 flex items-center justify-center ">
                      <button
                        type="submit"
                        className="rounded-md bg-indigo-500 px-2 py-0.5 md:px-3.5 md:py-1.5 font-semibold leading-7 text-white shadow-sm hover:bg-indigo-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                      >
                        Browse
                      </button>
                      <div className="text-white mx-4">or</div>
                      <button
                        type="button"
                        className="rounded-md bg-indigo-500 px-2 py-0.5 md:px-3.5 md:py-1.5 font-semibold leading-7 text-white shadow-sm hover:bg-indigo-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        onClick={() => {
                          router.push({
                            pathname: "/request/make",
                            query: {
                              prefill: JSON.stringify({
                                level: formik.values.level,
                                subject: formik.values.subject,
                              }),
                            },
                          });
                        }}
                      >
                        Make request
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
          <div className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]">
            <svg
              className="relative left-[calc(50%+3rem)] h-[21.1875rem] max-w-none -translate-x-1/2 sm:left-[calc(50%+36rem)] sm:h-[42.375rem]"
              viewBox="0 0 1155 678"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill="url(#ecb5b0c9-546c-4772-8c71-4d3f06d544bc)"
                fillOpacity=".3"
                d="M317.219 518.975L203.852 678 0 438.341l317.219 80.634 204.172-286.402c1.307 132.337 45.083 346.658 209.733 145.248C936.936 126.058 882.053-94.234 1031.02 41.331c119.18 108.451 130.68 295.337 121.53 375.223L855 299l21.173 362.054-558.954-142.079z"
              />
              <defs>
                <linearGradient
                  id="ecb5b0c9-546c-4772-8c71-4d3f06d544bc"
                  x1="1155.49"
                  x2="-78.208"
                  y1=".177"
                  y2="474.645"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#9089FC" />
                  <stop offset={1} stopColor="#FF80B5" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>
        <div className="relative px-6 lg:px-8">
          <div className="border-t border-1 py-8 max-w-7xl mx-auto">
            <div className="flex justify-between items-end">
              <div className="text-center font-bold text-2xl">Our tutors </div>
              <Link className="" href="/browse">
                See all &rarr;
              </Link>
            </div>
            <div className="flex overflow-auto divide-x-2 pb-2 -ml-4 mt-8">
              {!isLoading &&
                !error &&
                data?.profiles?.map((profile: any, i: number) => (
                  <SmallProfileCard tutorProfile={profile} key={i} />
                ))}
            </div>
          </div>
        </div>
        <div className="relative px-6 lg:px-8">
          <div className="py-16 space-y-10 border-t border-1">
            <div className="text-center text-3xl font-bold tracking-tight text-gray-900">
              If you&apos;re looking for a tutor, here&apos;s how it works
            </div>
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
              <dl className="grid grid-cols-1 gap-x-8 gap-y-16 lg:grid-cols-3">
                <div className="flex flex-col items-start">
                  <div className="">
                    <UserGroupIcon className="h-6 w-6 " aria-hidden="true" />
                  </div>
                  <dt className="mt-4 font-semibold">1. Browse tutors</dt>
                  <dd className="mt-2 leading-7">
                    Visit the{" "}
                    <Link
                      className="text-indigo-600 font-bold hover:underline hover:text-indigo-500 cursor-pointer"
                      href="/browse"
                    >
                      browse page
                    </Link>{" "}
                    to view the public profiles of tutors.
                  </dd>
                </div>
                <div className="flex flex-col items-start">
                  <div className="">
                    <MagnifyingGlassIcon
                      className="h-6 w-6 "
                      aria-hidden="true"
                    />
                  </div>
                  <dt className="mt-4 font-semibold ">2. Search and filter</dt>
                  <dd className="mt-2 leading-7 ">
                    Search and filter tutors according to your preference.
                  </dd>
                </div>
                <div className="flex flex-col items-start">
                  <div className="">
                    <PhoneIcon className="h-6 w-6 " aria-hidden="true" />
                  </div>
                  <dt className="mt-4 font-semibold ">3. Contact</dt>
                  <dd className="mt-2 leading-7 ">
                    Contact potential tutors directly via their public tutor
                    profile.
                  </dd>
                </div>
              </dl>
              <div className="flex items-center my-10">
                <div className="flex-grow border-t border-1 flex-1 border-gray-300"></div>
                <div className="-mt-1 mx-2 font-semibold text-xl text-gray-400">
                  or
                </div>
                <div className="flex-grow border-t border-1 flex-1 border-gray-300"></div>
              </div>
              <dl className="grid grid-cols-1 gap-x-8 gap-y-16 lg:grid-cols-3">
                <div className="flex flex-col items-start">
                  <div className="">
                    <PencilSquareIcon className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <dt className="mt-4 font-semibold ">
                    1. Fill in a tutor request
                  </dt>
                  <dd className="mt-2 leading-7">
                    Visit the{" "}
                    <Link
                      className="text-indigo-600 font-bold hover:underline hover:text-indigo-500 cursor-pointer"
                      href="/request/make"
                    >
                      request page
                    </Link>{" "}
                    to fill in a tutor request.
                  </dd>
                </div>
                <div className="flex flex-col items-start">
                  <div className="">
                    <ClockIcon className="h-6 w-6 " aria-hidden="true" />
                  </div>
                  <dt className="mt-4 font-semibold ">
                    2. Wait for applications
                  </dt>
                  <dd className="mt-2 leading-7 ">
                    Tutors on the platform will apply to your request. New
                    applications will be available for review in real-time via a
                    unique link.
                  </dd>
                </div>
                <div className="flex flex-col items-start">
                  <div className="">
                    <CalendarDaysIcon className="h-6 w-6 " aria-hidden="true" />
                  </div>
                  <dt className="mt-4 font-semibold ">
                    3. View applications and decide
                  </dt>
                  <dd className="mt-2 leading-7 ">
                    Look through the applications as they come in. Select your
                    favorite tutor and contact them directly.
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

Home.getLayout = (page: ReactElement) => {
  return <Layout>{page}</Layout>;
};

export default Home;
