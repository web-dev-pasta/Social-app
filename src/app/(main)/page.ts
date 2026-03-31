"use client";
import { redirect, usePathname } from "next/navigation";
export default function HomePage() {
  const pathName = usePathname();
  if (pathName === "/") redirect("/for-you");
}
