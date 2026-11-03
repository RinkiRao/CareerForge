import { useCallback, useEffect, useRef, useState } from "react";
import {
  BrainCircuit,
  ChevronDown,
  History,
  Mic,
  Pause,
  Radio,
  Repeat,
  Square,
  Trash2,
} from "lucide-react";
import "./MiraVoiceGuide.css";

const API_BASE_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:5000"
).replace(/\/+$/, "");

const LANGUAGES = {
  hi: { locale: "hi-IN", label: "Hindi", native: "हिन्दी" },
  en: { locale: "en-IN", label: "English", native: "English" },
  es: { locale: "es-ES", label: "Spanish", native: "Español" },
  fr: { locale: "fr-FR", label: "French", native: "Français" },
  de: { locale: "de-DE", label: "German", native: "Deutsch" },
  ja: { locale: "ja-JP", label: "Japanese", native: "日本語" },
  zh: { locale: "zh-CN", label: "Mandarin Chinese", native: "简体中文" },
  ar: { locale: "ar-SA", label: "Arabic", native: "العربية" },
  pt: { locale: "pt-BR", label: "Portuguese", native: "Português" },
  bn: { locale: "bn-IN", label: "Bengali", native: "বাংলা" },
  ta: { locale: "ta-IN", label: "Tamil", native: "தமிழ்" },
  te: { locale: "te-IN", label: "Telugu", native: "తెలుగు" },
  mr: { locale: "mr-IN", label: "Marathi", native: "मराठी" },
  ur: { locale: "ur-PK", label: "Urdu", native: "اردو" },
  ko: { locale: "ko-KR", label: "Korean", native: "한국어" },
};

const LANGUAGE_ENTRIES = Object.entries(LANGUAGES);
const WAKE_ACKNOWLEDGEMENTS = {
  en: "Yes, I'm listening. How can I help you?",
  hi: "हाँ, मैं सुन रही हूँ। मैं आपकी क्या मदद कर सकती हूँ?",
  es: "Sí, te escucho. ¿Cómo puedo ayudarte?",
  fr: "Oui, je vous écoute. Comment puis-je vous aider ?",
  de: "Ja, ich höre zu. Wie kann ich dir helfen?",
  ja: "はい、お聞きしています。どのようにお手伝いできますか？",
  zh: "我在听。请问有什么可以帮您？",
  ar: "نعم، أنا أستمع. كيف يمكنني مساعدتك؟",
  pt: "Sim, estou ouvindo. Como posso ajudar?",
  bn: "হ্যাঁ, আমি শুনছি। কীভাবে সাহায্য করতে পারি?",
  ta: "ஆம், நான் கேட்கிறேன். நான் எப்படி உதவலாம்?",
  te: "అవును, నేను వింటున్నాను. నేను ఎలా సహాయపడగలను?",
  mr: "हो, मी ऐकत आहे. मी तुम्हाला कशी मदत करू?",
  ur: "جی ہاں، میں سن رہی ہوں۔ میں آپ کی کیا مدد کر سکتی ہوں؟",
  ko: "네, 듣고 있어요. 무엇을 도와드릴까요?",
};

function getStudentToken() {
  return localStorage.getItem("careerforge_student_token");
}

function getRecognitionConstructor() {
  if (typeof window === "undefined") return null;
  return window.SpeechRecognition || window.webkitSpeechRecognition || null;
}

async function prepareOnDeviceRecognition(Recognition, locale, onPreparing) {
  if (
    typeof Recognition?.available !== "function" ||
    typeof Recognition?.install !== "function"
  ) {
    return false;
  }

  try {
    let availability = await Recognition.available({
      langs: [locale],
      processLocally: true,
    });
    if (availability === "downloadable") {
      onPreparing();
      const installed = await Recognition.install({ langs: [locale] });
      if (!installed) return false;
      availability = await Recognition.available({
        langs: [locale],
        processLocally: true,
      });
    }

    return availability === "available";
  } catch {
    return false;
  }
}

