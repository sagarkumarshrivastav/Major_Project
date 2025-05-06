
import { ReactNode } from "react";
import Navbar from "./Navbar";
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
      <footer className="bg-slate-100 dark:bg-gray-900 py-6 border-t">
        <div className="container text-center text-sm text-slate-600 dark:text-slate-400">
          <p>© 2025 Campus Finds & Claims. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
