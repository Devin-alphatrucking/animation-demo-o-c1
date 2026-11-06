import { PolicyPage, policyMetadata } from "@/components/content/PolicyPage";

export const metadata = policyMetadata("shipping-policy");

export default function Page() {
  return <PolicyPage k="shipping-policy" />;
}
