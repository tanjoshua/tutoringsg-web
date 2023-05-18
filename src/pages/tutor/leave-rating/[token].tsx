import { NextPageWithLayout } from "../../_app";
import { Fragment, ReactElement } from "react";
import Layout from "../../../components/layouts/Layout";
import { useQuery } from "react-query";
import { useRouter } from "next/router";
import Head from "next/head";
import { verifyRatingRequest, fulfilRatingRequest } from "@/services/rating";
import RouteGuardRedirect from "@/components/auth/RouteGuardRedirect";
import { RatingSelect } from "@/components/tutor-profile/WriteRatingModal";
import { useFormik } from "formik";
import toast from "react-hot-toast";
import axios from "axios";

const LeaveRating: NextPageWithLayout = () => {
  const router = useRouter();
  const { token } = router.query;
  const { isLoading, error, data, refetch } = useQuery(
    ["verifyRatingRequest", token],
    () => verifyRatingRequest({ token: token as string }),
    { enabled: !!token }
  );

  const formik = useFormik({
    initialValues: {
      testimonial: "",
      rating: 0,
      name: "",
    },
    onSubmit: async (values, { resetForm }) => {
      try {
        // TODO FULFIL REQUEST
        const result = await fulfilRatingRequest({
          token: token as string,
          rating: values.rating,
          testimonial: values.testimonial,
          name: values.name,
        });
        toast.success("Rating posted");
        router.push(`/${result.tutorUrlId}`);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          toast.error(
            error.response?.data?.message || "Could not create rating"
          );
        } else {
          toast.error("Could not create rating");
        }
      }
    },
  });

  if (error) {
    return (
      <div>
        <Head>
          <title>Rating request not found</title>
        </Head>
        <div className="bg-white px-4 py-5 mx-auto">
          <p className="text-sm text-gray-500">Rating request not found</p>
        </div>
      </div>
    );
  }

  // profile exists
  return (
    <div>
      <Head>
        <title>Leave a rating for {data?.tutorName}</title>
      </Head>
      <div className="bg-white px-4 py-5 mx-auto">
        <div className="flex items-baseline justify-between border-b border-gray-200 pb-2">
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-gray-900">
              Leave a rating for {data?.tutorName}
            </h1>
            <div className="mt-1 flex flex-col sm:mt-0 sm:flex-row sm:flex-wrap sm:space-x-6">
              <p className="text-sm text-gray-500">{data?.message}</p>
            </div>
          </div>
        </div>

        <form onSubmit={formik.handleSubmit}>
          <div className="pt-2">
            <div className="mb-4">
              <label className="text-start block mb-2 font-medium text-gray-900">
                Your name
              </label>
              <input
                className="border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 focus:border-indigo-600 focus:outline-none"
                id="name"
                placeholder="Your name"
                onChange={formik.handleChange}
                value={formik.values.name}
                maxLength={100}
                required
              />
            </div>
            <div className="mb-4">
              <label className="text-start block mb-2 font-medium text-gray-900">
                Your Rating
              </label>
              <div className="flex">
                <RatingSelect
                  rating={formik.values.rating}
                  setRating={(rating: number) =>
                    formik.setFieldValue("rating", rating)
                  }
                />
              </div>
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
            <div className="text-center">
              <button
                type="submit"
                className="justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                Leave rating
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

LeaveRating.getLayout = (page: ReactElement) => {
  return (
    <Layout>
      <RouteGuardRedirect ifNoTutorProfile>{page}</RouteGuardRedirect>
    </Layout>
  );
};

export default LeaveRating;
