"use client";

import { useEffect, useState } from "react";

let navigated = false;

/** An orange curtain that lifts on client-side navigations (never on first load). */
export function RouteVeil() {
  const [show] = useState(() => navigated);
  useEffect(() => {
    navigated = true;
  }, []);
  if (!show) return null;
  return <div aria-hidden="true" className="veil pointer-events-none fixed inset-0 z-[90] bg-om" />;
}
