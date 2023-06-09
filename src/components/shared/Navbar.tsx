import React from "react";
import { Fragment } from "react";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import {
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  BellIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { useQuery, useQueryClient } from "react-query";
import { getMe } from "@/services/user";
import { logout } from "@/services/auth";
import { useRouter } from "next/router";
import { classNames } from "@/utils/helpers";
import { UserIcon } from "@heroicons/react/20/solid";
import toast from "react-hot-toast";
import { Tooltip } from "react-tooltip";

const Navbar = () => {
  const router = useRouter();
  const atLoginPage =
    router.pathname === "/login" || router.pathname === "/login/tutor";
  const atTutorPortal = router.pathname.startsWith("/tutor/");

  const queryClient = useQueryClient();
  const { isLoading, error, data, refetch } = useQuery("me", getMe);
  const isLoggedIn = !isLoading && !!data?.user;
  const isTutorAccount = !!data?.user?.isTutor;

  const navigation = atTutorPortal
    ? [
        {
          name: "Tutor Profile",
          href: "/tutor/your-profile",
          current: router.pathname === "/tutor/your-profile",
        },
        {
          name: "Your Reviews",
          href: "/tutor/your-reviews",
          current: router.pathname === "/tutor/your-reviews",
        },
        {
          name: "Apply to Requests",
          href: "/tutor/dashboard",
          current: router.pathname === "/tutor/dashboard",
        },
      ]
    : [
        {
          name: "Browse Tutors",
          href: "/browse",
          current: router.pathname === "/browse",
        },
        {
          name: "Request a Tutor",
          href: "/request/make",
          current: router.pathname === "/request/make",
        },
        {
          name: "For Tutors",
          href: "/for-tutors",
          current: router.pathname === "/for-tutors",
        },
      ];

  return (
    <Disclosure as="nav" className="bg-gray-800">
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
            <div className="relative flex h-16 items-center justify-between">
              <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                {/* Mobile menu button*/}
                <Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
              <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start ">
                <div className="flex flex-shrink-0 items-center">
                  <Link href={atTutorPortal ? "/tutor/your-profile" : "/"}>
                    {atTutorPortal ? (
                      <div className="text-xl text-white font-sans font-medium tracking-wide border border-white rounded-md px-2 py-1">
                        <span className="text-red-500">tutor</span>ing.sg
                      </div>
                    ) : (
                      <div className="text-xl text-white font-sans font-medium tracking-wide border border-white rounded-md px-2 py-1">
                        tutoring.<span className="text-red-500">sg</span>
                      </div>
                    )}
                  </Link>
                </div>
                <div className="hidden sm:ml-6 sm:block">
                  <div className="flex space-x-4">
                    {navigation.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        className={classNames(
                          item.current
                            ? "bg-gray-900 text-white"
                            : "text-gray-300 hover:bg-gray-700 hover:text-white",
                          "px-3 py-2 rounded-md text-sm font-medium"
                        )}
                        aria-current={item.current ? "page" : undefined}
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
              <div className="absolute inset-y-0 right-0 flex items-center sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                {isLoggedIn && isTutorAccount && (
                  <div className="hidden md:block text-gray-300 hover:bg-gray-700 hover:text-whit px-3 py-2 rounded-md text-sm font-medium">
                    {atTutorPortal ? (
                      <Link href="/browse">
                        <div>Go to client portal</div>
                      </Link>
                    ) : (
                      <Link href="/tutor/your-profile">
                        <div>Go to tutor portal</div>
                      </Link>
                    )}
                  </div>
                )}

                {/* Profile dropdown */}
                {!isLoading &&
                  !atLoginPage &&
                  (isLoggedIn ? (
                    <Menu as="div" className="relative ml-3">
                      <div>
                        <Menu.Button className="flex flex-col items-center rounded-full p-1 bg-gray-800 text-gray-400 hover:text-white text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                          <span className="sr-only">Open user menu</span>
                          <UserIcon className="h-8 w-8" aria-hidden="true" />
                        </Menu.Button>
                      </div>
                      <Transition
                        as={Fragment}
                        enter="transition ease-out duration-100"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                      >
                        <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                          <Menu.Item>
                            {({ active }) => (
                              <Link
                                href={"/account/details"}
                                className={classNames(
                                  active ? "bg-gray-100" : "",
                                  "block px-4 py-2 text-sm text-gray-700"
                                )}
                              >
                                Your account
                              </Link>
                            )}
                          </Menu.Item>
                          {atTutorPortal && isTutorAccount && (
                            <Menu.Item>
                              {({ active }) => (
                                <Link
                                  href="/browse"
                                  className={classNames(
                                    active ? "bg-gray-100" : "",
                                    "block px-4 py-2 text-sm text-gray-700"
                                  )}
                                >
                                  Go to client portal
                                </Link>
                              )}
                            </Menu.Item>
                          )}
                          {!atTutorPortal && isTutorAccount && (
                            <Menu.Item>
                              {({ active }) => (
                                <Link
                                  href="/tutor/your-profile"
                                  className={classNames(
                                    active ? "bg-gray-100" : "",
                                    "block px-4 py-2 text-sm text-gray-700"
                                  )}
                                >
                                  Go to tutor portal
                                </Link>
                              )}
                            </Menu.Item>
                          )}
                          <Menu.Item>
                            {({ active }) => (
                              <div
                                onClick={async () => {
                                  await logout();
                                  queryClient.refetchQueries("me");
                                  toast.success("Logged out");
                                  router.reload();
                                }}
                                className={classNames(
                                  active ? "bg-gray-100" : "",
                                  "block px-4 py-2 text-sm text-gray-700 cursor-pointer"
                                )}
                              >
                                Sign out
                              </div>
                            )}
                          </Menu.Item>
                        </Menu.Items>
                      </Transition>
                    </Menu>
                  ) : (
                    <Menu as="div" className="relative ml-3">
                      <div>
                        <Menu.Button className="p-1 bg-gray-800 text-gray-400 hover:text-white">
                          Log In <span aria-hidden="true">&rarr;</span>
                        </Menu.Button>
                      </div>
                      <Transition
                        as={Fragment}
                        enter="transition ease-out duration-100"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                      >
                        <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                          <Menu.Item>
                            {({ active }) => (
                              <Link
                                href={
                                  router.pathname === "/"
                                    ? "/login"
                                    : `/login?next=${router.asPath}`
                                }
                                className={classNames(
                                  active ? "bg-gray-100" : "",
                                  "block px-4 py-2 text-sm text-gray-700"
                                )}
                              >
                                Client portal
                              </Link>
                            )}
                          </Menu.Item>
                          <Menu.Item>
                            {({ active }) => (
                              <Link
                                href="/login/tutor"
                                className={classNames(
                                  active ? "bg-gray-100" : "",
                                  "block px-4 py-2 text-sm text-gray-700"
                                )}
                              >
                                Tutor portal
                              </Link>
                            )}
                          </Menu.Item>
                        </Menu.Items>
                      </Transition>
                    </Menu>
                  ))}
              </div>
            </div>
          </div>

          <Disclosure.Panel className="sm:hidden">
            <div className="space-y-1 px-2 pt-2 pb-3">
              {navigation.map((item) => (
                <Disclosure.Button
                  key={item.name}
                  as="a"
                  href={item.href}
                  className={classNames(
                    item.current
                      ? "bg-gray-900 text-white"
                      : "text-gray-300 hover:bg-gray-700 hover:text-white",
                    "block px-3 py-2 rounded-md text-base font-medium"
                  )}
                  aria-current={item.current ? "page" : undefined}
                >
                  {item.name}
                </Disclosure.Button>
              ))}
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
};

export default Navbar;
