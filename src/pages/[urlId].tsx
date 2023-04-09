import { NextPageWithLayout } from "./_app";
import { ReactElement, useEffect, useRef, useState } from "react";
import Layout from "../components/layouts/Layout";
import { useQuery } from "react-query";
import { getTutorProfile, getUserTutorProfile } from "@/services/tutor";
import {
  LinkIcon,
  LockClosedIcon,
  MapPinIcon,
  PencilIcon,
  PhoneIcon,
  TagIcon,
  UserGroupIcon,
  UserIcon,
} from "@heroicons/react/20/solid";
import { useRouter } from "next/router";
import Head from "next/head";
import ShareModal from "@/components/tutor-profile/ShareModal";
import { LevelCategories } from "@/utils/options/levels";
import ContactModal from "@/components/tutor-profile/ContactModal";
import Link from "next/link";
import Image from "next/image";
import TestimonialSection from "@/components/tutor-profile/TestimonialSection";
import { ChatBubbleBottomCenterTextIcon } from "@heroicons/react/24/outline";

const TutorProfile: NextPageWithLayout = () => {
  const router = useRouter();
  const { urlId } = router.query;
  const { isLoading, error, data, refetch } = useQuery(
    ["tutorProfile", urlId],
    () => getTutorProfile({ urlId: urlId as string }),
    { enabled: !!urlId }
  );
  const [shareModalIsOpen, setShareModalIsOpen] = useState(false);
  const [contactModalIsOpen, setContactModalIsOpen] = useState(false);
  const testRef = useRef<HTMLDivElement>(null);

  if (isLoading) {
    return <></>;
  }

  if (error) {
    // profile does not exist
    return (
      <div className="relative px-6 lg:px-8">
        <Head>
          <title>404</title>
        </Head>
        <div className="mx-auto max-w-2xl py-20 ">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900">
              No profile found
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              We could not find the tutor profile you were looking for. Find a
              suitable tutor in the tutor marketplace.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link
                href="/browse"
                className="rounded-md bg-indigo-600 px-3.5 py-1.5 text-base font-semibold leading-7 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Browse tutors
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (data?.profile) {
    const profile = data.profile;
    // profile exists
    return (
      <div>
        <Head>
          <title>{profile.tutorName} · Tutor</title>
        </Head>

        <ShareModal
          link={`${process.env.WEB_URL}/${profile.urlId}`}
          open={shareModalIsOpen}
          setOpen={setShareModalIsOpen}
        />
        <ContactModal
          open={contactModalIsOpen}
          setOpen={setContactModalIsOpen}
          contactInfo={profile.contactInfo}
          profileId={profile.id}
        />
        <div className="lg:flex">
          <div className="px-4 lg:mx-8 mt-5 lg:p-5 lg:shadow-md rounded-lg lg:space-y-4 self-start lg:sticky lg:top-5">
            <div className="relative flex-shrink-0 overflow-hidden rounded-md h-40 w-40 lg:h-52 lg:w-52">
              <Image
                alt="profile picture"
                src={
                  profile.profilePic?.location ||
                  "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
                }
                fill
              />
            </div>
            <div className="mt-5">
              <h1 className="font-normal text-xl text-gray-900 leading-6">
                {profile.tutorName}
              </h1>
              <Link
                href="#testimonials"
                className="lg:flex lg:space-x-1 items-center hidden text-gray-500 hover:text-gray-600 underline leading-6 mt-2"
                scroll={false}
              >
                <ChatBubbleBottomCenterTextIcon className="h-5 w-5" />
                <div>{profile.testimonialCount} testimonials →</div>
              </Link>
              <div className="lg:flex hidden mt-4">
                <span className="space-x-2">
                  <button
                    type="button"
                    className="inline-flex items-center rounded-md text-white bg-indigo-600 hover:bg-indigo-500 px-4 py-2 text-sm font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    onClick={() => setContactModalIsOpen(true)}
                  >
                    <PhoneIcon
                      className="-ml-1 mr-2 h-5 w-5"
                      aria-hidden="true"
                    />
                    Contact
                  </button>
                  <button
                    type="button"
                    className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    onClick={() => setShareModalIsOpen(true)}
                  >
                    <LinkIcon
                      className="-ml-1 mr-2 h-5 w-5 text-gray-700"
                      aria-hidden="true"
                    />
                    Share
                  </button>
                </span>
              </div>
            </div>
          </div>
          <div className="lg:flex-1">
            <div className="lg:flex lg:items-center lg:justify-between px-4 lg:py-5 space-y-4 lg:space-x-6">
              <div className="min-w-0 flex-1">
                <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl tracking-tight">
                  {profile.title}
                </h1>
                <div className="mt-1 flex flex-col sm:mt-0 sm:flex-row sm:flex-wrap sm:space-x-6">
                  <div className="mt-2 flex items-center text-sm text-gray-500">
                    <TagIcon
                      className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400"
                      aria-hidden="true"
                    />
                    {profile.type}
                  </div>
                  <div className="mt-2 flex items-center text-sm text-gray-500">
                    <UserIcon
                      className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400"
                      aria-hidden="true"
                    />
                    {profile.gender}
                  </div>
                  <div className="mt-2 flex items-center text-sm text-gray-500">
                    <MapPinIcon
                      className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400"
                      aria-hidden="true"
                    />
                    {profile.regions.length == 6
                      ? "All regions & online"
                      : profile.regions.join(", ")}
                  </div>
                </div>
              </div>
              <div className="lg:hidden pb-4 space-y-4">
                <Link
                  href="#testimonials"
                  className="flex space-x-1 items-center text-gray-500 hover:text-gray-600 underline leading-6 "
                  scroll={false}
                >
                  <ChatBubbleBottomCenterTextIcon className="h-5 w-5" />
                  <div>{profile.testimonialCount} testimonials →</div>
                </Link>
                <div className="flex space-x-2">
                  <span className="lg:ml-3 space-x-2">
                    <button
                      type="button"
                      className="inline-flex items-center rounded-md text-white bg-indigo-600 hover:bg-indigo-500 px-4 py-2 text-sm font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                      onClick={() => setContactModalIsOpen(true)}
                    >
                      <PhoneIcon
                        className="-ml-1 mr-2 h-5 w-5"
                        aria-hidden="true"
                      />
                      Contact
                    </button>
                    <button
                      type="button"
                      className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                      onClick={() => setShareModalIsOpen(true)}
                    >
                      <LinkIcon
                        className="-ml-1 mr-2 h-5 w-5 text-gray-700"
                        aria-hidden="true"
                      />
                      Share
                    </button>
                  </span>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200">
              <dl>
                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-700">
                    Levels taught
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                    {profile.levels.join(", ")}
                  </dd>
                </div>
                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-700">
                    Subjects taught
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0 whitespace-pre-wrap">
                    {Object.values(LevelCategories).map((level) => {
                      if (
                        profile.levels.includes(level) &&
                        profile.subjects[level]
                      ) {
                        return `${level}: ${profile.subjects[level].join(
                          ", "
                        )}\n`;
                      }
                    })}
                  </dd>
                </div>
                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-700">Pricing</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0 whitespace-pre-wrap">
                    ${profile.pricing.rate} / hr
                    {profile.pricing.details && (
                      <>
                        <br />
                        {profile.pricing.details}
                      </>
                    )}
                  </dd>
                </div>
                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-700">
                    Teaching Experience and Academic Qualifications
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0 whitespace-pre-wrap">
                    {profile.qualifications}
                  </dd>
                </div>
                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-700">
                    Tutor Description
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0 whitespace-pre-wrap">
                    {profile.description}
                  </dd>
                </div>
                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-700">
                    Contact Info
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0 whitespace-pre-wrap">
                    {profile.contactInfo.phoneNumber &&
                      `Phone Number: +65 ${profile.contactInfo.phoneNumber}\n`}
                    {profile.contactInfo.email &&
                      `Email: ${profile.contactInfo.email}\n`}
                    {profile.contactInfo.telegram &&
                      `Telegram: @${profile.contactInfo.telegram}\n`}
                  </dd>
                </div>
              </dl>
            </div>

            <div id="testimonials" ref={testRef}>
              <TestimonialSection
                profileId={profile.id}
                profileUrlId={profile.urlId}
              />
            </div>
          </div>
        </div>
      </div>
    );
  } else {
    // this shouldn't happen but I think it does when the page first loads
    return <></>;
  }
};

TutorProfile.getLayout = (page: ReactElement) => {
  return <Layout>{page}</Layout>;
};

export default TutorProfile;
