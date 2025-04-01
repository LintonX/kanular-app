import React from "react";
import Footer from "./Footer";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <section className="flex-grow">{children}</section>
      <footer className="end-0">
        <Footer />
      </footer>
    </div>
  );
}
