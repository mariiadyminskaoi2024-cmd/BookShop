import React, { useEffect, useState } from "react";

const CartPage = () => {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(savedCart);
  }, []);

  const updateCart = (updatedCart) => {
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const removeFromCart = (index) => {
    const updatedCart = cart.filter((_, i) => i !== index);
    updateCart(updatedCart);
  };

  const changeQuantity = (index, delta) => {
    const updatedCart = [...cart];
    updatedCart[index].quantity = (updatedCart[index].quantity || 1) + delta;

    if (updatedCart[index].quantity <= 0) {
      updatedCart.splice(index, 1);
    }

    updateCart(updatedCart);
  };

  const totalPrice = cart.reduce(
    (sum, item) => sum + Number(item.price) * Number(item.quantity || 1),
    0
  );

  const handleCheckout = async () => {
    if (cart.length === 0) {
      alert("Кошик порожній");
      return;
    }

    const userId = localStorage.getItem("userId") || "guest";

    const order = {
      userId,
      items: cart,
      totalPrice,
      customerInfo: {
        name: localStorage.getItem("userName") || "Guest",
        email: localStorage.getItem("userEmail") || "",
      },
    };

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(order),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "Помилка при оформленні замовлення");
        return;
      }

      alert("Замовлення успішно оформлено");
      localStorage.removeItem("cart");
      setCart([]);
      window.location.hash = "#/account";
    } catch (error) {
      console.error("Checkout error:", error);
      alert("Помилка сервера");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Кошик</h1>

      {cart.length === 0 ? (
        <p>Ваш кошик порожній</p>
      ) : (
        <>
          {cart.map((item, index) => (
            <div
              key={index}
              style={{
                border: "1px solid #ccc",
                padding: "10px",
                marginBottom: "10px",
                borderRadius: "8px",
              }}
            >
              <h3>{item.title}</h3>
              <p>Ціна: {item.price} грн</p>
              <p>Кількість: {item.quantity || 1}</p>

              <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                <button onClick={() => changeQuantity(index, -1)}>-</button>
                <button onClick={() => changeQuantity(index, 1)}>+</button>
                <button onClick={() => removeFromCart(index)}>Видалити</button>
              </div>
            </div>
          ))}

          <h2>Загальна сума: {totalPrice} грн</h2>
          <button onClick={handleCheckout}>Оформити замовлення</button>
        </>
      )}
    </div>
  );
};

export default CartPage;