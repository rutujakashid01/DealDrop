"use client";

import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Loader2 } from "lucide-react";
import {createClient} from "@/utils/supabase/client";

export default function PriceChart({ productId }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    if (!productId) return;

    async function loadData() {
      setLoading(true);

      const { data, error } = await supabase
        .from("price_history")
        .select("price, checked_at")
        .eq("product_id", productId)
        .order("checked_at", { ascending: true });

      if (error) {
        console.error("Supabase error:", error);
        setLoading(false);
        return;
      }

      const chartData = data.map((item, index) => ({
        date: item.checked_at
          ? new Date(item.checked_at).toLocaleDateString()
          : `Point ${index + 1}`,
        price: Number(item.price),
      }));

      setData(chartData);
      setLoading(false);
    }

    loadData();
  }, [productId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8 text-gray-500 w-full">
        <Loader2 className="w-5 h-5 animate-spin mr-2" />
        Loading chart...
      </div>
    );
  }

  if (!data.length) {
    return (
      <div className="text-center py-8 text-gray-500 w-full">
        No price history yet.
      </div>
    );
  }

  return (
    <div className="w-full h-75 mt-4">
      <h4 className="text-sm font-semibold mb-4 text-gray-700">
        Price History
      </h4>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Line
            dataKey="price"
            stroke="#FA5D19"
            strokeWidth={2}
            dot={{ r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}


