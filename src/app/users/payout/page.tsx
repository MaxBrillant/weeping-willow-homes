import BackButton from "@/app/components/backButton";
import { Button } from "@/components/ui/button";

export default function Payout() {
  return (
    <>
      <div className="flex flex-row gap-5 py-3 border-b-2">
        <BackButton />
        <p className="font-bold text-3xl">Payout</p>
      </div>
      <div>
        <Button>Add payout method</Button>
      </div>
    </>
  );
}
