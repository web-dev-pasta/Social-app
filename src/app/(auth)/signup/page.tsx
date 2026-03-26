import { SignupForm } from "@/components/signup-form";
import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Sign Up",
};
export default function SignupPage() {
  return <SignupForm />;
}
