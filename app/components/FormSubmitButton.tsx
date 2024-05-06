"use client";

import { ComponentProps } from "react";
import { useFormStatus } from "react-dom";

type FormSubmitButtonProps = {
  children: React.ReactNode;
  className?: string;
} & ComponentProps<"button">;

export default function FormSubmitButton({
  children,
  className,
  ...props
}: FormSubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <button
      {...props}
      type="submit"
      disabled={pending}
      className={`btn btn-primary btn-block ${className}`}
    >
      {children}
      {pending && <span className="loading loading-spinner loading-xs" />}
    </button>
  );
}
