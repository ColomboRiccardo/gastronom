import { SHIPPING_RATES, SHOP } from "@/lib/shipping/config";

import { absoluteUrl } from "./site";

const ORGANIZATION_ID = () => `${absoluteUrl("/")}/#organization`;
const STORE_ID = () => `${absoluteUrl("/")}/#store`;

const POSTAL_ADDRESS = {
  "@type": "PostalAddress",
  streetAddress: "Via Nuvoloni 13",
  addressLocality: "Sanremo",
  addressRegion: "IM",
  postalCode: "18038",
  addressCountry: "IT",
};

// Mon-Sun 10:00-14:00 / 15:00-20:00 (see home.hours_value)
const OPENING_HOURS = [
  {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
    opens: "10:00",
    closes: "14:00",
  },
  {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
    opens: "15:00",
    closes: "20:00",
  },
];

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": ORGANIZATION_ID(),
    name: "Гастроном",
    alternateName: SHOP.name,
    url: absoluteUrl("/"),
    logo: absoluteUrl("/opengraph-image"),
    telephone: SHOP.phone,
    address: POSTAL_ADDRESS,
  };
}

export function localBusinessJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "GroceryStore",
    "@id": STORE_ID(),
    name: "Гастроном",
    alternateName: `${SHOP.name} Sanremo`,
    description:
      "Eastern European delicatessen in Sanremo: Russian, Ukrainian, Romanian and Slavic food, drinks and crafts.",
    url: absoluteUrl("/"),
    image: absoluteUrl("/hero-shop.jpg"),
    telephone: SHOP.phone,
    address: POSTAL_ADDRESS,
    openingHoursSpecification: OPENING_HOURS,
    priceRange: "€€",
    currenciesAccepted: "EUR",
    paymentAccepted: "Cash, Credit Card",
    parentOrganization: { "@id": ORGANIZATION_ID() },
  };
}

export function webSiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Гастроном",
    url: absoluteUrl("/"),
    inLanguage: ["en", "it", "fr", "ru"],
    publisher: { "@id": ORGANIZATION_ID() },
  };
}

function money(value: number) {
  return { "@type": "MonetaryAmount", value: value.toFixed(2), currency: "EUR" };
}

/**
 * Courier shipping to Italy. Frozen goods cannot travel by courier, so they
 * only advertise in-store pickup.
 */
export function offerShippingDetails(isFrozen: boolean) {
  if (isFrozen) {
    return [
      {
        "@type": "OfferShippingDetails",
        shippingRate: money(SHIPPING_RATES.pickup),
        shippingDestination: { "@type": "DefinedRegion", addressCountry: "IT", addressRegion: "IM" },
        deliveryTime: {
          "@type": "ShippingDeliveryTime",
          handlingTime: { "@type": "QuantitativeValue", minValue: 0, maxValue: 1, unitCode: "DAY" },
          transitTime: { "@type": "QuantitativeValue", minValue: 0, maxValue: 0, unitCode: "DAY" },
        },
      },
    ];
  }

  const transit = {
    "@type": "ShippingDeliveryTime",
    handlingTime: { "@type": "QuantitativeValue", minValue: 0, maxValue: 2, unitCode: "DAY" },
    transitTime: { "@type": "QuantitativeValue", minValue: 1, maxValue: 4, unitCode: "DAY" },
  };

  return [
    {
      "@type": "OfferShippingDetails",
      shippingRate: money(SHIPPING_RATES.courierNorth),
      shippingDestination: {
        "@type": "DefinedRegion",
        addressCountry: "IT",
        addressRegion: [
          "Piemonte", "Valle d'Aosta", "Lombardia", "Liguria", "Veneto",
          "Trentino-Alto Adige", "Friuli-Venezia Giulia", "Emilia-Romagna",
        ],
      },
      deliveryTime: transit,
    },
    {
      "@type": "OfferShippingDetails",
      shippingRate: money(SHIPPING_RATES.courierRest),
      shippingDestination: { "@type": "DefinedRegion", addressCountry: "IT" },
      deliveryTime: transit,
    },
  ];
}

/**
 * Mirrors the Terms page: EU consumers have a 14-day withdrawal right, except
 * for perishable food and goods unsealed after delivery.
 */
export function merchantReturnPolicy() {
  return {
    "@type": "MerchantReturnPolicy",
    applicableCountry: "IT",
    returnPolicyCategory: "https://schema.org/MerchantReturnFiniteReturnWindow",
    merchantReturnDays: 14,
    returnMethod: "https://schema.org/ReturnByMail",
    returnFees: "https://schema.org/ReturnShippingFees",
    itemCondition: "https://schema.org/NewCondition",
  };
}
