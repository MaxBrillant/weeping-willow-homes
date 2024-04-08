"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ReactElement, useState } from "react";

export default function SeeMoreDialog(content: {
  title: string;
  button: ReactElement;
  body: ReactElement;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{content.button}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px] max-h-[500px] overflow-auto">
        <DialogHeader>
          <DialogTitle>{content.title}</DialogTitle>
        </DialogHeader>
        {content.body}
      </DialogContent>
    </Dialog>
  );
}
