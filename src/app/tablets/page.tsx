import { GroupPage, groupMetadata } from "@/components/catalog/GroupPage";

export const metadata = groupMetadata("tablets");

export default function Page() {
  return <GroupPage groupKey="tablets" />;
}
