const DEFAULT_MESSAGE =
  "Assalamu Alaikum, I want to book a free Quran trial class.";

export function buildWhatsAppLink(phone?: string, message: string = DEFAULT_MESSAGE) {
  const base = phone ? `https://wa.me/${phone}` : "https://wa.me/";
  return `${base}?text=${encodeURIComponent(message)}`;
}

export function trackEvent(event: string, payload?: Record<string, unknown>) {
  if (typeof window === "undefined") {
    return;
  }

  const appWindow = window as Window & {
    dataLayer?: Record<string, unknown>[];
    fbq?: (...args: unknown[]) => void;
  };

  if (appWindow.dataLayer) {
    appWindow.dataLayer.push({ event, ...payload });
  }

  if (appWindow.fbq) {
    appWindow.fbq("trackCustom", event, payload);
  }
}

export { DEFAULT_MESSAGE };
