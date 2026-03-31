import React from "react";

export default function UserInfo({ user }) {
  return (
    <div className="account-box">
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>UID:</strong> {user.uid}</p>
    </div>
  );
}