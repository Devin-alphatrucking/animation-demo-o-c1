import { PolicyPage, policyMetadata } from "@/components/content/PolicyPage";

export const metadata = policyMetadata("terms-and-conditions");

export default function Page() {
  return <PolicyPage k="terms-and-conditions" />;
}
