import { useEffect, useState } from "react";

import { getUserHistory } from "../../api/user.ts";
import OrderCard from "./orders/OrderCard.tsx";
import { type Order, type OrderStatus } from "./orders/orderTypes.ts";

export default function OrdersSection() {
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getUserHistory().then(({ data }) => {
      if (data) {
        const fetchedOrders: Order[] = data.map((item) => ({
          id: String(item.id),
          date: new Date(item.created_at).toLocaleDateString("pl-PL", {
            day: "2-digit",
            month: "long",
            year: "numeric",
          }),
          price: item.total,
          status: item.status as OrderStatus,
        }));
        setOrders(fetchedOrders);
      }
      setIsLoading(false);
    });
  }, []);

  return (
    <div className="flex w-full flex-col items-center pt-6 text-app-text md:pt-12">
      <p className="text-center text-3xl md:text-5xl">Historia zamówień</p>

      {isLoading ? (
        <div className="mt-12 text-center text-app-textMuted">
          Ładowanie historii...
        </div>
      ) : (
        <div className="my-6 flex w-full flex-col gap-0.5 overflow-hidden rounded-xl bg-app-surfaceSoft md:m-12 md:max-w-[calc(100%-6rem)]">
          {orders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              isExpanded={expandedOrder === order.id}
              onToggle={() =>
                setExpandedOrder(expandedOrder === order.id ? null : order.id)
              }
            >
              <div className="mt-4 text-app-textMuted">
                Szczegóły zamówienia
              </div>
            </OrderCard>
          ))}
          {orders.length === 0 && (
            <div className="p-8 text-center text-app-textMuted">
              Brak zamówień
            </div>
          )}
        </div>
      )}
    </div>
  );
}
