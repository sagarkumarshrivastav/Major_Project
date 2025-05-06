
import { ReactNode } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { cn } from "@/lib/utils";

type LayoutProps = {
  children: ReactNode;
  className?: string;
};

const Layout = ({ children, className }: LayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className={cn("flex-grow container py-8 px-4 sm:px-6", className)}>
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
