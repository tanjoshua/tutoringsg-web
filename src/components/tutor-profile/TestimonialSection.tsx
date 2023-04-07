import { getMe } from "@/services/user";
import { useFormik } from "formik";
import Link from "next/link";
import { useRouter } from "next/router";
import { useQuery } from "react-query";
import WriteTestimonialModal from "./WriteTestmonialModal";
import { useState } from "react";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";
import {
  deleteTestimonial,
  getTestimonials,
  testimonialExists,
} from "@/services/testimonial";
import { Tooltip } from "react-tooltip";
import toast from "react-hot-toast";

export default function TestimonialSection({
  profileId,
  profileUrlId,
}: {
  profileUrlId: string;
  profileId: string;
}) {
  const {
    isLoading: meIsLoading,
    error: meIsError,
    data: meData,
  } = useQuery("me", getMe);
  let user = meData?.user;
  const {
    isLoading: testimonialsIsLoading,
    error: testimonialsError,
    data: testimonialData,
    refetch: testimonialRefetch,
  } = useQuery(["testimonials", profileId], () =>
    getTestimonials({ profileId, page: 1, limit: 10 })
  );
  const {
    isLoading: existsIsLoading,
    error: existsError,
    data: existsData,
    refetch: existsRefetch,
  } = useQuery(["testimonialExists", profileId], () =>
    testimonialExists({ profileId })
  );
  console.log(existsData);

  const loadingButton = meIsLoading || existsIsLoading;

  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className="p-4 border-t border-gray-200">
      <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">
        Recent Testimonials
      </h1>
      <div className="divide-y-2">
        {!loadingButton &&
          (user ? (
            !existsData?.testimonial ? (
              <div className="flex py-6">
                <button
                  type="button"
                  className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  onClick={() => setModalOpen(true)}
                >
                  <PencilSquareIcon
                    className="-ml-1 mr-2 h-5 w-5 text-gray-700"
                    aria-hidden="true"
                  />
                  Write a testimonial
                  <WriteTestimonialModal
                    profileId={profileId}
                    open={modalOpen}
                    setOpen={setModalOpen}
                    refetch={() => {
                      testimonialRefetch();
                      existsRefetch();
                    }}
                  />
                </button>
              </div>
            ) : (
              <div className="py-6">
                You&apos;ve left a testimonial on{" "}
                {new Date(existsData.testimonial.createdAt).toLocaleDateString(
                  "en-us",
                  {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  }
                )}
              </div>
            )
          ) : (
            <Link
              href={`/login?next=${profileUrlId}`}
              className="flex py-6 underline text-indigo-600 hover:text-indigo-800 cursor-pointer"
            >
              Log in to leave a testimonial
            </Link>
          ))}

        {!testimonialsIsLoading &&
          testimonialData?.testimonials?.map((testimonial: any, i: number) => (
            <div className="flex py-6" key={i}>
              <div className="relative h-24 w-24 flex-shrink-0">
                <div className="text-gray-900">{testimonial.authorName}</div>
                <div className="text-gray-600 mt-2">
                  {new Date(testimonial.createdAt).toLocaleDateString("en-us", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </div>
              </div>

              <div className="ml-4 flex flex-1 flex-col">
                <div className="flex justify-between items-center">
                  <div className="text-gray-800 font-semibold tracking-wide">
                    {testimonial.title}
                  </div>
                  {testimonial.author == user.id && (
                    <>
                      <TrashIcon
                        data-tooltip-id="delete"
                        className="w-6 h-6 text-red-500 cursor-pointer"
                        onClick={async () => {
                          try {
                            await deleteTestimonial({ id: testimonial.id });
                            toast.success("Deleted");
                            testimonialRefetch();
                            existsRefetch();
                          } catch {
                            toast.error("Could not delete");
                          }
                        }}
                      />
                      <Tooltip id="delete">Delete testimonial</Tooltip>
                    </>
                  )}
                </div>
                <div className="mt-2 text-gray-600">
                  {testimonial.testimonial}
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
