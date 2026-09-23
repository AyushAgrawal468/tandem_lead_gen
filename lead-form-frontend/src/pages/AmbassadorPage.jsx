import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { apiUrl } from "../lib/api";

const pageWrapper = {
  minHeight: "100vh",
  background: "#111111",
  color: "#F2F2F2",
  fontFamily: '"Anek Latin", Helvetica, sans-serif',
};

const container = {
  maxWidth: "860px",
  margin: "0 auto",
  padding: "clamp(24px, 5vw, 60px) clamp(16px, 4vw, 40px) 80px",
};

const h1Style = {
  fontSize: "clamp(28px, 4vw, 42px)",
  fontWeight: "700",
  marginBottom: "36px",
  color: "#F2F2F2",
};

const sectionHeading = {
  marginTop: "36px",
  marginBottom: "12px",
  fontSize: "clamp(17px, 2.2vw, 22px)",
  fontWeight: "700",
  color: "#00FFC8",
  letterSpacing: "0.01em",
};

const bodyText = {
  fontSize: "clamp(14px, 1.8vw, 17px)",
  lineHeight: "1.8",
  color: "#BCBCBC",
};

const strongStyle = { color: "#F2F2F2" };

const tableWrapper = { overflowX: "auto", marginTop: "8px" };

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
  fontSize: "14px",
  minWidth: "480px",
};

const thStyle = {
  textAlign: "left",
  padding: "10px",
  borderBottom: "1px solid #2a2a2a",
  color: "#F2F2F2",
  whiteSpace: "nowrap",
};

const tdStyle = {
  padding: "10px",
  borderBottom: "1px solid #2a2a2a",
  color: "#BCBCBC",
};

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
    return (
      <div style={{ ...pageWrapper, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={bodyText}>Loading…</p>
      </div>
    );
  }
  if (state.status === "invalid") {
    return (
      <div style={{ ...pageWrapper, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={bodyText}>This link isn't valid.</p>
      </div>
    );
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
    <div style={pageWrapper}>
      <div style={container}>
        <h1 style={h1Style}>{programName}</h1>

        <section>
          <h2 style={sectionHeading}>Wallet</h2>
          <p style={bodyText}>Confirmed balance: <strong style={strongStyle}>{formatRupees(wallet.confirmedBalancePaise)}</strong></p>
          <p style={bodyText}>Pending qualification: <strong style={strongStyle}>{formatRupees(wallet.pendingQualificationPaise)}</strong></p>
          <p style={bodyText}>Next payout: <strong style={strongStyle}>{wallet.nextPayoutDate}</strong></p>
        </section>

        <section>
          <h2 style={sectionHeading}>Your referrals</h2>
          <div style={tableWrapper}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Referee</th>
                  <th style={thStyle}>State</th>
                  <th style={thStyle}>Detected</th>
                  <th style={thStyle}>Reason</th>
                  <th style={thStyle}>Amount</th>
                </tr>
              </thead>
              <tbody>
                {conversions.map((c) => (
                  <tr key={c.id}>
                    <td style={tdStyle}>{c.refereeMaskedName} {c.refereeMaskedPhone}</td>
                    <td style={tdStyle}>{c.state}</td>
                    <td style={tdStyle}>{c.detectedAt}</td>
                    <td style={tdStyle}>{c.reason || "—"}</td>
                    <td style={tdStyle}>{c.amountPaise != null ? formatRupees(c.amountPaise) : "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2 style={sectionHeading}>Payout history</h2>
          <div style={tableWrapper}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Period</th>
                  <th style={thStyle}>Amount</th>
                  <th style={thStyle}>State</th>
                  <th style={thStyle}>UTR</th>
                </tr>
              </thead>
              <tbody>
                {payoutHistory.map((p, i) => (
                  <tr key={i}>
                    <td style={tdStyle}>{p.periodStart} → {p.periodEnd}</td>
                    <td style={tdStyle}>{formatRupees(p.netPaise)}</td>
                    <td style={tdStyle}>{p.state}</td>
                    <td style={tdStyle}>{p.utr || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2 style={sectionHeading}>Qualification rules</h2>
          <p style={{ ...bodyText, fontStyle: "italic", color: "#969696" }}>
            Version {qualificationRules.version}, effective {qualificationRules.effectiveSince}
          </p>
          <p style={bodyText}>{qualificationRules.text || "Rules not yet published."}</p>
        </section>

        <section>
          <h2 style={sectionHeading}>Campus leaderboard</h2>
          <ol style={{ ...bodyText, paddingLeft: "20px" }}>
            {leaderboard.map((row, i) => (
              <li key={i} style={{ marginBottom: "6px" }}>{row.firstName || "—"} — {row.qualifiedCount} qualified</li>
            ))}
          </ol>
        </section>
      </div>
    </div>
  );
}
