import { useState } from "react";

import { Arrow } from "@/components/site/ui";
import { business, whatsappHref } from "@/lib/site";

/**
 * The enquiry form.
 *
 * Five boxes, all of them required, and nothing else. That is the whole
 * design, and it took removing more than it kept.
 *
 * This form previously asked for eight things — name, phone, email, service,
 * date, location, number of functions, and a free-text box — then quietly
 * marked three of them optional in a footnote under the heading. That footnote
 * was doing the damage. A field the page calls optional is a field a visitor
 * stops to reason about, and four of them in a row turn a two-minute question
 * into a form to be survived. So the optional four are gone: date, location,
 * function count, and the second free-text box. Oriana asks for all of them on
 * the reply anyway, when there is a person to ask, which is a better moment
 * than a cold field on a web page.
 *
 * What is left is what the studio genuinely cannot reply without: a name to
 * call, an email to write to, and a message. No asterisk legend to decode
 * either — every field is required, so there is nothing to decode.
 *
 * The service choice is the one field that is a decision rather than a fact, so
 * it stays as three wide tap targets instead of a list of radio rows. The
 * thing most likely to be missed on a phone is the thing that must not be.
 *
 * The free-text box is deliberately the widest thing on the page and the last
 * field before the button, so "write whatever you want to ask" is the final
 * thing a person does rather than the first. Two people can type a wedding
 * date into a two-line box; the same people will not fill a form that opens on
 * a date input they do not have yet.
 *
 * Delivery has two real paths, in order:
 *
 *   1. If VITE_ENQUIRY_ENDPOINT is configured, the payload is POSTed there as
 *      JSON. Set one variable and the form works.
 *   2. With no endpoint, the values are composed into a WhatsApp message.
 *
 * The second path used to be a bare `window.open`, which browsers block as a
 * popup often enough that the form would show "thank you" while the enquiry
 * went nowhere — the worst possible failure, because it looks like success. The
 * hand-off is now checked, and if the window was blocked the confirmation
 * screen says so plainly and offers a link to press instead, so there is no
 * path on which a person presses send and is quietly lost.
 */

const SERVICES = [
  { value: "Photography", note: "Candid, traditional, destination" },
  { value: "Wedding Films", note: "Feature films, teasers, reels" },
  { value: "Photography + Films", note: "Both teams, structured together" },
] as const;

type Fields = {
  name: string;
  phone: string;
  email: string;
  service: string;
  query: string;
};

const EMPTY: Fields = {
  name: "",
  phone: "",
  email: "",
  service: "",
  query: "",
};

/** Every field is required, so this is the whole list. */
const REQUIRED = ["name", "phone", "email", "service", "query"] as const;

/** Indian mobile numbers, with the separators people actually type. */
const PHONE = /^[+]?[\d][\d\s()-]{7,17}\d$/;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Each one names the problem and the fix, rather than just reporting a miss. */
const MESSAGES = {
  name: "We need a name to reply to.",
  phone: "We need a number to call you back on.",
  email: "We need an email — everything we send you goes there.",
  service: "Pick the closest one. It is easy to change later.",
  query: "One line is enough to start.",
} as const;

type Errors = Partial<Record<keyof Fields, string>>;

/** The same body in both paths, so nothing is dropped on the way to WhatsApp. */
const compose = (values: Fields) =>
  [
    "Hi Oriana, I'd like to talk about my wedding.",
    "",
    `Name: ${values.name}`,
    `Phone: ${values.phone}`,
    `Email: ${values.email}`,
    `Interested in: ${values.service}`,
    "",
    values.query,
    "",
    "Sent from the website.",
    business.phone,
  ].join("\n");

