export type Product = {
  id: string;
  title: string;
  brand?: string | null;
  price?: { value: number | null; currency: string | null };
  image_url: string;
  url?: string | null;
  tags?: string[];
  validator_tag?: string;
  validator_reason?: string;
  validator_score?: number;
};

export type Outfit = {
  id: string;
  name: string;
  items: string[];
  description: string;
};

export type ClarificationOption = {
  id: string;
  label: string;
  short_description?: string;
  image_hint?: string;
};

export type ClarificationCardsPayload = {
  question: string;
  options: ClarificationOption[];
};

export type UiEvent =
  | {
    type: "disambiguation";
    question: string;
    options: { id: string; label: string; preview_url?: string }[];
  }
  | { type: "refinements"; chips: { id: string; label: string }[] }
  | { type: "outfit_refinements"; chips: { id: string; label: string }[] };

// ✅ NEW: read base URL from env
const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE || "http://127.0.0.1:8000";

export type MuseResponse = {
  text: string;
  final_products: Product[];
  outfits?: Outfit[];
  weather_context?: {
    temperature?: string;
    humidity?: string;
    uv_index?: string;
    conditions?: string;
    summary?: string;
  };
  clarification_cards?: ClarificationCardsPayload;
  ui_event?: UiEvent;
};

export async function sendMessage(
  userText: string,
  uiEvents: UiEvent[] = []
): Promise<MuseResponse> {
  // ✅ IMPORTANT: use API_BASE here instead of "/api/chat"
  const res = await fetch(`${API_BASE}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      // ⚠️ If backend expects snake_case, change these to user_id/thread_id
      userId: "demo-user",
      threadId: "demo-thread",
      message: userText,
      ui_events: uiEvents,
    }),
  });

  if (!res.ok) {
    throw new Error(`API error: ${res.status}`);
  }

  const data = await res.json();

  return {
    text: data.reply_text,
    final_products: data.products || [],
    outfits: data.outfits,
    weather_context: data.weather_context,
    clarification_cards: data.clarification_cards,
    ui_event: data.refinement_chips
      ? { type: "refinements", chips: data.refinement_chips }
      : undefined,
  };
}
