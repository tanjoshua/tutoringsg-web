import App, { NextPageWithLayout } from "../../_app";
import { ReactElement, useState } from "react";
import Layout from "../../../components/layouts/Layout";
import { useQuery, useQueryClient } from "react-query";
import { LockClosedIcon, ArrowPathIcon } from "@heroicons/react/20/solid";
import { useRouter } from "next/router";
import Head from "next/head";
import {
  closeTutorRequest,
  getTutorApplications,
  updateTutorApplicationState,
} from "@/services/tutorRequest";
import { ApplicationState, RateOptions } from "@/utils/enums";
import Spinner from "@/components/shared/Spinner";
import AppCard from "@/components/tutor-request/AppCard";
import TutorDetailsModal from "@/components/tutor-request/TutorDetailsModal";
import ContactModal from "@/components/tutor-profile/ContactModal";
import CloseRequestModal from "@/components/tutor-request/CloseRequestModal";
import toast from "react-hot-toast";
import Link from "next/link";

const tabClasses =
  "inline-block p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 ";
const tabClassesSelected =
  "inline-block p-4 text-indigo-600 border-b-2 border-indigo-600 rounded-t-lg";

const generatePrefilledMessage = (availability: string) => {
  if (!availability) {
    return "";
  }
  return `Thanks for applying to my tutor request. I am interested in scheduling a lesson with you. Here is my availability: \n${availability}`;
};

