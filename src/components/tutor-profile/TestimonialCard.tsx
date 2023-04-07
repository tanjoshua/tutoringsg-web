import { TrashIcon } from "@heroicons/react/24/outline";
import { Tooltip } from "react-tooltip";

export default function TestimonialCard({
  testimonial,
  isUsersTestimonial,
  deleteTestimonial,
}: {
  testimonial: any;
  isUsersTestimonial?: boolean;
  deleteTestimonial?: Function;
}) {
  return (
    <div className="sm:flex py-6">
      <div className="relative sm:w-40 flex-shrink-0 flex justify-between sm:block ">
        <div className="text-gray-900 text-sm">
          {isUsersTestimonial ? "You" : testimonial.authorName}
        </div>
        <div className="text-gray-600 sm:mt-2 text-sm">
          {new Date(testimonial.createdAt).toLocaleDateString("en-us", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </div>
      </div>

      <div className="sm:ml-4 sm:mt-0 mt-2 flex flex-1 flex-col">
        <div className="flex justify-between items-center">
          <div className="text-gray-800 text-base font-semibold tracking-wide ">
            {testimonial.title}
          </div>
        </div>
        <div className="mt-2 text-gray-600 text-sm">
          {testimonial.testimonial}
        </div>
        {isUsersTestimonial && (
          <div className="self-end">
            <TrashIcon
              data-tooltip-id="delete"
              className="w-6 h-6 text-red-500 cursor-pointer"
              onClick={() => {
                if (deleteTestimonial) deleteTestimonial(testimonial.id);
              }}
            />
            <Tooltip id="delete">Delete testimonial</Tooltip>
          </div>
        )}
      </div>
    </div>
  );
}
