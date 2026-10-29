import { useEffect, useState, useCallback, useRef } from "react";
import {
  INDIAN_LANGUAGES,
  setPortalLanguage,
  useCurrentLanguage,
  translateDOM,
  t,
} from "./i18n";
import type { SupportedLanguage } from "./i18n";

type FontSize = "small" | "normal" | "large" | "xlarge";

export function GovAccessibilityBar() {
  const [fontSize, setFontSize] = useState<FontSize>(() => {
    return (localStorage.getItem("samanvay_font_size") as FontSize) || "normal";
  });
  const [highContrast, setHighContrast] = useState<boolean>(() => {
    return localStorage.getItem("samanvay_high_contrast") === "true";
  });
  const [speaking, setSpeaking] = useState(false);
  const [paused, setPaused] = useState(false);
  const [ttsSupported, setTtsSupported] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const currentLang = useCurrentLanguage();
  const langRef = useRef<HTMLDivElement>(null);
  const voicesLoadedRef = useRef(false);
  const ttsTimeoutRef = useRef<number | null>(null);

  // Sync font size
  useEffect(() => {
    document.documentElement.setAttribute("data-font-size", fontSize);
    localStorage.setItem("samanvay_font_size", fontSize);
  }, [fontSize]);

  // Sync high contrast mode
  useEffect(() => {
    document.documentElement.setAttribute(
      "data-high-contrast",
      highContrast ? "true" : "false"
    );
    localStorage.setItem("samanvay_high_contrast", highContrast ? "true" : "false");
  }, [highContrast]);

  // Translate DOM on initial mount or when language changes
  useEffect(() => {
    if (currentLang !== "en") {
      const timer = setTimeout(() => {
        translateDOM(currentLang);
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [currentLang]);

  // Initialize SpeechSynthesis and voices
  useEffect(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      setTtsSupported(true);
      const loadVoices = () => {
        window.speechSynthesis.getVoices();
        voicesLoadedRef.current = true;
      };
      loadVoices();
      window.speechSynthesis.addEventListener("voiceschanged", loadVoices);
      return () => {
        window.speechSynthesis.removeEventListener("voiceschanged", loadVoices);
        window.speechSynthesis.cancel();
      };
    }
  }, []);

  // Close language dropdown on outside click
  useEffect(() => {
    if (!langOpen) return;
    const handleClick = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [langOpen]);

  // Text-to-Speech logic
  const doSpeak = useCallback(() => {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();

    // Check if user has highlighted text on the screen
    const selection = window.getSelection()?.toString().trim();
    let textToRead = "";

    if (selection && selection.length > 2) {
      textToRead = selection;
    } else {
      // Find main content or active workspace
      const mainEl =
        document.getElementById("main-content") ||
        document.querySelector(".app-workspace") ||
        document.querySelector(".login-layout") ||
        document.body;

      if (mainEl) {
        // Clone and strip headers/utilities/scripts so it doesn't read the buttons
        const clone = mainEl.cloneNode(true) as HTMLElement;
        clone
          .querySelectorAll(
            ".gov-utility-bar, .demo-strip, .visually-hidden, script, style, svg, button"
          )
          .forEach((el) => el.remove());

        const raw = clone.innerText || clone.textContent || "";
        textToRead = raw.replace(/\s+/g, " ").trim();
      }
    }

    if (!textToRead) {
      textToRead = document.title || "Samanvay Grievance Coordination Portal";
    }

    // Prepend page context
    const pageTitle =
      document.querySelector("h1")?.innerText || document.title || "Samanvay";
    const speechIntro =
      currentLang === "hi"
        ? `पृष्ठ: ${pageTitle}। `
        : currentLang === "mr"
        ? `पृष्ठ: ${pageTitle}। `
        : `Page: ${pageTitle}. `;

    const fullText = (speechIntro + textToRead)
      .replace(/https?:\/\/\S+/g, "link")
      .slice(0, 3000);

    // Sentence chunking to prevent Chrome 15-second cutoff bug
    const sentences = fullText.match(/[^.!?।\n]+[.!?।\n]+/g) || [fullText];
    const voices = window.speechSynthesis.getVoices();

    // Voice match for selected language
    const preferredVoice =
      voices.find((v) => v.lang.toLowerCase().startsWith(currentLang)) ||
      voices.find((v) => v.lang.includes("IN") || v.name.includes("India")) ||
      voices.find((v) => v.lang.startsWith("en")) ||
      voices[0];

    let sentenceIndex = 0;
    setSpeaking(true);
    setPaused(false);

    const speakNextSentence = () => {
      if (sentenceIndex >= sentences.length) {
        setSpeaking(false);
        setPaused(false);
        return;
      }

      const chunk = sentences[sentenceIndex++].trim();
      if (!chunk) {
        speakNextSentence();
        return;
      }

      const utterance = new SpeechSynthesisUtterance(chunk);
      if (preferredVoice) utterance.voice = preferredVoice;
      utterance.rate = 0.95;
      utterance.pitch = 1.0;

      utterance.onend = () => {
        speakNextSentence();
      };

      utterance.onerror = (e) => {
        console.warn("Speech synthesis utterance error:", e);
        speakNextSentence();
      };

      window.speechSynthesis.speak(utterance);
    };

    speakNextSentence();
  }, [currentLang]);

  const handleSpeak = useCallback(() => {
    if (!("speechSynthesis" in window)) return;
    const voices = window.speechSynthesis.getVoices();
    if (voices.length === 0 && !voicesLoadedRef.current) {
      const onReady = () => {
        window.speechSynthesis.removeEventListener("voiceschanged", onReady);
        doSpeak();
      };
      window.speechSynthesis.addEventListener("voiceschanged", onReady);
      ttsTimeoutRef.current = window.setTimeout(() => {
        window.speechSynthesis.removeEventListener("voiceschanged", onReady);
        doSpeak();
      }, 300);
    } else {
      doSpeak();
    }
  }, [doSpeak]);

  const handlePause = useCallback(() => {
    if ("speechSynthesis" in window && window.speechSynthesis.speaking) {
      window.speechSynthesis.pause();
      setPaused(true);
    }
  }, []);

  const handleResume = useCallback(() => {
    if ("speechSynthesis" in window && window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
      setPaused(false);
    }
  }, []);

  const handleStop = useCallback(() => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
      setPaused(false);
    }
  }, []);

  const handleSkipToContent = (e: React.MouseEvent) => {
    e.preventDefault();
    const main = document.getElementById("main-content");
    if (main) {
      main.setAttribute("tabindex", "-1");
      main.focus();
      main.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleLangSelect = (code: SupportedLanguage) => {
    setPortalLanguage(code);
    setLangOpen(false);
  };

  const currentOption =
    INDIAN_LANGUAGES.find((l) => l.code === currentLang) || INDIAN_LANGUAGES[0];

  return (
    <aside
      className="gov-utility-bar"
      role="region"
      aria-label="Government of India Accessibility Bar"
    >
      <div className="gov-tricolor" aria-hidden="true">
        <span className="saffron" />
        <span className="white" />
        <span className="green" />
      </div>
      <div className="gov-bar-content">
        <div className="gov-identity">
          <div className="gov-titles">
            <a className="gov-org" href="https://www.india.gov.in/" target="_blank" rel="noopener noreferrer" aria-label="Government of India — opens in a new tab">
              {currentLang === "hi" || currentLang === "mr"
                ? "भारत सरकार | Government of India"
                : "भारत सरकार | Government of India"}
              <span aria-hidden="true"> ↗</span>
            </a>
            <span className="gov-dept">
              {currentLang === "hi" || currentLang === "mr"
                ? "अखिल भारतीय तकनीकी शिक्षा परिषद (AICTE) · समन्वय पोर्टल"
                : "अखिल भारतीय तकनीकी शिक्षा परिषद | All India Council for Technical Education (AICTE)"}
            </span>
          </div>
        </div>

        <div className="gov-accessibility-controls">
          <a
            href="#main-content"
            className="gov-skip-link"
            onClick={handleSkipToContent}
          >
            {t("Skip to main content", currentLang)}
          </a>

          <div
            className="gov-control-group"
            role="group"
            aria-label="Text Size Controls"
          >
            <span className="gov-label" aria-hidden="true">
              {currentLang === "hi" ? "अक्षर:" : currentLang === "mr" ? "मजकूर:" : "Text:"}
            </span>
            <button
              type="button"
              className={`gov-btn ${fontSize === "small" ? "active" : ""}`}
              onClick={() => setFontSize("small")}
              aria-label="Decrease text size (A-)"
              title="Decrease text size (90%)"
            >
              A-
            </button>
            <button
              type="button"
              className={`gov-btn ${fontSize === "normal" ? "active" : ""}`}
              onClick={() => setFontSize("normal")}
              aria-label="Normal text size (A)"
              title="Default text size (100%)"
            >
              A
            </button>
            <button
              type="button"
              className={`gov-btn ${fontSize === "large" ? "active" : ""}`}
              onClick={() => setFontSize("large")}
              aria-label="Increase text size (A+)"
              title="Large text size (115%)"
            >
              A+
            </button>
            <button
              type="button"
              className={`gov-btn ${fontSize === "xlarge" ? "active" : ""}`}
              onClick={() => setFontSize("xlarge")}
              aria-label="Maximum text size (A++)"
              title="Extra large text size (130%)"
            >
              A++
            </button>
          </div>

          <div
            className="gov-control-group"
            role="group"
            aria-label="Contrast Mode"
          >
            <button
              type="button"
              className={`gov-btn contrast-toggle ${highContrast ? "active" : ""}`}
              onClick={() => setHighContrast((prev) => !prev)}
              aria-label={
                highContrast
                  ? "Switch to standard contrast view"
                  : "Switch to high contrast view"
              }
              title={
                highContrast ? "Standard contrast" : "High contrast mode (WCAG AAA)"
              }
            >
              <span className="contrast-icon" aria-hidden="true">
                ◑
              </span>
              <span>
                {highContrast
                  ? t("Standard", currentLang)
                  : t("High Contrast", currentLang)}
              </span>
            </button>
          </div>

          {ttsSupported && (
            <div
              className="gov-control-group tts-group"
              role="group"
              aria-label="Screen Reader / Text-to-Speech"
            >
              {!speaking ? (
                <button
                  type="button"
                  className="gov-btn tts-btn"
                  onClick={handleSpeak}
                  aria-label="Listen to page audio with Text-to-Speech"
                  title="Text-to-Speech / Screen Reader"
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                    <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
                    <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                  </svg>
                  <span>{t("Listen", currentLang)}</span>
                </button>
              ) : (
                <div className="tts-active-controls">
                  <span className="tts-pulse" aria-hidden="true">
                    <span className="wave" />
                    <span className="wave" />
                    <span className="wave" />
                  </span>
                  {paused ? (
                    <button
                      type="button"
                      className="gov-btn tts-sub-btn"
                      onClick={handleResume}
                      aria-label="Resume speech audio"
                      title="Resume"
                    >
                      {t("Resume", currentLang)}
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="gov-btn tts-sub-btn"
                      onClick={handlePause}
                      aria-label="Pause speech audio"
                      title="Pause"
                    >
                      {t("Pause", currentLang)}
                    </button>
                  )}
                  <button
                    type="button"
                    className="gov-btn tts-sub-btn stop"
                    onClick={handleStop}
                    aria-label="Stop speech audio"
                    title="Stop"
                  >
                    {t("Stop", currentLang)}
                  </button>
                </div>
              )}
            </div>
          )}

          <div className="gov-lang-selector" ref={langRef}>
            <button
              type="button"
              className="gov-btn lang-toggle"
              onClick={() => setLangOpen((prev) => !prev)}
              aria-expanded={langOpen}
              aria-haspopup="listbox"
              title="Select Language"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="2" y1="12" x2="22" y2="12" />
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
              </svg>
              <span>{currentOption.native}</span>
              <svg
                width="10"
                height="10"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
                className={`lang-chevron ${langOpen ? "open" : ""}`}
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>
            {langOpen && (
              <div
                className="lang-dropdown"
                role="listbox"
                aria-label="Language selection"
              >
                {INDIAN_LANGUAGES.map((lang) => (
                  <button
                    key={lang.code}
                    type="button"
                    role="option"
                    className={`lang-option ${
                      lang.code === currentLang ? "selected" : ""
                    }`}
                    aria-selected={lang.code === currentLang}
                    onClick={() => handleLangSelect(lang.code)}
                  >
                    <span className="lang-native">{lang.native}</span>
                    <span className="lang-english">{lang.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
}
