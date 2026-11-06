import { PolicyPage, policyMetadata } from "@/components/content/PolicyPage";

export const metadata = policyMetadata("privacy-policy");

export default function Page() {
  return <PolicyPage k="privacy-policy" />;
}
