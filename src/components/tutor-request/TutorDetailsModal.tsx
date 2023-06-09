import { Dispatch, Fragment, SetStateAction, useRef, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useQuery } from "react-query";
import { getTutorApplication } from "@/services/tutorRequest";
import { ApplicationState } from "@/utils/enums";
import {
  MapPinIcon,
  PhoneIcon,
  TagIcon,
  UserIcon,
  XMarkIcon,
} from "@heroicons/react/20/solid";
import Image from "next/image";
import Link from "next/link";
import Rating from "../tutor-profile/Rating";

export default function TutorDetailsModal({
  id,
  open,
  setOpen,
  updateState,
  showContact,
}: {
  id: string;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  updateState: (applicationId: string, state: string) => void;
  showContact: Function;
}) {
  const cancelButtonRef = useRef(null);
  const { isLoading, error, data, refetch, isRefetching } = useQuery(
    ["getTutorApplication", id],
    () => getTutorApplication({ id }),
    { enabled: !!id }
  );

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10"
        initialFocus={cancelButtonRef}
        onClose={setOpen}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all md:m-8 max-w-6xl">
                <div className="overflow-hidden bg-white shadow sm:rounded-lg">
                  <div className="flex px-4 py-5 sm:px-6">
                    <div className="flex-1 sm:flex space-y-4 sm:space-x-6">
                      <div className="relative flex-shrink-0 overflow-hidden rounded-md h-40 w-40 lg:h-52 lg:w-52">
                        <Image
                          alt="profile picture"
                          src={
                            data?.tutorApplication?.tutorProfile?.profilePic
                              ?.location ||
                            "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
                          }
                          fill
                        />
                      </div>
                      <div>
                        <div className="text-lg text-gray-500">
                          {data?.tutorApplication?.tutorProfile?.tutorName}
                        </div>
                        <h3 className="text-xl font-semibold leading-6 text-gray-900">
                          {data?.tutorApplication?.tutorProfile?.title}
                          <div className="mt-1 flex flex-col sm:mt-0 sm:flex-row sm:flex-wrap sm:space-x-6">
                            <div className="mt-2 flex items-center text-sm text-gray-500">
                              <TagIcon
                                className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400"
                                aria-hidden="true"
                              />
                              {data?.tutorApplication?.tutorProfile?.type}
                            </div>
                            <div className="mt-2 flex items-center text-sm text-gray-500">
                              <UserIcon
                                className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400"
                                aria-hidden="true"
                              />
                              {data?.tutorApplication?.tutorProfile?.gender}
                            </div>
                            <div className="mt-2 flex items-center text-sm text-gray-500">
                              <MapPinIcon
                                className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400"
                                aria-hidden="true"
                              />
                              {data?.tutorApplication?.tutorProfile?.regions
                                .length == 6
                                ? "All regions & online"
                                : data?.tutorApplication?.tutorProfile?.regions.join(
                                    ", "
                                  )}
                            </div>
                          </div>
                        </h3>
                        <Link
                          href={`/${data?.tutorApplication?.tutorProfile.urlId}#ratings`}
                          className="mt-4 flex"
                          target="_blank"
                        >
                          <Rating
                            rating={
                              data?.tutorApplication?.tutorProfile.totalRating /
                              data?.tutorApplication?.tutorProfile.ratingCount
                            }
                            rateCount={
                              data?.tutorApplication?.tutorProfile.ratingCount
                            }
                          />
                        </Link>
                        <button
                          type="button"
                          className="mt-4 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 "
                          onClick={() => {
                            showContact({
                              ...data?.tutorApplication?.tutorProfile
                                ?.contactInfo,
                              profileId:
                                data?.tutorApplication?.tutorProfile?.id,
                            });
                          }}
                        >
                          <PhoneIcon
                            className="-ml-1 mr-2 h-5 w-5 text-gray-700"
                            aria-hidden="true"
                          />
                          Contact
                        </button>
                      </div>
                    </div>

                    <div className="">
                      <button
                        onClick={() => {
                          setOpen(false);
                        }}
                      >
                        <XMarkIcon className="h-6 w-6 text-gray-600 hover:text-gray-500" />
                      </button>
                    </div>
                  </div>
                  <div className="border-t border-gray-200">
                    <dl>
                      <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt className="text-sm font-medium text-gray-500">
                          Tutor name
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                          {data?.tutorApplication?.tutorProfile?.tutorName}
                        </dd>
                      </div>
                      <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt className="text-sm font-medium text-gray-500">
                          Tutor type
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                          {data?.tutorApplication?.tutorProfile?.type}
                        </dd>
                      </div>
                      <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt className="text-sm font-medium text-gray-500">
                          Pricing
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0 whitespace-pre-wrap">
                          ${data?.tutorApplication?.tutorProfile?.pricing?.rate}{" "}
                          / hr
                          {data?.tutorApplication?.tutorProfile?.pricing
                            ?.details && (
                            <>
                              <br />
                              {
                                data?.tutorApplication?.tutorProfile?.pricing
                                  ?.details
                              }
                            </>
                          )}
                        </dd>
                      </div>
                      <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt className="text-sm font-medium text-gray-700">
                          Teaching Experience and Academic Qualifications
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0 whitespace-pre-wrap">
                          {data?.tutorApplication?.tutorProfile?.qualifications}
                        </dd>
                      </div>
                      <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt className="text-sm font-medium text-gray-700">
                          Tutor Description
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0 whitespace-pre-wrap">
                          {data?.tutorApplication?.tutorProfile?.description}
                        </dd>
                      </div>
                      <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt className="text-sm font-medium text-gray-700">
                          Contact Info
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                          {data?.tutorApplication?.tutorProfile?.contactInfo
                            .phoneNumber &&
                            `Phone Number: +65 ${data?.tutorApplication?.tutorProfile?.contactInfo.phoneNumber}`}
                          {data?.tutorApplication?.tutorProfile?.contactInfo
                            .phoneNumber &&
                            data?.tutorApplication?.tutorProfile?.contactInfo
                              .email && <br />}
                          {data?.tutorApplication?.tutorProfile?.contactInfo
                            .email &&
                            `Email: ${data?.tutorApplication?.tutorProfile?.contactInfo.email}`}
                        </dd>
                      </div>
                    </dl>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                  {data?.tutorApplication?.state ===
                    ApplicationState.Pending && (
                    <button
                      type="button"
                      className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 sm:ml-3 sm:w-auto"
                      onClick={() => {
                        updateState(id, ApplicationState.Shortlisted);
                        setOpen(false);
                      }}
                    >
                      Shortlist
                    </button>
                  )}
                  {data?.tutorApplication?.state ===
                    ApplicationState.Shortlisted && (
                    <button
                      type="button"
                      className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
                      onClick={() => {
                        updateState(id, ApplicationState.Pending);
                        setOpen(false);
                      }}
                    >
                      Remove from shortlist
                    </button>
                  )}
                  {data?.tutorApplication?.state ===
                    ApplicationState.Hidden && (
                    <button
                      type="button"
                      className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 sm:ml-3 sm:w-auto"
                      onClick={() => {
                        updateState(id, ApplicationState.Pending);
                        setOpen(false);
                      }}
                    >
                      Unhide
                    </button>
                  )}

                  <button
                    type="button"
                    className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                    onClick={() => setOpen(false)}
                    ref={cancelButtonRef}
                  >
                    Close
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
