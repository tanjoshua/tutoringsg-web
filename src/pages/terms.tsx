import { NextPageWithLayout } from "./_app";
import { ReactElement } from "react";
import Layout from "../components/layouts/Layout";
import Head from "next/head";

const Terms: NextPageWithLayout = () => {
  return (
    <div className="bg-white px-4 py-5 mx-auto">
      <Head>
        <title>Terms & Conditions</title>
      </Head>
      <h1>Terms and conditions</h1>
      <ul className="list-disc px-4">
        <li>
          tutoring.sg is not a party in dealings between client and tutors.
          tutoring.sg merely makes its site services available to allow clients
          to determine the suitability of tutors themselves, and to enable
          tutors to determine the suitability of clients for themselves.
        </li>
        <li>
          tutoring.sg reserves the right to refuse service, terminate accounts,
          remove a tutor&apos;s profile, remove or edit content from the website
          at its discretion.
        </li>
      </ul>
    </div>
  );
};

Terms.getLayout = (page: ReactElement) => {
  return <Layout>{page}</Layout>;
};

export default Terms;
