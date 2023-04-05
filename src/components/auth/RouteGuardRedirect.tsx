import { getUserTutorProfile } from "@/services/tutor";
import { getMe } from "@/services/user";
import { useRouter } from "next/router";
import { FC, PropsWithChildren, useEffect, useState } from "react";
import { useQuery } from "react-query";

const RouteGuardRedirect = ({
  children,
  ifLoggedIn,
  ifNotLoggedIn,
  ifNotTutor,
  ifNoTutorProfile,
}: PropsWithChildren<{
  children: JSX.Element;
  ifNotLoggedIn?: boolean;
  ifNotTutor?: boolean;
  ifLoggedIn?: boolean;
  ifNoTutorProfile?: boolean;
}>): JSX.Element => {
  const router = useRouter();
  const { isLoading, error, data, refetch } = useQuery("me", getMe);
  const {
    isLoading: profileIsLoading,
    error: profileError,
    data: profileData,
    refetch: profileRefetch,
  } = useQuery("userTutorProfile", getUserTutorProfile, {
    enabled: !!data?.user && !!data?.user?.isTutor,
  });
  const [safe, setSafe] = useState(false);

  useEffect(() => {
    if (!isLoading && !error) {
      const isLoggedIn = !!data?.user;

      if (isLoggedIn) {
        // logged in
        if (ifLoggedIn) {
          const redirectToClient =
            router.pathname === "/login" || router.pathname === "/register";
          if (redirectToClient) {
            router.replace("/browse");
            return;
          } else {
            router.replace("/tutor/your-profile");
            return;
          }
        }

        if (ifNotTutor || ifNoTutorProfile) {
          if (!data?.user?.isTutor) {
            router.replace("/for-tutors");
            return;
          }
        }

        if (ifNoTutorProfile) {
          if (!profileIsLoading && !profileError && !profileData.profile) {
            router.replace("/tutor/your-profile");
            return;
          }
        }
      } else {
        // not logged in
        if (ifNotLoggedIn || ifNotTutor || ifNoTutorProfile) {
          router.replace("/login?next=" + router.asPath);
          return;
        }
      }
      setSafe(true);
    }
  }, [
    data,
    error,
    ifLoggedIn,
    ifNoTutorProfile,
    ifNotLoggedIn,
    ifNotTutor,
    isLoading,
    profileData,
    profileError,
    profileIsLoading,
    router,
  ]);

  return safe ? children : <></>;
};

export default RouteGuardRedirect;
