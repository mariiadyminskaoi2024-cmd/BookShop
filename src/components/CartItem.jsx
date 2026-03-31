import React from "react";

export default function CartItem({
  item,
  increaseQuantity,
  decreaseQuantity,
  removeFromCart,
}) {
  return (
    <div className="cart-item">
      <div className="cart-item-info">
        <h4>{item.title}</h4>
        <p>Автор: {item.author}</p>
        <p>Ціна: {item.price} грн</p>
      </div>

      <div className="cart-controls">
        <button onClick={() => decreaseQuantity(item.id)}>-</button>
        <span>{item.quantity}</span>
        <button onClick={() => increaseQuantity(item.id)}>+</button>
        <button className="remove-btn" onClick={() => removeFromCart(item.id)}>
          Видалити
        </button>
      </div>
    </div>
  );
}