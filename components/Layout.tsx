import Head from "next/head";
import Image from "next/image";
import { PropsWithChildren } from "react";
import { Meta } from "./Meta";

export const Layout = (props: PropsWithChildren) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Meta />
      {props.children}
    </div>
  );
};
