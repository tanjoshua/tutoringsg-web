import React from "react";
import { Toaster } from "react-hot-toast";
import Navbar from "../shared/Navbar";
import Footer from "../shared/Footer";

type Props = { children: any };

const Layout = (props: Props) => {
  return (
    <div className="relative min-h-screen">
      <Navbar />
      <Toaster />
      <main className="">{props.children}</main>
    </div>
  );
};

export default Layout;
