import { cn } from "@/lib/utils";

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export default function Container({ children, className, ...props }: ContainerProps) {
  return (
    <div className={cn("mx-auto max-w-[1920px]", className)} {...props}>
      {children}
    </div>
  );
}
