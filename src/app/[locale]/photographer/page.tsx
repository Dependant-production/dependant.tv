import Photographer from "@/components/templates/photographerPage/Photographer";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Photographer",
};

export default function PhotograperPage() {

  return  <Photographer />;
}
