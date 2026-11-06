import { GroupPage, groupMetadata } from "@/components/catalog/GroupPage";

export const metadata = groupMetadata("mobiles");

export default function Page() {
  return <GroupPage groupKey="mobiles" />;
}
