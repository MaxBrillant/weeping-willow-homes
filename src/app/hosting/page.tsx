import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ManageHomes from "./manageHomes";
import ManageGuests from "./manageGuests";
export default function Hosting() {
  return (
    <>
      <div className="py-3 px-10">
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
