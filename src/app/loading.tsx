import Image from "next/image";

export default function Loading() {
  return (
    <div className="flex m-[15%] items-center justify-center">
      <Image
        src="/logo.png"
        alt="logo"
        width={100}
        height={100}
        className="h-fit z-10 aspect-square object-cover bg-white border border-black rounded-full"
      />

      <div className="fixed w-[100px] h-[100px] bg-slate-400 m-[15%] items-center justify-center rounded-full animate-ping"></div>
    </div>
  );
}
