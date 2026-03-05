import express from "express";
import { createServer as createViteServer } from "vite";
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

// Initialize Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.SUPABASE_SERVICE_ROLE_KEY || ""
);

// Regular JSON middleware
app.use(express.json());

// API: Create Order for WhatsApp flow
app.post("/api/orders", async (req, res) => {
  try {
    const { items, userId } = req.body;

    // 1. Create Order in Supabase
    const totalPrice = items.reduce(
      (acc: number, item: any) => acc + item.price * item.quantity,
      0
    );

    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        user_id: userId,
        total_price: totalPrice,
        status: "pending",
      })
      .select()
      .single();

    if (orderError) throw orderError;

    // 2. Create Order Items
    const orderItems = items.map((item: any) => ({
      order_id: order.id,
      product_id: item.id,
      quantity: item.quantity,
      price: item.price,
    }));

    const { error: itemsError } = await supabase
      .from("order_items")
      .insert(orderItems);

    if (itemsError) throw itemsError;

    res.json({ success: true, orderId: order.id });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// Vite middleware for development
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static("dist"));
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
