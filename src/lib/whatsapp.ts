const DEFAULT_MESSAGE = `*بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ*

اَلسَّلَامُ عَلَيْكُمْ وَرَحْمَةُ اللهِ وَبَرَكَاتُهُ

I would like to book a free trial class for online Quran learning with Hafiz Kamran.

Please share available class timings and course details.

*جَزَاكَ اللَّهُ خَيْرًا*`;

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
