import { getUserTutorProfile } from "@/services/tutor";
import { getMe } from "@/services/user";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useQuery } from "react-query";

export const RedirectIfNotLoggedIn = () => {
  const router = useRouter();
  const { isLoading, error, data, refetch } = useQuery("me", getMe);
  const isLoggedIn = !isLoading && !!data?.user;

  useEffect(() => {
    if (!isLoading && !error && !isLoggedIn) {
      router.replace("/login?next=" + router.asPath);
    }
  }, [isLoading, data, router]);
};

export const RedirectIfLoggedIn = () => {
  const router = useRouter();
  const { isLoading, error, data, refetch } = useQuery("me", getMe);
  const isLoggedIn = !isLoading && !!data?.user;

  useEffect(() => {
    if (!isLoading && !error && isLoggedIn) {
      router.replace("/tutor/your-profile");
    }
  }, [isLoading, data, router]);
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
  useEffect(() => {
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
  }, [isLoggedIn, profileIsLoading, profileData, router]);
};
