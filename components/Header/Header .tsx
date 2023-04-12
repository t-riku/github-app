import Link from "next/link";
import { memo } from "react";
import { DiGithubFull } from "react-icons/di";
import styles from "./Header.module.css";

let render = 0;

export const Header = memo(() => {
  console.log(`render${render}`);
  render++;
  return (
    <header className={styles.header}>
      <h1 className={styles.title}>Github Repository Viewer!</h1>
      <Link
        href="https://github.com/t-riku/github-app"
        target="_blank"
        rel="noopener noreferrer"
      >
        <div className={styles.animateGithub}>
          <DiGithubFull className={styles.textGithub} />
          <div className={styles.circle01}></div>
          <div className={styles.circle02}></div>
          <div className={styles.circle03}></div>
        </div>
      </Link>
    </header>
  );
});
