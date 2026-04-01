import React, { useEffect, useState } from "react";

const AccountPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const userId = localStorage.getItem("userId") || "guest";
        const response = await fetch(`/api/orders/${userId}`);

        if (!response.ok) {
          throw new Error("Не вдалося отримати замовлення");
        }

        const data = await response.json();

        if (Array.isArray(data)) {
          setOrders(data);
        } else {
          setOrders([]);
        }
      } catch (err) {
        console.error("Помилка завантаження замовлень:", err);
        setError("Не вдалося завантажити замовлення");
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

    const date = new Date(createdAt);
    if (isNaN(date.getTime())) return "Невідома дата";

    return date.toLocaleString();
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Мій акаунт</h1>
      <h2>Мої замовлення</h2>

      {loading && <p>Завантаження...</p>}

      {!loading && error && <p>{error}</p>}

      {!loading && !error && orders.length === 0 && (
        <p>Замовлень ще немає</p>
      )}

      {!loading &&
        !error &&
        orders.length > 0 &&
        orders.map((order) => (
          <div
            key={order.id}
            style={{
              border: "1px solid #ccc",
              borderRadius: "8px",
              padding: "15px",
              marginBottom: "15px",
            }}
          >
            <p>
              <strong>ID замовлення:</strong> {order.id}
            </p>
            <p>
              <strong>Дата:</strong> {formatDate(order.createdAt)}
            </p>
            <p>
              <strong>Сума:</strong> {order.totalPrice || 0} грн
            </p>

            <h4>Товари:</h4>

            {Array.isArray(order.items) && order.items.length > 0 ? (
              order.items.map((item, index) => (
                <div key={index} style={{ marginBottom: "8px" }}>
                  {item.title || "Без назви"} — {item.quantity || 1} шт. —{" "}
                  {item.price || 0} грн
                </div>
              ))
            ) : (
              <p>Немає товарів</p>
            )}
          </div>
        ))}
    </div>
  );
};

export default AccountPage;