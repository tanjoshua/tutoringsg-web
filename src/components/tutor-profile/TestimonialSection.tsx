import { getMe } from "@/services/user";
import { useFormik } from "formik";
import Link from "next/link";
import { useRouter } from "next/router";
import { useQuery } from "react-query";
import WriteTestimonialModal from "./WriteTestmonialModal";
import { useState } from "react";
import { PencilSquareIcon } from "@heroicons/react/24/outline";

export default function TestimonialSection({
  profileId,
  profileUrlId,
}: {
  profileUrlId: string;
  profileId: string;
}) {
  const router = useRouter();
  const {
    isLoading: meIsLoading,
    error: meIsError,
    data: meData,
  } = useQuery("me", getMe);
  let user = meData?.user;
  const testimonials = [{}, {}];

  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className="p-4 border-t border-gray-200">
      <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">
        Recent Testimonials
      </h1>
      <div className="divide-y-2">
        {user ? (
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
              />
            </button>
          </div>
        ) : (
          <Link
            href={`/login?next=${profileUrlId}`}
            className="flex py-6 underline text-indigo-600 hover:text-indigo-800 cursor-pointer"
          >
            Log in to leave a testimonial
          </Link>
        )}

        {testimonials.map((testimonial, i) => (
          <div className="flex py-6" key={i}>
            <div className="relative h-24 w-24 flex-shrink-0">
              <div className="text-gray-900">Name Name</div>
              <div className="text-gray-600 mt-2">Date</div>
            </div>

            <div className="ml-4 flex flex-1 flex-col">
              <div className="text-gray-800 font-semibold tracking-wide">
                Title of testimonial
              </div>
              <div className="mt-2 text-gray-600">Lorem ipsum</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
