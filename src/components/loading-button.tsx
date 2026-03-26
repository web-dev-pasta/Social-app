import React from "react";
import { Spinner } from "./ui/spinner";
import { Button } from "./ui/button";

interface LoadingButtonProps {
  isSubmitting: boolean;
  title: string;
}

function LoadingButton({ isSubmitting, title }: LoadingButtonProps) {
  return (
    <Button disabled={isSubmitting} type="submit">
      {isSubmitting ? <Spinner /> : title}
    </Button>
  );
}

export default LoadingButton;
