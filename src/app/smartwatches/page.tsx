import { GroupPage, groupMetadata } from "@/components/catalog/GroupPage";

export const metadata = groupMetadata("smartwatches");

export default function Page() {
  return <GroupPage groupKey="smartwatches" />;
}
