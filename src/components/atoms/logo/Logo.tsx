import React from "react";
import styles from "./Logo.module.css";
import { Link } from "@/i18n/routing";

export const Logo = () => {
  return (
    <Link href="/" className={styles.logo}>
      Logo
    </Link>
  );
};
