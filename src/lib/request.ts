const ipv4SegmentRegex = /^(25[0-5]|2[0-4]\d|1?\d?\d)$/;
const ipv4Regex = /^(?:\d{1,3}\.){3}\d{1,3}$/;
const ipv6Regex = /^[0-9a-fA-F:]+$/;

function isValidIp(value: string) {
  if (!value) {
    return false;
  }

  const trimmed = value.trim();

  if (ipv4Regex.test(trimmed)) {
    return trimmed
      .split(".")
      .every((segment) => ipv4SegmentRegex.test(segment));
  }

  if (ipv6Regex.test(trimmed) && trimmed.includes(":")) {
    return true;
  }

  return false;
}

export function extractClientIp(headers: Headers) {
  const trustedHeaders = [
    "x-vercel-ip",
    "x-real-ip",
    "cf-connecting-ip",
  ];

  for (const headerName of trustedHeaders) {
    const value = headers.get(headerName);
    if (value && isValidIp(value)) {
      return value.trim();
    }
  }

  const forwardedFor = headers.get("x-forwarded-for");

  if (forwardedFor) {
    const candidate = forwardedFor.split(",")[0]?.trim();

    if (
      candidate &&
      isValidIp(candidate) &&
      process.env.NODE_ENV !== "production"
    ) {
      console.log("Candidate IP:", candidate);
      return candidate;
    }
  }

  return null;
}
