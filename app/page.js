import { Button } from "@/components/ui/button";
import { UserButton } from "@clerk/nextjs";
import Image from "next/image";

export default function Home() {
  return (
    <div>
      <h1>get started</h1>
      <Button>submit</Button>
      <UserButton />
    </div>
  );
}
