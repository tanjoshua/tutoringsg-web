import { NextPageWithLayout } from "./_app";
import { ReactElement } from "react";
import Layout from "../components/layouts/Layout";
import {
  ArrowPathIcon,
  CurrencyDollarIcon,
  EyeSlashIcon,
  ForwardIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import Head from "next/head";
import { FaceSmileIcon } from "@heroicons/react/20/solid";
import Link from "next/link";
import { useQuery, useQueryClient } from "react-query";
import { useRouter } from "next/router";
import { getMe } from "@/services/user";
import { becomeTutor } from "@/services/auth";
import { toast } from "react-hot-toast";

const features = [
  {
    name: "No commission fees",
    description: `Our platform is uniquely designed to operate with automated processes with no human intervention. 
    This allows us to provide a high-quality service with no fees to the tutors and students.`,
    icon: CurrencyDollarIcon,
  },
  {
    name: "Your digital resume",
    description: (
      <div>
        After creating a tutor profile, you get a customizable and shareable
        link, such as{" "}
        <Link
          href="/josh"
          className="font-bold text-indigo-600 hover:underline cursor-pointer"
        >
          tutoring.sg/josh
        </Link>{" "}
        where you can showcase your qualifications and expertise. If you
        don&apos;t have a large online presence or website, let us provide that
        for you.
      </div>
    ),
    icon: UserCircleIcon,
  },
  {
    name: "No middlement",
    description: `Our platform is designed to connect tutors and students directly, eliminating the need for middlemen and streamlining the process of finding the right match for each student. 
    By cutting out the middleman, we're able to ensure fast turnaround times for both tutors and students. 
    Potential clients can reach you directly, without having to navigate through a complex system or wait for intermediaries to facilitate the process. `,
    icon: ForwardIcon,
  },
  {
    name: "Future improvements",
    description: `Our tutoring platform is always evolving to provide the best possible experience for our users. 
      We're constantly adding new features and making quality of life improvements to ensure that our platform remains the best choice for both tutors and students.`,
    icon: ArrowPathIcon,
  },
];

const ForTutors: NextPageWithLayout = () => {
  const router = useRouter();
  const { isLoading, error, data, refetch } = useQuery("me", getMe);
  const isLoggedIn = !isLoading && !error && !!data?.user;
  const queryClient = useQueryClient();

  return (
    <>
      <Head>
        <title>Join us as a tutor</title>
      </Head>
      <div className="bg-white py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-lg font-semibold leading-8 tracking-tight text-indigo-600">
              100% commission free marketplace
            </h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Join Our Free Tutoring Marketplace and Matching Service
            </p>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Welcome to tutoring.sg, where we make it easy for tutors like you
              to connect with students and share your knowledge. Our platform is
              <span className="text-indigo-600 font-medium">
                {" "}
                completely free to use
              </span>
              , with no hidden fees or commissions. Unlike tutor agencies who
              charge high commission fees, we believe that tutors like you
              should keep all of the money you earn.
            </p>
            <div className="mt-10">
              {isLoggedIn ? (
                <button
                  className="text-lg font-semibold leading-7 text-white p-2 bg-indigo-700 hover:bg-indigo-600 rounded-lg"
                  onClick={async () => {
                    try {
                      const data = await becomeTutor();
                      await queryClient.refetchQueries("me");
                      toast.success(data?.message || "Success");
                      router.push("/tutor/your-profile");
                    } catch {
                      toast.error("Error occured");
                    }
                  }}
                >
                  Become a tutor
                </button>
              ) : (
                <Link
                  href="/register/tutor"
                  className="text-lg font-semibold leading-7 text-white p-2 bg-indigo-700 hover:bg-indigo-600 rounded-lg"
                >
                  Join today <span aria-hidden="true">→</span>
                </Link>
              )}
            </div>
          </div>
          <div className="mx-auto mt-16 max-w-2xl lg:max-w-4xl">
            <dl className="grid max-w-xl grid-cols-1 gap-y-10 gap-x-8 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
              {features.map((feature) => (
                <div key={feature.name} className="relative pl-16">
                  <dt className="text-base font-semibold leading-7 text-gray-900">
                    <div className="absolute top-0 left-0 flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600">
                      <feature.icon
                        className="h-6 w-6 text-white"
                        aria-hidden="true"
                      />
                    </div>
                    {feature.name}
                  </dt>
                  <dd className="mt-2 text-base leading-7 text-gray-600">
                    {feature.description}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </>
  );
};

ForTutors.getLayout = (page: ReactElement) => {
  return <Layout>{page}</Layout>;
};

export default ForTutors;
