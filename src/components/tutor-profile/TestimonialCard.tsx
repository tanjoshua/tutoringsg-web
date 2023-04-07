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
    <div className="flex py-6">
      <div className="relative h-24 w-24 flex-shrink-0">
        <div className="text-gray-900">
          {isUsersTestimonial ? "You" : testimonial.authorName}
        </div>
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
          {isUsersTestimonial && (
            <>
              <TrashIcon
                data-tooltip-id="delete"
                className="w-6 h-6 text-red-500 cursor-pointer"
                onClick={() => {
                  if (deleteTestimonial) deleteTestimonial(testimonial.id);
                }}
              />
              <Tooltip id="delete">Delete testimonial</Tooltip>
            </>
          )}
        </div>
        <div className="mt-2 text-gray-600">{testimonial.testimonial}</div>
      </div>
    </div>
  );
}
