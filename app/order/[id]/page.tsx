import { Dashboard } from "@/app/components/feature/tables";

export default async function OrderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <Dashboard initialOrderId={id} />;
}
