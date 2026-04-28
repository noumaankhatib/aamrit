// Heroicons-style outline icons. Inline SVG, no extra deps.
// All icons render at 1em — control size with className (e.g. "w-5 h-5").

type Props = React.SVGProps<SVGSVGElement> & { name: IconName };

export type IconName =
  | "search"
  | "cart"
  | "user"
  | "menu"
  | "close"
  | "chevron-down"
  | "chevron-right"
  | "chevron-left"
  | "plus"
  | "minus"
  | "trash"
  | "check"
  | "check-circle"
  | "clock"
  | "truck"
  | "package"
  | "lock"
  | "shield"
  | "heart"
  | "google"
  | "arrow-right"
  | "leaf"
  | "spark"
  | "credit-card"
  | "dashboard"
  | "box"
  | "list"
  | "logout"
  | "edit"
  | "external"
  | "mail";

export default function Icon({ name, className = "w-5 h-5", ...rest }: Props) {
  const common = {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.6,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    className,
    "aria-hidden": true,
    ...rest,
  };
  switch (name) {
    case "search":
      return (
        <svg {...common}><circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" /></svg>
      );
    case "cart":
      return (
        <svg {...common}>
          <path d="M3 4h2l2.4 12.5A2 2 0 0 0 9.4 18h8.6a2 2 0 0 0 2-1.6L21.5 8H6" />
          <circle cx="9" cy="20" r="1.4" /><circle cx="18" cy="20" r="1.4" />
        </svg>
      );
    case "user":
      return (
        <svg {...common}>
          <circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" />
        </svg>
      );
    case "menu":
      return <svg {...common}><path d="M4 7h16M4 12h16M4 17h16" /></svg>;
    case "close":
      return <svg {...common}><path d="m6 6 12 12M6 18 18 6" /></svg>;
    case "chevron-down":
      return <svg {...common}><path d="m6 9 6 6 6-6" /></svg>;
    case "chevron-right":
      return <svg {...common}><path d="m9 6 6 6-6 6" /></svg>;
    case "chevron-left":
      return <svg {...common}><path d="m15 6-6 6 6 6" /></svg>;
    case "plus":
      return <svg {...common}><path d="M12 5v14M5 12h14" /></svg>;
    case "minus":
      return <svg {...common}><path d="M5 12h14" /></svg>;
    case "trash":
      return (
        <svg {...common}>
          <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
          <path d="M6 6v14a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V6" />
          <path d="M10 11v6M14 11v6" />
        </svg>
      );
    case "check":
      return <svg {...common}><path d="m5 13 4 4L19 7" /></svg>;
    case "check-circle":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" /><path d="m8 12 3 3 5-6" />
        </svg>
      );
    case "clock":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" />
        </svg>
      );
    case "truck":
      return (
        <svg {...common}>
          <path d="M3 7h11v9H3zM14 11h4l3 3v2h-7" />
          <circle cx="7" cy="18" r="2" /><circle cx="17" cy="18" r="2" />
        </svg>
      );
    case "package":
      return (
        <svg {...common}>
          <path d="M21 8 12 3 3 8v8l9 5 9-5z" />
          <path d="M3 8l9 5 9-5M12 13v8" />
        </svg>
      );
    case "lock":
      return (
        <svg {...common}>
          <rect x="4" y="11" width="16" height="10" rx="2" />
          <path d="M8 11V7a4 4 0 0 1 8 0v4" />
        </svg>
      );
    case "shield":
      return (
        <svg {...common}>
          <path d="M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6z" />
        </svg>
      );
    case "heart":
      return (
        <svg {...common}>
          <path d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.5-7 10-7 10Z" />
        </svg>
      );
    case "google":
      // Brand Google "G" — official colors, kept simple
      return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden>
          <path fill="#4285F4" d="M21.6 12.23c0-.78-.07-1.53-.2-2.25H12v4.26h5.4a4.62 4.62 0 0 1-2 3.03v2.5h3.23c1.89-1.74 2.97-4.3 2.97-7.54Z" />
          <path fill="#34A853" d="M12 22c2.7 0 4.97-.9 6.63-2.43l-3.23-2.5c-.9.6-2.04.96-3.4.96-2.61 0-4.83-1.76-5.62-4.13H3.04v2.6A10 10 0 0 0 12 22Z" />
          <path fill="#FBBC05" d="M6.38 13.9a6 6 0 0 1 0-3.8V7.5H3.04a10 10 0 0 0 0 9l3.34-2.6Z" />
          <path fill="#EA4335" d="M12 5.96c1.47 0 2.79.5 3.83 1.5l2.86-2.86A10 10 0 0 0 12 2 10 10 0 0 0 3.04 7.5l3.34 2.6C7.17 7.72 9.39 5.96 12 5.96Z" />
        </svg>
      );
    case "arrow-right":
      return <svg {...common}><path d="M5 12h14M13 6l6 6-6 6" /></svg>;
    case "leaf":
      return (
        <svg {...common}>
          <path d="M3 21c0-9 7-15 18-15 0 11-6 18-15 18-1 0-3 0-3-3Z" />
          <path d="M3 21c4-4 9-7 14-9" />
        </svg>
      );
    case "spark":
      return (
        <svg {...common}>
          <path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6 7.7 7.7M16.3 16.3l2.1 2.1M5.6 18.4 7.7 16.3M16.3 7.7l2.1-2.1" />
        </svg>
      );
    case "credit-card":
      return (
        <svg {...common}>
          <rect x="3" y="6" width="18" height="13" rx="2" />
          <path d="M3 10h18M7 15h2" />
        </svg>
      );
    case "dashboard":
      return (
        <svg {...common}>
          <rect x="3" y="3" width="7" height="9" rx="1.5" />
          <rect x="14" y="3" width="7" height="5" rx="1.5" />
          <rect x="14" y="12" width="7" height="9" rx="1.5" />
          <rect x="3" y="16" width="7" height="5" rx="1.5" />
        </svg>
      );
    case "box":
      return (
        <svg {...common}>
          <path d="M3 7v10l9 5 9-5V7l-9-4z" />
          <path d="M3 7l9 5 9-5" />
        </svg>
      );
    case "list":
      return <svg {...common}><path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" /></svg>;
    case "logout":
      return (
        <svg {...common}>
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
          <path d="m16 17 5-5-5-5M21 12H9" />
        </svg>
      );
    case "edit":
      return (
        <svg {...common}>
          <path d="M11 4H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-5" />
          <path d="m18.5 2.5 3 3L12 15l-4 1 1-4z" />
        </svg>
      );
    case "external":
      return (
        <svg {...common}>
          <path d="M14 4h6v6M21 3l-9 9" />
          <path d="M19 14v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h5" />
        </svg>
      );
    case "mail":
      return (
        <svg {...common}>
          <rect x="3" y="5" width="18" height="14" rx="2" />
          <path d="m3 7 9 6 9-6" />
        </svg>
      );
  }
}
