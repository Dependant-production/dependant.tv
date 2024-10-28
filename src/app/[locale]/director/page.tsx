import Director from "@/components/templates/directorPage/Director";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Director",
};

export default function DirectorPage() {
  return <Director />;
}