export function EnquiryForm() {
  const [fields, setFields] = useState<Fields>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [state, setState] = useState<"idle" | "sending" | "sent">("idle");
  const [problem, setProblem] = useState<string | null>(null);
  // A real person never sees this. Bots fill it in.
  const [trap, setTrap] = useState("");
  /* Set only when the browser refused to open the hand-off. `blocked` is the
     reason the confirmation screen shows its rescue link. */
  const [blocked, setBlocked] = useState(false);

  const set = (key: keyof Fields) => (value: string) => {
    setFields((prev) => ({ ...prev, [key]: value }));
    // Clear a field's error as soon as it is edited, rather than making the
    // visitor submit twice to find out what was wrong.
    setErrors((prev) => (prev[key] ? { ...prev, [key]: undefined } : prev));
  };

  const validate = (values: Fields): Errors => {
    const found: Errors = {};
    for (const key of REQUIRED) {
      if (!values[key].trim()) found[key] = MESSAGES[key];
    }
    if (values.phone.trim() && !PHONE.test(values.phone.trim())) {
      found.phone = "That number looks incomplete — include the area code.";
    }
    if (values.email.trim() && !EMAIL.test(values.email.trim())) {
      found.email = "That email is missing an @ or a domain.";
    }
    return found;
  };

  /**
   * Open the hand-off and report whether the browser allowed it.
   *
   * `window.open` returns null when a popup blocker refuses the request. Ignoring
   * that return value is how a blocked hand-off becomes a silent success.
   */
  const handOff = () => {
    const win = window.open(whatsappHref(compose(fields)), "_blank", "noopener,noreferrer");
    setBlocked(win === null);
  };

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setProblem(null);

    const found = validate(fields);
    setErrors(found);
    if (Object.keys(found).length > 0) {
      const first = Object.keys(found)[0];
      if (first === "service") {
        document.querySelector<HTMLInputElement>('input[name="service"]')?.focus();
      } else {
        document.getElementById(`enquiry-${first}`)?.focus();
      }
      return;
    }

    if (trap) {
      setState("sent");
      return;
    }

    const endpoint = import.meta.env["VITE_ENQUIRY_ENDPOINT"] as string | undefined;
    const web3formsKey = import.meta.env["VITE_WEB3FORMS_ACCESS_KEY"] as string | undefined;

    if (!endpoint && !web3formsKey) {
      // No endpoint configured. Hand the composed message to WhatsApp, which is
      // a real destination and a real delivery, not a pretend success screen.
      handOff();
      setState("sent");
      return;
    }

    setState("sending");
    try {
      const payload: any = { ...fields };
      let url = endpoint;
      
      if (web3formsKey) {
        payload.access_key = web3formsKey;
        url = "https://api.web3forms.com/submit";
      }

      const response = await fetch(url as string, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error(String(response.status));
      setState("sent");
    } catch {
      // The endpoint is down. Do not claim success and do not discard what they
      // typed — fall through to WhatsApp with everything intact.
      handOff();
      setProblem("Our form could not be reached, so we opened WhatsApp with your details instead.");
      setState("sent");
    }
  };

  if (state === "sent") {
    return (
      <div
        aria-labelledby="enquiry-done"
        className="rounded-card border border-line bg-bone p-7 sm:p-9"
      >
        <p className="eyebrow">Sent</p>
        <h2 id="enquiry-done" className="mt-5 font-display text-h3 text-ink">
          {blocked ? "One tap left." : "Thank you — we have your details."}
        </h2>
        {blocked ? (
          <>
            <p className="measure mt-4 text-mute">
              Your browser stopped the WhatsApp window from opening on its own, so this has not been
              sent yet. Nothing you typed is lost — press the button and it goes.
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3">
              <a
                href={whatsappHref(compose(fields))}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-ink"
              >
                Open WhatsApp
                <Arrow className="size-3.5" />
              </a>
              <a href={`mailto:${business.email}`} className="link text-sm">
                or email {business.email}
              </a>
            </div>
          </>
        ) : (
          <p className="measure mt-4 text-mute">
            Oriana will reply to you shortly, usually the same day. If it is urgent, call{" "}
            <a href={business.phoneHref} className="link">
              {business.phone}
            </a>
            .
          </p>
        )}

        {problem ? (
          <p role="status" className="mt-4 max-w-[46ch] text-sm text-gold-ink">
            {problem}
          </p>
        ) : null}
      </div>
    );
  }

  return (
    <div
      aria-labelledby="enquiry-heading"
      className="rounded-card border border-line bg-bone p-6 sm:p-9"
    >
      <p className="eyebrow">Enquiry</p>
      <h2 id="enquiry-heading" className="mt-4 font-display text-h3 text-ink">
        Five boxes. That is the whole form.
      </h2>
      <p className="mt-3 max-w-[44ch] text-sm leading-relaxed text-mute">
        We only ask for what we need to answer you. Dates, venue and everything else can wait for
        the reply.
      </p>

      <form onSubmit={onSubmit} noValidate className="mt-8">
        {/* Spam trap. Hidden from sight and from the accessibility tree. */}
        <div aria-hidden="true" className="absolute h-0 w-0 overflow-hidden opacity-0">
          <label htmlFor="enquiry-website">Website</label>
          <input
            id="enquiry-website"
            name="website"
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={trap}
            onChange={(event) => setTrap(event.target.value)}
          />
        </div>

        <div className="grid gap-x-8 gap-y-7 sm:grid-cols-3">
          <TextField
            id="enquiry-name"
            label="Name"
            required
            value={fields.name}
            onChange={set("name")}
            error={errors.name}
            autoComplete="name"
            placeholder="Neha Menon"
          />
          <TextField
            id="enquiry-phone"
            label="Phone"
            required
            type="tel"
            inputMode="tel"
            value={fields.phone}
            onChange={set("phone")}
            error={errors.phone}
            autoComplete="tel"
            placeholder="+91"
          />
          <TextField
            id="enquiry-email"
            label="Email"
            required
            type="email"
            inputMode="email"
            value={fields.email}
            onChange={set("email")}
            error={errors.email}
            autoComplete="email"
            placeholder="you@email.com"
          />
        </div>

        {/* The one field that is a decision rather than a fact, so it is three
            tap targets wide instead of a list of radios. */}
        <fieldset
          aria-describedby={errors.service ? "enquiry-service-error" : undefined}
          className="mt-8 border-0 p-0"
        >
          <legend className="label text-mute">
            What do you need? <span className="text-gold-ink">*</span>
          </legend>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {SERVICES.map((option) => {
              const on = fields.service === option.value;
              return (
                <label
                  key={option.value}
                  className="cursor-pointer rounded-[inherit] focus-within:outline focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-ink"
                >
                  <input
                    type="radio"
                    name="service"
                    value={option.value}
                    checked={on}
                    onChange={() => set("service")(option.value)}
                    aria-invalid={errors.service ? true : undefined}
                    className="peer sr-only"
                  />
                  <span
                    className={`flex h-full flex-col justify-between gap-2 rounded-card border p-4 transition-colors duration-300 ${
                      on ? "border-ink bg-cream" : "border-line bg-paper hover:border-ink/40"
                    }`}
                  >
                    <span className="flex items-center gap-2.5">
                      <span
                        aria-hidden="true"
                        className={`size-3.5 shrink-0 rounded-full border transition-colors duration-300 ${
                          on ? "border-ink bg-ink" : "border-line bg-transparent"
                        }`}
                      />
                      <span
                        className={`text-sm font-medium leading-tight ${on ? "text-ink" : "text-ink/75"}`}
                      >
                        {option.value}
                      </span>
                    </span>
                    <span className="text-xs leading-relaxed text-mute">{option.note}</span>
                  </span>
                </label>
              );
            })}
          </div>
          {errors.service ? (
            <p id="enquiry-service-error" role="alert" className="mt-3 text-sm text-clay">
              {errors.service}
            </p>
          ) : null}
        </fieldset>

        {/* Last field, and the biggest. Whatever the person actually wants to
            ask goes here, so it reads as a message rather than a form row. */}
        <div className="mt-8">
          <label htmlFor="enquiry-query" className="label text-mute">
            Your query <span className="text-gold-ink">*</span>
          </label>
          <textarea
            id="enquiry-query"
            name="query"
            rows={4}
            required
            value={fields.query}
            onChange={(event) => set("query")(event.target.value)}
            aria-invalid={errors.query ? true : undefined}
            aria-describedby={errors.query ? "enquiry-query-error" : undefined}
            placeholder="Dates you are holding, where it is, what you want to know — write it however it comes."
            className="field mt-3"
          />
          {errors.query ? (
            <p id="enquiry-query-error" role="alert" className="mt-2 text-sm text-clay">
              {errors.query}
            </p>
          ) : null}
        </div>

        <div className="mt-9 flex flex-col items-start gap-5 border-t border-line pt-7 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-[32ch] text-sm leading-relaxed text-mute" aria-live="polite">
            {state === "sending" ? "Sending…" : "No payment, no obligation. We reply the same day."}
          </p>
          <button type="submit" disabled={state === "sending"} className="btn btn-ink">
            {state === "sending" ? "Sending" : "Send enquiry"}
            <Arrow className="size-3.5" />
          </button>
        </div>
      </form>
    </div>
  );
}

function TextField({
  id,
  label,
  value,
  onChange,
  error,
  required,
  type = "text",
  inputMode,
  ...rest
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string | undefined;
  required?: boolean | undefined;
  type?: string | undefined;
  inputMode?: "text" | "tel" | "email" | "numeric" | undefined;
  autoComplete?: string | undefined;
  placeholder?: string | undefined;
}) {
  return (
    <div>
      <label htmlFor={id} className="label text-mute">
        {label} {required ? <span className="text-gold-ink">*</span> : null}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        inputMode={inputMode}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        className="field mt-3"
        {...rest}
      />
      {error ? (
        <p id={`${id}-error`} role="alert" className="mt-2 text-sm text-clay">
          {error}
        </p>
      ) : null}
    </div>
  );
}
