import { UserButton } from "@clerk/nextjs";
import Image from "next/image";

export default function Home() {
  return (
    <div>
      <h1>get started</h1>
      <UserButton />
    </div>
  );
}
