import { Customer360Dashboard } from "@/components/customers/customer-360-dashboard";

export default async function CustomerPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <Customer360Dashboard customerId={Number(id)} />;
}
