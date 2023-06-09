import Head from "next/head";
import { NextPageWithLayout } from "../_app";
import { ReactElement, useEffect, useState } from "react";
import { LockClosedIcon } from "@heroicons/react/20/solid";
import Layout from "../../components/layouts/Layout";
import { useFormik } from "formik";
import { googleLogin, login } from "@/services/auth";
import axios from "axios";
import { useRouter } from "next/router";
import { useQueryClient } from "react-query";
import ForgetPasswordModal from "@/components/auth/ForgetPasswordModal";
import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
import { toast } from "react-hot-toast";
import Link from "next/link";
import RouteGuardRedirect from "@/components/auth/RouteGuardRedirect";

const tabClasses =
  "w-full p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 ";
const tabClassesSelected =
  "w-full p-4 text-indigo-600 border-b-2 border-indigo-600 rounded-t-lg";
const Login: NextPageWithLayout = () => {
  const router = useRouter();
  const isTutorLogin = router.pathname === "/login/tutor";
  const queryClient = useQueryClient();
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    onSubmit: async (values) => {
      try {
        await login({ ...values, tutor: isTutorLogin });
        queryClient.refetchQueries("me");
        toast.success("Logged in");
      } catch (error) {
        console.log(error);
        if (axios.isAxiosError(error)) {
          if (error.response?.status === 401) {
            toast.error(error.response.data.message);
          } else {
            toast.error("Couldn't log in");
          }
        }
      }
    },
  });
  const [forgetPasswordModalIsOpen, setForgetPasswordModalIsOpen] =
    useState(false);

  const onGoogleLoginSuccess = async (response: CredentialResponse) => {
    const credential = response.credential;
    if (credential) {
      try {
        const data = await googleLogin({ credential, tutor: isTutorLogin });
        queryClient.refetchQueries("me");
        toast.success(data.message);
      } catch (error) {
        console.log(error);
        if (axios.isAxiosError(error)) {
          if (error.response?.status === 401) {
            toast.error(error.response.data.message);
          } else {
            toast.error("Couldn't log in");
          }
        } else {
          toast.error("Couldn't log in");
        }
      }
    } else {
      toast.error("Could not get credentials");
    }
  };

  return (
    <>
      <Head>
        <title>{isTutorLogin ? "Tutor Login" : "Client Login"}</title>
      </Head>
      <ForgetPasswordModal
        open={forgetPasswordModalIsOpen}
        setOpen={setForgetPasswordModalIsOpen}
      />
      <>
        <div className="flex min-h-full items-center justify-center sm:py-12 px-4 sm:px-6 lg:px-8">
          <div className="w-full max-w-md space-y-6">
            <div className="text-sm font-medium text-center text-gray-500 border-b border-gray-200 mx-2 leading-6">
              <ul className="flex -mb-px">
                <li className="flex-1">
                  <button
                    onClick={() => router.replace("/login")}
                    className={!isTutorLogin ? tabClassesSelected : tabClasses}
                  >
                    Client portal
                  </button>
                </li>
                <li className="flex-1 ">
                  <button
                    onClick={() => router.replace("/login/tutor")}
                    className={isTutorLogin ? tabClassesSelected : tabClasses}
                  >
                    Tutor portal
                  </button>
                </li>
              </ul>
            </div>
            <div>
              <div className="mx-auto w-min text-4xl text-gray-800 font-sans font-medium tracking-wide rounded-md px-2 py-1">
                {isTutorLogin ? (
                  <div>
                    <span className="text-red-500">tutor</span>ing.sg
                  </div>
                ) : (
                  <div>
                    tutoring.<span className="text-red-500">sg</span>
                  </div>
                )}
              </div>
              <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
                Sign in to your account <br />
                {isTutorLogin ? "(Tutor portal)" : "(Client portal)"}
              </h2>
            </div>
            <div className="flex justify-center">
              <GoogleLogin
                size={"large"}
                useOneTap
                onSuccess={onGoogleLoginSuccess}
                onError={() => toast.error("Couldn't log in")}
              />
            </div>
            <div>
              <div className="flex items-center">
                <div className="flex-grow border-t border-1 flex-1"></div>
                <div className="-mt-1 mx-2 text-gray-400 text-sm">or</div>
                <div className="flex-grow border-t border-1 flex-1"></div>
              </div>
            </div>
            <form className="mt-8 space-y-6" onSubmit={formik.handleSubmit}>
              <input type="hidden" name="remember" defaultValue="true" />
              <div className="-space-y-px rounded-md shadow-sm">
                <div>
                  <label htmlFor="email-address" className="sr-only">
                    Email address
                  </label>
                  <input
                    id="email-address"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="relative block w-full appearance-none rounded-none rounded-t-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                    placeholder="Email address"
                    onChange={formik.handleChange}
                    value={formik.values.email}
                  />
                </div>
                <div className="relative">
                  <label htmlFor="password" className="sr-only">
                    Password
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    className="relative block w-full appearance-none rounded-none rounded-b-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                    placeholder="Password"
                    onChange={formik.handleChange}
                    value={formik.values.password}
                  />
                </div>
              </div>

              <div className="flex items-center justify-end">
                <div className="text-sm">
                  <div
                    className="font-medium text-indigo-600 hover:text-indigo-500 cursor-pointer"
                    onClick={() => setForgetPasswordModalIsOpen(true)}
                  >
                    Forgot your password?
                  </div>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="group relative flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                    <LockClosedIcon
                      className="h-5 w-5 text-indigo-500 group-hover:text-indigo-400"
                      aria-hidden="true"
                    />
                  </span>
                  Sign in
                </button>
              </div>

              <div className="text-center text-sm">
                No account?{" "}
                <Link
                  href={isTutorLogin ? "/register/tutor" : "/register"}
                  className="font-medium text-indigo-600 hover:text-indigo-500"
                >
                  Create one
                </Link>
              </div>
            </form>
          </div>
        </div>
      </>
    </>
  );
};

Login.getLayout = (page: ReactElement) => {
  return (
    <Layout>
      <RouteGuardRedirect ifLoggedIn>{page}</RouteGuardRedirect>
    </Layout>
  );
};

export default Login;
