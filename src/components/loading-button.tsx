import React from "react";
import { Spinner } from "./ui/spinner";
import { Button } from "./ui/button";

interface LoadingButtonProps extends React.ComponentProps<typeof Button> {
  isSubmitting?: boolean;
  title: string;
}

function LoadingButton({ isSubmitting, title, ...props }: LoadingButtonProps) {
  return (
    <Button {...props} disabled={props.disabled ?? isSubmitting}>
      {isSubmitting ? <Spinner /> : title}
    </Button>
  );
}

export default LoadingButton;
