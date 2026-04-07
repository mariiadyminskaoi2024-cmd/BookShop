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
    <div
      style={{
        padding: "20px 0 40px",
        color: "#f7efe8",
      }}
    >
      <h1
        style={{
          fontSize: "52px",
          marginBottom: "20px",
          fontWeight: "700",
        }}
      >
        Мій акаунт
      </h1>

      <h2
        style={{
          fontSize: "34px",
          marginBottom: "24px",
          fontWeight: "700",
        }}
      >
        Мої замовлення
      </h2>

      {loading && <p style={{ fontSize: "20px" }}>Завантаження...</p>}

      {!loading && error && (
        <p style={{ color: "#ffb3b3", fontSize: "18px" }}>{error}</p>
      )}

      {!loading && !error && orders.length === 0 && (
        <div
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "20px",
            padding: "30px",
            fontSize: "22px",
            color: "#f7efe8",
          }}
        >
          Замовлень ще немає
        </div>
      )}

      {!loading &&
        !error &&
        orders.length > 0 &&
        orders.map((order) => (
          <div
            key={order.id}
            style={{
              border: "1px solid rgba(255,255,255,0.18)",
              borderRadius: "20px",
              padding: "24px",
              marginBottom: "20px",
              background:
                "linear-gradient(135deg, rgba(255,255,255,0.03), rgba(216,154,91,0.07))",
              boxShadow: "0 8px 24px rgba(0,0,0,0.25)",
              color: "#f7efe8",
            }}
          >
            <p style={{ margin: "8px 0", fontSize: "18px" }}>
              <strong style={{ color: "#d89a5b" }}>ID замовлення:</strong>{" "}
              {order.id}
            </p>

            <p style={{ margin: "8px 0", fontSize: "18px" }}>
              <strong style={{ color: "#d89a5b" }}>Дата оформлення:</strong>{" "}
              {formatDate(order.createdAt)}
            </p>

            <p style={{ margin: "8px 0", fontSize: "18px" }}>
              <strong style={{ color: "#d89a5b" }}>Кількість товарів:</strong>{" "}
              {getTotalItems(order.items)}
            </p>

            <p style={{ margin: "8px 0", fontSize: "18px" }}>
              <strong style={{ color: "#d89a5b" }}>Сума:</strong>{" "}
              {Number(order.totalPrice || 0)} грн
            </p>

            {order.customerInfo && Object.keys(order.customerInfo).length > 0 && (
              <div style={{ marginTop: "18px" }}>
                <h4
                  style={{
                    marginBottom: "10px",
                    fontSize: "22px",
                    color: "#fff7f0",
                  }}
                >
                  Інформація про покупця:
                </h4>

                {order.customerInfo.name && (
                  <p style={{ margin: "6px 0", fontSize: "17px" }}>
                    <strong style={{ color: "#d89a5b" }}>Ім’я:</strong>{" "}
                    {order.customerInfo.name}
                  </p>
                )}

                {order.customerInfo.phone && (
                  <p style={{ margin: "6px 0", fontSize: "17px" }}>
                    <strong style={{ color: "#d89a5b" }}>Телефон:</strong>{" "}
                    {order.customerInfo.phone}
                  </p>
                )}

                {order.customerInfo.address && (
                  <p style={{ margin: "6px 0", fontSize: "17px" }}>
                    <strong style={{ color: "#d89a5b" }}>Адреса:</strong>{" "}
                    {order.customerInfo.address}
                  </p>
                )}
              </div>
            )}

            <h4
              style={{
                marginTop: "20px",
                marginBottom: "12px",
                fontSize: "22px",
                color: "#fff7f0",
              }}
            >
              Товари:
            </h4>

            {Array.isArray(order.items) && order.items.length > 0 ? (
              <div>
                {order.items.map((item, index) => (
                  <div
                    key={index}
                    style={{
                      padding: "12px 0",
                      borderBottom:
                        index !== order.items.length - 1
                          ? "1px solid rgba(255,255,255,0.08)"
                          : "none",
                    }}
                  >
                    <p style={{ margin: "6px 0", fontSize: "17px" }}>
                      <strong style={{ color: "#d89a5b" }}>Назва:</strong>{" "}
                      {item.title || "Без назви"}
                    </p>

                    {item.author && (
                      <p style={{ margin: "6px 0", fontSize: "17px" }}>
                        <strong style={{ color: "#d89a5b" }}>Автор:</strong>{" "}
                        {item.author}
                      </p>
                    )}

                    <p style={{ margin: "6px 0", fontSize: "17px" }}>
                      <strong style={{ color: "#d89a5b" }}>Кількість:</strong>{" "}
                      {item.quantity || 1}
                    </p>

                    <p style={{ margin: "6px 0", fontSize: "17px" }}>
                      <strong style={{ color: "#d89a5b" }}>Ціна:</strong>{" "}
                      {item.price || 0} грн
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ fontSize: "17px" }}>Немає товарів</p>
            )}
          </div>
        ))}
    </div>
  );
};

export default AccountPage;