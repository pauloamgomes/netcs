"use client";

import clsx from "clsx";
import { useState } from "react";
import { useFormStatus } from "react-dom";

import { BlocksNewsletterSignup, Maybe } from "~generated/graphql";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      className={clsx("mt-4 btn btn-neutral", pending && "btn-disabled")}
      disabled={pending}
    >
      {pending ? (
        <>
          <span className="loading loading-spinner"></span>
          Processing
        </>
      ) : (
        "Subscribe"
      )}
    </button>
  );
}

function StatusMessage({
  status,
  thankYouMessage,
  errorMessage,
}: {
  status: string;
  thankYouMessage: Maybe<string>;
  errorMessage: Maybe<string>;
}) {
  const { pending } = useFormStatus();

  if (status === "idle" || pending) {
    return null;
  }

  return (
    <div
      className={clsx(
        "alert",
        status === "success" ? "alert-success" : "alert-error"
      )}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="stroke-current shrink-0 h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>

      {status === "success" ? (
        <span className="whitespace-pre-wrap">{thankYouMessage}</span>
      ) : (
        <span className="whitespace-pre-wrap">{errorMessage}</span>
      )}
    </div>
  );
}

export function FormNewsletterSignup({
  block,
}: {
  block: BlocksNewsletterSignup;
}) {
  const { thankYouMessage = "Thank you", errorMessage = "Error" } = block;

  const [status, setStatus] = useState("idle");

  const actionSubmit = async (formData: FormData) => {
    const email = formData.get("email")?.toString();
    const res = await fetch("/api/newsletter", {
      method: "POST",
      body: JSON.stringify({ email }),
    }).then((res) => res.json());

    setStatus(res.status || "error");
  };

  return (
    <form action={actionSubmit}>
      <div className="bg-base-200 p-6 rounded-md">
        <StatusMessage
          status={status}
          thankYouMessage={thankYouMessage}
          errorMessage={errorMessage}
        />

        {status !== "success" ? (
          <div className="form-control w-full flex">
            <label className="label">
              <span className="label-text">What is your email address?</span>
            </label>

            <input
              name="email"
              type="email"
              placeholder="Email address"
              required
              className="input input-bordered w-full"
            />

            <SubmitButton />
          </div>
        ) : null}
      </div>
    </form>
  );
}
