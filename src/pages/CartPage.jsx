import React from "react";

const CartPage = ({
  cartItems = [],
  totalPrice = 0,
  increaseQuantity,
  decreaseQuantity,
  removeFromCart,
  onCheckout,
}) => {
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
          marginBottom: "30px",
          fontWeight: "700",
        }}
      >
        Кошик
      </h1>

      {cartItems.length === 0 ? (
        <div
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "20px",
            padding: "30px",
            fontSize: "24px",
          }}
        >
          Ваш кошик порожній
        </div>
      ) : (
        <>
          <div style={{ display: "grid", gap: "20px" }}>
            {cartItems.map((item) => (
              <div
                key={item.id}
                style={{
                  border: "1px solid rgba(255,255,255,0.18)",
                  borderRadius: "20px",
                  padding: "24px",
                  background:
                    "linear-gradient(135deg, rgba(255,255,255,0.03), rgba(255,160,80,0.05))",
                  boxShadow: "0 8px 24px rgba(0,0,0,0.25)",
                }}
              >
                <h3
                  style={{
                    fontSize: "24px",
                    marginBottom: "16px",
                    fontWeight: "700",
                    color: "#fff7f0",
                  }}
                >
                  {item.title}
                </h3>

                <p style={{ fontSize: "20px", margin: "8px 0" }}>
                  <strong>Автор:</strong> {item.author}
                </p>

                <p style={{ fontSize: "20px", margin: "8px 0" }}>
                  <strong>Ціна:</strong> {item.price} грн
                </p>

                <p style={{ fontSize: "20px", margin: "8px 0 18px" }}>
                  <strong>Кількість:</strong> {item.quantity}
                </p>

                <div
                  style={{
                    display: "flex",
                    gap: "12px",
                    flexWrap: "wrap",
                  }}
                >
                  <button
                    onClick={() => decreaseQuantity(item.id)}
                    style={smallButtonStyle}
                  >
                    −
                  </button>

                  <button
                    onClick={() => increaseQuantity(item.id)}
                    style={smallButtonStyle}
                  >
                    +
                  </button>

                  <button
                    onClick={() => removeFromCart(item.id)}
                    style={dangerButtonStyle}
                  >
                    Видалити
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div
            style={{
              marginTop: "30px",
              padding: "24px",
              borderRadius: "20px",
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            <h2
              style={{
                fontSize: "34px",
                marginBottom: "20px",
                fontWeight: "700",
              }}
            >
              Загальна сума: {totalPrice} грн
            </h2>

            <button onClick={onCheckout} style={mainButtonStyle}>
              Оформити замовлення
            </button>
          </div>
        </>
      )}
    </div>
  );
};

const mainButtonStyle = {
  background: "#d89a5b",
  color: "#1c1008",
  border: "none",
  borderRadius: "14px",
  padding: "14px 24px",
  fontSize: "22px",
  fontWeight: "700",
  cursor: "pointer",
  boxShadow: "0 8px 18px rgba(216,154,91,0.25)",
};

const smallButtonStyle = {
  background: "#d89a5b",
  color: "#1c1008",
  border: "none",
  borderRadius: "10px",
  width: "44px",
  height: "44px",
  fontSize: "24px",
  fontWeight: "700",
  cursor: "pointer",
};

const dangerButtonStyle = {
  background: "#3a2923",
  color: "#fff3ea",
  border: "1px solid rgba(255,255,255,0.12)",
  borderRadius: "10px",
  padding: "0 18px",
  height: "44px",
  fontSize: "18px",
  fontWeight: "600",
  cursor: "pointer",
};

export default CartPage;