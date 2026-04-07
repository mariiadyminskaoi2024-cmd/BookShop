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

    const date = new Date(createdAt);
    if (isNaN(date.getTime())) return "Невідома дата";

    return date.toLocaleString("uk-UA");
  };

  const getTotalItems = (items) => {
    if (!Array.isArray(items)) return 0;
    return items.reduce((sum, item) => sum + Number(item.quantity || 0), 0);
  };

  return (
    <div style={{ padding: "20px", maxWidth: "900px", margin: "0 auto" }}>
      <h1>Мій акаунт</h1>
      <h2>Мої замовлення</h2>

      {loading && <p>Завантаження...</p>}

      {!loading && error && (
        <p style={{ color: "red" }}>{error}</p>
      )}

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
              backgroundColor: "#fff",
            }}
          >
            <p>
              <strong>ID замовлення:</strong> {order.id}
            </p>
            <p>
              <strong>Дата оформлення:</strong> {formatDate(order.createdAt)}
            </p>
            <p>
              <strong>Кількість товарів:</strong> {getTotalItems(order.items)}
            </p>
            <p>
              <strong>Сума:</strong> {Number(order.totalPrice || 0)} грн
            </p>

            {order.customerInfo && Object.keys(order.customerInfo).length > 0 && (
              <div style={{ marginTop: "10px" }}>
                <h4>Інформація про покупця:</h4>
                {order.customerInfo.name && (
                  <p>
                    <strong>Ім’я:</strong> {order.customerInfo.name}
                  </p>
                )}
                {order.customerInfo.phone && (
                  <p>
                    <strong>Телефон:</strong> {order.customerInfo.phone}
                  </p>
                )}
                {order.customerInfo.address && (
                  <p>
                    <strong>Адреса:</strong> {order.customerInfo.address}
                  </p>
                )}
              </div>
            )}

            <h4 style={{ marginTop: "15px" }}>Товари:</h4>

            {Array.isArray(order.items) && order.items.length > 0 ? (
              <div>
                {order.items.map((item, index) => (
                  <div
                    key={index}
                    style={{
                      padding: "8px 0",
                      borderBottom:
                        index !== order.items.length - 1
                          ? "1px solid #eee"
                          : "none",
                    }}
                  >
                    <p style={{ margin: "4px 0" }}>
                      <strong>Назва:</strong> {item.title || "Без назви"}
                    </p>
                    {item.author && (
                      <p style={{ margin: "4px 0" }}>
                        <strong>Автор:</strong> {item.author}
                      </p>
                    )}
                    <p style={{ margin: "4px 0" }}>
                      <strong>Кількість:</strong> {item.quantity || 1}
                    </p>
                    <p style={{ margin: "4px 0" }}>
                      <strong>Ціна:</strong> {item.price || 0} грн
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p>Немає товарів</p>
            )}
          </div>
        ))}
    </div>
  );
};

export default AccountPage;