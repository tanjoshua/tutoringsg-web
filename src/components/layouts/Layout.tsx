import React from "react";
import { Toaster } from "react-hot-toast";
import Navbar from "../shared/Navbar";
import Footer from "../shared/Footer";

type Props = { children: any };

const Layout = (props: Props) => {
  return (
    <div className="relative min-h-screen pb-20">
      <Navbar />
      <Toaster />
      <main>{props.children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
