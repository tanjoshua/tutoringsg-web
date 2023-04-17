import { NextPageWithLayout } from "../_app";
import { Fragment, ReactElement, useEffect, useState } from "react";
import Layout from "../../components/layouts/Layout";
import { useQuery } from "react-query";
import {
  ChevronDownIcon,
  MinusIcon,
  PlusIcon,
} from "@heroicons/react/20/solid";
import { useRouter } from "next/router";
import Head from "next/head";
import { getAppliedRequests, getTutorRequests } from "@/services/tutorRequest";
import { TutorType } from "@/utils/enums";
import Spinner from "@/components/shared/Spinner";
import Select from "@/components/shared/Select";
import { LevelCategories, levelCategoryOptions } from "@/utils/options/levels";
import { levelCategoryToSubjectOptions } from "@/utils/options/subjects";
import Creatable from "@/components/shared/Creatable";
import RequestCard from "@/components/tutor-request/RequestCard";
import PaginateFooter from "@/components/shared/PaginateFooter";
import TutorRequestModal from "@/components/tutor-request/TutorRequestModal";
import { getUserTutorProfile } from "@/services/tutor";
import { regionOptions } from "@/utils/options/regions";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import { classNames } from "@/utils/helpers";
import { ReviewSortBy } from "@/utils/options/sort";
import RouteGuardRedirect from "@/components/auth/RouteGuardRedirect";
import RatingSection from "@/components/tutor-profile/RatingSection";
import { getRatings } from "@/services/rating";
import RatingCard from "@/components/tutor-profile/RatingCard";

const tabClasses =
  "inline-block px-4 pb-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 ";
const tabClassesSelected =
  "inline-block px-4 pb-4 text-indigo-600 border-b-2 border-indigo-600 rounded-t-lg";

const Reviews: NextPageWithLayout = () => {
  const router = useRouter();
  const [filters, setFilters] = useState<{
    sortBy: string;
  }>({
    sortBy: ReviewSortBy.Newest,
  });
  const sortOptions = Object.values(ReviewSortBy).map((value) => ({
    name: value,
    current: filters.sortBy === value,
  }));
  const [sendRequestModalOpen, setSendRequestModalOpen] = useState(false);
  const { isLoading, error, data, refetch } = useQuery(
    "userTutorProfile",
    getUserTutorProfile
  );
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
    ["rating", data?.profile?.id, paginationQuery],
    () => getRatings({ profileId: data?.profile?.id, ...paginationQuery }),
    { enabled: !!data?.profile?.id }
  );

  if (error) {
    return <></>;
  }

  // profile exists
  return (
    <div>
      <Head>
        <title>Your Reviews</title>
      </Head>
      <div className="bg-white px-4 py-5 mx-auto">
        <div className="flex items-baseline justify-between border-b border-gray-200 pb-6">
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-gray-900">
              Reviews on your profile
            </h1>
            <div className="mt-1 flex flex-col sm:mt-0 sm:flex-row sm:flex-wrap sm:space-x-6">
              <p className="text-sm text-gray-500">
                View the reviews on your profile and also send review requests
                to your students.
              </p>
            </div>
          </div>

          <div className="flex items-center">
            <Menu as="div" className="relative inline-block text-left">
              <div>
                <Menu.Button className="group inline-flex justify-center text-sm font-medium text-gray-700 hover:text-gray-900">
                  Sort
                  <ChevronDownIcon
                    className="-mr-1 ml-1 h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-gray-500"
                    aria-hidden="true"
                  />
                </Menu.Button>
              </div>

              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute right-0 z-10 mt-2 w-40 origin-top-right rounded-md bg-white shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <div className="py-1">
                    {sortOptions.map((option) => (
                      <Menu.Item key={option.name}>
                        {({ active }) => (
                          <div
                            onClick={() =>
                              setFilters({ ...filters, sortBy: option.name })
                            }
                            className={classNames(
                              option.current
                                ? "font-medium text-gray-900"
                                : "text-gray-500",
                              active ? "bg-gray-100" : "",
                              "block px-4 py-2 text-sm cursor-pointer"
                            )}
                          >
                            {option.name}
                          </div>
                        )}
                      </Menu.Item>
                    ))}
                  </div>
                </Menu.Items>
              </Transition>
            </Menu>
          </div>
        </div>
        <div className="sm:flex py-5 border-b sm:justify-between sm:items-center">
          <div className="">
            <div className="text-gray-900 font-semibold">
              Request a review from your student
            </div>
            <div className="text-sm text-gray-500">
              No account necessary. Recipient will receive a unique URL which
              allows them to leave a review.
            </div>
          </div>
          <button
            type="button"
            className="mt-4 sm:mt-0 inline-flex items-center rounded-md text-white bg-indigo-500 hover:bg-indigo-600 px-4 py-2 text-sm font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            onClick={() => setSendRequestModalOpen(true)}
          >
            Send Request
          </button>
        </div>

        <div className="divide-y">
          {ratingData?.ratings?.map((rating: any, i: number) => (
            <RatingCard rating={rating} key={i} />
          ))}
          {ratingData?.count === 0 && (
            <div className="text-sm text-gray-500 py-6">No ratings</div>
          )}
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
      </div>
    </div>
  );
};

Reviews.getLayout = (page: ReactElement) => {
  return (
    <Layout>
      <RouteGuardRedirect ifNoTutorProfile>{page}</RouteGuardRedirect>
    </Layout>
  );
};

export default Reviews;
