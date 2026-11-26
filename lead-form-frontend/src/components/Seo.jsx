import React from "react";
import { Helmet } from "react-helmet";

// Canonical host for every page, even when served from demo (which is noindex at nginx anyway)
export const SITE = "https://tandem.it.com";

/** Snapshot rule 4: every page renders its own title, description, canonical, Open Graph and JSON-LD. */
export default function Seo({ title, description, path, noindex = false, jsonLd }) {
  const url = `${SITE}${path}`;
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      {noindex ? <meta name="robots" content="noindex" /> : <link rel="canonical" href={url} />}
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="Tandem" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      {/* Default link preview (canvas J3-41); shared event links get their own from Spring's link preview */}
      <meta property="og:image" content={`${SITE}/og-default.png`} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content="Tandem: Swipe on plans. Match with friends." />
      <meta name="twitter:card" content="summary_large_image" />
      {jsonLd && <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>}
    </Helmet>
  );
}
