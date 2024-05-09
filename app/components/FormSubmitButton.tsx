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
      {...props} // Put it first so the next few lines can override it
      type="submit"
      disabled={pending}
      className={`btn btn-primary btn-block ${className}`}
    >
      {children}
      {pending && <span className="loading loading-spinner loading-xs" />}
    </button>
  );
}
