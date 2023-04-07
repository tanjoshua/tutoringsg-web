import Head from "next/head";
import { NextPageWithLayout } from "../_app";
import { ReactElement, useEffect } from "react";
import Layout from "../../components/layouts/Layout";
import { useFormik } from "formik";
import { googleRegister, register } from "@/services/auth";
import { useRouter } from "next/router";
import axios, { AxiosError } from "axios";
import toast from "react-hot-toast";
import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
import { useQueryClient } from "react-query";
import Link from "next/link";
import RouteGuardRedirect from "@/components/auth/RouteGuardRedirect";

const tabClasses =
  "w-full p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 ";
const tabClassesSelected =
  "w-full p-4 text-indigo-600 border-b-2 border-indigo-600 rounded-t-lg";
const Register: NextPageWithLayout = () => {
  const router = useRouter();
  const isTutorRegister = router.pathname === "/register/tutor";
  const queryClient = useQueryClient();
  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
    },
    onSubmit: async (values) => {
      try {
        await register({ ...values, tutor: isTutorRegister });
        queryClient.refetchQueries("me");
        toast.success("Account created");
      } catch (error) {
        if (axios.isAxiosError(error)) {
          if (error.response?.status === 403) {
            toast.error("Account with email already exists");
          } else {
            toast.error("Error creating account");
          }
        }
      }
    },
  });
  const onGoogleLoginSuccess = async (response: CredentialResponse) => {
    const credential = response.credential;
    if (credential) {
      try {
        await googleRegister({ credential, tutor: isTutorRegister });
        queryClient.refetchQueries("me");
        toast.success("Account created");
      } catch (error) {
        if (axios.isAxiosError(error)) {
          if (error.response?.status === 403) {
            toast.error("Account with email already exists");
          } else {
            toast.error("Error creating account");
          }
        }
      }
    } else {
      toast.error("Could not get credentials");
    }
  };
  return (
    <>
      <Head>
        <title>{isTutorRegister ? "Tutor Register" : "Client Register"}</title>
      </Head>
      <div className="flex min-h-full items-center justify-center sm:py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-6">
          <div className="text-sm font-medium text-center text-gray-500 border-b border-gray-200 mx-2 leading-6">
            <ul className="flex -mb-px">
              <li className="flex-1">
                <button
                  onClick={() => router.replace("/register")}
                  className={!isTutorRegister ? tabClassesSelected : tabClasses}
                >
                  Client account
                </button>
              </li>
              <li className="flex-1 ">
                <button
                  onClick={() => router.replace("/register/tutor")}
                  className={isTutorRegister ? tabClassesSelected : tabClasses}
                >
                  Tutor account
                </button>
              </li>
            </ul>
          </div>
          <div>
            <h2 className="text-center text-3xl font-bold tracking-tight text-gray-900">
              {isTutorRegister
                ? "Create a tutor account"
                : "Create a client account"}
            </h2>
            {isTutorRegister && (
              <p className="text-center text-gray-500">
                You can also convert an existing account into a tutor account
                under &apos;Your Account&apos;.
              </p>
            )}
          </div>
          <div className="flex justify-center">
            <GoogleLogin
              size={"large"}
              useOneTap
              onSuccess={onGoogleLoginSuccess}
              onError={() => toast.error("Couldn't log in")}
              text="signup_with"
            />
          </div>
          <div>
            <div className="flex items-center">
              <div className="flex-grow border-t border-1 flex-1"></div>
              <div className="-mt-1 mx-2 text-gray-400 text-sm">or</div>
              <div className="flex-grow border-t border-1 flex-1"></div>
            </div>
          </div>
          <form
            className="mt-8 space-y-6"
            autoComplete="off"
            onSubmit={formik.handleSubmit}
          >
            <div>
              <label className="block text-sm font-medium mb-2 ">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                className="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none block w-full p-2.5"
                placeholder="Name"
                onChange={formik.handleChange}
                value={formik.values.name}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 ">
                Email address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none block w-full p-2.5"
                placeholder="Email address"
                onChange={formik.handleChange}
                value={formik.values.email}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 ">
                Password
              </label>

              <input
                type="password"
                id="password"
                name="password"
                className="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none block w-full p-2.5"
                placeholder="Password"
                onChange={formik.handleChange}
                value={formik.values.password}
                required
              />
            </div>

            <div>
              <button
                type="submit"
                className="group relative flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                Create
              </button>
            </div>

            <div className="text-center text-sm">
              Already have an account?{" "}
              <Link
                href={isTutorRegister ? "/login/tutor" : "/login"}
                className="font-medium text-indigo-600 hover:text-indigo-500"
              >
                Login
              </Link>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

Register.getLayout = (page: ReactElement) => {
  return (
    <Layout>
      <RouteGuardRedirect ifLoggedIn>{page}</RouteGuardRedirect>
    </Layout>
  );
};

export default Register;
