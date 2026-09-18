import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { apiUrl } from "../lib/api";

function formatRupees(paise) {
  if (paise === undefined || paise === null) return "—";
  return "₹" + (paise / 100).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export default function AmbassadorPage() {
  const { token } = useParams();
  const [state, setState] = useState({ status: "loading", data: null });

  useEffect(() => {
    let cancelled = false;
    fetch(apiUrl(`/api/ambassador/page?token=${encodeURIComponent(token)}`))
      .then((res) => res.json())
      .then((json) => {
        if (cancelled) return;
        if (json.success) {
          setState({ status: "ready", data: json.data });
        } else {
          setState({ status: "invalid", data: null });
        }
      })
      .catch(() => {
        if (!cancelled) setState({ status: "invalid", data: null });
      });
    return () => { cancelled = true; };
  }, [token]);

  if (state.status === "loading") {
    return <div style={{ padding: 24 }}>Loading…</div>;
  }
  if (state.status === "invalid") {
    return <div style={{ padding: 24 }}>This link isn't valid.</div>;
  }

  // Defensive defaults — the backend response is an untyped map; a partial response (e.g. a
  // future backend change omitting a field) should degrade one section, not crash the page.
  const {
    wallet = {},
    conversions = [],
    payoutHistory = [],
    qualificationRules = {},
    leaderboard = [],
    programName
  } = state.data || {};

  return (
    <div style={{ padding: 24, maxWidth: 960, margin: "0 auto" }}>
      <h1>{programName}</h1>

      <section>
        <h2>Wallet</h2>
        <p>Confirmed balance: <strong>{formatRupees(wallet.confirmedBalancePaise)}</strong></p>
        <p>Pending qualification: <strong>{formatRupees(wallet.pendingQualificationPaise)}</strong></p>
        <p>Next payout: <strong>{wallet.nextPayoutDate}</strong></p>
      </section>

      <section>
        <h2>Your referrals</h2>
        <table>
          <thead>
            <tr><th>Referee</th><th>State</th><th>Detected</th><th>Reason</th><th>Amount</th></tr>
          </thead>
          <tbody>
            {conversions.map((c) => (
              <tr key={c.id}>
                <td>{c.refereeMaskedName} {c.refereeMaskedPhone}</td>
                <td>{c.state}</td>
                <td>{c.detectedAt}</td>
                <td>{c.reason || "—"}</td>
                <td>{c.amountPaise != null ? formatRupees(c.amountPaise) : "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section>
        <h2>Payout history</h2>
        <table>
          <thead>
            <tr><th>Period</th><th>Amount</th><th>State</th><th>UTR</th></tr>
          </thead>
          <tbody>
            {payoutHistory.map((p, i) => (
              <tr key={i}>
                <td>{p.periodStart} → {p.periodEnd}</td>
                <td>{formatRupees(p.netPaise)}</td>
                <td>{p.state}</td>
                <td>{p.utr || "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section>
        <h2>Qualification rules</h2>
        <p><em>Version {qualificationRules.version}, effective {qualificationRules.effectiveSince}</em></p>
        <p>{qualificationRules.text || "Rules not yet published."}</p>
      </section>

      <section>
        <h2>Campus leaderboard</h2>
        <ol>
          {leaderboard.map((row, i) => (
            <li key={i}>{row.firstName || "—"} — {row.qualifiedCount} qualified</li>
          ))}
        </ol>
      </section>
    </div>
  );
}
