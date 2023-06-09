import { NextPageWithLayout } from "./_app";
import { ReactElement } from "react";
import Layout from "../components/layouts/Layout";

const ForgotPassword: NextPageWithLayout = () => {
  return <></>;
};

ForgotPassword.getLayout = (page: ReactElement) => {
  return <Layout>{page}</Layout>;
};

export default ForgotPassword;
