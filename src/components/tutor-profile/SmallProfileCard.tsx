import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function SmallProfileCard({
  tutorProfile,
}: {
  tutorProfile: any;
}) {
  // normal version
  return (
    <Link
      href={`/${tutorProfile.urlId}`}
      className="flex flex-col px-4 items-center "
    >
      <div className="">
        <div className="relative h-40 w-40 sm:h-48 sm:w-48 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
          <Image
            alt="profile picture"
            src={
              tutorProfile.profilePic?.location ||
              "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
            }
            fill
            sizes="(max-width: 768px) 100vw,
              (max-width: 1200px) 50vw,
              33vw"
          />
        </div>
      </div>
      <div className="flex flex-col text-center mt-2 w-40 sm:w-60">
        <div className="text-xs sm:text-sm">{tutorProfile.tutorName}</div>
        <h1 className="text-sm sm:text-base font-medium tracking-tighter line-clamp-2">
          {tutorProfile.title}
        </h1>
      </div>
    </Link>
  );
}
