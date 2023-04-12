import Image from "next/image";
import { memo } from "react";
import styles from "./Footer.module.css";

export const Footer = memo(() => (
  <footer className={styles.footer}>
    <a
      href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
      target="_blank"
      rel="noopener noreferrer"
    >
      Powered by{" "}
      <span className={styles.logo}>
        <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
      </span>
    </a>
    <p>created with Nextjs, Typescript and GitHub GraphQL API</p>
  </footer>
));
