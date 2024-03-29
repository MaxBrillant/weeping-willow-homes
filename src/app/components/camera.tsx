"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Image from "next/image";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";

const SelfieCamera = (props: {
  setProfilePhoto: Dispatch<SetStateAction<Blob | undefined>>;
  defaultPhoto: string | undefined;
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
  const [open, setOpen] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState<Blob>();

  useEffect(() => {
    if (open) {
      const getMedia = async () => {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: "user" },
            audio: false,
          });
          setMediaStream(stream);
        } catch (err) {
          console.error("Error accessing camera:", err);
        }
      };

      getMedia();

      return () => {
        mediaStream?.getTracks().forEach((track) => track.stop());
      };
    } else {
      mediaStream?.getTracks().forEach((track) => track.stop());
      if (videoRef.current) {
        videoRef.current.srcObject = null; // Clear the video source
      }
    }
  }, [open]);

  useEffect(() => {
    if (videoRef.current && mediaStream) {
      videoRef.current.srcObject = mediaStream;
    }
  }, [mediaStream]);

  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement("canvas");
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

        canvas.toBlob(async (blob) => {
          if (blob) {
            props.setProfilePhoto(blob);
            setProfilePhoto(blob);
          }
        });
      }
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {profilePhoto != undefined ? (
          <div>
            <Image
              src={URL.createObjectURL(profilePhoto)}
              alt="profile"
              width={300}
              height={300}
              className="w-40 aspect-square object-cover rounded-full"
            ></Image>
            <p>Click here to change your profile picture</p>
          </div>
        ) : props.defaultPhoto != undefined ? (
          <div>
            <Image
              src={props.defaultPhoto}
              alt="profile"
              width={300}
              height={300}
              className="w-40 aspect-square object-cover rounded-full"
            ></Image>
            <p>Click here to change your profile picture</p>
          </div>
        ) : (
          <button className="w-36 h-36 bg-slate-300 rounded-full">P</button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] max-h-[500px] overflow-auto">
        <DialogHeader>
          <DialogTitle>Take a selfie</DialogTitle>
        </DialogHeader>
        <div className="w-full h-full flex flex-col">
          {open && (
            <video
              ref={videoRef}
              className="aspect-square rounded-full object-cover"
              autoPlay
              playsInline
            />
          )}
          <Button onClick={capturePhoto}>Take Photo</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SelfieCamera;
