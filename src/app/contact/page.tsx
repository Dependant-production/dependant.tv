import { Button } from "@/components/atoms/button/Button";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Contact",
  };


export default function ContactPage() {
    return (
        <>
        <h1>Hello, Contact Page!</h1>
        <Button />
        </>
    )
  }