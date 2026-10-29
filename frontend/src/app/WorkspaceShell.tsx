import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import type { Session } from "../api";
import { Icon } from "../shared/ui";
import { useResource } from "../shared/useResource";
import { dateLabel, person, words } from "../presentation";
import { navigation, utilities } from "./navigation";
import { PortalMasthead } from "../shared/PortalMasthead";
import { GovAccessibilityBar } from "../shared/GovAccessibilityBar";
import { useCurrentLanguage, t } from "../shared/i18n";

export function WorkspaceShell({
  session,
  route,
  section,
  label,
  onLogout,
  children,
}: {
  session: Session;
  route: string;
  section: string;
  label: string;
  onLogout: () => void;
  children: ReactNode;
}) {
  const [menu, setMenu] = useState(false);
  const [search, setSearch] = useState("");
  const lang = useCurrentLanguage();
  const clock = useResource<{ as_of: string; clock_offset_seconds: number }>(
    "/api/settings",
  );
  useEffect(() => {
    setMenu(false);
  }, [route]);
  const links = (items: ReadonlyArray<readonly [string, string]>) =>
    items.map(([key, name]) => (
      <a
        href={"#/" + key}
        key={key}
        aria-current={section === key ? "page" : undefined}
      >
        <Icon name={key === "transfers" ? "arrow" : key === "dependencies" ? "coordination" : key} />
        <span>{t(name, lang)}</span>
      </a>
    ));
  return (
    <>
      <a
        className="skip-link"
        href="#main-content"
        onClick={(event) => {
          event.preventDefault();
          document.getElementById("main-content")?.focus();
        }}
      >
        Skip to main content
      </a>
      <GovAccessibilityBar />
      <PortalMasthead />
      <div className="portal-body">
      <aside className="app-sidebar" aria-label="Workspace navigation">
        <div className="portal-mobile-nav">
          <span>Officer workspace</span>
          <button className="menu-toggle" aria-expanded={menu}
            aria-controls="workspace-navigation" onClick={() => setMenu(value => !value)}>
            <Icon name="cases" size={16} /> {menu ? "Close menu" : "Menu"}
          </button>
        </div>
        <div
          id="workspace-navigation"
          className={"navigation-area " + (menu ? "is-open" : "")}
          onKeyDown={(event) => {
            if (event.key === "Escape") {
              setMenu(false);
              document
                .querySelector<HTMLButtonElement>(".menu-toggle")
                ?.focus();
            }
          }}
        >
          <nav aria-label="Main navigation">{links(navigation)}</nav>
          <nav className="nav-utilities" aria-label="Tools and help">
            {links(utilities)}
          </nav>
        </div>
      </aside>
      <div className="app-workspace">
        {clock.data && clock.data.clock_offset_seconds !== 0 && (
          <p className="clock-notice">Demo date {dateLabel(clock.data.as_of)} · clock +{clock.data.clock_offset_seconds / 3600}h</p>
        )}
        <header className="app-topbar">
          {section !== "cases" ? (
            <form
              className="workspace-search"
              role="search"
              onSubmit={(event) => {
                event.preventDefault();
                location.hash =
                  "#/cases" +
                  (search.trim()
                    ? "?q=" + encodeURIComponent(search.trim())
                    : "");
              }}
            >
              <label className="visually-hidden" htmlFor="workspace-search">
                Search complaints
              </label>
              <Icon name="search" size={18} />
              <input
                id="workspace-search"
                type="search"
                placeholder={t("Find a complaint or institution", lang)}
                value={search}
                maxLength={200}
                onChange={(event) => setSearch(event.target.value)}
              />
              <button type="submit" aria-label="Search complaints">
                <Icon name="arrow" size={16} />
              </button>
            </form>
          ) : (
            <span className="workspace-breadcrumb">
              Workspace <span>/</span> <strong>{label}</strong>
            </span>
          )}
          <div className="account-menu">
            <span className="account-avatar" aria-hidden="true">
              {person(session.user.display_name)
                .split(" ")
                .slice(0, 2)
                .map((part) => part[0])
                .join("")}
            </span>
            <div>
              <strong>{person(session.user.display_name)}</strong>
              <small>
                {session.user.memberships
                  .map((member) => words(member.role))
                  .join(" · ")}
              </small>
            </div>
            <button className="text-button" onClick={onLogout}>
              {t("Sign out", lang)}
            </button>
          </div>
        </header>
        <main id="main-content" tabIndex={-1} key={route}>
          {children}
          <footer className="page-footer">
            <span>Samanvay · synthetic demonstration</span>
            <a href="#/settings">Help & demo limits</a>
          </footer>
        </main>
      </div>
      </div>
    </>
  );
}
