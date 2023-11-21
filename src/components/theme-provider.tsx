import { cookies } from "next/headers";

import { themes } from "~/lib/themes";

import { ThemeSwitcher } from "./theme-switcher";

export default async function ThemeProvider() {
  const themeCookie = cookies().get("theme");
  const currentTheme = themeCookie ? themeCookie.value : themes[0];
  return <ThemeSwitcher theme={currentTheme} list={themes} />;
}
