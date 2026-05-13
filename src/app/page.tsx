import { AcademyPage } from "@/components/academy-page";
import { siteConfig } from "@/lib/site";

export default function Home() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    name: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "customer support",
        email: siteConfig.email
      }
    ],
    sameAs: []
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <AcademyPage />
    </>
  );
}
