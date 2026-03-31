import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function NotFound() {
  return (
    <div>
      <h2>Not Found</h2>
      <p>Could not find requested resource</p>
      <Button asChild>
        <Link href="/for-you">Return Home</Link>
      </Button>
    </div>
  );
}
