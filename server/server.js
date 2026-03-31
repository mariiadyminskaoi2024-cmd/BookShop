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

    if (!serviceAccount.private_key) {
      throw new Error("У FIREBASE_SERVICE_ACCOUNT відсутній private_key");
    }

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });

    db = admin.firestore();
    console.log("Firebase Admin підключено успішно через ENV.");
  } else {
    const serviceAccountPath = path.join(__dirname, "serviceAccountKey.json");

    if (!fs.existsSync(serviceAccountPath)) {
      console.warn("Файл serviceAccountKey.json не знайдено.");
    } else {
      const raw = fs.readFileSync(serviceAccountPath, "utf8");
      const serviceAccount = JSON.parse(raw);

      if (!serviceAccount.private_key) {
        throw new Error("У serviceAccountKey.json відсутній private_key");
      }

      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });

      db = admin.firestore();
      console.log("Firebase Admin підключено успішно через файл.");
    }
  }
} catch (error) {
  console.error("Помилка ініціалізації Firebase Admin:", error.message);
}

app.get("/api/orders/:userId", async (req, res) => {
  try {
    if (!db) {
      return res.status(503).json({
        error: "Firebase Admin не налаштований. Перевір ключ Firebase",
      });
    }

    const { userId } = req.params;

    const snapshot = await db
      .collection("orders")
      .where("userId", "==", userId)
      .get();

    const orders = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.json(orders);
  } catch (error) {
    console.error("Помилка отримання замовлень:", error);
    res.status(500).json({ error: "Помилка сервера" });
  }
});

const buildPath = path.join(__dirname, "../build");

if (fs.existsSync(buildPath)) {
  app.use(express.static(buildPath));

  app.get("*", (req, res) => {
    if (req.path.startsWith("/api")) {
      return res.status(404).json({ error: "API route not found" });
    }

    res.sendFile(path.join(buildPath, "index.html"));
  });
} else {
  app.get("/", (req, res) => {
    res.send("BookShop backend працює");
  });
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});