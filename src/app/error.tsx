"use client"; // Error components must be Client components

import * as React from "react";

import { Container } from "~/components/container";
import { ExclamationCircleIcon } from "~/components/icons";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  React.useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <Container className="flex h-full items-center">
      <div className="flex flex-col items-center">
        <ExclamationCircleIcon className="w-20 h-20 text-error animate-bounce animate-infinite animate-duration-1000 animate-delay-500 animate-ease-in" />
        <h1 className="mt-4 text-4xl text-error font-bold tracking-tight sm:text-5xl">
          Error!
        </h1>
        <p className="mt-4 text-lg">Something went wrong!</p>
        <button
          className="btn btn-error mt-8"
          onClick={
            // Attempt to recover by trying to re-render the segment
            () => reset()
          }
        >
          Try again
        </button>
      </div>
    </Container>
  );
}
