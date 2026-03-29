"use client";
import { useInView } from "react-intersection-observer";

interface InViewWrapperProps extends React.PropsWithChildren {
  className: string;
  onReachButtom: () => void;
}

function InfiniteScrollContainer({
  children,
  className,
  onReachButtom,
}: InViewWrapperProps) {
  const { ref } = useInView({
    rootMargin: "200px",
    onChange(inView) {
      if (inView) {
        onReachButtom();
      }
    },
  });
  return (
    <div className={className}>
      {children}
      <div className="sr-only" ref={ref}>
        Load more
      </div>
    </div>
  );
}

export default InfiniteScrollContainer;
