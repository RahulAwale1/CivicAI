import * as React from "react";

type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export default function Input({ className = "", ...props }: InputProps) {
  return (
    <input
      {...props}
      className={`w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:border-blue-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-500 ${className}`}
    />
  );
}