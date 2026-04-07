const express = require("express");
const cors = require("cors");
const admin = require("firebase-admin");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

let db;

try {
  if (!admin.apps.length) {
    if (
      process.env.FIREBASE_PROJECT_ID &&
      process.env.FIREBASE_CLIENT_EMAIL &&
      process.env.FIREBASE_PRIVATE_KEY
    ) {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
        }),
      });

      console.log("Firebase Admin initialized через ENV");
    } else {
      const serviceAccount = require("./serviceAccountKey.json");

      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });

      console.log("Firebase Admin initialized через файл");
    }
  }

  db = admin.firestore();
} catch (error) {
  console.error("Firebase initialization error:", error);
  db = null;
}

// GET: отримати всі замовлення користувача
app.get("/api/orders/:userId", async (req, res) => {
  try {
    if (!db) {
      return res.status(500).json({ error: "Database not initialized" });
    }

    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ error: "userId is required" });
    }

    const snapshot = await db
      .collection("orders")
      .where("userId", "==", userId)
      .get();

    const orders = snapshot.docs.map((doc) => {
      const data = doc.data();

      return {
        id: doc.id,
        ...data,
        createdAt:
          data.createdAt && typeof data.createdAt.toDate === "function"
            ? data.createdAt.toDate().toISOString()
            : data.createdAt || null,
      };
    });

    // Сортування від найновіших до найстаріших
    orders.sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return dateB - dateA;
    });

    res.status(200).json(orders);
  } catch (error) {
    console.error("GET /api/orders/:userId error:", error);
    res.status(500).json({ error: error.message || "Server error" });
  }
});

// POST: зберегти нове замовлення
app.post("/api/orders", async (req, res) => {
  try {
    if (!db) {
      return res.status(500).json({ error: "Database not initialized" });
    }

    const { userId, items, totalPrice, customerInfo } = req.body;

    if (!userId) {
      return res.status(400).json({ error: "userId is required" });
    }

    // Перевірка, щоб не зберігати порожній кошик
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "Cart is empty" });
    }

    const cleanItems = items.map((item) => ({
      id: item.id || "",
      title: item.title || "",
      author: item.author || "",
      price: Number(item.price || 0),
      quantity: Number(item.quantity || 1),
    }));

    const calculatedTotalPrice = cleanItems.reduce((sum, item) => {
      return sum + item.price * item.quantity;
    }, 0);

    const newOrder = {
      userId,
      items: cleanItems,
      totalPrice:
        totalPrice !== undefined ? Number(totalPrice) : calculatedTotalPrice,
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
    res.status(500).json({ error: error.message || "Server error" });
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