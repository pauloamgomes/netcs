import { Maybe } from "~generated/graphql";

export function formatDate(dateString: string) {
  return new Date(`${dateString}`).toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

export async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function validateEmail(email?: string): boolean {
  if (!email) {
    return false;
  }

  const emailRegex: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function getImageMaskClass(imageMask?: Maybe<string>) {
  if (!imageMask) return "";

  switch (imageMask) {
    case "decagon":
      return "mask mask-decagon";
    case "squircle":
      return "mask mask-squircle";
    case "heart":
      return "mask mask-heart";
    case "hexagon":
      return "mask mask-hexagon";
    case "hexagon-2":
      return "mask mask-hexagon-2";
    case "pentagon":
      return "mask mask-pentagon";
    case "diamond":
      return "mask mask-diamond";
    case "circle":
      return "mask mask-circle";
    case "parallelogram":
      return "mask mask-parallelogram";
    case "parallelogram-2":
      return "mask mask-parallelogram-2";
    case "star":
      return "mask mask-star";
    case "star-2":
      return "mask mask-star-2";
    case "triangle":
      return "mask mask-triangle";
  }

  return "";
}

export function getCookie(cookieName: string): string | null {
  const name = cookieName + "=";
  const decodedCookie = decodeURIComponent(document.cookie);
  const cookieArray = decodedCookie.split(";");

  for (let i = 0; i < cookieArray.length; i++) {
    let cookie = cookieArray[i];
    while (cookie.charAt(0) === " ") {
      cookie = cookie.substring(1);
    }
    if (cookie.indexOf(name) === 0) {
      return cookie.substring(name.length, cookie.length);
    }
  }
  return null;
}

export function updateQueryParams(
  newParams: { [key: string]: string },
  remove = false
) {
  const currentSearchParams = new URLSearchParams(window.location.search);

  for (const [key, value] of Object.entries(newParams)) {
    if (`${value}`?.length) {
      const parsedValue = Array.isArray(value) ? value.join(",") : `${value}`;
      currentSearchParams.set(key, parsedValue);
    } else if (remove) {
      currentSearchParams.delete(key);
    }
  }

  return currentSearchParams.toString();
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-zA-Z0-9 -]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}
