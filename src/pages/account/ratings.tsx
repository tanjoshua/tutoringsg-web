import Head from "next/head";
import { NextPageWithLayout } from "../_app";
import { ReactElement, useState } from "react";
import Layout from "../../components/layouts/Layout";
import { useQuery } from "react-query";
import { getMe } from "@/services/user";
import Spinner from "@/components/shared/Spinner";
import {
  CheckBadgeIcon,
  ExclamationCircleIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { Tooltip } from "react-tooltip";
import { requestEmailVerification } from "@/services/auth";
import { toast } from "react-hot-toast";
import Link from "next/link";
import RouteGuardRedirect from "@/components/auth/RouteGuardRedirect";
import { useRouter } from "next/router";
import SelectionTab from "@/components/account/SelectionTab";
import { deleteRating, getRatings, getUserRatings } from "@/services/rating";
import PaginateFooter from "@/components/shared/PaginateFooter";
import Rating from "@/components/tutor-profile/Rating";

const AccountRatings: NextPageWithLayout = () => {
  const { isLoading, error, data, refetch } = useQuery("me", getMe);
  const [paginationQuery, setPaginationQuery] = useState({
    page: 1,
    limit: 10,
  });
  const {
    isLoading: ratingsIsLoading,
    error: ratingsError,
    data: ratingData,
    refetch: ratingRefetch,
  } = useQuery(
    ["userRatings", paginationQuery],
    () => getUserRatings(paginationQuery),
    { enabled: !isLoading && !!data.user }
  );
  const router = useRouter();
  return (
    <>
      <Head>
        <title>Your Ratings</title>
      </Head>
      {isLoading ? (
        <Spinner />
      ) : (
        <div className="px-4 py-5">
          <div className="space-y-4">
            <div>
              <h2 className="text-2xl font-semibold leading-6 text-gray-900">
                Your account
              </h2>
            </div>
            <SelectionTab />
            {!ratingsIsLoading && (
              <div className="divide-y-2">
                {ratingData?.ratings.length === 0 && (
                  <p className="text-gray-600 py-6">No ratings found</p>
                )}
                {ratingData?.ratings.map((rating: any, i: number) => (
                  <div className="sm:flex py-6" key={i}>
                    <div className="relative sm:w-40 flex-shrink-0 flex justify-between sm:block ">
                      <div className="text-gray-900 text-sm">
                        <Link
                          href={`/${rating.tutorProfile.urlId}`}
                          className=" text-indigo-600 underline hover:text-indigo-800"
                        >
                          {rating.tutorProfile.tutorName}
                        </Link>
                      </div>
                      <div className="text-gray-600 sm:mt-2 text-sm">
                        {new Date(rating.createdAt).toLocaleDateString(
                          "en-us",
                          {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          }
                        )}
                      </div>
                    </div>

                    <div className="sm:ml-4 sm:mt-0 mt-2 flex flex-1 flex-col">
                      <div className="flex justify-between items-center">
                        <Rating rating={rating.rating} />
                      </div>
                      <div className="mt-2 text-gray-600 text-sm">
                        {rating.testimonial}
                      </div>
                      <div className="self-end">
                        <TrashIcon
                          data-tooltip-id="delete"
                          className="w-6 h-6 text-red-500 cursor-pointer"
                          onClick={async () => {
                            try {
                              await deleteRating({
                                id: rating.id,
                              });
                              toast.success("Deleted");
                              ratingRefetch();
                            } catch (error: any) {
                              toast.error(
                                error?.response?.data?.message ||
                                  "Could not delete rating"
                              );
                            }
                          }}
                        />
                        <Tooltip id="delete">Delete rating</Tooltip>
                      </div>
                    </div>
                  </div>
                ))}
                <div className="">
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
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

AccountRatings.getLayout = (page: ReactElement) => {
  return (
    <Layout>
      <RouteGuardRedirect ifNotLoggedIn>{page}</RouteGuardRedirect>
    </Layout>
  );
};

export default AccountRatings;
