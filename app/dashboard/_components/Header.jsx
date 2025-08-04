"use client";
import { Button } from "../../../components/ui/button.jsx";

import { UserButton } from "@clerk/nextjs";

import Image from "next/image";
import React from "react";

function Header() {
  return (
    <div className="p-3 px-5 flex items-center justify-between shadow-md">
      <div className="flex gap-3 items-center">
        <Image
          src={"/generated-image.png"}
          height={200}
          width={200}
          alt="clipPilot logo"
        />
      </div>
      <div className="flex gap-3 items-center">
        <Button>DashBoard</Button>
        <UserButton />
      </div>
    </div>
  );
}
export default Header;
