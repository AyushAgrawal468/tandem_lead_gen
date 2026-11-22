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
      {jsonLd && <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>}
    </Helmet>
  );
}
