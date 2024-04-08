import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ManageHomes from "./manageHomes";
import ManageGuests from "./manageGuests";
import Image from "next/image";
import Link from "next/link";
export default function Hosting() {
  return (
    <>
      <div className="flex flex-row gap-3 py-3 px-7 items-center">
        <Link href={"/"}>
          <Image
            src="/logo.png"
            alt="logo"
            width={40}
            height={40}
            className="h-fit aspect-square object-cover border border-black rounded-full"
          />
        </Link>
        <p className="font-bold text-3xl">Hosting</p>
      </div>
      <Tabs defaultValue="My homes" className="flex flex-col w-full">
        <TabsList>
          <TabsTrigger value="My homes" className="w-1/2">
            My homes
          </TabsTrigger>
          <TabsTrigger value="My guests" className="w-1/2">
            Guests and reservations
          </TabsTrigger>
        </TabsList>
        <TabsContent value="My homes">
          <ManageHomes />
        </TabsContent>
        <TabsContent value="My guests">
          <ManageGuests />
        </TabsContent>
      </Tabs>
    </>
  );
}
