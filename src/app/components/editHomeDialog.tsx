"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useRouter } from "next/navigation";
import { ReactElement, cloneElement, useState } from "react";

export default function EditPopup(content: {
  title: string;
  form: ReactElement;
}) {
  const [open, setOpen] = useState(false);
  const { refresh } = useRouter();

  const modifiedForm = cloneElement(content.form, {
    submitFunctions: [() => setOpen(false), () => refresh()],
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={"outline"}>Edit</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] max-h-[500px] overflow-auto">
        <DialogHeader>
          <DialogTitle>{content.title}</DialogTitle>
        </DialogHeader>
        {modifiedForm}
      </DialogContent>
    </Dialog>
  );
}