function normalizeLanguage(language) {
  const normalized = String(language || "").trim().toLowerCase();
  const code = normalized.split("-")[0];
  if (LANGUAGES[code]) return code;
  return LANGUAGE_ENTRIES.find(
    ([, option]) => option.label.toLowerCase() === normalized || option.native.toLowerCase() === normalized
  )?.[0] || "en";
}

function getSavedConversations(memory) {
  if (Array.isArray(memory?.conversations) && memory.conversations.length) {
    return [...memory.conversations].sort(
      (left, right) =>
        new Date(right.timestamp || right.userMessage?.timestamp || 0) -
        new Date(left.timestamp || left.userMessage?.timestamp || 0)
    );
  }

  const messages = Array.isArray(memory?.messages) ? memory.messages : [];
  const conversations = [];
  for (let index = 0; index < messages.length - 1; index += 1) {
    const userMessage = messages[index];
    const assistantMessage = messages[index + 1];
    if (userMessage.role === "user" && assistantMessage.role === "assistant") {
      conversations.push({
        id: `legacy-${index}`,
        timestamp: userMessage.timestamp,
        userMessage,
        assistantMessage,
      });
      index += 1;
    }
  }
  return conversations.reverse();
}

function formatMemoryDate(value) {
  const date = value ? new Date(value) : null;
  return date && !Number.isNaN(date.getTime())
    ? date.toLocaleString()
    : "Date unavailable";
}

function getRecognitionError(error, { onDeviceRecognitionAvailable = false } = {}) {
  switch (error) {
    case "not-allowed":
    case "service-not-allowed":
      return {
        status: "permissionDenied",
        detail: "Microphone permission was denied. Allow microphone access in browser settings and retry.",
      };
    case "audio-capture":
      return {
        status: "microphoneUnavailable",
        detail: "No usable microphone was found. Check the microphone connection and retry.",
      };
    case "network":
      return {
        status: "networkError",
        detail: onDeviceRecognitionAvailable
          ? "The browser's on-device speech recognizer could not process this audio. No transcript was produced; check the microphone and retry."
          : /Electron/i.test(navigator.userAgent)
            ? "Microphone access is working, but this embedded browser's online speech-recognition service returned a network error. It has no on-device language pack available for this language. Open MIRA in a supported full browser with speech recognition access and retry."
            : "Microphone access is working, but the browser's online speech-recognition service returned a network error. No transcript was produced. Check the browser's network/service access and retry.",
      };
    case "no-speech":
      return {
        status: "noSpeech",
        detail: "No speech was detected. Try again and speak after listening starts.",
      };
    default:
      return {
        status: "speechError",
        detail: `Browser speech recognition failed${error ? ` (${error})` : ""}.`,
      };
  }
}

function findSpeechVoice(voices, language) {
  const { locale } = LANGUAGES[language];
  const exactLocale = locale.toLowerCase();
  const languageVoices = voices.filter((voice) => {
    const voiceLocale = voice.lang?.toLowerCase();
    if (!voiceLocale || voiceLocale.split("-")[0] !== language) return false;
    if (language === "zh") return !voiceLocale.startsWith("zh-hk");
    return true;
  });
  return (
    languageVoices.find((voice) => voice.lang.toLowerCase() === exactLocale) ||
    languageVoices[0] ||
    null
  );
}

