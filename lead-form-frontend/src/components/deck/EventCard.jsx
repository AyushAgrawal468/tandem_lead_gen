import { useState } from "react";
import { PosterFallback, SendIcon, CategoryBadge } from "./parts";

// Handoff "EventCard reference", word for word, plus a fallback when the poster fails to load
// ("Poster missing or fails to load" in Edge cases). The share button is left out where there's no onShare.
export function EventCard({ event, desk, onShare, strip, style }) {
  const { title, displayDate, displayPrice, category, tag, posterUrl } = event;
  const [broken, setBroken] = useState(false);
  return (
    <article className="card" style={style} aria-label={`${title}, ${displayDate}, ${displayPrice}`} data-event-card="" data-desk={desk ? "" : undefined}>
      {strip && <div className="card-strip"><span className="avatar">{strip[0]}</span>{strip} is in</div>}
      <div className="card-poster">
        {posterUrl && !broken
          ? <img src={posterUrl} alt="" draggable="false" loading="eager" decoding="async" onError={() => setBroken(true)} />
          : <PosterFallback title={title} category={category} />}
      </div>
      <div className="card-info">
        <div className="card-text">
          <h2 className="card-title">{title}</h2>
          <p className="card-date">{displayDate}</p>
          {displayPrice && <p className="card-price">{displayPrice}</p>}
        </div>
        {onShare && (
          <button className="share-btn" aria-label="Send to a friend"
            onPointerDown={e => e.stopPropagation()} onClick={onShare}>
            <SendIcon />
          </button>
        )}
      </div>
      <CategoryBadge category={category} />
      {tag && <span className="card-tag">{tag}</span>}
    </article>
  );
}
