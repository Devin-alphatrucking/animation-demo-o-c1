import { GroupPage, groupMetadata } from "@/components/catalog/GroupPage";

export const metadata = groupMetadata("laptops");

export default function Page() {
  return <GroupPage groupKey="laptops" />;
}
