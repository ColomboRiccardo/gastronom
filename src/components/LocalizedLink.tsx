"use client";

import NextLink from "next/link";
import type { ComponentProps } from "react";

import { useLanguage } from "@/context/LanguageContext";
import { localizeHref } from "@/lib/i18n/locale-path";

type Props = ComponentProps<typeof NextLink>;

/**
 * Drop-in replacement for next/link that keeps visitors inside the current
 * language: "/products" becomes "/it/products" when Italian is active.
 * External URLs, API routes and static files pass through untouched.
 */
export default function LocalizedLink({ href, ...rest }: Props) {
  const { language } = useLanguage();
  const localized = typeof href === "string" ? localizeHref(href, language) : href;
  return <NextLink href={localized} {...rest} />;
}
