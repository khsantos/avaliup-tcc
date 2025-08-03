import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// @ts-nocheck
serve(async (req) => {
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")! // IMPORTANTE: service role para permitir update
  );

  try {
    const { productId, platform, newPrice } = await req.json();

    if (!productId || !platform || !newPrice) {
      return new Response(
        JSON.stringify({ error: "Campos obrigatórios: productId, platform, newPrice" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const { data, error } = await supabase
      .from("product_prices")
      .upsert(
        {
          product_id: productId,
          platform: platform,
          price: newPrice,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "product_id,platform" } // garante que só existe um registro por loja
      );

    if (error) throw error;

    return new Response(JSON.stringify({ success: true, data }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ success: false, error: err.message }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }
});
