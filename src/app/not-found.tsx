import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="m-10 text-center">
      <h2 className="text-3xl font-semibold">Not Found</h2>
      <div className="space-y-2">
        <p className="text-xl">Could not find requested resource</p>
        <Button asChild>
          <Link href="/for-you">Return Home</Link>
        </Button>
      </div>
    </div>
  );
}
