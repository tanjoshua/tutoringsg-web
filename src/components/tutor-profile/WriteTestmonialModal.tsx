import { Dispatch, Fragment, SetStateAction, useRef, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import {
  ShareIcon,
  LinkIcon,
  PencilSquareIcon,
} from "@heroicons/react/24/outline";
import { LockClosedIcon, XMarkIcon } from "@heroicons/react/20/solid";
import { useFormik } from "formik";
import { toast } from "react-hot-toast";
import { postTestimonial } from "@/services/testimonial";
import axios from "axios";

export default function WriteTestimonialModal({
  open,
  setOpen,
  profileId,
  refetch,
}: {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  profileId: string;
  refetch: Function;
}) {
  const formik = useFormik({
    initialValues: {
      title: "",
      testimonial: "",
    },
    onSubmit: async (values, { resetForm }) => {
      try {
        await postTestimonial({ ...values, tutorProfile: profileId });
        setOpen(false);
        resetForm();
        refetch();
        toast.success("Testimonial created");
      } catch (error) {
        if (axios.isAxiosError(error)) {
          toast.error(
            error.response?.data?.message || "Could not create testimonial"
          );
        } else {
          toast.error("Could not create testimonial");
        }
      }
    },
  });
  const confirmButtonRef = useRef(null);

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10"
        initialFocus={confirmButtonRef}
        onClose={() => {
          setOpen(false);
        }}
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
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 w-full sm:max-w-lg">
                <div className="absolute right-2 top-2">
                  <button
                    onClick={() => {
                      setOpen(false);
                    }}
                  >
                    <XMarkIcon className="h-6 w-6 text-gray-500 hover:text-gray-400" />
                  </button>
                </div>
                <form
                  id="testimonial"
                  className=""
                  onSubmit={formik.handleSubmit}
                >
                  <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                    <div className="sm:flex sm:items-start">
                      <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-indigo-100 sm:mx-0 sm:h-10 sm:w-10">
                        <PencilSquareIcon
                          className="h-6 w-6 text-gray-600"
                          aria-hidden="true"
                        />
                      </div>
                      <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                        <Dialog.Title
                          as="h3"
                          className="text-lg font-medium leading-6 text-gray-900"
                        >
                          Write a testimonial
                        </Dialog.Title>
                      </div>
                    </div>
                    <div className="mt-4 pt-4 space-y-4 flex flex-col border-t">
                      <div className="mb-4">
                        <label className="text-start block mb-2 font-medium text-gray-900">
                          Title
                        </label>
                        <input
                          type="text"
                          id="title"
                          className="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none block w-full p-2.5"
                          placeholder="Eg. Amazing tutor! Worth every penny"
                          onChange={formik.handleChange}
                          value={formik.values.title}
                          required
                        />
                      </div>
                      <div className="mb-4">
                        <label className="text-start block mb-2 font-medium text-gray-900">
                          Testimonial
                        </label>
                        <textarea
                          className="border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 focus:border-indigo-600 focus:outline-none"
                          id="testimonial"
                          rows={5}
                          placeholder="Your testimonial"
                          onChange={formik.handleChange}
                          value={formik.values.testimonial}
                          maxLength={1000}
                          required
                        ></textarea>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                    <button
                      className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 sm:ml-3 sm:w-auto"
                      type="submit"
                      ref={confirmButtonRef}
                    >
                      Confirm
                    </button>
                    <button
                      type="button"
                      className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                      onClick={() => setOpen(false)}
                    >
                      Back
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
