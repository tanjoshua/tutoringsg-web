import { TrashIcon } from "@heroicons/react/24/outline";
import { Tooltip } from "react-tooltip";
import Rating from "./Rating";

export default function RatingCard({
  rating,
  isUsersRating,
  deleteRating,
}: {
  rating: any;
  isUsersRating?: boolean;
  deleteRating?: Function;
}) {
  return (
    <div className="sm:flex py-6">
      <div className="relative sm:w-40 flex-shrink-0 flex justify-between sm:block ">
        <div className="text-gray-900 text-sm">
          {isUsersRating ? "You" : rating.authorName}
        </div>
        <div className="text-gray-600 sm:mt-2 text-sm">
          {new Date(rating.createdAt).toLocaleDateString("en-us", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </div>
      </div>

      <div className="sm:ml-4 sm:mt-0 mt-2 flex flex-1 flex-col">
        <div className="flex justify-between items-center">
          <Rating rating={rating.rating} />
        </div>
        <div className="mt-2 text-gray-600 text-sm">{rating.testimonial}</div>
        {isUsersRating && (
          <div className="self-end">
            <TrashIcon
              data-tooltip-id="delete"
              className="w-6 h-6 text-red-500 cursor-pointer"
              onClick={() => {
                if (deleteRating) deleteRating(rating.id);
              }}
            />
            <Tooltip id="delete">Delete rating</Tooltip>
          </div>
        )}
      </div>
    </div>
  );
}
