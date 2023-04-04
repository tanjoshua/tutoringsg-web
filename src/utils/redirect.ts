import { getUserTutorProfile } from "@/services/tutor";
import { getMe } from "@/services/user";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useQuery } from "react-query";

export const RedirectIfNotLoggedIn = () => {
  const router = useRouter();
  const { isLoading, error, data, refetch } = useQuery("me", getMe);
  const isLoggedIn = !isLoading && !!data?.user;

  if (!isLoading && !error && !isLoggedIn) {
    router.replace("/login?next=" + router.asPath);
  }
};

export const RedirectIfNotTutor = () => {
  const router = useRouter();
  const { isLoading, error, data, refetch } = useQuery("me", getMe);
  const isLoggedIn = !isLoading && !!data?.user;
  const isTutorAccount = !!data?.user.isTutor;

  if (!isLoading && !error && !isLoggedIn) {
    router.replace("/login?next=" + router.asPath);
  }

  if (!isTutorAccount) {
    router.replace("/for-tutors");
  }
};

export const RedirectIfLoggedIn = () => {
  const router = useRouter();
  const { isLoading, error, data, refetch } = useQuery("me", getMe);
  const isLoggedIn = !isLoading && !!data?.user;
  const redirectToClient =
    router.pathname === "/login" || router.pathname === "/register";

  if (!isLoading && !error && isLoggedIn) {
    if (redirectToClient) {
      router.replace("/browse");
    } else {
      router.replace("/tutor/your-profile");
    }
  }
};

export const RedirectIfNoTutorProfile = () => {
  const router = useRouter();
  const { isLoading, error, data, refetch } = useQuery("me", getMe);
  const isLoggedIn = !isLoading && !!data?.user;
  const {
    isLoading: profileIsLoading,
    error: profileError,
    data: profileData,
    refetch: profileRefetch,
  } = useQuery("userTutorProfile", getUserTutorProfile);
  if (
    !error &&
    !isLoading &&
    isLoggedIn &&
    !profileError &&
    !profileIsLoading &&
    !profileData.profile
  ) {
    router.replace("/tutor/your-profile");
  }
};
