"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useEffect, useRef } from "react";

export default function UnauthorizedPage() {
  const link = useRef<null | HTMLAnchorElement>(null);
  useEffect(() => {
    const interval = setTimeout(() => {
      link.current?.click();
    }, 3000);
    return () => {
      clearTimeout(interval);
    };
  }, []);
  return (
    <main>
      <h1>401 - Unauthorized</h1>
      <p>Please log in to access this page.</p>
      <Button asChild>
        <Link ref={link} href={`/login`}>
          Go to login page
        </Link>
      </Button>
    </main>
  );
}
