import { useCallback, useEffect, useRef, useState } from "react";
import { useRouterState } from "@tanstack/react-router";

import { whatsappHref } from "@/lib/site";

/**
 * A short, preset-only enquiry assistant.
 *
 * Deliberately no text inputs. Every earlier version of this site's enquiry form
 * asked a visitor to type, and typing is the single largest drop-off on a
 * wedding site — so the whole conversation is tapping a chip, and the only place
 * a real message is composed is WhatsApp, which the visitor already trusts and
 * already has installed.
 *
 * The answers are assembled into the WhatsApp message so the studio opens the
 * thread with the service, timing and location already filled in, rather than
 * with "Hi" and a blank conversation to start.
 */

/** Shown once per session, and never on the contact page — that page already
 *  offers the same WhatsApp handoff without the detour. */
const SESSION_KEY = "oriana.concierge.asked";
const OPEN_AFTER_MS = 12_000;

const STEPS = [
  {
    key: "service",
    label: "Service",
    question: "What can we shoot for you?",
    options: ["Wedding photography", "Wedding films", "Photography + films", "Something else"],
  },
  {
    key: "date",
    label: "Wedding date",
    question: "When is the wedding?",
    options: [
      "Within 3 months",
      "3 – 6 months away",
      "6 – 12 months away",
      "More than a year away",
    ],
  },
  {
    key: "location",
    label: "Location",
    question: "Where is it happening?",
    options: ["Calicut / Kozhikode", "Elsewhere in Kerala", "Elsewhere in India", "International"],
  },
] as const;

type Answers = Partial<Record<(typeof STEPS)[number]["key"], string>>;

export function ConciergeChat() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [open, setOpen] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});

  const panelRef = useRef<HTMLDivElement>(null);
  const launcherRef = useRef<HTMLButtonElement>(null);

  const done = step >= STEPS.length;
  // `done` already rules this out at runtime, but the compiler cannot narrow an
  // array index from a comparison, so the lookup is optional throughout.
  const current = STEPS[step];

  const close = useCallback(() => {
    setOpen(false);
    // Send focus back where it came from, so keyboard users are not dumped at
    // the top of the document.
    launcherRef.current?.focus();
  }, []);

  useEffect(() => {
    if (pathname === "/contact") return;
    if (sessionStorage.getItem(SESSION_KEY)) return;

    const id = window.setTimeout(() => {
      setOpen(true);
      sessionStorage.setItem(SESSION_KEY, "1");
    }, OPEN_AFTER_MS);

    return () => window.clearTimeout(id);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);
    // Move focus into the panel so the first chip is reachable without hunting.
    panelRef.current?.focus();

    return () => document.removeEventListener("keydown", onKey);
  }, [open, close]);

  const choose = (option: string) => {
    if (!current) return;
    setAnswers((prev) => ({ ...prev, [current.key]: option }));
    setStep((s) => s + 1);
  };

  // Short labels, not the questions — this text lands in WhatsApp, where a
  // full question in front of its own answer reads like a form being filled in.
  const summary = STEPS.map((s) => `${s.label}: ${answers[s.key]}`).join("\n");
  const message = `Hi Oriana, I'd like to enquire.\n\n${summary}`;

  const launcher = (
    <button
      ref={launcherRef}
      type="button"
      onClick={() => (open ? close() : setOpen(true))}
      className="concierge-launcher"
      aria-expanded={open}
      aria-controls="oriana-concierge"
    >
      {open ? (
        <svg viewBox="0 0 16 16" className="size-5" fill="none" stroke="currentColor">
          <path d="M4 4l8 8M12 4l-8 8" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      ) : (
        <svg viewBox="0 0 20 20" className="size-5" fill="none" stroke="currentColor">
          <path
            d="M18 10a8 8 0 0 1-11.6 7.1L2 18.5l1.4-4.3A8 8 0 1 1 18 10Z"
            strokeWidth="1.4"
            strokeLinejoin="round"
          />
          <path d="M7 9h.01M10 9h.01M13 9h.01" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      )}
      <span className="sr-only">{open ? "Close the assistant" : "How can I help you?"}</span>
    </button>
  );

  return (
    <div className="concierge">
      {launcher}

      <div
        id="oriana-concierge"
        ref={panelRef}
        role="dialog"
        aria-label="Oriana enquiry assistant"
        aria-modal="false"
        tabIndex={-1}
        className={`concierge-panel ${open && !dismissed ? "is-open" : ""}`}
      >
        <div className="concierge-head">
          <p className="concierge-hello">How can I help you?</p>
          <p className="concierge-sub">
            {done
              ? "Here's your enquiry. Continue to WhatsApp and we'll reply there."
              : "Three quick questions, then straight to WhatsApp."}
          </p>
        </div>

        <div className="concierge-body">
          {done ? (
            <>
              <dl className="concierge-summary">
                {STEPS.map((s) => (
                  <div key={s.key} className="concierge-summary-row">
                    <dt>{s.key}</dt>
                    <dd>{answers[s.key]}</dd>
                  </div>
                ))}
              </dl>

              <a
                href={whatsappHref(message)}
                target="_blank"
                rel="noreferrer noopener"
                className="btn btn-ink w-full"
                onClick={() => setDismissed(true)}
              >
                Continue to WhatsApp
              </a>

              <button
                type="button"
                onClick={() => {
                  setStep(0);
                  setAnswers({});
                }}
                className="concierge-again"
              >
                Start again
              </button>
            </>
          ) : (
            <>
              <p className="concierge-q">{current?.question}</p>
              <ul className="flex flex-col gap-2">
                {current?.options.map((option) => (
                  <li key={option}>
                    <button type="button" onClick={() => choose(option)} className="concierge-chip">
                      {option}
                    </button>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
