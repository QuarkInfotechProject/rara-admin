"use client";
import Image from "next/image";
import ChnLogoDark from "@/images/chn-logo-dark.png";
import ChnLogoLight from "@/images/chn-logo-light.png";

function ChnLogo() {
  return (
    <>
      <Image className="hidden dark:block" width={120} src={ChnLogoDark} alt="Community Homestay Logo" />
      <Image className="dark:hidden" width={120} src={ChnLogoLight} alt="Community Homestay Logo" />
    </>
  );
}

export default ChnLogo;
