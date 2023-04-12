import { ReactElement } from "react";
import { Header } from "../components/Header/Header ";
import { Footer } from "../components/Footer/Footer";
import layoutStyles from "./Layout.module.css";

type LayoutProps = Required<{
  readonly children: ReactElement;
}>;

export const Layout = ({ children }: LayoutProps) => (
  <div className={layoutStyles.container}>
    <Header />
    {children}
    <Footer />
  </div>
);
