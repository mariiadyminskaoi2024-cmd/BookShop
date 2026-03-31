import React from "react";
import CartItem from "../components/CartItem";

export default function CartPage({
  cartItems,
  totalPrice,
  increaseQuantity,
  decreaseQuantity,
  removeFromCart,
  onCheckout,
}) {
  return (
    <section id="cart" className="panel">
      <h2 className="section-heading">Кошик</h2>

      {cartItems.length === 0 ? (
        <p className="empty-text">Кошик порожній.</p>
      ) : (
        <>
          <div className="cart-list">
            {cartItems.map((item) => (
              <CartItem
                key={item.id}
                item={item}
                increaseQuantity={increaseQuantity}
                decreaseQuantity={decreaseQuantity}
                removeFromCart={removeFromCart}
              />
            ))}
          </div>

          <div className="cart-summary">
            <h3>Загальна сума: {totalPrice} грн</h3>
            <button className="checkout-btn" onClick={onCheckout}>
              Оформити замовлення
            </button>
          </div>
        </>
      )}
    </section>
  );
}