import React, { useEffect, useState } from "react";

const AccountPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      const userId = localStorage.getItem("userId") || "guest";

      try {
        const response = await fetch(`/api/orders/${userId}`);
        const data = await response.json();

        if (response.ok) {
          setOrders(data);
        } else {
          console.error(data.error || "Не вдалося отримати замовлення");
        }
      } catch (error) {
        console.error("Fetch orders error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const formatDate = (createdAt) => {
    if (!createdAt) return "Невідома дата";

    if (createdAt.seconds) {
      return new Date(createdAt.seconds * 1000).toLocaleString();
    }

    return new Date(createdAt).toLocaleString();
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Мій акаунт</h1>
      <h2>Мої замовлення</h2>

      {loading ? (
        <p>Завантаження...</p>
      ) : orders.length === 0 ? (
        <p>Замовлень ще немає</p>
      ) : (
        orders.map((order) => (
          <div
            key={order.id}
            style={{
              border: "1px solid #ccc",
              padding: "15px",
              marginBottom: "15px",
              borderRadius: "8px",
            }}
          >
            <p>
              <strong>ID замовлення:</strong> {order.id}
            </p>
            <p>
              <strong>Дата:</strong> {formatDate(order.createdAt)}
            </p>
            <p>
              <strong>Сума:</strong> {order.totalPrice} грн
            </p>

            <h4>Товари:</h4>
            {order.items && order.items.length > 0 ? (
              order.items.map((item, index) => (
                <div key={index} style={{ marginBottom: "8px" }}>
                  {item.title} — {item.quantity || 1} шт. — {item.price} грн
                </div>
              ))
            ) : (
              <p>Немає товарів</p>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default AccountPage;