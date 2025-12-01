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
  | { type: "outfit_refinements"; chips: { id: string; label: string }[] }
  | { type: "capability_chips"; chips: { id: string; label: string }[] }
  | { type: "clarification_choice"; choice_id: string };

// Base URL from env without requiring Node typings in the browser.
const API_BASE =
  (typeof globalThis !== "undefined" &&
    (globalThis as { process?: { env?: { NEXT_PUBLIC_API_BASE?: string } } })?.process?.env?.NEXT_PUBLIC_API_BASE) ||
  "http://127.0.0.1:8000";

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

/**
 * Get or create a persistent user ID stored in localStorage
 */
function getUserId(): string {
  if (typeof window === 'undefined') return 'demo-user';

  const STORAGE_KEY = 'muse_user_id';
  let userId = localStorage.getItem(STORAGE_KEY);

  if (!userId) {
    // Generate a unique user ID: timestamp + random
    userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem(STORAGE_KEY, userId);
    console.log('[MUSE] Created new user ID:', userId);
  }

  return userId;
}

/**
 * Get or create a persistent thread ID for this session
 */
function getThreadId(): string {
  if (typeof window === 'undefined') return 'demo-thread';

  const STORAGE_KEY = 'muse_thread_id';
  let threadId = sessionStorage.getItem(STORAGE_KEY);

  if (!threadId) {
    threadId = `thread_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    sessionStorage.setItem(STORAGE_KEY, threadId);
  }

  return threadId;
}

export async function sendMessage(
  userText: string,
  uiEvents: UiEvent[] = []
): Promise<MuseResponse> {
  const userId = getUserId();
  const threadId = getThreadId();

  const res = await fetch(`${API_BASE}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      userId: userId,
      threadId: threadId,
      message: userText,
      ui_events: uiEvents,
    }),
  });

  if (!res.ok) {
    throw new Error(`API error: ${res.status}`);
  }

  const data = await res.json();

  return {
    text: data.stylist_response,
    final_products: data.products || [],
    outfits: data.outfits,
    weather_context: data.weather_context,
    clarification_cards: data.clarification_cards,
    ui_event: data.ui_event,
  };
}