const TutorProfile: NextPageWithLayout = () => {
  const router = useRouter();
  const { token } = router.query;
  const queryClient = useQueryClient();
  const { isLoading, error, data, refetch, isRefetching } = useQuery(
    ["getTutorApplications", token],
    () => getTutorApplications({ token: token as string }),
    { enabled: !!token }
  );
  const [tabSelected, setTabSelected] = useState(ApplicationState.Pending);
  const [tutorDetailsModalOpen, setTutorDetailsModalOpen] = useState(false);
  const [appId, setAppId] = useState("");
  const [closeRequestModalOpen, setCloseRequestModalOpen] = useState(false);
  const showTutorDetails = (id: string) => {
    setAppId(id);
    setTutorDetailsModalOpen(true);
  };

  const updateState = async (applicationId: string, state: string) => {
    await updateTutorApplicationState({ applicationId, newState: state });
    refetch();
    queryClient.refetchQueries({
      queryKey: ["getTutorApplication", applicationId],
    });
  };

  const [contactModalOpen, setContactModalIsOpen] = useState(false);
  const [contactInfo, setContactModalInfo] = useState<any>({});
  const showContactDetails = (info: any) => {
    setTutorDetailsModalOpen(false);
    setContactModalInfo(info);
    setContactModalIsOpen(true);
  };

  if (isLoading) {
    return <></>;
  }

  if (error) {
    // profile does not exist
    return (
      <div className="relative px-6 lg:px-8">
        <div className="mx-auto max-w-2xl py-20 ">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900">
              Tutor request not found
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              We could not find the tutor request you were looking for. Find a
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

  if (data?.tutorRequest) {
    const tutorRequest = data.tutorRequest;
    const pendingApplications: any[] = data.pendingApplications;
    const hiddenApplications: any[] = data.hiddenApplications;
    const shortlistedApplications: any[] = data.shortlistedApplications;

    const closeRequest = async () => {
      toast.promise(
        closeTutorRequest({ id: tutorRequest.id }).then(() => refetch()),
        {
          loading: "Closing",
          success: "Request closed",
          error: "Error closing",
        }
      );
    };

    // profile exists
    return (
      <div>
        <Head>
          <title>{`Tutor Applications`}</title>
        </Head>
        <CloseRequestModal
          open={closeRequestModalOpen}
          setOpen={setCloseRequestModalOpen}
          closeRequest={closeRequest}
        />
        <ContactModal
          open={contactModalOpen}
          setOpen={setContactModalIsOpen}
          contactInfo={contactInfo}
          profileId={contactInfo.profileId}
          prefill={{
            name: tutorRequest.name,
            email: tutorRequest.contactInfo.email,
            phoneNumber: tutorRequest.contactInfo.phoneNumber,
            message: generatePrefilledMessage(tutorRequest.availability),
          }}
        />
        <TutorDetailsModal
          id={appId}
          open={tutorDetailsModalOpen}
          setOpen={setTutorDetailsModalOpen}
          updateState={updateState}
          showContact={showContactDetails}
        />
        <div className="lg:flex lg:items-center lg:justify-between px-4 py-5 sm:px-6">
          <div className="min-w-0 flex-1">
            <h1 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
              {`Hello ${tutorRequest.name}, here are the tutors that have applied`}
            </h1>
            <h2 className="mt-2 text-lg font-bold leading-7 text-gray-900 sm:truncate sm:text-xl sm:tracking-tight">
              Tutor requests will automatically close after a week.
            </h2>

            <div className="mt-2 flex flex-col sm:flex-row sm:flex-wrap sm:space-x-6">
              <p className="text-sm text-gray-500">
                New tutors who apply to your tutor request will show up here.
                This list will be constantly updated so check back in regularly!
              </p>
            </div>
          </div>
          <div className="mt-5 flex lg:mt-0 lg:ml-4">
            <span className="">
              <button
                type="button"
                className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                onClick={() => {
                  refetch();
                }}
              >
                {isRefetching ? (
                  <>Loading...</>
                ) : (
                  <>
                    <ArrowPathIcon
                      className="-ml-1 mr-2 h-5 w-5 text-gray-700"
                      aria-hidden="true"
                    />
                    Refresh
                  </>
                )}
              </button>
            </span>
            <span className="ml-2">
              <button
                type="button"
                className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                onClick={() => {
                  setCloseRequestModalOpen(true);
                }}
                disabled={tutorRequest.closed}
              >
                <LockClosedIcon
                  className="-ml-1 mr-2 h-5 w-5 text-gray-700"
                  aria-hidden="true"
                />
                {tutorRequest.closed ? "Request closed" : "Close request"}
              </button>
            </span>
          </div>
        </div>

        <div className="border-t border-gray-200 md:grid md:grid-cols-2 md:items-start">
          <div>
            <div className="text-sm font-medium text-center text-gray-500 border-b border-gray-200 mx-2 leading-6">
              <ul className="flex flex-wrap -mb-px">
                <li className="mr-2">
                  <button
                    className={
                      tabSelected === ApplicationState.Pending
                        ? tabClassesSelected
                        : tabClasses
                    }
                    onClick={() => setTabSelected(ApplicationState.Pending)}
                  >
                    Pending
                  </button>
                </li>
                <li className="mr-2">
                  <button
                    className={
                      tabSelected === ApplicationState.Hidden
                        ? tabClassesSelected
                        : tabClasses
                    }
                    onClick={() => setTabSelected(ApplicationState.Hidden)}
                  >
                    Hidden
                  </button>
                </li>
                <li className="mr-2 md:hidden">
                  <button
                    className={
                      tabSelected === ApplicationState.Shortlisted
                        ? tabClassesSelected
                        : tabClasses
                    }
                    onClick={() => setTabSelected(ApplicationState.Shortlisted)}
                  >
                    Shortlisted
                  </button>
                </li>
              </ul>
            </div>
            <div className="p-2">
              <div>
                {isLoading && <Spinner />}
                {!isLoading && tabSelected === ApplicationState.Pending && (
                  <ul role="list" className="divide-y divide-gray-200">
                    {pendingApplications.length === 0 && (
                      <div className="text-sm text-gray-500">
                        No pending applications yet. Check back at a later date!
                      </div>
                    )}
                    {pendingApplications.map((app) => (
                      <AppCard
                        key={app._id}
                        tutorProfile={app.tutorProfile}
                        id={app._id}
                        normal
                        showDetails={showTutorDetails}
                        updateState={updateState}
                        showContact={showContactDetails}
                      />
                    ))}
                  </ul>
                )}
                {!isRefetching && tabSelected === ApplicationState.Hidden && (
                  <ul role="list" className="divide-y divide-gray-200">
                    {hiddenApplications.length === 0 && (
                      <div className="text-sm text-gray-500">
                        No hidden applications.
                      </div>
                    )}
                    {hiddenApplications.map((app) => (
                      <AppCard
                        key={app._id}
                        tutorProfile={app.tutorProfile}
                        id={app._id}
                        hidden
                        showDetails={showTutorDetails}
                        updateState={updateState}
                        showContact={showContactDetails}
                      />
                    ))}
                  </ul>
                )}
                {!isRefetching &&
                  tabSelected === ApplicationState.Shortlisted && (
                    <ul role="list" className="divide-y divide-gray-200">
                      {shortlistedApplications.length === 0 && (
                        <div className="text-sm text-gray-500">
                          No shortlisted applicants. You can also{" "}
                          <Link
                            href="/browse"
                            className="text-indigo-500 hover:underline"
                          >
                            browse our marketplace
                          </Link>{" "}
                          to find more tutors!
                        </div>
                      )}
                      {shortlistedApplications.map((app) => (
                        <AppCard
                          key={app._id}
                          tutorProfile={app.tutorProfile}
                          id={app._id}
                          shortlist
                          showDetails={showTutorDetails}
                          updateState={updateState}
                          showContact={showContactDetails}
                        />
                      ))}
                    </ul>
                  )}
              </div>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="border-b border-gray-200">
              <div className="text-2xl font-bold text-gray-900 p-4 leading-6">
                Shortlisted tutors
              </div>
            </div>
            <div className="p-2">
              {isLoading && <Spinner />}
              {!isLoading && (
                <ul role="list" className="divide-y divide-gray-200">
                  {shortlistedApplications.length === 0 && (
                    <div className="text-sm text-gray-500">
                      No shortlisted applicants. You can also{" "}
                      <Link
                        href="/browse"
                        className="text-indigo-500 hover:underline"
                      >
                        browse our marketplace
                      </Link>{" "}
                      to find more tutors!
                    </div>
                  )}
                  {shortlistedApplications.map((app) => (
                    <AppCard
                      key={app._id}
                      tutorProfile={app.tutorProfile}
                      id={app._id}
                      shortlist
                      showDetails={showTutorDetails}
                      updateState={updateState}
                      showContact={showContactDetails}
                    />
                  ))}
                </ul>
              )}
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
