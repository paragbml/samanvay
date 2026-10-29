import { useState } from "react";
import type { FormEvent } from "react";
import { api } from "../api";
import type { Session } from "../api";
import { Icon } from "../shared/ui";
import { PortalMasthead } from "../shared/PortalMasthead";

export function Login({
  error,
  onLogin,
  onRetry,
}: {
  error: string;
  onLogin: (session: Session) => void;
  onRetry: () => void;
}) {
  const [busy, setBusy] = useState(false),
    [message, setMessage] = useState("");
  const [username, setUsername] = useState(""),
    [password, setPassword] = useState("");
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setMessage("");
    try {
      onLogin(
        await api<Session>("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password }),
        }),
      );
    } catch (error) {
      setMessage((error as Error).message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <>
    <PortalMasthead />
    <div className="login-layout" id="main-content" tabIndex={-1}>
      <section className="login-story">
        <span className="portal-eyebrow"><span /> CONNECTED GOVERNANCE · CLEAR ACCOUNTABILITY</span>
        <h2>
          Separate complaints.
          <br />
          <em>One shared plan.</em>
        </h2>
        <p>
          See the people, evidence and next steps behind every case. Bring teams
          together without losing individual responsibility.
        </p>
        <div
          className="login-connection-example"
          aria-label="Illustration of separate case ownership and shared institution coordination"
        >
          <div className="example-cases">
            <div>
              <Icon name="cases" />
              <strong>Complaint A</strong>
              <span>Its own case officer</span>
            </div>
            <div>
              <Icon name="cases" />
              <strong>Complaint B</strong>
              <span>Its own case officer</span>
            </div>
          </div>
          <div className="example-branches" aria-hidden="true" />
          <div className="example-plan">
            <Icon name="coordination" size={22} />
            <div>
              <strong>A shared institution plan</strong>
              <span>Separate coordination lead</span>
            </div>
            <Icon name="check" size={18} />
          </div>
          <p>Illustration · complaints remain separate records</p>
        </div>
        <div className="login-principles">
          <span>
            <Icon name="check" size={16} /> Original records retained
          </span>
          <span>
            <Icon name="check" size={16} /> Authorised human review
          </span>
        </div>
      </section>
      <section className="login-panel panel padded">
        <span className="login-access-icon"><Icon name="cases" size={24} /></span>
        <span className="portal-eyebrow">OFFICER ACCESS</span>
        <h1 id="page-title" tabIndex={-1}>
          Sign in to your workspace
        </h1>
        <p>Review complaints and keep the next step clear.</p>
        {(error || message) && (
          <div className="validation-errors" role="alert">
            <p>{message || error}</p>
            <button onClick={onRetry}>Retry connection</button>
          </div>
        )}
        <form className="login-form" onSubmit={submit}>
          <label htmlFor="login-username">Email</label>
          <input
            id="login-username"
            type="email"
            autoComplete="username"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <label htmlFor="login-password">Password</label>
          <input
            id="login-password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className="primary" disabled={busy}>
            {busy ? "Signing in…" : "Sign in"}
          </button>
        </form>
        <details className="demo-credentials">
          <summary>Try a demo account</summary>
          <p>
            Choose a role for the SIH walkthrough. Explore saved complaints, shared plans and reports with role-specific actions.
          </p>
          <div className="demo-account-grid">
            {[
              ["rb", "Case officer"],
              ["coordinator", "Coordinator"],
              ["management", "Management"],
              ["supervisor", "Supervisor"],
              ["pgrc", "Grievance officer"],
              ["admin", "Administrator"],
            ].map(([id, label]) => (
              <button
                type="button"
                key={id}
                onClick={() => {
                  setUsername(id + "@demo.test");
                  setPassword("DemoOnly-Stage2!");
                }}
              >
                {label}
              </button>
            ))}
          </div>
          <p className="small">
            Demo accounts have explicit read access to the SIH showcase cases. Role-specific actions remain restricted.
          </p>
        </details>
      </section>
      <p className="login-disclaimer">
        <strong>Student prototype · Demo data</strong>
        <br />
        Built by SIH Team : Unfazed | Problem Statement ID : 26264
      </p>
    </div>
    </>
  );
}
