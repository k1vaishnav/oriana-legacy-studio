import { useCallback, useEffect, useRef, useState } from "react";
import { business, whatsappHref } from "@/lib/site";

type Step = "name" | "phone" | "interest" | "done";

const AUTO_OPEN_DELAY = 6000;
const NUDGE_DELAY = 2500;

export function FloatingWhatsApp() {
  const [atBottom, setAtBottom] = useState(false);

  // Chatbot state
  const [chatOpen, setChatOpen] = useState(false);
  // Attention (bloom + sway + green dot + teaser) runs whenever the chat
  // is closed — before first open AND after the user closes it.
  const [nudgeVisible, setNudgeVisible] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<{ sender: "bot" | "user"; text: string }[]>([
    { sender: "bot", text: "Hi there! 👋 Welcome to Oriana Weddings." },
    { sender: "bot", text: "Ask me anything — or share your name and I’ll get you a quick quote." },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [step, setStep] = useState<Step>("name");
  const [lead, setLead] = useState({ name: "", phone: "", interest: "" });

  const desktopInputRef = useRef<HTMLInputElement>(null);
  const mobileInputRef = useRef<HTMLInputElement>(null);
  const desktopEndRef = useRef<HTMLDivElement>(null);
  const mobileEndRef = useRef<HTMLDivElement>(null);
  // Guards so the scheduled auto-pop fires exactly once and never
  // re-opens over a user who explicitly closed it.
  const autoFiredRef = useRef(false);
  const userClosedRef = useRef(false);
  const renudgeTimerRef = useRef(0);
  const chatOpenRef = useRef(false);
  chatOpenRef.current = chatOpen;

  // One id per chat session so partial rows can be grouped on the backend.
  const [sessionId] = useState(() => {
    try {
      return crypto.randomUUID();
    } catch {
      return `chat-${Date.now()}-${Math.floor(Math.random() * 1e6)}`;
    }
  });

  // Live mirrors for the unload flush (listeners only see mount-time state).
  const leadRef = useRef(lead);
  leadRef.current = lead;
  const stepRef = useRef(step);
  stepRef.current = step;
  const messagesRef = useRef(messages);
  messagesRef.current = messages;
  const lastFlushKeyRef = useRef("");

  const resolveEndpoint = useCallback(() => {
    const accessKey = import.meta.env["VITE_WEB3FORMS_ACCESS_KEY"] as string | undefined;
    const legacyEndpoint = import.meta.env["VITE_ENQUIRY_ENDPOINT"] as string | undefined;
    if (!accessKey && !legacyEndpoint) return null;
    return {
      url: (accessKey ? "https://api.web3forms.com/submit" : legacyEndpoint) as string,
      accessKey,
    };
  }, []);

  const buildPayload = useCallback(
    (
      data: typeof lead,
      status: string,
      transcriptLines: { sender: "bot" | "user"; text: string }[],
      accessKey: string | undefined,
    ): Record<string, string> => {
      const transcript = transcriptLines
        .map((m) => `${m.sender === "user" ? "Visitor" : "Oriana"}: ${m.text}`)
        .join("\n");
      const payload: Record<string, string> = {
        source: "Chatbot",
        chat_session: sessionId,
        chat_status: status,
        name: data.name || "(not given)",
        phone: data.phone || "(not given)",
        email: "chatbot@orianaweddings.com",
        service: data.interest || "(not chosen)",
        query: `Chatbot ${status}. Full transcript:\n${transcript}`,
        page_url: typeof window !== "undefined" ? window.location.href : "",
      };
      if (accessKey) payload["access_key"] = accessKey;
      return payload;
    },
    [sessionId],
  );

  const sendLeadData = useCallback(
    async (
      data: typeof lead,
      status: "started" | "name-captured" | "phone-captured" | "complete" | "abandoned",
      transcriptLines: { sender: "bot" | "user"; text: string }[],
    ) => {
      const endpoint = resolveEndpoint();
      if (!endpoint) return;

      try {
        const payload = buildPayload(data, status, transcriptLines, endpoint.accessKey);
        await fetch(endpoint.url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } catch (e) {
        console.error("Failed to save lead in background", e);
      }
    },
    [resolveEndpoint, buildPayload],
  );

  // Best-effort flush when the tab is closed/hidden — fetch may not
  // survive unload, so this uses sendBeacon with the latest snapshot.
  const beaconLeadData = useCallback(() => {
    const snapshot = leadRef.current;
    const transcript = messagesRef.current;
    const userLines = transcript.filter((m) => m.sender === "user");
    if (stepRef.current === "done") return;
    if (!snapshot.name && !snapshot.phone && userLines.length === 0) return;

    const key = JSON.stringify([snapshot, stepRef.current, userLines.length]);
    if (lastFlushKeyRef.current === key) return;
    lastFlushKeyRef.current = key;

    const endpoint = resolveEndpoint();
    if (!endpoint || !("sendBeacon" in navigator)) return;
    try {
      const payload = buildPayload(snapshot, "abandoned", transcript, endpoint.accessKey);
      navigator.sendBeacon(
        endpoint.url,
        new Blob([JSON.stringify(payload)], { type: "application/json" }),
      );
    } catch {
      /* unload path — nothing left to do */
    }
  }, [resolveEndpoint, buildPayload]);

  const focusActiveInput = () => {
    // Wait for the open transition so the focus ring doesn't jump.
    window.setTimeout(() => {
      const isDesktop = window.matchMedia("(min-width: 1024px)").matches;
      const target = isDesktop ? desktopInputRef.current : mobileInputRef.current;
      target?.focus({ preventScroll: true });
    }, 320);
  };

  const openChat = () => {
    autoFiredRef.current = true;
    window.clearTimeout(renudgeTimerRef.current);
    setNudgeVisible(false);
    setChatOpen(true);
    focusActiveInput();
  };

  const closeChat = useCallback(() => {
    userClosedRef.current = true;
    // If they walk away mid-flow, log whatever we have before closing.
    if (step !== "done" && (lead.name || lead.phone || messages.some((m) => m.sender === "user"))) {
      void sendLeadData(lead, "abandoned", messages);
    }
    setChatOpen(false);
    setNudgeVisible(false);
    // Attention resumes on the buttons right away; the teaser card
    // comes back after a breather so it doesn't feel naggy.
    window.clearTimeout(renudgeTimerRef.current);
    renudgeTimerRef.current = window.setTimeout(() => {
      if (!chatOpenRef.current) setNudgeVisible(true);
    }, 12000);
  }, [step, lead, messages, sendLeadData]);

  // Scroll position (hide dock near footer) + teaser + guaranteed auto-pop.
  // NOTE: nothing here is cancelled by random taps/scrolls — the chat pops
  // once per page load unless the user explicitly closed it first.
  useEffect(() => {
    const onScroll = () => {
      setAtBottom(window.innerHeight + window.scrollY >= document.body.scrollHeight - 80);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    const nudgeTimer = window.setTimeout(() => {
      if (autoFiredRef.current || userClosedRef.current) return;
      setNudgeVisible(true);
    }, NUDGE_DELAY);

    let retryTimer = 0;
    const doAutoOpen = () => {
      if (autoFiredRef.current || userClosedRef.current) return;
      if (document.hidden) {
        // Tab in background — try again shortly instead of giving up.
        retryTimer = window.setTimeout(doAutoOpen, 2000);
        return;
      }
      autoFiredRef.current = true;
      setNudgeVisible(false);
      setChatOpen(true);
      focusActiveInput();
    };
    const autoTimer = window.setTimeout(doAutoOpen, AUTO_OPEN_DELAY);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.clearTimeout(nudgeTimer);
      window.clearTimeout(autoTimer);
      window.clearTimeout(retryTimer);
      window.clearTimeout(renudgeTimerRef.current);
    };
  }, []);

  // Keep the conversation pinned to the latest message.
  useEffect(() => {
    desktopEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    mobileEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, chatOpen, step, isTyping]);

  // Esc closes the chat.
  useEffect(() => {
    if (!chatOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeChat();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [chatOpen, closeChat]);

  // Last-resort logging: tab closed, reloaded, or app backgrounded mid-chat.
  useEffect(() => {
    const onHidden = () => {
      if (document.visibilityState === "hidden") beaconLeadData();
    };
    document.addEventListener("visibilitychange", onHidden);
    window.addEventListener("pagehide", beaconLeadData);
    return () => {
      document.removeEventListener("visibilitychange", onHidden);
      window.removeEventListener("pagehide", beaconLeadData);
    };
  }, [beaconLeadData]);

  const botSay = (text: string, delay = 650) => {
    setIsTyping(true);
    window.setTimeout(() => {
      setMessages((prev) => [...prev, { sender: "bot", text }]);
      setIsTyping(false);
    }, delay);
  };

  const handleSend = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputValue.trim() || isTyping) return;

    const userMsg = inputValue.trim();
    setMessages((prev) => [...prev, { sender: "user", text: userMsg }]);
    setInputValue("");

    if (step === "name") {
      const looksLikeQuestion =
        /[?]|price|cost|package|availab|date|book|venue|where|how|what/i.test(userMsg);
      const withUserLine = [...messages, { sender: "user" as const, text: userMsg }];
      if (looksLikeQuestion) {
        // They asked something instead of giving a name — log the text anyway.
        void sendLeadData(lead, "started", withUserLine);
        botSay(
          `Great question! Our team will give you exact pricing & dates — could I get your name first so they can reply personally?`,
        );
        return;
      }
      const updated = { ...lead, name: userMsg };
      setLead(updated);
      // Log the name immediately — if they leave now, we still have it.
      void sendLeadData(updated, "name-captured", withUserLine);
      setStep("phone");
      botSay(`Nice to meet you, ${userMsg}! What's the best phone number to reach you at?`);
    } else if (step === "phone") {
      const updated = { ...lead, phone: userMsg };
      setLead(updated);
      // Log name + phone immediately — never lose a reachable lead.
      void sendLeadData(updated, "phone-captured", [
        ...messages,
        { sender: "user" as const, text: userMsg },
      ]);
      setStep("interest");
      botSay("Got it! What are you looking for? Just tap one below 👇");
    }
  };

  const handleChipClick = (interest: string) => {
    const completedLead = { ...lead, interest };
    const withUserLine = [...messages, { sender: "user" as const, text: interest }];
    setLead(completedLead);
    setMessages(withUserLine);
    setStep("done");

    void sendLeadData(completedLead, "complete", withUserLine);

    window.setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "Perfect! Opening WhatsApp so our team can assist you right away. 💬",
        },
      ]);
      window.setTimeout(() => {
        const name = completedLead.name || "there";
        const msg = `Hi Oriana team, I'm ${name}. My contact is ${completedLead.phone}. I'm interested in ${interest}.`;
        window.open(whatsappHref(msg), "_blank");
      }, 1800);
    }, 600);
  };

  const showAttentionDot = !chatOpen;

  return (
    <>
      {/* Desktop dock — chat window stays visible even near the footer once open */}
      <div
        className={`fixed right-5 bottom-5 z-40 hidden flex-col items-end gap-3 transition-all duration-500 lg:flex ${
          chatOpen
            ? "translate-y-0 opacity-100"
            : !atBottom
              ? "translate-y-0 opacity-100"
              : "pointer-events-none translate-y-8 opacity-0"
        }`}
      >
        <div className="relative">
          {/* Teaser — looks like an incoming message, impossible to miss */}
          {nudgeVisible && !chatOpen && (
            <div className="concierge-nudge absolute bottom-[calc(100%+12px)] right-0 w-[280px] overflow-hidden rounded-2xl rounded-br-md bg-ink text-white shadow-2xl ring-1 ring-white/10">
              <div className="flex items-start gap-3 p-4 pb-3">
                <span className="relative flex size-10 shrink-0 items-center justify-center rounded-full bg-gold-ink text-base font-bold text-white">
                  O
                  <span className="absolute -bottom-0.5 -right-0.5 flex size-3">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex size-3 rounded-full border-2 border-ink bg-green-500"></span>
                  </span>
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-semibold leading-snug">Planning a wedding? 💍</p>
                  <p className="mt-0.5 text-xs leading-relaxed text-white/75">
                    Get a quick quote — we usually reply instantly.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setNudgeVisible(false);
                  }}
                  aria-label="Dismiss"
                  className="rounded-full p-1 text-white/60 hover:bg-white/10 hover:text-white"
                >
                  <svg
                    viewBox="0 0 24 24"
                    className="size-3.5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <button
                onClick={() => openChat()}
                className="mx-4 mb-4 flex w-[calc(100%-2rem)] items-center justify-center gap-2 rounded-full bg-gold-ink py-2.5 text-xs font-bold text-white transition-colors hover:bg-gold-ink/90"
              >
                Get a Quote
                <svg
                  viewBox="0 0 24 24"
                  className="size-3.5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          )}

          {/* Chat window */}
          <div
            role="dialog"
            aria-label="Chat with Oriana Weddings"
            className={`absolute bottom-[calc(100%+16px)] right-0 flex w-[350px] max-w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-black/10 transition-all duration-300 origin-bottom-right ${chatOpen ? "scale-100 opacity-100 translate-y-0" : "scale-95 opacity-0 pointer-events-none translate-y-3"}`}
          >
            {/* Header */}
            <div className="flex items-center justify-between bg-ink p-4 text-white">
              <div className="flex items-center gap-3">
                <div className="relative flex size-10 items-center justify-center rounded-full bg-gold-ink text-white font-bold text-lg">
                  O
                  <span className="absolute bottom-0 right-0 size-3 rounded-full bg-green-500 border-2 border-ink"></span>
                </div>
                <div>
                  <h3 className="font-display font-semibold leading-tight">Oriana Weddings</h3>
                  <p className="text-xs text-white/70">
                    <span className="mr-1 inline-block size-1.5 rounded-full bg-green-400 align-middle"></span>
                    Online — replies instantly
                  </p>
                </div>
              </div>
              <button
                onClick={closeChat}
                aria-label="Close chat"
                className="rounded-full p-2 hover:bg-white/10 transition-colors"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="size-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Messages */}
            <div className="flex h-[320px] flex-col gap-3 overflow-y-auto bg-paper/50 p-4">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-sm ${msg.sender === "user" ? "bg-gold-ink text-white rounded-tr-sm" : "bg-white text-ink border border-line/50 rounded-tl-sm"}`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="flex items-center gap-1.5 rounded-2xl rounded-tl-sm border border-line/50 bg-white px-4 py-3 shadow-sm">
                    <span className="typing-dot" />
                    <span className="typing-dot" />
                    <span className="typing-dot" />
                  </div>
                </div>
              )}

              {step === "interest" && !isTyping && (
                <div className="flex flex-col gap-2 mt-1">
                  {[
                    "Wedding Photography",
                    "Wedding Films",
                    "Photography + Films",
                    "Other Enquiries",
                  ].map((opt) => (
                    <button
                      key={opt}
                      onClick={() => handleChipClick(opt)}
                      className="text-left rounded-xl border border-gold-ink/30 bg-white px-4 py-2.5 text-sm font-medium text-ink hover:bg-gold-ink hover:text-white transition-colors shadow-sm"
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              )}
              <div ref={desktopEndRef} />
            </div>

            {/* Input — autofocused on open so the user can just type */}
            <form
              onSubmit={handleSend}
              className="flex items-center gap-2 border-t border-line/50 bg-white p-3"
            >
              <input
                ref={desktopInputRef}
                type={step === "phone" ? "tel" : "text"}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                disabled={step === "interest" || step === "done"}
                placeholder={
                  step === "name"
                    ? "Ask anything, or type your name…"
                    : step === "phone"
                      ? "Your phone number…"
                      : "Tap an option above 👆"
                }
                aria-label="Type your message"
                autoComplete={step === "phone" ? "tel" : "name"}
                className="flex-1 rounded-full bg-paper/50 px-4 py-2.5 text-sm outline-none ring-1 ring-line/50 focus:ring-2 focus:ring-gold-ink transition-all disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={!inputValue.trim() || step === "interest" || step === "done"}
                aria-label="Send message"
                className="flex size-10 items-center justify-center rounded-full bg-ink text-white transition-all hover:bg-gold-ink disabled:opacity-40 shrink-0"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="size-4 ml-0.5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </button>
            </form>
          </div>

          {/* Get-a-quote toggle — soft bloom + sway while closed. */}
          <button
            onClick={() => (chatOpen ? closeChat() : openChat())}
            aria-expanded={chatOpen}
            aria-label={chatOpen ? "Close chat" : "Get a quote"}
            className={`group relative flex w-full items-center justify-center gap-2.5 rounded-full px-5 py-3.5 text-sm font-bold ring-1 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-2xl active:translate-y-0 ${chatOpen ? "bg-ink text-white ring-ink shadow-xl" : "bg-gold-ink text-white ring-gold-ink/50 shadow-xl"} ${showAttentionDot ? "btn-attn-gold" : "shadow-xl"}`}
          >
            <span className="flex size-8 items-center justify-center rounded-full bg-white/20 text-white transition-colors group-hover:bg-white group-hover:text-gold-ink">
              {chatOpen ? (
                <svg
                  viewBox="0 0 24 24"
                  className="size-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg
                  viewBox="0 0 24 24"
                  className="size-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                  />
                </svg>
              )}
            </span>
            {chatOpen ? "Close Chat" : "Get a Quote"}
          </button>
        </div>

        <a
          href={business.phoneHref}
          className={`group relative flex w-full items-center justify-center gap-2.5 rounded-full bg-white px-5 py-3.5 text-sm font-bold text-ink ring-1 ring-black/5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-2xl hover:ring-gold-ink/30 ${showAttentionDot ? "btn-attn-light shadow-xl shadow-black/5" : "shadow-xl shadow-black/5"}`}
        >
          <span className="flex size-8 items-center justify-center rounded-full bg-cream text-gold-ink transition-colors group-hover:bg-gold-ink group-hover:text-white">
            <svg viewBox="0 0 16 16" className="size-4" fill="currentColor" aria-hidden="true">
              <path d="M10.5 1h-5A1.5 1.5 0 0 0 4 2.5v11A1.5 1.5 0 0 0 5.5 15h5A1.5 1.5 0 0 0 12 13.5v-11A1.5 1.5 0 0 0 10.5 1Zm-5 1h5a.5.5 0 0 1 .5.5v8h-6v-8a.5.5 0 0 1 .5-.5Zm5 12h-5a.5.5 0 0 1-.5-.5V11h6v2.5a.5.5 0 0 1-.5.5ZM8 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z" />
            </svg>
          </span>
          {business.phone}
        </a>
      </div>

      {/* Mobile bar */}
      <div
        className={`fixed inset-x-4 bottom-4 z-40 flex items-center justify-between gap-2 rounded-full border border-line/40 bg-paper/80 p-1.5 shadow-2xl backdrop-blur-xl transition-all duration-500 lg:hidden ${
          atBottom && !chatOpen ? "translate-y-24 opacity-0" : "translate-y-0 opacity-100"
        }`}
      >
        <button
          onClick={() => (chatOpen ? closeChat() : openChat())}
          aria-expanded={chatOpen}
          aria-label={chatOpen ? "Close chat" : "Get a quote"}
          className={`relative flex flex-1 items-center justify-center gap-2 rounded-full py-3 text-sm font-bold tracking-tight text-white transition-colors hover:bg-gold-ink/90 shadow-lg ${chatOpen ? "bg-ink" : "bg-gold-ink"} ${showAttentionDot ? "btn-attn-gold" : ""}`}
        >
          {chatOpen ? (
            <svg
              viewBox="0 0 24 24"
              className="size-4 text-white"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg
              viewBox="0 0 24 24"
              className="size-4 text-white"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
              />
            </svg>
          )}
          {chatOpen ? "Close" : "Get Quote"}
        </button>
        <a
          href={business.phoneHref}
          className={`relative flex flex-1 items-center justify-center gap-2 rounded-full bg-white/60 py-3 text-sm font-bold tracking-tight text-ink transition-colors hover:bg-white ${showAttentionDot ? "btn-attn-light" : ""}`}
        >
          <svg
            viewBox="0 0 16 16"
            className="size-4 text-gold-ink"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M10.5 1h-5A1.5 1.5 0 0 0 4 2.5v11A1.5 1.5 0 0 0 5.5 15h5A1.5 1.5 0 0 0 12 13.5v-11A1.5 1.5 0 0 0 10.5 1Zm-5 1h5a.5.5 0 0 1 .5.5v8h-6v-8a.5.5 0 0 1 .5-.5Zm5 12h-5a.5.5 0 0 1-.5-.5V11h6v2.5a.5.5 0 0 1-.5.5ZM8 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z" />
          </svg>
          {business.phone}
        </a>
      </div>

      {/* Mobile chat card */}
      <div
        role="dialog"
        aria-label="Chat with Oriana Weddings"
        className={`fixed inset-x-3 bottom-[72px] z-50 flex flex-col overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-black/10 transition-all duration-300 origin-bottom lg:hidden ${
          chatOpen
            ? "scale-100 opacity-100 translate-y-0"
            : "scale-95 opacity-0 pointer-events-none translate-y-4"
        }`}
        style={{ maxHeight: "65dvh" }}
      >
        <div className="flex items-center justify-between bg-ink p-3.5 text-white">
          <div className="flex items-center gap-2.5">
            <div className="relative flex size-9 items-center justify-center rounded-full bg-gold-ink text-white font-bold text-base">
              O
              <span className="absolute -bottom-0.5 -right-0.5 size-2.5 rounded-full bg-green-500 border-2 border-ink"></span>
            </div>
            <div>
              <h3 className="font-display text-sm font-semibold leading-tight">Oriana Weddings</h3>
              <p className="text-[11px] text-white/60">
                <span className="mr-1 inline-block size-1.5 rounded-full bg-green-400 align-middle"></span>
                Online now
              </p>
            </div>
          </div>
          <button
            onClick={closeChat}
            aria-label="Close chat"
            className="rounded-full p-1.5 hover:bg-white/10 transition-colors"
          >
            <svg
              viewBox="0 0 24 24"
              className="size-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex flex-1 flex-col gap-3 overflow-y-auto p-3.5">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed shadow-sm ${msg.sender === "user" ? "bg-gold-ink text-white rounded-tr-sm" : "bg-paper text-ink border border-line/40 rounded-tl-sm"}`}
              >
                {msg.text}
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start">
              <div className="flex items-center gap-1.5 rounded-2xl rounded-tl-sm border border-line/40 bg-paper px-3.5 py-3">
                <span className="typing-dot" />
                <span className="typing-dot" />
                <span className="typing-dot" />
              </div>
            </div>
          )}

          {step === "interest" && !isTyping && (
            <div className="flex flex-col gap-1.5 mt-1">
              {[
                "Wedding Photography",
                "Wedding Films",
                "Photography + Films",
                "Other Enquiries",
              ].map((opt) => (
                <button
                  key={opt}
                  onClick={() => handleChipClick(opt)}
                  className="text-left rounded-xl border border-gold-ink/30 bg-white px-3.5 py-2.5 text-sm font-medium text-ink hover:bg-gold-ink hover:text-white transition-colors shadow-sm"
                >
                  {opt}
                </button>
              ))}
            </div>
          )}
          <div ref={mobileEndRef} />
        </div>

        <form
          onSubmit={handleSend}
          className="flex items-center gap-2 border-t border-line/40 bg-white p-2.5"
        >
          <input
            ref={mobileInputRef}
            type={step === "phone" ? "tel" : "text"}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            disabled={step === "interest" || step === "done"}
            placeholder={
              step === "name"
                ? "Ask anything, or type your name…"
                : step === "phone"
                  ? "Your phone number…"
                  : "Tap an option above 👆"
            }
            aria-label="Type your message"
            autoComplete={step === "phone" ? "tel" : "name"}
            className="flex-1 rounded-full bg-paper/80 px-4 py-2.5 text-sm outline-none ring-1 ring-line/50 focus:ring-2 focus:ring-gold-ink transition-all disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!inputValue.trim() || step === "interest" || step === "done" || isTyping}
            aria-label="Send message"
            className="flex size-10 items-center justify-center rounded-full bg-ink text-white transition-all hover:bg-gold-ink disabled:opacity-40 shrink-0"
          >
            <svg
              viewBox="0 0 24 24"
              className="size-4 ml-0.5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
        </form>
      </div>
    </>
  );
}
