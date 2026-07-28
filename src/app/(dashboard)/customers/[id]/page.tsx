import { Customer360Page } from "@/components/customers/customer-360-page";

export default async function CustomerPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <Customer360Page customerId={Number(id)} />;
}
