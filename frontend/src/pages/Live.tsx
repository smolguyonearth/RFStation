// components/ButtonStatus.js
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function Live() {
  const [isPressed, setIsPressed] = useState(false);

  useEffect(() => {
    supabase
      .from("button_status")
      .select("is_pressed")
      .eq("id", 1)
      .single()
      .then(({ data }) => setIsPressed(data?.is_pressed ?? false));

    // 2. ฟังการเปลี่ยนแปลง (Realtime)
    const channel = supabase
      .channel("schema-db-changes")
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "button_status" },
        (payload) => setIsPressed(payload.new.is_pressed),
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <div style={{ padding: "50px", textAlign: "center" }}>
      <h1>Status: {isPressed ? "🔴 Pressed" : "⚪ Released"}</h1>
    </div>
  );
}
