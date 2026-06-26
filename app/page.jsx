"use client";

import { useEffect } from "react";

export default function Page() {
  useEffect(() => {
    document.documentElement.style.margin = "0";
    document.documentElement.style.padding = "0";
    document.body.style.margin = "0";
    document.body.style.padding = "0";
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <iframe
      src="/michelle-gatherings-standalone.html"
      title="Michelle's Gatherings"
      style={{ position: "fixed", inset: 0, width: "100vw", height: "100vh", border: 0 }}
    />
  );
}
