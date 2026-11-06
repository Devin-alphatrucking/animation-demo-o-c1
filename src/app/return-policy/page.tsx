import { PolicyPage, policyMetadata } from "@/components/content/PolicyPage";

export const metadata = policyMetadata("return-policy");

export default function Page() {
  return <PolicyPage k="return-policy" />;
}
