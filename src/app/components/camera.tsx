"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Compressor from "compressorjs";
import Image from "next/image";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { IoMdCamera } from "react-icons/io";
import { RiAccountCircleLine } from "react-icons/ri";

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

  function compressImage(file: File): Promise<File> {
    return new Promise((resolve, reject) => {
      new Compressor(file, {
        quality: 0.6, // Adjust the desired image quality (0.0 - 1.0)
        // maxWidth: 700, // Adjust the maximum width of the compressed image
        // maxHeight: 700, // Adjust the maximum height of the compressed image
        success: (result) => {
          resolve(new File([result], file.name, { type: result.type }));
        },
        error: (error) => {
          reject(error);
        },
      });
    });
  }

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
            const file = new File([blob], "profilePhoto", { type: blob.type });
            await compressImage(file).then((value) => {
              props.setProfilePhoto(value);
              setProfilePhoto(value);
            });
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
          <div className="w-fit">
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
          <div className="w-fit">
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
          <div className="w-fit">
            <button className="w-36 h-36 bg-slate-300 rounded-full text-2xl font-semibold">
              <RiAccountCircleLine className="w-36 h-36 p-7 fill-slate-700" />
            </button>
            <p>Click here to change your profile picture</p>
          </div>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] max-h-[500px] overflow-auto">
        <div className="w-full h-fit flex flex-col items-center gap-3">
          <h1>Make sure your face is visible</h1>
          {open && (
            <video
              ref={videoRef}
              className="h-80 aspect-square rounded-full object-cover"
              autoPlay
              playsInline
            />
          )}
          <Button
            onClick={capturePhoto}
            size={"icon"}
            className="w-16 h-16 p-3 rounded-full"
            asChild
          >
            <IoMdCamera className="p-3 aspect-square" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SelfieCamera;
