const express = require("express");
const cors = require("cors");
const admin = require("firebase-admin");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

let db = null;

try {
  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });

    db = admin.firestore();
    console.log("Firebase Admin через ENV");
  } else {
    const serviceAccount = require("./serviceAccountKey.json");

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });

    db = admin.firestore();
    console.log("Firebase Admin через файл");
  }
} catch (error) {
  console.error("Firebase error:", error.message);
}

// 🔥 1. API ПЕРШИМ
app.get("/api/orders/:userId", async (req, res) => {
  try {
    const snapshot = await db
      .collection("orders")
      .where("userId", "==", req.params.userId)
      .get();

    const orders = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// 🔥 2. STATIC ФАЙЛИ
const buildPath = path.join(__dirname, "../build");

if (fs.existsSync(buildPath)) {
  app.use(express.static(buildPath));

  // 🔥 3. ТІЛЬКИ ДЛЯ РОУТІВ REACT
  app.get("*", (req, res) => {
    res.sendFile(path.join(buildPath, "index.html"));
  });
} else {
  app.get("/", (req, res) => {
    res.send("Backend працює");
  });
}

app.listen(PORT, () => {
  console.log("Server started on port", PORT);
});