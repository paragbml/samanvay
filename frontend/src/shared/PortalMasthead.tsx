import { Brand } from "./Brand";

export function PortalMasthead() {
  return (
    <header className="portal-masthead">
      <div className="council-identity">
        <a className="national-emblem-link" href="https://www.india.gov.in/" target="_blank" rel="noopener noreferrer" aria-label="Government of India — opens in a new tab">
          <img className="national-emblem" src="/brand/national-emblem.svg" alt="State Emblem of India — Lion Capital of Ashoka" width="42" height="64" />
        </a>
        <img src="/brand/aicte-logo.webp" alt="AICTE" width="64" height="64" />
        <div>
          <span lang="hi">अखिल भारतीय तकनीकी शिक्षा परिषद</span>
          <strong>All India Council for Technical Education</strong>
          <small>Cross-Bureau Complaint Coordination</small>
        </div>
      </div>
      <a className="brand" href="#/overview" aria-label="Samanvay home"><Brand /></a>
    </header>
  );
}