export default function MiraVoiceGuide({ profile, pageContext, onNavigate }) {
  const [language, setLanguage] = useState(normalizeLanguage(profile?.language));
  const [status, setStatus] = useState("idle");
  const [isBusy, setIsBusy] = useState(false);
  const [statusDetail, setStatusDetail] = useState("");
  const [wakeEnabled, setWakeEnabled] = useState(false);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [lastResponse, setLastResponse] = useState("");
  const [reviewedConversations, setReviewedConversations] = useState(null);
  const [voices, setVoices] = useState([]);
  const [languageMenuOpen, setLanguageMenuOpen] = useState(false);
  const [languageSearch, setLanguageSearch] = useState("");
  const recognitionRef = useRef(null);
  const wakeEnabledRef = useRef(false);
  const mountedRef = useRef(false);
  const operationRef = useRef(0);
  const requestControllerRef = useRef(null);
  const busyRef = useRef(false);
  const recognitionStartingRef = useRef(false);
  const recognitionTimerRef = useRef(null);
  const utteranceRef = useRef(null);
  const startListeningRef = useRef(null);
  const languageSelectorRef = useRef(null);
  const selectedLanguage = LANGUAGES[language];
  const filteredLanguages = LANGUAGE_ENTRIES.filter(([code, option]) =>
    `${option.label} ${option.native} ${option.locale} ${code}`
      .toLocaleLowerCase()
      .includes(languageSearch.trim().toLocaleLowerCase())
  );

  const setBusy = useCallback((value) => {
    busyRef.current = value;
    setIsBusy(value);
  }, []);

  const statusLabels = {
    idle: "Microphone off",
    requestingPermission: "Requesting microphone permission",
    preparingRecognition: "Preparing speech recognition",
    listeningQuestion: "Listening for your question",
    listeningWake: "Listening for wake word",
    processing: "Processing with CareerForge AI",
    speaking: "Speaking",
    paused: "Paused",
    noSpeech: "No speech detected",
    permissionDenied: "Microphone permission denied",
    microphoneUnavailable: "Microphone unavailable",
    speechError: "Speech recognition error",
    networkError: "Speech recognition service network error",
    browserUnsupported: "Browser speech recognition unsupported",
    voiceUnavailable: "Selected language voice unavailable",
    synthesisUnsupported: "Speech synthesis unsupported",
    authenticationRequired: "Student sign-in required",
    aiUnavailable: "CareerForge AI unavailable",
  };

  const stopRecognition = useCallback(() => {
    if (recognitionTimerRef.current) {
      window.clearTimeout(recognitionTimerRef.current);
      recognitionTimerRef.current = null;
    }
    const recognition = recognitionRef.current;
    recognitionRef.current = null;
    recognitionStartingRef.current = false;
    if (recognition) {
      recognition.onresult = null;
      recognition.onerror = null;
      recognition.onend = null;
      try {
        recognition.abort();
      } catch {
        recognition.stop();
      }
    }
  }, []);

  const speak = useCallback(
    (text, requestId = operationRef.current) =>
      new Promise((resolve) => {
        if (
          !text ||
          !mountedRef.current ||
          requestId !== operationRef.current ||
          !("speechSynthesis" in window) ||
          typeof window.SpeechSynthesisUtterance !== "function"
        ) {
          setStatus("synthesisUnsupported");
          setStatusDetail("Spoken responses are not supported by this browser. You can still read MIRA's text response.");
          resolve(false);
          return;
        }

        const voice = findSpeechVoice(voices, language);
        if (!voice) {
          setStatus("voiceUnavailable");
          setStatusDetail(`No ${selectedLanguage.label} speech voice is available in this browser. MIRA's text response is still available.`);
          resolve(false);
          return;
        }

        window.speechSynthesis.cancel();
        const utterance = new window.SpeechSynthesisUtterance(text);
        utterance.lang = LANGUAGES[language].locale;
        utterance.voice = voice;
        utterance.rate = 1;
        utterance.pitch = 1;
        utteranceRef.current = utterance;
        let settled = false;
        const finish = (played) => {
          if (settled) return;
          settled = true;
          if (utteranceRef.current === utterance) utteranceRef.current = null;
          resolve(played);
        };
        utterance.onstart = () => {
          if (requestId === operationRef.current) setStatus("speaking");
        };
        utterance.onend = () => {
          if (requestId === operationRef.current) {
            setStatus("idle");
          }
          finish(true);
        };
        utterance.onerror = (event) => {
          if (requestId === operationRef.current) {
            setStatus("speechError");
            setStatusDetail(event.error || "Browser speech synthesis could not play this response.");
          }
          finish(false);
        };
        try {
          window.speechSynthesis.speak(utterance);
        } catch (error) {
          setStatus("speechError");
          setStatusDetail(error.message || "Unable to start spoken playback.");
          finish(false);
        }
      }),
    [language, selectedLanguage.label, voices]
  );

  const sendQuestion = useCallback(
    async (rawText) => {
      const cleanText = String(rawText || "").trim();
      if (!cleanText || busyRef.current || !mountedRef.current) return;
      setQuestion(cleanText);
      setAnswer("");
      setStatusDetail("");
      setStatus("processing");
      setBusy(true);
      const requestId = ++operationRef.current;

      const navigationRequest = cleanText
        .toLowerCase()
        .match(/^(?:open|go to|navigate to)\s+(?:the\s+)?(.+)$/);
      const destination = navigationRequest?.[1] || "";
      const navigationTargets = [
        { page: "learning", match: /\b(learn|learning|course|courses)\b/ },
        { page: "jobs", match: /\b(jobs?|internships?)\b/ },
        { page: "profile", match: /\bprofile\b/ },
        { page: "projects", match: /\bprojects?\b/ },
        { page: "dsa", match: /\b(coding|practice|dsa)\b/ },
        { page: "assessments", match: /\b(assessments?|tests?)\b/ },
        { page: "applications", match: /\bapplications?\b/ },
        { page: "achievements", match: /\bachievements?\b/ },
        { page: "overview", match: /\b(dashboard|overview)\b/ },
      ];
      const target = navigationTargets.find((item) => item.match.test(destination));
      if (target && onNavigate) {
        onNavigate(target.page);
        const navReply =
          language === "hi"
            ? "ठीक है, मैं वह सेक्शन खोल रहा हूँ।"
            : `Opening ${target.page === "dsa" ? "coding practice" : target.page}.`;
        setAnswer(navReply);
        setLastResponse(navReply);
        setBusy(false);
        await speak(navReply, requestId);
        return;
      }

      const token = getStudentToken();
      if (!token) {
        setBusy(false);
        wakeEnabledRef.current = false;
        setWakeEnabled(false);
        setStatus("authenticationRequired");
        setStatusDetail("Sign in with a student account to ask MIRA by voice.");
        return;
      }

      const controller = new AbortController();
      requestControllerRef.current = controller;
      const conversationId =
        window.crypto?.randomUUID?.() ||
        `${Date.now()}-${Math.random().toString(36).slice(2)}`;
      try {
        const response = await fetch(`${API_BASE_URL}/api/ai/voice`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            message: cleanText,
            conversationId,
            preferredLanguage: language,
            pageContext: `${window.location.pathname} — ${pageContext}`,
          }),
          signal: controller.signal,
        });
        const data = await response.json().catch(() => ({}));
        if (!mountedRef.current || requestId !== operationRef.current) return;
        if (!response.ok || typeof data.reply !== "string" || !data.reply.trim()) {
          const error = new Error(data.message || "CareerForge AI could not answer.");
          error.status = response.status;
          throw error;
        }
        const actualReply = data.reply.trim();
        setAnswer(actualReply);
        setLastResponse(actualReply);
        setBusy(false);
        setStatus("idle");
        const speechPlayed = await speak(actualReply, requestId);
        if (wakeEnabledRef.current) {
          if (speechPlayed) {
            startListeningRef.current?.("wake");
          } else {
            wakeEnabledRef.current = false;
            setWakeEnabled(false);
          }
        }
      } catch (error) {
        if (
          !mountedRef.current ||
          requestId !== operationRef.current ||
          error.name === "AbortError"
        ) {
          return;
        }
        setBusy(false);
        setStatus(
          error.status === 401 || error.status === 403
            ? "authenticationRequired"
            : error.status === 429
              ? "aiUnavailable"
              : "aiUnavailable"
        );
        wakeEnabledRef.current = false;
        setWakeEnabled(false);
        setStatusDetail(error.message || "CareerForge AI is unavailable. Please try again later.");
      } finally {
        if (requestControllerRef.current === controller) {
          requestControllerRef.current = null;
        }
      }
    },
    [language, onNavigate, pageContext, setBusy, speak]
  );

  const requestMicrophone = useCallback(async () => {
    if (
      !navigator.mediaDevices?.getUserMedia ||
      !window.isSecureContext
    ) {
      const error = new Error("Microphone access requires HTTPS or localhost and browser getUserMedia support.");
      error.name = "NotSupportedError";
      throw error;
    }
    setStatus("requestingPermission");
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const hasAudioTrack = stream.getAudioTracks().some((track) => track.readyState === "live");
    stream.getTracks().forEach((track) => track.stop());
    if (!hasAudioTrack) {
      const error = new Error("No live microphone audio track was found.");
      error.name = "NotFoundError";
      throw error;
    }
  }, []);

  const startListening = useCallback(
    async (mode = "once") => {
      if (!mountedRef.current || busyRef.current || recognitionStartingRef.current) return;
      const Recognition = getRecognitionConstructor();
      if (!Recognition) {
        setStatus("browserUnsupported");
        setStatusDetail("This browser does not support SpeechRecognition. Voice input is unavailable in this browser.");
        setWakeEnabled(false);
        wakeEnabledRef.current = false;
        return;
      }

      const requestId = ++operationRef.current;
      stopRecognition();
      recognitionStartingRef.current = true;
      try {
        const useOnDeviceRecognition = await prepareOnDeviceRecognition(
          Recognition,
          LANGUAGES[language].locale,
          () => {
            if (requestId === operationRef.current) {
              setStatus("preparingRecognition");
              setStatusDetail(
                `Preparing the browser's on-device ${LANGUAGES[language].label} speech pack.`
              );
            }
          }
        );
        if (!mountedRef.current || requestId !== operationRef.current) return;
        await requestMicrophone();
        if (!mountedRef.current || requestId !== operationRef.current) return;
        const recognition = new Recognition();
        recognition.lang = LANGUAGES[language].locale;
        if ("processLocally" in recognition) {
          recognition.processLocally = useOnDeviceRecognition;
        }
        recognition.continuous = mode === "wake";
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;
        recognitionRef.current = recognition;

        recognition.onstart = () => {
          recognitionStartingRef.current = false;
          if (requestId === operationRef.current) {
            setStatus(mode === "wake" ? "listeningWake" : "listeningQuestion");
            setStatusDetail("");
          }
        };
        recognition.onresult = async (event) => {
          if (!mountedRef.current || requestId !== operationRef.current) return;
          const transcript = event.results?.[event.results.length - 1]?.[0]?.transcript?.trim();
          if (!transcript) return;
          if (mode === "wake") {
            const wakePattern = /(?:\bhey\s+)?\bmira\b|(?:हे\s*)?मीरा|मिरा/i;
            const match = wakePattern.exec(transcript);
            if (!match) return;
            setBusy(true);
            stopRecognition();
            const remainingQuestion = transcript
              .slice(match.index + match[0].length)
              .replace(/^[\s,.:;!?-]+/, "")
              .trim();
            const acknowledgement = WAKE_ACKNOWLEDGEMENTS[language];
            setBusy(false);
            const acknowledged = await speak(acknowledgement, requestId);
            if (requestId !== operationRef.current || !mountedRef.current) return;
            if (remainingQuestion) {
              await sendQuestion(remainingQuestion);
            } else if (acknowledged && wakeEnabledRef.current) {
              await startListeningRef.current?.("once");
            } else if (!acknowledged) {
              wakeEnabledRef.current = false;
              setWakeEnabled(false);
            }
            return;
          }
          stopRecognition();
          await sendQuestion(transcript);
        };
        recognition.onerror = (event) => {
          if (!mountedRef.current || requestId !== operationRef.current) return;
          recognitionStartingRef.current = false;
          const failure = getRecognitionError(event.error, {
            onDeviceRecognitionAvailable: useOnDeviceRecognition,
          });
          setStatus(failure.status);
          setStatusDetail(failure.detail);
          if (event.error !== "no-speech") {
            wakeEnabledRef.current = false;
            setWakeEnabled(false);
          }
          if (mode === "wake" && event.error === "no-speech") {
            setStatus("listeningWake");
            setStatusDetail("");
          }
        };
        recognition.onend = () => {
          recognitionStartingRef.current = false;
          if (recognitionRef.current === recognition) recognitionRef.current = null;
          if (
            mountedRef.current &&
            (mode === "wake" || mode === "once") &&
            wakeEnabledRef.current &&
            !busyRef.current &&
            requestId === operationRef.current &&
            document.visibilityState === "visible"
          ) {
            recognitionTimerRef.current = window.setTimeout(
              () => startListeningRef.current?.("wake"),
              700
            );
          }
        };
        recognition.start();
      } catch (error) {
        recognitionStartingRef.current = false;
        if (!mountedRef.current || requestId !== operationRef.current) return;
        if (mode === "wake") {
          wakeEnabledRef.current = false;
          setWakeEnabled(false);
        }
        if (error.name === "NotAllowedError" || error.name === "PermissionDeniedError") {
          setStatus("permissionDenied");
          setStatusDetail("Microphone permission was denied. Allow access in browser settings, then retry.");
        } else if (error.name === "NotFoundError" || error.name === "NotReadableError") {
          setStatus("microphoneUnavailable");
          setStatusDetail(error.message || "The microphone is unavailable.");
        } else if (error.name === "NotSupportedError") {
          setStatus("browserUnsupported");
          setStatusDetail(error.message);
        } else {
          setStatus("speechError");
          setStatusDetail(error.message || "Unable to start browser speech recognition.");
        }
      }
    },
    [language, requestMicrophone, sendQuestion, setBusy, speak, stopRecognition]
  );

  useEffect(() => {
    startListeningRef.current = startListening;
  }, [startListening]);

  const enableWakeWord = useCallback(async () => {
    if (!getRecognitionConstructor()) {
      await startListening("wake");
      return;
    }
    wakeEnabledRef.current = true;
    setWakeEnabled(true);
    await startListening("wake");
  }, [startListening]);

  const pauseWakeWord = useCallback(() => {
    wakeEnabledRef.current = false;
    setWakeEnabled(false);
    stopRecognition();
    setStatus("paused");
    setStatusDetail("");
  }, [stopRecognition]);

  const stopAll = useCallback(() => {
    operationRef.current += 1;
    wakeEnabledRef.current = false;
    setWakeEnabled(false);
    setBusy(false);
    requestControllerRef.current?.abort();
    requestControllerRef.current = null;
    stopRecognition();
    if ("speechSynthesis" in window) window.speechSynthesis.cancel();
    utteranceRef.current = null;
    setStatus("idle");
    setStatusDetail("");
  }, [setBusy, stopRecognition]);

  const repeatLast = useCallback(async () => {
    if (!lastResponse) return;
    const requestId = ++operationRef.current;
    stopRecognition();
    const speechPlayed = await speak(lastResponse, requestId);
    if (speechPlayed && wakeEnabledRef.current && requestId === operationRef.current) {
      startListeningRef.current?.("wake");
    } else if (!speechPlayed && wakeEnabledRef.current) {
      wakeEnabledRef.current = false;
      setWakeEnabled(false);
    }
  }, [lastResponse, speak, stopRecognition]);

  const reviewMemory = useCallback(async () => {
    const token = getStudentToken();
    if (!token) {
      setStatus("authenticationRequired");
      setStatusDetail("Sign in with a student account to review MIRA memory.");
      return;
    }
    setStatus("processing");
    try {
      const response = await fetch(`${API_BASE_URL}/api/ai/memory`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok || !data.memory) {
        throw new Error(data.message || "Unable to load MIRA memory.");
      }
      const memory = data.memory;
      const conversations = getSavedConversations(memory);
      setReviewedConversations(conversations);
      const turnCount = conversations.length;
      const summary = `MIRA has ${turnCount} saved conversation turns. ${
        memory.lastInteractionAt
          ? `The last interaction was ${new Date(memory.lastInteractionAt).toLocaleString()}.`
          : "There is no saved interaction yet."
      }`;
      setQuestion("");
      setAnswer(summary);
      setLastResponse(summary);
      setStatus("idle");
      await speak(summary);
    } catch (error) {
      setStatus("aiUnavailable");
      setStatusDetail(error.message);
    }
  }, [speak]);

  const clearMemory = useCallback(async () => {
    if (!window.confirm("Delete your private CareerForge AI memory? This cannot be undone.")) return;
    const token = getStudentToken();
    if (!token) {
      setStatus("authenticationRequired");
      setStatusDetail("Sign in with a student account to delete MIRA memory.");
      return;
    }
    try {
      const response = await fetch(`${API_BASE_URL}/api/ai/memory`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.message || "Unable to delete MIRA memory.");
      setLastResponse("");
      setAnswer("");
      setReviewedConversations([]);
      setStatus("idle");
      setStatusDetail("Your private MIRA conversation memory was deleted.");
    } catch (error) {
      setStatus("aiUnavailable");
      setStatusDetail(error.message);
    }
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    const synthesis = window.speechSynthesis;
    let voicePoll = null;
    let previousHandler = null;
    let refreshVoices = null;
    if (synthesis) {
      refreshVoices = () => setVoices(synthesis.getVoices());
      refreshVoices();
      synthesis.addEventListener?.("voiceschanged", refreshVoices);
      previousHandler = synthesis.onvoiceschanged;
      if (!synthesis.addEventListener) synthesis.onvoiceschanged = refreshVoices;
      let attempts = 0;
      voicePoll = window.setInterval(() => {
        refreshVoices();
        attempts += 1;
        if (attempts >= 20 || synthesis.getVoices().length) {
          window.clearInterval(voicePoll);
        }
      }, 250);
    }

    return () => {
      mountedRef.current = false;
      operationRef.current += 1;
      wakeEnabledRef.current = false;
      requestControllerRef.current?.abort();
      stopRecognition();
      if (synthesis) {
        synthesis.cancel();
        if (voicePoll) window.clearInterval(voicePoll);
        synthesis.removeEventListener?.("voiceschanged", refreshVoices);
        if (!synthesis.removeEventListener) {
          synthesis.onvoiceschanged = previousHandler || null;
        }
      }
    };
  }, [stopRecognition]);

  useEffect(() => {
    const onVisibilityChange = () => {
      if (document.visibilityState !== "visible" && wakeEnabledRef.current) {
        pauseWakeWord();
      }
    };
    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => document.removeEventListener("visibilitychange", onVisibilityChange);
  }, [pauseWakeWord]);

  useEffect(() => {
    const closeLanguageMenu = (event) => {
      if (!languageSelectorRef.current?.contains(event.target)) {
        setLanguageMenuOpen(false);
        setLanguageSearch("");
      }
    };
    document.addEventListener("pointerdown", closeLanguageMenu);
    return () => document.removeEventListener("pointerdown", closeLanguageMenu);
  }, []);

  return (
    <section className="mira-voice-card" aria-label="MIRA voice assistant">
      <header className="mira-voice-card-header">
        <span className="mira-voice-mark"><BrainCircuit size={20} /></span>
        <div>
          <span className="mira-voice-eyebrow">MIRA · PERSONAL AI COMPANION</span>
          <strong>{profile?.name || "Student"}</strong>
        </div>
      </header>

      <div className={`mira-voice-status mira-voice-status-${status}`} role="status" aria-live="polite">
        <span className="mira-voice-dot" />
        {statusLabels[status] || "Voice status unavailable"}
      </div>
      {statusDetail && <p className="mira-voice-detail" role="status">{statusDetail}</p>}

      <div className="mira-voice-language" ref={languageSelectorRef}>
        <label htmlFor="mira-language-search">Conversation language</label>
        <div className="mira-language-combobox">
          <input
            id="mira-language-search"
            type="search"
            role="combobox"
            aria-autocomplete="list"
            aria-expanded={languageMenuOpen}
            aria-controls="mira-language-options"
            value={languageMenuOpen ? languageSearch : `${selectedLanguage.native} · ${selectedLanguage.label}`}
            disabled={
              isBusy ||
              wakeEnabled ||
              ["listeningQuestion", "listeningWake", "speaking"].includes(status)
            }
            onFocus={() => {
              setLanguageMenuOpen(true);
              setLanguageSearch("");
            }}
            onClick={() => {
              setLanguageMenuOpen(true);
              setLanguageSearch("");
            }}
            onChange={(event) => {
              setLanguageSearch(event.target.value);
              setLanguageMenuOpen(true);
            }}
            onKeyDown={(event) => {
              if (event.key === "Escape") {
                setLanguageMenuOpen(false);
                setLanguageSearch("");
              } else if (event.key === "Enter" && filteredLanguages.length) {
                event.preventDefault();
                setLanguage(filteredLanguages[0][0]);
                setLanguageMenuOpen(false);
                setLanguageSearch("");
                setStatusDetail("");
              }
            }}
            placeholder="Search languages"
          />
          <ChevronDown size={17} aria-hidden="true" />
          {languageMenuOpen && (
            <div className="mira-language-options" id="mira-language-options" role="listbox" aria-label="Available languages">
              {filteredLanguages.length ? filteredLanguages.map(([code, option]) => (
                <button
                  type="button"
                  role="option"
                  aria-selected={language === code}
                  key={code}
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => {
                    setLanguage(code);
                    setLanguageMenuOpen(false);
                    setLanguageSearch("");
                    setStatusDetail("");
                  }}
                >
                  <span>{option.native}</span>
                  <span>{option.label}</span>
                  <small>{option.locale}</small>
                </button>
              )) : (
                <p className="mira-language-no-results">No matching language</p>
              )}
            </div>
          )}
        </div>
      </div>

      {(question || answer) && (
        <div className="mira-voice-transcript" aria-live="polite">
          {question && <p><strong>You said</strong><span>{question}</span></p>}
          {answer && <p><strong>MIRA</strong><span>{answer}</span></p>}
        </div>
      )}

      {reviewedConversations && (
        <div className="mira-memory-review" aria-live="polite">
          <strong>Saved conversations ({reviewedConversations.length})</strong>
          {reviewedConversations.length ? (
            reviewedConversations.map((conversation) => (
              <article className="mira-memory-conversation" key={conversation.id}>
                <time dateTime={conversation.timestamp || conversation.userMessage?.timestamp}>
                  {formatMemoryDate(
                    conversation.timestamp || conversation.userMessage?.timestamp
                  )}
                </time>
                <p><b>You said</b><span>{conversation.userMessage?.content}</span></p>
                <p><b>MIRA</b><span>{conversation.assistantMessage?.content}</span></p>
              </article>
            ))
          ) : (
            <p>No saved MIRA conversations yet.</p>
          )}
        </div>
      )}

      <div className="mira-voice-actions">
        <button
          type="button"
          className="mira-voice-button mira-voice-primary"
          onClick={wakeEnabled ? pauseWakeWord : enableWakeWord}
          disabled={["requestingPermission", "processing", "speaking"].includes(status)}
        >
          {wakeEnabled ? <Pause size={17} /> : <Radio size={17} />}
          {wakeEnabled ? "Pause listening" : status === "paused" ? "Resume listening" : "Enable wake word"}
        </button>
        <button
          type="button"
          className="mira-voice-button"
          onClick={() => startListening("once")}
          disabled={["requestingPermission", "processing", "speaking"].includes(status)}
        >
          <Mic size={17} /> Ask now
        </button>
        <button type="button" className="mira-voice-button" onClick={repeatLast} disabled={!lastResponse}>
          <Repeat size={16} /> Repeat
        </button>
        <button type="button" className="mira-voice-button" onClick={stopAll}>
          <Square size={15} /> Stop
        </button>
        {["networkError", "speechError", "noSpeech", "permissionDenied", "microphoneUnavailable"].includes(status) && (
          <button type="button" className="mira-voice-button" onClick={() => startListening(wakeEnabled ? "wake" : "once")}>
            Retry listening
          </button>
        )}
      </div>

      <div className="mira-voice-actions">
        <button type="button" className="mira-voice-button" onClick={reviewMemory}>
          <History size={16} /> Review memory
        </button>
        <button type="button" className="mira-voice-button" onClick={clearMemory}>
          <Trash2 size={16} /> Delete memory
        </button>
      </div>
      <p className="mira-voice-privacy">
        MIRA uses browser-provided speech recognition and speech synthesis. Recognition availability and voices vary by browser, device, and language. Microphone access is requested only after a voice action and listening stops when you pause, leave this page, or switch tabs.
      </p>
    </section>
  );
}
