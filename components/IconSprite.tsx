// Inline SVG sprite — all icons + scene illustrations referenced via <use href="#i-…" />
// Inserted once in the root layout so every component can simply reference symbol IDs.
export default function IconSprite() {
  return (
    <svg
      width="0"
      height="0"
      style={{ position: "absolute" }}
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <symbol id="i-leaf" viewBox="0 0 24 24">
          <path
            fill="currentColor"
            d="M21 3c-9 0-15 5.5-15 13 0 1.6.4 3 1 4.2 5-9 11.5-12 14-13.2-1.5 2.5-7.5 6.5-12 12C15.5 19 21 14 21 3z"
          />
        </symbol>
        <symbol id="i-mango" viewBox="0 0 24 24">
          <path
            fill="currentColor"
            d="M12 2c4.5 2 7 5.5 7 10 0 5-3.5 10-7 10S5 17 5 12c0-4.5 2.5-8 7-10z"
            opacity=".95"
          />
          <path
            fill="#2E7D32"
            d="M12 2c1 2 1.4 3.7 1.2 5.4-.7-.6-1.7-.8-2.6-.5C10 5 10.8 3.4 12 2z"
          />
        </symbol>
        <symbol id="i-arrow" viewBox="0 0 24 24">
          <path
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M5 12h14M13 6l6 6-6 6"
          />
        </symbol>
        <symbol id="i-check" viewBox="0 0 24 24">
          <path
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M5 13l4 4L19 7"
          />
        </symbol>
        <symbol id="i-star" viewBox="0 0 24 24">
          <path
            fill="currentColor"
            d="M12 2l2.4 6.9H22l-6 4.4 2.3 6.9L12 16l-6.3 4.2L8 13.3 2 8.9h7.6L12 2z"
          />
        </symbol>
        <symbol id="i-sun" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="4" fill="currentColor" />
          <g stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.5 4.5l2 2M17.5 17.5l2 2M4.5 19.5l2-2M17.5 6.5l2-2" />
          </g>
        </symbol>
        <symbol id="i-tree" viewBox="0 0 24 24">
          <path
            fill="currentColor"
            d="M12 2c4 2.5 6 5.5 6 8.5 0 2.6-1.6 4.7-4 5.5V22h-4v-6c-2.4-.8-4-2.9-4-5.5C6 7.5 8 4.5 12 2z"
          />
        </symbol>
        <symbol id="i-shield" viewBox="0 0 24 24">
          <path
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinejoin="round"
            d="M12 2l8 3v7c0 5-3.5 9-8 10-4.5-1-8-5-8-10V5l8-3z"
          />
          <path
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            d="M9 12l2 2 4-4"
          />
        </symbol>
        <symbol id="i-truck" viewBox="0 0 24 24">
          <path
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinejoin="round"
            d="M3 6h11v10H3zM14 9h4l3 3v4h-7zM7 19a2 2 0 100-4 2 2 0 000 4zM18 19a2 2 0 100-4 2 2 0 000 4z"
          />
        </symbol>
        <symbol id="i-heart" viewBox="0 0 24 24">
          <path
            fill="currentColor"
            d="M12 21s-7-4.5-9.5-9C.5 8 3 4 6.5 4c2 0 3.5 1 5.5 3 2-2 3.5-3 5.5-3C21 4 23.5 8 21.5 12 19 16.5 12 21 12 21z"
          />
        </symbol>
        <symbol id="i-pin" viewBox="0 0 24 24">
          <path
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinejoin="round"
            d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 1118 0z"
          />
          <circle cx="12" cy="10" r="3" fill="none" stroke="currentColor" strokeWidth="2" />
        </symbol>
        <symbol id="i-phone" viewBox="0 0 24 24">
          <path
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinejoin="round"
            d="M22 16.92V21a1 1 0 01-1.09 1A19.79 19.79 0 012 4.09 1 1 0 013 3h4.09a1 1 0 011 .75 12 12 0 00.66 2.81 1 1 0 01-.23 1L6.91 9.09a16 16 0 008 8l1.5-1.5a1 1 0 011-.23 12 12 0 002.81.66 1 1 0 01.78 1z"
          />
        </symbol>
        <symbol id="i-mail" viewBox="0 0 24 24">
          <rect
            x="3"
            y="5"
            width="18"
            height="14"
            rx="2"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          />
          <path d="M3 7l9 6 9-6" fill="none" stroke="currentColor" strokeWidth="2" />
        </symbol>
        <symbol id="i-cart" viewBox="0 0 24 24">
          <path
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 7h2l2 12h12l2-9H7"
          />
          <circle cx="9" cy="21" r="1.5" fill="currentColor" />
          <circle cx="18" cy="21" r="1.5" fill="currentColor" />
        </symbol>
        <symbol id="i-whatsapp" viewBox="0 0 24 24">
          <path
            fill="currentColor"
            d="M20.5 3.5A11.78 11.78 0 0012 0C5.4 0 .1 5.3.1 11.9c0 2.1.6 4.1 1.6 5.9L0 24l6.4-1.7c1.7.9 3.6 1.4 5.6 1.4 6.6 0 11.9-5.3 11.9-11.9 0-3.2-1.2-6.2-3.4-8.3zM12 21.7c-1.7 0-3.4-.5-4.9-1.3l-.4-.2-3.8 1 1-3.7-.2-.4c-.9-1.5-1.4-3.2-1.4-5 0-5.4 4.4-9.8 9.8-9.8 2.6 0 5.1 1 6.9 2.9 1.8 1.9 2.9 4.3 2.9 6.9 0 5.4-4.5 9.6-9.9 9.6zm5.4-7.3c-.3-.1-1.7-.8-2-.9-.3-.1-.5-.1-.7.1-.2.3-.8.9-1 1.1-.2.2-.4.2-.7.1-.3-.1-1.3-.5-2.4-1.5-.9-.8-1.5-1.8-1.7-2.1-.2-.3 0-.4.1-.6l.5-.6c.2-.2.2-.3.3-.5.1-.2 0-.4 0-.5-.1-.1-.7-1.7-1-2.4-.3-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4s-1 1-1 2.4 1 2.8 1.2 3c.1.2 2.1 3.2 5 4.5.7.3 1.3.5 1.7.6.7.2 1.4.2 1.9.1.6-.1 1.7-.7 2-1.4.2-.7.2-1.2.2-1.4-.1-.2-.3-.2-.6-.3z"
          />
        </symbol>
        <symbol id="i-instagram" viewBox="0 0 24 24">
          <rect
            x="3"
            y="3"
            width="18"
            height="18"
            rx="5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          />
          <circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="2" />
          <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
        </symbol>
        <symbol id="i-menu" viewBox="0 0 24 24">
          <path
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            d="M4 6h16M4 12h16M4 18h16"
          />
        </symbol>
        <symbol id="i-quote" viewBox="0 0 24 24">
          <path
            fill="currentColor"
            d="M7.2 10.6c0-2.4 1.5-4 3.6-4.6L11.4 7c-1.4.5-2 1.5-2 2.5h1.4c.5 0 1 .5 1 1v3.5c0 .5-.5 1-1 1H7.6c-.5 0-1-.5-1-1V11c0-.1.6-.4.6-.4zM14.6 10.6c0-2.4 1.5-4 3.6-4.6l.6 1c-1.4.5-2 1.5-2 2.5H18c.5 0 1 .5 1 1v3.5c0 .5-.5 1-1 1H15c-.5 0-1-.5-1-1V11c0-.1.6-.4.6-.4z"
          />
        </symbol>
        <symbol id="i-medal" viewBox="0 0 24 24">
          <circle cx="12" cy="14" r="6" fill="none" stroke="currentColor" strokeWidth="1.8" />
          <path
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinejoin="round"
            d="M8 12L5 3l4 1 3-2 3 2 4-1-3 9"
          />
          <circle cx="12" cy="14" r="2" fill="currentColor" />
        </symbol>
        <symbol id="i-team" viewBox="0 0 24 24">
          <circle cx="9" cy="8" r="3" fill="none" stroke="currentColor" strokeWidth="1.8" />
          <circle cx="17" cy="9" r="2.5" fill="none" stroke="currentColor" strokeWidth="1.8" />
          <path
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            d="M3 19c0-3.3 2.7-6 6-6s6 2.7 6 6M21 19c0-2.5-1.5-4.5-4-5.5"
          />
        </symbol>
        <symbol id="i-flask" viewBox="0 0 24 24">
          <path
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinejoin="round"
            d="M9 3h6M10 3v6L4 19c-1 1.7 0 3 1.5 3h13c1.5 0 2.5-1.3 1.5-3l-6-10V3"
          />
        </symbol>
        <symbol id="i-plus" viewBox="0 0 24 24">
          <path
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            d="M12 5v14M5 12h14"
          />
        </symbol>
        <symbol id="i-globe" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="1.8" />
          <path
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            d="M3 12h18M12 3a14 14 0 010 18M12 3a14 14 0 000 18"
          />
        </symbol>
        <symbol id="i-clipboard" viewBox="0 0 24 24">
          <rect
            x="6"
            y="4"
            width="12"
            height="17"
            rx="2"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
          />
          <path
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            d="M9 4v2h6V4M9 11h6M9 15h4"
          />
        </symbol>
        <symbol id="i-pen" viewBox="0 0 24 24">
          <path
            fill="currentColor"
            d="M14.06 4.94l3 3-9.9 9.9H4.16v-3l9.9-9.9zm5.66-1.41l-1.66 1.66 3 3 1.66-1.66a1.5 1.5 0 000-2.12l-.88-.88a1.5 1.5 0 00-2.12 0z"
          />
        </symbol>
        <symbol id="i-bag" viewBox="0 0 24 24">
          <path
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinejoin="round"
            d="M5 7h14l-1 13H6zM9 7a3 3 0 016 0"
          />
        </symbol>

        {/* ─── Scene illustrations for OrchardStory ─── */}
        <symbol id="ill-blossom" viewBox="0 0 400 240">
          <defs>
            <linearGradient id="bs-bg" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FFFBF5" />
              <stop offset="100%" stopColor="#FCEBC2" />
            </linearGradient>
            <radialGradient id="bs-sun" cx="80%" cy="20%" r="35%">
              <stop offset="0%" stopColor="#FFD773" />
              <stop offset="100%" stopColor="#FFD773" stopOpacity="0" />
            </radialGradient>
          </defs>
          <rect width="400" height="240" fill="url(#bs-bg)" />
          <circle cx="320" cy="55" r="65" fill="url(#bs-sun)" />
          <path
            d="M 30 200 Q 110 165 175 140 Q 245 115 320 95"
            fill="none"
            stroke="#7A5000"
            strokeWidth="6"
            strokeLinecap="round"
          />
          <path
            d="M 175 140 Q 195 110 230 100"
            fill="none"
            stroke="#7A5000"
            strokeWidth="4"
            strokeLinecap="round"
          />
          <path d="M 70 175 q 10 -20 30 -20 q -8 18 -30 20 z" fill="#2E7D32" />
          <path d="M 130 145 q 12 -22 35 -20 q -10 22 -35 20 z" fill="#2E7D32" />
          <path d="M 190 130 q 14 -24 38 -22 q -10 25 -38 22 z" fill="#256628" />
          <path d="M 240 110 q 14 -22 35 -18 q -8 22 -35 18 z" fill="#2E7D32" />
          <path d="M 290 90 q 12 -18 30 -16 q -6 18 -30 16 z" fill="#256628" />
          <g fill="#FFD773">
            <circle cx="155" cy="138" r="3" />
            <circle cx="160" cy="132" r="3" />
            <circle cx="168" cy="135" r="3" />
            <circle cx="172" cy="142" r="3" />
            <circle cx="163" cy="146" r="3" />
            <circle cx="220" cy="105" r="3" />
            <circle cx="228" cy="100" r="3" />
            <circle cx="234" cy="106" r="3" />
            <circle cx="226" cy="112" r="3" />
            <circle cx="280" cy="90" r="3" />
            <circle cx="287" cy="84" r="3" />
            <circle cx="295" cy="92" r="3" />
          </g>
          <path d="M 0 220 Q 200 230 400 215 L 400 240 L 0 240 Z" fill="#256628" opacity=".15" />
        </symbol>

        <symbol id="ill-pick" viewBox="0 0 400 240">
          <defs>
            <linearGradient id="pk-bg" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FFFBF5" />
              <stop offset="100%" stopColor="#F9D584" />
            </linearGradient>
          </defs>
          <rect width="400" height="240" fill="url(#pk-bg)" />
          <ellipse cx="120" cy="90" rx="110" ry="60" fill="#256628" opacity=".22" />
          <ellipse cx="220" cy="60" rx="120" ry="50" fill="#2E7D32" opacity=".18" />
          <path
            d="M 30 70 Q 130 60 230 80"
            fill="none"
            stroke="#7A5000"
            strokeWidth="5"
            strokeLinecap="round"
          />
          <path d="M 90 65 q 8 -18 28 -16 q -6 18 -28 16 z" fill="#2E7D32" />
          <path d="M 160 70 q 10 -20 32 -18 q -8 20 -32 18 z" fill="#256628" />
          <line x1="170" y1="78" x2="170" y2="105" stroke="#7A5000" strokeWidth="2" />
          <ellipse cx="170" cy="135" rx="34" ry="40" fill="#F4A300" />
          <ellipse cx="160" cy="125" rx="10" ry="14" fill="#FFD773" opacity=".7" />
          <line x1="240" y1="82" x2="240" y2="100" stroke="#7A5000" strokeWidth="2" />
          <ellipse cx="240" cy="124" rx="26" ry="32" fill="#E07A00" />
          <ellipse cx="232" cy="116" rx="8" ry="11" fill="#F6BF45" opacity=".7" />
          <g fill="#C68B5C">
            <rect
              x="265"
              y="155"
              width="120"
              height="22"
              rx="11"
              transform="rotate(-12 325 166)"
            />
            <path d="M 230 130 q -8 8 -8 20 q 0 12 12 18 q 14 6 26 0 l 16 -10 q 8 -6 6 -16 q -2 -8 -10 -10 z" />
            <path d="M 210 138 q -6 4 -6 12 q 0 8 8 10 q 6 2 10 -4" />
            <path d="M 215 130 q -8 2 -10 10 q -2 8 6 12" />
          </g>
          <rect
            x="338"
            y="148"
            width="22"
            height="32"
            rx="4"
            fill="#2E7D32"
            transform="rotate(-12 349 164)"
          />
          <path
            d="M 0 215 Q 200 225 400 210 L 400 240 L 0 240 Z"
            fill="#7A5000"
            opacity=".25"
          />
        </symbol>

        <symbol id="ill-crate" viewBox="0 0 400 240">
          <defs>
            <linearGradient id="cr-wood" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#B07300" />
              <stop offset="100%" stopColor="#7A5000" />
            </linearGradient>
            <linearGradient id="cr-bg" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FFFBF5" />
              <stop offset="100%" stopColor="#FCEBC2" />
            </linearGradient>
            <linearGradient id="cr-mango" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#F6BF45" />
              <stop offset="100%" stopColor="#E07A00" />
            </linearGradient>
          </defs>
          <rect width="400" height="240" fill="url(#cr-bg)" />
          <rect x="60" y="80" width="280" height="120" fill="url(#cr-wood)" />
          <line x1="60" y1="100" x2="340" y2="100" stroke="#5A3C00" strokeWidth="2" />
          <line x1="60" y1="130" x2="340" y2="130" stroke="#5A3C00" strokeWidth="2" />
          <line x1="60" y1="160" x2="340" y2="160" stroke="#5A3C00" strokeWidth="2" />
          <rect x="50" y="120" width="300" height="90" fill="#8C5A00" />
          <line x1="50" y1="140" x2="350" y2="140" stroke="#5A3C00" strokeWidth="2" />
          <line x1="50" y1="170" x2="350" y2="170" stroke="#5A3C00" strokeWidth="2" />
          <polygon points="50,120 60,80 60,200 50,210" fill="#5A3C00" />
          <polygon points="350,120 340,80 340,200 350,210" fill="#5A3C00" />
          <g stroke="#F6BF45" strokeWidth="1.6" opacity=".85">
            <line x1="62" y1="100" x2="78" y2="92" />
            <line x1="78" y1="98" x2="92" y2="90" />
            <line x1="98" y1="100" x2="112" y2="92" />
            <line x1="118" y1="98" x2="132" y2="90" />
            <line x1="138" y1="100" x2="152" y2="92" />
            <line x1="158" y1="98" x2="172" y2="90" />
            <line x1="178" y1="100" x2="192" y2="92" />
            <line x1="198" y1="98" x2="212" y2="90" />
            <line x1="218" y1="100" x2="232" y2="92" />
            <line x1="238" y1="98" x2="252" y2="90" />
            <line x1="258" y1="100" x2="272" y2="92" />
            <line x1="278" y1="98" x2="292" y2="90" />
            <line x1="298" y1="100" x2="312" y2="92" />
            <line x1="318" y1="98" x2="332" y2="90" />
          </g>
          <g>
            <ellipse cx="95" cy="95" rx="22" ry="26" fill="url(#cr-mango)" />
            <ellipse cx="89" cy="88" rx="6" ry="9" fill="#FFE5A6" opacity=".7" />
            <ellipse cx="145" cy="92" rx="22" ry="26" fill="url(#cr-mango)" />
            <ellipse cx="139" cy="85" rx="6" ry="9" fill="#FFE5A6" opacity=".7" />
            <ellipse cx="195" cy="95" rx="22" ry="26" fill="url(#cr-mango)" />
            <ellipse cx="189" cy="88" rx="6" ry="9" fill="#FFE5A6" opacity=".7" />
            <ellipse cx="245" cy="92" rx="22" ry="26" fill="url(#cr-mango)" />
            <ellipse cx="239" cy="85" rx="6" ry="9" fill="#FFE5A6" opacity=".7" />
            <ellipse cx="295" cy="95" rx="22" ry="26" fill="url(#cr-mango)" />
            <ellipse cx="289" cy="88" rx="6" ry="9" fill="#FFE5A6" opacity=".7" />
          </g>
          <ellipse cx="200" cy="218" rx="160" ry="6" fill="#000" opacity=".12" />
        </symbol>

        <symbol id="ill-truck" viewBox="0 0 400 240">
          <defs>
            <linearGradient id="tr-bg" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#E0F2FE" />
              <stop offset="100%" stopColor="#FFFBF5" />
            </linearGradient>
            <linearGradient id="tr-cab" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#F6BF45" />
              <stop offset="100%" stopColor="#E07A00" />
            </linearGradient>
          </defs>
          <rect width="400" height="240" fill="url(#tr-bg)" />
          <path
            d="M 0 165 Q 80 130 160 155 Q 240 180 320 145 Q 360 130 400 150 L 400 195 L 0 195 Z"
            fill="#2E7D32"
            opacity=".22"
          />
          <path
            d="M 0 180 Q 100 160 200 175 Q 300 190 400 170 L 400 200 L 0 200 Z"
            fill="#256628"
            opacity=".18"
          />
          <rect x="0" y="195" width="400" height="30" fill="#3A2700" opacity=".22" />
          <g stroke="#FFFBF5" strokeWidth="3" strokeDasharray="14 12">
            <line x1="0" y1="210" x2="400" y2="210" />
          </g>
          <rect
            x="80"
            y="105"
            width="180"
            height="80"
            rx="4"
            fill="white"
            stroke="#7A5000"
            strokeWidth="2"
          />
          <text
            x="170"
            y="150"
            textAnchor="middle"
            fontFamily="serif"
            fontStyle="italic"
            fontWeight="700"
            fontSize="22"
            fill="#E07A00"
          >
            Aamrit
          </text>
          <text
            x="170"
            y="166"
            textAnchor="middle"
            fontFamily="sans-serif"
            fontSize="8"
            fill="#7A5000"
            letterSpacing="0.2em"
          >
            FARM-FRESH MANGOES
          </text>
          <path
            d="M 260 130 L 310 130 L 330 155 L 330 185 L 260 185 Z"
            fill="url(#tr-cab)"
            stroke="#7A5000"
            strokeWidth="2"
          />
          <path
            d="M 268 138 L 305 138 L 320 156 L 268 156 Z"
            fill="#BAE6FD"
            stroke="#7A5000"
            strokeWidth="1.5"
          />
          <circle cx="324" cy="170" r="3" fill="#FFD773" />
          <circle cx="120" cy="195" r="14" fill="#1F1F1F" />
          <circle cx="120" cy="195" r="6" fill="#7A5000" />
          <circle cx="220" cy="195" r="14" fill="#1F1F1F" />
          <circle cx="220" cy="195" r="6" fill="#7A5000" />
          <circle cx="305" cy="195" r="14" fill="#1F1F1F" />
          <circle cx="305" cy="195" r="6" fill="#7A5000" />
          <circle cx="60" cy="55" r="22" fill="#FFD773" opacity=".8" />
        </symbol>

        <symbol id="ill-crate-pack" viewBox="0 0 320 200">
          <defs>
            <linearGradient id="cp-bg" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FFFBF5" />
              <stop offset="100%" stopColor="#FCEBC2" />
            </linearGradient>
            <linearGradient id="cp-wood" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#B07300" />
              <stop offset="100%" stopColor="#7A5000" />
            </linearGradient>
            <linearGradient id="cp-mango" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#F6BF45" />
              <stop offset="100%" stopColor="#E07A00" />
            </linearGradient>
          </defs>
          <rect width="320" height="200" fill="url(#cp-bg)" />
          <rect x="40" y="60" width="240" height="110" fill="url(#cp-wood)" />
          <line x1="40" y1="85" x2="280" y2="85" stroke="#5A3C00" strokeWidth="2" />
          <line x1="40" y1="115" x2="280" y2="115" stroke="#5A3C00" strokeWidth="2" />
          <line x1="40" y1="145" x2="280" y2="145" stroke="#5A3C00" strokeWidth="2" />
          <rect x="32" y="100" width="256" height="80" fill="#8C5A00" />
          <line x1="32" y1="125" x2="288" y2="125" stroke="#5A3C00" strokeWidth="2" />
          <line x1="32" y1="155" x2="288" y2="155" stroke="#5A3C00" strokeWidth="2" />
          <g>
            <ellipse cx="78" cy="68" rx="18" ry="22" fill="url(#cp-mango)" />
            <ellipse cx="73" cy="62" rx="5" ry="8" fill="#FFE5A6" opacity=".7" />
            <ellipse cx="120" cy="68" rx="18" ry="22" fill="url(#cp-mango)" />
            <ellipse cx="115" cy="62" rx="5" ry="8" fill="#FFE5A6" opacity=".7" />
            <ellipse cx="160" cy="68" rx="18" ry="22" fill="url(#cp-mango)" />
            <ellipse cx="155" cy="62" rx="5" ry="8" fill="#FFE5A6" opacity=".7" />
            <ellipse cx="200" cy="68" rx="18" ry="22" fill="url(#cp-mango)" />
            <ellipse cx="195" cy="62" rx="5" ry="8" fill="#FFE5A6" opacity=".7" />
            <ellipse cx="240" cy="68" rx="18" ry="22" fill="url(#cp-mango)" />
            <ellipse cx="235" cy="62" rx="5" ry="8" fill="#FFE5A6" opacity=".7" />
          </g>
          <ellipse cx="160" cy="186" rx="120" ry="5" fill="#000" opacity=".14" />
        </symbol>
      </defs>
    </svg>
  );
}
