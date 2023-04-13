import {
  BookmarkIcon,
  BookmarkSlashIcon,
  EyeIcon,
  EyeSlashIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";
import { updateTutorApplicationState } from "@/services/tutorRequest";
import { ApplicationState } from "@/utils/enums";
import {
  CurrencyDollarIcon,
  MapPinIcon,
  PhoneIcon,
  TagIcon,
} from "@heroicons/react/20/solid";
import Image from "next/image";
import { Tooltip } from "react-tooltip";
import Rating from "../tutor-profile/Rating";

interface TutorProfile {
  _id: string;
  id: string;
  title: string;
  type: string;
  pricing: { rate: number };
  tutorName: string;
  qualifications: string;
  description: string;
  image: string;
  contactInfo: any;
  profilePic: { location: string };
  totalRating: number;
  ratingCount: number;
}

export default function AppCard({
  tutorProfile,
  id,
  normal,
  shortlist,
  hidden,
  showDetails,
  updateState,
  showContact,
}: {
  tutorProfile: TutorProfile;
  id: string;
  normal?: boolean; // normal pending card
  shortlist?: boolean; // short list card type
  hidden?: boolean; // hidden card type
  showDetails: Function;
  updateState: (applicationId: string, state: string) => void;
  showContact: Function;
}) {
  // normal version
  return (
    <li className="flex py-6">
      <div className="relative h-24 w-24 md:h-32 md:w-32 flex-shrink-0 overflow-hidden rounded-md ">
        <Image
          src={
            tutorProfile.profilePic?.location ||
            "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
          }
          alt="profile picture"
          fill
        />
      </div>

      <div className="ml-4 flex flex-1 flex-col">
        <div>
          <div className="flex justify-between items-start text-base text-gray-900">
            <div>
              <div className="text-xs sm:text-sm">{tutorProfile.tutorName}</div>
              <h1 className="sm:text-lg font-medium tracking-tight">
                {tutorProfile.title}
              </h1>
            </div>
            <div className="flex">
              {normal && (
                <button
                  className="rounded-md transititext-primary"
                  data-tooltip-id="hide"
                  onClick={() => {
                    updateState(id, ApplicationState.Hidden);
                  }}
                >
                  <EyeSlashIcon className="h-6 w-6 text-indigo-600 hover:text-indigo-500" />
                  <Tooltip id="hide">Hide</Tooltip>
                </button>
              )}
              {hidden && (
                <button
                  className="rounded-md transititext-primary"
                  data-tooltip-id="unhide"
                  onClick={() => {
                    updateState(id, ApplicationState.Pending);
                  }}
                >
                  <EyeIcon className="h-6 w-6 text-indigo-600 hover:text-indigo-500" />
                  <Tooltip id="unhide">Unhide</Tooltip>
                </button>
              )}
            </div>
          </div>
          <Rating
            rating={tutorProfile.totalRating / tutorProfile.ratingCount}
            rateCount={tutorProfile.ratingCount}
          />

          <div className="mt-1 text-sm text-gray-500 line-clamp-4 mb-1">
            <div className="sm:flex sm:items-center sm:space-x-1">
              <div className="flex items-center text-sm text-gray-500">
                <TagIcon
                  className="h-5 w-5 flex-shrink-0 text-gray-400"
                  aria-hidden="true"
                />
                {tutorProfile.type}
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <CurrencyDollarIcon
                  className="h-5 w-5 flex-shrink-0 text-gray-400"
                  aria-hidden="true"
                />
                {tutorProfile.pricing.rate}/hr
              </div>
            </div>
            <div className="mt-2">{tutorProfile.qualifications}</div>
          </div>
        </div>
        <div className="flex flex-1 items-end justify-between text-sm mt-2">
          <div
            className="flex-1 text-indigo-600 hover:text-indigo-500 cursor-pointer"
            onClick={() => {
              showDetails(id);
            }}
          >
            Read more
          </div>

          <div className="flex space-x-4">
            <button
              type="button"
              className="font-medium text-indigo-600 hover:text-indigo-500 flex items-center"
              onClick={() => {
                showContact({
                  ...tutorProfile.contactInfo,
                  profileId: tutorProfile.id || tutorProfile._id, // TODO: THIS IS A TEMP FIX
                });
              }}
              data-te-toggle="tooltip"
              title="Contact"
            >
              <PhoneIcon className="h-6 w-6" />
              <div className="hidden sm:block">Contact</div>
            </button>
            {!shortlist && (
              <button
                type="button"
                className="font-medium text-indigo-600 hover:text-indigo-500 flex items-center"
                onClick={() => {
                  updateState(id, ApplicationState.Shortlisted);
                }}
                data-te-toggle="tooltip"
                title="Shortlist"
              >
                <BookmarkIcon className="h-6 w-6" />
                <div className="hidden sm:block">Shortlist</div>
              </button>
            )}
            {shortlist && (
              <button
                type="button"
                className="font-medium text-indigo-600 hover:text-indigo-500 flex items-center "
                data-te-toggle="tooltip"
                title="Remove from shortlist"
                onClick={() => {
                  updateState(id, ApplicationState.Pending);
                }}
              >
                <BookmarkSlashIcon className="h-6 w-6 " />
                <div className="hidden sm:block">Remove</div>
              </button>
            )}
          </div>
        </div>
      </div>
    </li>
  );
}
