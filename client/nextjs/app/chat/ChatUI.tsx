"use client";

import { useState, useRef, useEffect } from "react";
import { sendMessage, type MuseResponse, type Product, type UiEvent } from "../api";
import ProductCard from "../components/ProductCard";
import ClarificationCards from "../components/ClarificationCards";
import DisambiguationCard from "../components/DisambiguationCard";

type Message = {
  role: "user" | "assistant";
  text: string;
  products?: Product[];
};

export default function ChatUI() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [clarificationCards, setClarificationCards] = useState<any>(null);
  const [uiEvent, setUiEvent] = useState<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleSend = async (text: string = input, uiEvents: UiEvent[] = []) => {
    if (!text.trim() && uiEvents.length === 0) return;

    if (text.trim()) {
      setMessages((prev) => [...prev, { role: "user", text }]);
      setInput("");
    }

    setLoading(true);
    setClarificationCards(null);
    setUiEvent(null);

    try {
      const response: MuseResponse = await sendMessage(text, uiEvents);

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: response.text,
          products: response.final_products,
        },
      ]);

      if (response.clarification_cards) {
        setClarificationCards(response.clarification_cards);
      }
      if (response.ui_event) {
        setUiEvent(response.ui_event);
      }
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: `Error: ${error}` },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleDisambiguation = (chosenId: string) => {
    handleSend("", [{ type: "clarification_choice", choice_id: chosenId }]);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-[1400px] h-[95vh] flex flex-col gap-4">

        {/* Header */}
        <div className="text-center fade-in-up py-2">
          <h1 className="font-display text-5xl font-semibold mb-1 bg-gradient-to-r from-pink-400 via-rose-400 to-blue-400 bg-clip-text text-transparent">
            Muse
          </h1>
          <p className="text-xs font-light tracking-[0.3em] text-gray-400 uppercase">
            Your Personal Fashion Stylist
          </p>
        </div>

        {/* Chat Container */}
        <div className="flex-1 bg-white/80 backdrop-blur-2xl rounded-[2rem] shadow-2xl border border-white/50 overflow-hidden flex flex-col relative">

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-6 sm:p-10 space-y-8 scroll-smooth">

            {/* Empty State */}
            {messages.length === 0 && (
              <div className="h-full flex items-center justify-center">
                <div className="text-center fade-in-up max-w-lg">
                  <div className="text-8xl mb-8 animate-pulse">✨</div>
                  <h2 className="font-display text-4xl font-medium text-gray-800 mb-6">
                    Welcome to Muse
                  </h2>
                  <p className="text-gray-500 font-light leading-relaxed text-xl">
                    Your AI fashion companion. Tell me what you're looking for, or just say hello!
                  </p>
                </div>
              </div>
            )}

            {/* Messages */}
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} fade-in-up`}
              >
                <div
                  className={`max-w-[70%] rounded-3xl px-8 py-6 shadow-sm ${msg.role === "user"
                    ? "bg-gradient-to-br from-gray-900 to-gray-800 text-white rounded-br-sm"
                    : "bg-white text-gray-800 border border-gray-100 rounded-bl-sm shadow-md"
                    }`}
                >
                  <p className="whitespace-pre-line font-light text-lg leading-relaxed">{msg.text}</p>

                  {/* Products Grid */}
                  {msg.products && msg.products.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
                      {msg.products.map((p) => (
                        <ProductCard key={p.id} product={p} />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Loading Indicator */}
            {loading && (
              <div className="flex justify-start fade-in-up">
                <div className="bg-white border border-gray-100 rounded-3xl rounded-bl-sm px-6 py-4 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="flex gap-1.5">
                      <span className="w-2.5 h-2.5 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                      <span className="w-2.5 h-2.5 bg-rose-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                      <span className="w-2.5 h-2.5 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                    </div>
                    <span className="text-sm font-light text-gray-500">Curating styles...</span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Clarifications */}
          {clarificationCards && (
            <div className="px-6 sm:px-10 pb-4">
              <ClarificationCards
                question={clarificationCards.question}
                options={clarificationCards.options}
                onSelect={handleDisambiguation}
              />
            </div>
          )}

          {uiEvent?.type === "disambiguation" && (
            <div className="px-6 sm:px-10 pb-4">
              <DisambiguationCard
                question={uiEvent.question}
                options={uiEvent.options}
                onSelect={handleDisambiguation}
              />
            </div>
          )}

          {/* Input Area */}
          <div className="px-4 sm:px-8 pb-6 pt-4 bg-gradient-to-t from-white via-white/95 to-transparent border-t border-white/60">
            <div className="relative mx-auto w-full max-w-[1400px]">
              <div className="absolute inset-x-0 sm:inset-x-6 -top-1 h-16 bg-gradient-to-r from-pink-200/60 via-rose-200/70 to-blue-200/50 blur-3xl opacity-80 pointer-events-none" />

              <div className="relative w-full flex flex-col sm:flex-row items-stretch gap-3 sm:gap-4 rounded-[18px] sm:rounded-3xl border border-pink-100/70 bg-white/95 shadow-[0_20px_60px_rgba(236,72,153,0.12)] focus-within:border-pink-300 focus-within:shadow-[0_22px_70px_rgba(236,72,153,0.18)] transition-all px-4 py-3 sm:px-5 sm:py-4">
                <div className="flex items-center gap-3 text-gray-500">
                  <span className="inline-flex items-center justify-center w-11 h-11 rounded-2xl bg-gradient-to-br from-pink-50 to-rose-100 text-pink-500 shadow-inner">
                    <svg
                      aria-hidden="true"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={1.8}
                      className="w-6 h-6"
                    >
                      <circle cx="11" cy="11" r="6.2" />
                      <line x1="15.8" y1="15.8" x2="20.5" y2="20.5" strokeLinecap="round" />
                    </svg>
                  </span>
                  <div className="hidden sm:block">
                    <p className="text-xs uppercase tracking-[0.28em] text-pink-400/90 font-semibold">Search</p>
                    <p className="text-sm text-gray-500 font-light -mt-1">Ask Muse for a look, vibe, or occasion.</p>
                  </div>
                </div>

                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
                  placeholder='E.g. "monochrome streetwear with a bold jacket"'
                  className="flex-1 min-w-0 bg-transparent text-base sm:text-lg text-gray-900 placeholder:text-gray-400 outline-none py-2 sm:py-0"
                  disabled={loading}
                  aria-label="Describe what you want Muse to find"
                />

                <button
                  onClick={() => handleSend()}
                  disabled={loading || !input.trim()}
                  className="inline-flex items-center justify-center gap-2 px-5 sm:px-6 py-3 sm:py-3.5 rounded-2xl font-semibold text-white bg-gradient-to-r from-pink-400 via-rose-500 to-red-400 hover:from-pink-500 hover:via-rose-600 hover:to-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-95"
                >
                  {loading ? (
                    <>
                      <span className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                      <span className="text-sm font-medium">Searching</span>
                    </>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                        <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
                      </svg>
                      <span>Send</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
