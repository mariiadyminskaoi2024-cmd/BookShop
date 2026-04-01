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

app.get("/api/orders/:userId", async (req, res) => {
  try {
    if (!db) {
      return res.status(500).json({ error: "Database not initialized" });
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

    orders.sort((a, b) => {
      const dateA = a.createdAt?.seconds
        ? a.createdAt.seconds * 1000
        : new Date(a.createdAt || 0).getTime();

      const dateB = b.createdAt?.seconds
        ? b.createdAt.seconds * 1000
        : new Date(b.createdAt || 0).getTime();

      return dateB - dateA;
    });

    res.json(orders);
  } catch (error) {
    console.error("GET /api/orders/:userId error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

app.post("/api/orders", async (req, res) => {
  try {
    if (!db) {
      return res.status(500).json({ error: "Database not initialized" });
    }

    const { userId, items, totalPrice, customerInfo } = req.body;

    if (!userId) {
      return res.status(400).json({ error: "userId is required" });
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "Cart is empty" });
    }

    const newOrder = {
      userId,
      items,
      totalPrice: totalPrice || 0,
      customerInfo: customerInfo || {},
      createdAt: new Date().toISOString(),
    };

    const docRef = await db.collection("orders").add(newOrder);

    res.status(201).json({
      message: "Order saved successfully",
      order: {
        id: docRef.id,
        ...newOrder,
      },
    });
  } catch (error) {
    console.error("POST /api/orders error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

const buildPath = path.join(__dirname, "../build");

if (fs.existsSync(buildPath)) {
  app.use(express.static(buildPath));

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