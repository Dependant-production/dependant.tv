import { redirect } from "@/i18n/routing";

export default function RootPage() {
  return redirect({ href: "/", locale: "en" });
}
