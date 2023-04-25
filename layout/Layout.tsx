import { FC, ReactElement } from "react";
import { Footer } from "../components/Footer/Footer";
import { Header } from "../components/Header/Header ";
import layoutStyles from "./Layout.module.css";

type LayoutProps = Required<{
  readonly children: ReactElement;
}>;

export const Layout:FC<LayoutProps> = ({ children }) => (
  <div className={layoutStyles.container}>
    <Header />
    {children}
    <Footer />
  </div>
);
