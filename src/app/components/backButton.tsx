"use client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function BackButton() {
  const router = useRouter();
  return (
    <Button variant={"ghost"} onClick={router.back}>
      Back
    </Button>
  );
}
