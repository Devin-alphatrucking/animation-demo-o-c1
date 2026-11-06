import { GroupPage, groupMetadata } from "@/components/catalog/GroupPage";

export const metadata = groupMetadata("electronics");

export default function Page() {
  return <GroupPage groupKey="electronics" />;
}
