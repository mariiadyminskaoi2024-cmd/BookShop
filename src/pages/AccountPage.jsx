import React from "react";
import UserInfo from "../components/UserInfo";

export default function AccountPage({ user, orders }) {
  return (
    <section id="account" className="panel">
      <h2 className="section-heading">Мій акаунт</h2>

      {user ? (
        <>
          <UserInfo user={user} />

          <h3 className="sub-heading">Історія замовлень</h3>

          {orders.length === 0 ? (
            <p className="empty-text">Замовлень поки немає.</p>
          ) : (
            <div className="orders-list">
              {orders.map((order) => (
                <div className="order-card" key={order.id}>
                  <p><strong>Дата:</strong> {order.createdAt}</p>
                  <p><strong>Сума:</strong> {order.total} грн</p>
                  <ul>
                    {order.items.map((item, index) => (
                      <li key={index}>
                        {item.title} — {item.quantity} шт.
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </>
      ) : (
        <p className="empty-text">Користувач не увійшов у систему.</p>
      )}
    </section>
  );
}