import { createClient } from "@supabase/supabase-js";

export default async function handler(req: any, res: any) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL || "",
        process.env.SUPABASE_SERVICE_ROLE_KEY || ""
    );

    try {
        const { items, userId } = req.body;

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

        res.status(200).json({ success: true, orderId: order.id });
    } catch (error: any) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
}
