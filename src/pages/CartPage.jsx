import React from "react";

const CartPage = ({
  cartItems,
  totalPrice,
  increaseQuantity,
  decreaseQuantity,
  removeFromCart,
  onCheckout,
}) => {
  return (
    <div style={{ padding: "20px" }}>
      <h1>Кошик</h1>

      {cartItems.length === 0 ? (
        <p>Ваш кошик порожній</p>
      ) : (
        <>
          {cartItems.map((item) => (
            <div
              key={item.id}
              style={{
                border: "1px solid #ccc",
                padding: "10px",
                marginBottom: "10px",
                borderRadius: "8px",
              }}
            >
              <h3>{item.title}</h3>
              <p>Ціна: {item.price} грн</p>
              <p>Кількість: {item.quantity}</p>

              <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                <button onClick={() => decreaseQuantity(item.id)}>-</button>
                <button onClick={() => increaseQuantity(item.id)}>+</button>
                <button onClick={() => removeFromCart(item.id)}>
                  Видалити
                </button>
              </div>
            </div>
          ))}

          <h2>Загальна сума: {totalPrice} грн</h2>
          <button onClick={onCheckout}>Оформити замовлення</button>
        </>
      )}
    </div>
  );
};

export default CartPage;