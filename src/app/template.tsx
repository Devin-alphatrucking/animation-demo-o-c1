import { RouteVeil } from "@/components/motion/RouteVeil";

/** Client navigations get an orange curtain; page content itself is never transformed. */
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <>
      <RouteVeil />
      {children}
    </>
  );
}
