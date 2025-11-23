# ANAMNESIS v3.0

**The Mirror of Your Mind** - A living visualization of your consciousness across AI conversations.

![ANAMNESIS](https://img.shields.io/badge/version-3.0.0-cyan)
![Electron](https://img.shields.io/badge/electron-28-blue)
![React](https://img.shields.io/badge/react-18-blue)
![TypeScript](https://img.shields.io/badge/typescript-5-blue)

---

## The Vision

ANAMNESIS transforms your AI conversation history into a **living, breathing dashboard**. It's not just a tool—it's a window into your own mind.

### Two States

**STATE 1: THE WALL** (Animated, overwhelming, hypnotic)
- Hundreds of monitors displaying your memories
- Constant motion, Blade Runner aesthetic
- Cyberpunk post-processing effects
- Sub-100ms search across all conversations

**STATE 2: THE MEMORY** (Still, intimate, readable)
- Vintage collage layout
- Typewriter text, handwritten notes
- Quality photography aesthetic
- "Forced to stare at your own thoughts"

---

## Features

- **Import** - ChatGPT, Claude, Gemini exports
- **Visualize** - 10+ animated monitor styles
- **Search** - Instant fuzzy search across all memories
- **Explore** - Click any memory for the vintage collage view
- **Export** - Generate SPINE seeds to continue conversations anywhere

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm or pnpm

### Development

```bash
# Clone the repository
git clone https://github.com/your-username/anamnesis.git
cd anamnesis

# Install dependencies
npm install

# Start development mode
npm run dev
```

### Production Build

```bash
# Build for production
npm run build

# Package for distribution
npm run electron:build
```

---

## Tech Stack

- **Frontend**: React 18, TypeScript, Framer Motion, Tailwind CSS
- **3D/Effects**: Three.js, React Three Fiber
- **State**: Zustand
- **Search**: Fuse.js (client), SQLite FTS5 (backend)
- **Desktop**: Electron 28
- **Database**: SQLite (via better-sqlite3)

---

## Project Structure

```
anamnesis/
├── electron/           # Electron main process
│   ├── main.ts
│   ├── preload.ts
│   └── services/
├── src/
│   ├── views/          # Main views (Awakening, Wall, Memory)
│   ├── components/     # React components
│   │   ├── Monitor/    # Monitor visual styles
│   │   ├── Collage/    # Vintage collage elements
│   │   └── Effects/    # Visual effects
│   ├── systems/        # Core systems
│   ├── stores/         # Zustand state
│   ├── hooks/          # React hooks
│   └── types/          # TypeScript types
├── scripts/            # Build and install scripts
└── public/             # Static assets
```

---

## Monitor Styles

Each memory is displayed as one of these animated monitor types:

| Style | Description | Trigger |
|-------|-------------|---------|
| **Cartoon** | 1930s animation style | Creative/brainstorm content |
| **Sitcom** | 1950s TV aesthetic | Conversational content |
| **Tutorial** | VHS makeup tutorial | How-to/learning content |
| **Cyberpunk** | Neon Blade Runner | AI/tech content |
| **Terminal** | Code editor style | Programming content |
| **Glitch** | Abstract RGB split | Experimental content |
| **Emergency** | Alert broadcast | Urgent/important content |
| **News** | Breaking news ticker | Research/information |
| **Static** | No signal noise | Miscellaneous |

---

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `⌘/Ctrl + K` | Focus search |
| `Escape` | Close memory / Clear search |
| `Click` | Open memory collage |

---

## License

MIT

---

## Contributing

Contributions welcome! Please read our contributing guidelines before submitting PRs.

---

*"Your mind is about to become visible."*
