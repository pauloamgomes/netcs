import { cookies, draftMode } from "next/headers";
import { redirect } from "next/navigation";

const { CONTENTFUL_PREVIEW_SECRET } = process.env;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  if (searchParams.get("previewSecret") !== CONTENTFUL_PREVIEW_SECRET) {
    return new Response("Invalid token", { status: 401 });
  }

  draftMode().enable();

  // Override cookie header for draft mode for usage in live-preview
  // https://github.com/vercel/next.js/issues/49927
  const cookieStore = cookies();
  const cookie = cookieStore.get("__prerender_bypass")!;
  cookies().set({
    name: "__prerender_bypass",
    value: cookie?.value,
    httpOnly: true,
    path: "/",
    secure: true,
    sameSite: "none",
  });

  redirect(searchParams.get("redirect") || "/");
}
