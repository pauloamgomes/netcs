import Link from "next/link";

import { Container } from "~/components/container";
import { GlobeIcon } from "~/components/icons";

export default function NotFound() {
  return (
    <Container className="flex h-full items-center">
      <div className="flex flex-col items-center">
        <GlobeIcon className="w-20 h-20 text-error animate-bounce animate-infinite animate-duration-1000 animate-delay-500 animate-ease-in" />
        <p className="mt-2 text-xl font-semibold text-error">404</p>
        <h1 className="mt-4 text-4xl text-error font-bold tracking-tight sm:text-5xl">
          Page not found
        </h1>
        <p className="mt-4 text-lg">
          Sorry, we couldn&apos;t find the page you&apos;re looking for.
        </p>
        <Link href="/" className="mt-4 btn btn-link link-accent">
          Go back home
        </Link>
      </div>
    </Container>
  );
}
