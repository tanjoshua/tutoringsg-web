import { getMe } from "@/services/user";
import { useFormik } from "formik";
import Link from "next/link";
import { useRouter } from "next/router";
import { useQuery } from "react-query";
import WriteRatingModal from "./WriteRatingModal";
import { useState } from "react";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";
import { deleteRating, getRatings, ratingExists } from "@/services/rating";
import { Tooltip } from "react-tooltip";
import toast from "react-hot-toast";
import RatingCard from "./RatingCard";
import PaginateFooter from "../shared/PaginateFooter";

export default function RatingSection({
  profileRefetch,
  profileId,
  profileUrlId,
}: {
  profileRefetch: Function;
  profileUrlId: string;
  profileId: string;
}) {
  const {
    isLoading: meIsLoading,
    error: meIsError,
    data: meData,
  } = useQuery("me", getMe);
  let user = meData?.user;
  const [paginationQuery, setPaginationQuery] = useState({
    page: 1,
    limit: 10,
  });
  const {
    isLoading: ratingsIsLoading,
    error: ratingsError,
    data: ratingData,
    refetch: ratingRefetch,
  } = useQuery(["rating", profileId, paginationQuery], () =>
    getRatings({ profileId, ...paginationQuery })
  );
  const {
    isLoading: existsIsLoading,
    error: existsError,
    data: existsData,
    refetch: existsRefetch,
  } = useQuery(["ratingExists", profileId], () => ratingExists({ profileId }));

  const loadingButton = meIsLoading || existsIsLoading;

  const [modalOpen, setModalOpen] = useState(false);

  const deleteRatingHelper = async (id: string) => {
    try {
      await deleteRating({ id });
      toast.success("Deleted");
      profileRefetch();
      ratingRefetch();
      existsRefetch();
    } catch {
      toast.error("Could not delete");
    }
  };

  return (
    <div>
      {existsData?.rating && (
        <div className="p-4 border-t border-gray-200">
          <div className="">
            <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">
              Your rating
            </h1>
            <div>
              You&apos;ve left a rating on{" "}
              {new Date(existsData.rating.createdAt).toLocaleDateString(
                "en-us",
                {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                }
              )}
            </div>
            <RatingCard
              rating={existsData.rating}
              isUsersRating
              deleteRating={deleteRatingHelper}
            />
          </div>
        </div>
      )}
      <div className="p-4 border-t border-gray-200">
        <h1 className="text-xl font-bold text-gray-900 sm:text-2xl leading-6">
          Recent Ratings
        </h1>
        <div className="divide-y">
          {!loadingButton &&
            (user ? (
              !user.emailVerified ? (
                <Link
                  href={`/account/details`}
                  className="flex py-6 underline text-indigo-600 hover:text-indigo-800 cursor-pointer"
                >
                  Please verify your email to leave a rating
                </Link>
              ) : (
                !existsData?.rating && (
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
                      Leave a Rating
                      <WriteRatingModal
                        profileId={profileId}
                        open={modalOpen}
                        setOpen={setModalOpen}
                        refetch={() => {
                          profileRefetch();
                          ratingRefetch();
                          existsRefetch();
                        }}
                      />
                    </button>
                  </div>
                )
              )
            ) : (
              <Link
                href={`/login?next=${profileUrlId}`}
                className="flex underline text-indigo-600 hover:text-indigo-800 cursor-pointer leading-6 py-6"
              >
                Log in to leave a rating
              </Link>
            ))}

          {!ratingsIsLoading && (
            <>
              {ratingData?.ratings?.map((rating: any, i: number) => (
                <RatingCard rating={rating} key={i} />
              ))}
              {ratingData?.count === 0 && (
                <div className="text-sm text-gray-500 py-6">
                  No other ratings
                </div>
              )}
              <div className="-mx-2">
                {ratingData?.count > 0 && (
                  <PaginateFooter
                    page={paginationQuery.page}
                    limit={paginationQuery.limit}
                    total={ratingData?.count}
                    setPage={(page: number) => {
                      setPaginationQuery((query) => ({ ...query, page }));
                    }}
                  />
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
