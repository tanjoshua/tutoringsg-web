import Head from "next/head";
import { NextPageWithLayout } from "./../_app";
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
import {
  deleteTestimonial,
  getTestimonials,
  getUserTestimonials,
} from "@/services/testimonial";
import PaginateFooter from "@/components/shared/PaginateFooter";

const AccountTestimonials: NextPageWithLayout = () => {
  const { isLoading, error, data, refetch } = useQuery("me", getMe);
  const [paginationQuery, setPaginationQuery] = useState({
    page: 1,
    limit: 10,
  });
  const {
    isLoading: testimonialsIsLoading,
    error: testimonialsError,
    data: testimonialData,
    refetch: testimonialRefetch,
  } = useQuery(
    ["userTestimonials", paginationQuery],
    () => getUserTestimonials(paginationQuery),
    { enabled: !isLoading && !!data.user }
  );
  const router = useRouter();
  return (
    <>
      <Head>
        <title>Your Testimonials</title>
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
            {!testimonialsIsLoading && (
              <div className="divide-y-2">
                {testimonialData?.testimonials.length === 0 && (
                  <p className="text-gray-600">No testimonials found</p>
                )}
                {testimonialData?.testimonials.map(
                  (testimonial: any, i: number) => (
                    <div className="sm:flex py-6" key={i}>
                      <div className="relative sm:w-40 flex-shrink-0 flex justify-between sm:block ">
                        <div className="text-gray-900 text-sm">
                          <Link
                            href={`/${testimonial.tutorProfile.urlId}`}
                            className=" text-indigo-600 underline hover:text-indigo-800"
                          >
                            {testimonial.tutorProfile.tutorName}
                          </Link>
                        </div>
                        <div className="text-gray-600 sm:mt-2 text-sm">
                          {new Date(testimonial.createdAt).toLocaleDateString(
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
                          <div className="text-gray-800 text-base font-semibold tracking-wide ">
                            {testimonial.title}
                          </div>
                        </div>
                        <div className="mt-2 text-gray-600 text-sm">
                          {testimonial.testimonial}
                        </div>
                        <div className="self-end">
                          <TrashIcon
                            data-tooltip-id="delete"
                            className="w-6 h-6 text-red-500 cursor-pointer"
                            onClick={async () => {
                              try {
                                await deleteTestimonial({
                                  id: testimonial.id,
                                });
                                toast.success("Deleted");
                                testimonialRefetch();
                              } catch (error: any) {
                                toast.error(
                                  error?.response?.data?.message ||
                                    "Could not delete testimonial"
                                );
                              }
                            }}
                          />
                          <Tooltip id="delete">Delete testimonial</Tooltip>
                        </div>
                      </div>
                    </div>
                  )
                )}
                <div className="">
                  {testimonialData?.count > 0 && (
                    <PaginateFooter
                      page={paginationQuery.page}
                      limit={paginationQuery.limit}
                      total={testimonialData?.count}
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

AccountTestimonials.getLayout = (page: ReactElement) => {
  return (
    <Layout>
      <RouteGuardRedirect ifNotLoggedIn>{page}</RouteGuardRedirect>
    </Layout>
  );
};

export default AccountTestimonials;
