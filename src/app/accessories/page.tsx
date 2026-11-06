import { GroupPage, groupMetadata } from "@/components/catalog/GroupPage";

export const metadata = groupMetadata("accessories");

export default function Page() {
  return <GroupPage groupKey="accessories" />;
}
