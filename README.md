# Fractals & Chaos

An immersive, full-viewport interactive exploration of fractals and chaos theory. The project renders four classic fractal types in real time using WebGL fragment shaders, pairs them with a 3D height-map visualization, and offers a five-chapter narrated guided tour with ambient soundscape.

## What It Explores

### The Mathematics of Chaos

At the heart of every fractal is a deceptively simple rule applied over and over. Take any complex number, square it, add a constant, and repeat. Whether the result stays bounded or flies to infinity — and how quickly — produces the intricate, infinitely detailed structures you see on screen.

The project visualizes four families of fractals, each revealing different aspects of complex dynamics:

| Fractal | Formula | What It Shows |
|---------|---------|---------------|
| Mandelbrot Set | z² + c | Maps every constant c by whether its orbit stays bounded. The "master catalog" of dynamical behavior. |
| Julia Sets | z² + c (fixed c) | The dual of the Mandelbrot set. Each point in the Mandelbrot plane has a corresponding Julia set. Connected if c is inside the set, Cantor dust if outside. |
| Burning Ship | (\|Re(z)\| + i\|Im(z)\|)² + c | Absolute values before squaring break symmetry, producing jagged, ship-like forms unlike anything in the Mandelbrot set. |
| Newton's Method | z - (z³-1)/(3z²) | Newton's root-finding algorithm applied to z³ = 1. Three basins of attraction with fractal Wada boundaries. |

### Why WebGL?

The Coffee Anatomy and Ocean Depths projects in this series use the **Canvas 2D API**, which is well suited for drawing shapes, gradients, particles, and text. Fractals are a fundamentally different rendering problem: the Mandelbrot set requires evaluating a complex iterative formula **independently for every pixel on screen** — millions of per-pixel computations per frame.

WebGL solves this by running a **fragment shader on the GPU**, where thousands of cores evaluate `z² + c` in parallel across every pixel simultaneously. This is what makes smooth zooming, real-time palette changes, and interactive Julia set previews possible at 60fps. A single static render that would take seconds on the CPU completes in milliseconds on the GPU.

The fragment shader implements the Inigo Quilez cosine color palette technique, producing smooth, continuous color gradients that map escape velocity to color without banding artifacts.

### Exploration Features

- **Interactive pan and zoom** — Click and drag to pan, scroll to zoom. Explore Seahorse Valley, Elephant Valley, deep spiral arms, and miniature copies of the full set.
- **Zoom presets** — One-click jumps to notable locations: Overview, Seahorse Valley, Elephant Valley, and a deep zoom at 100,000x magnification.
- **Real-time Julia preview** — Toggle the Julia inset to see the corresponding Julia set for any point you hover over in the Mandelbrot set.
- **Orbit visualization** — Toggle orbit paths to see the actual iteration sequence for any point under the cursor.
- **Coordinate axes** — Crosshair overlay showing position in the complex plane.
- **3D height map** — A Three.js height-mapped mesh in the corner showing the fractal's escape-time topology as a 3D surface. Rotatable with mouse drag.

### Color Palettes

Five dark-mode palettes, each applying coordinated colors to the fractal shader, UI elements, and 3D visualization:

- **Deep Space** — Blue-indigo with violet accents
- **Inferno** — Warm amber-orange volcanic tones
- **Frost** — Cool cyan-teal arctic palette
- **Electric** — Purple-magenta high-contrast (default)
- **Twilight** — Pink-coral sunset tones

### Guided Tour

A five-chapter narrated tour walks through the mathematics and visual phenomena with synchronized animations. Narration is pre-generated via ElevenLabs TTS, and the tour engine coordinates:

- Character-by-character text reveal synchronized to audio playback
- Fractal type switching and view transitions timed to narration content
- Ambient soundscape that fades in before narration, ducks during speech, swells between chapters, and fades out at the end
- Full immersive mode — all UI elements hide during narration, leaving only the fractal, title, chapter progress pips, and tour controls

#### Tour Chapters

1. **The Language of Iteration** (60s) — Introduction to the Mandelbrot set: the z² + c rule, bounded vs. escaping points, the infinite boundary
2. **Anatomy of the Mandelbrot Set** (77s) — Cardioid, period-two bulb, Seahorse Valley, Elephant Valley, Sharkovskii's theorem
3. **Julia Sets -- The Dual World** (80s) — The Fatou-Julia theorem, connected vs. disconnected Julia sets, Douady rabbit, dendrites
4. **The Fractal Zoo** (83s) — Burning Ship fractal, Newton's method basins, Wada boundaries, holomorphic dynamics
5. **Chaos, Beauty, and the Edge of Knowledge** (101s) — Butterfly effect, Feigenbaum constants, universality, fractals as nature's geometry

### Ambient Sound

Three layered WAV soundscapes crossfade and loop to create a continuous atmospheric backdrop. During the guided tour:

- 5-7 seconds of ambient swell before narration begins
- Volume ducks to 12% during speech
- Swells back to full volume for 10-20 seconds after narration ends
- Fades out gracefully at the end of the tour

## How It's Built

### Architecture

Single-file HTML application (`index.html`, ~1,630 lines) with inline CSS and JavaScript. No build step, no frameworks, no dependencies beyond Three.js loaded from CDN. The immersive layout places the fractal canvas as a full-viewport fixed layer with all UI floating on top using text-shadow for contrast rather than opaque panels.

### Technology

| Component | Technology | Why |
|-----------|-----------|-----|
| Fractal rendering | WebGL fragment shaders | Massively parallel per-pixel computation on the GPU — required for real-time fractal exploration |
| Color mapping | Inigo Quilez cosine palette (GLSL) | Smooth, continuous color gradients without banding; palette-swappable via uniform vectors |
| 3D height map | Three.js r128 + OrbitControls | Interactive 3D surface showing fractal escape-time topology |
| Orbit computation | Canvas 2D overlay | CPU-side iteration for single-point orbit paths drawn on a transparent overlay canvas |
| Ambient sound | Web Audio API (3 layered WAV sources) | Crossfading loops with gain automation for tour duck/unduck |
| Tour narration | ElevenLabs TTS (pre-generated MP3) | Five chapter audio files with timed action system |
| State management | Plain JS object with lerp animation | Smooth animated transitions between views via request-animation-frame interpolation |
| Theming | CSS custom properties (5 palettes) | Dark-mode only; palettes update shader uniforms, CSS variables, and 3D mesh colors simultaneously |
| URL state | history.replaceState | Shareable fractal coordinates, zoom level, and palette via query parameters |
| Layout | CSS fixed positioning | Immersive full-viewport fractal with floating UI — no panels or glass boxes |
| Fonts | Google Fonts (Cormorant Garamond + Karla) | Display serif for titles/captions, clean sans-serif for UI |
| Icons | Google Material Symbols Outlined | Consistent iconography across controls |

### File Structure

```
Fractal-Explorer/
  index.html              -- Complete application (HTML + CSS + JS), ~1,630 lines
  README.md               -- This file
  scripts/
    generate-audio.js     -- ElevenLabs TTS generation script (Node.js)
  audio/
    01-iteration.mp3      -- Chapter 1 narration (929 KB)
    02-mandelbrot.mp3     -- Chapter 2 narration (1.2 MB)
    03-julia.mp3          -- Chapter 3 narration (1.2 MB)
    04-zoo.mp3            -- Chapter 4 narration (1.3 MB)
    05-chaos.mp3          -- Chapter 5 narration (1.5 MB)
    ambient-1.wav         -- Ambient layer 1 (5.5 MB, 30s loop)
    ambient-2.wav         -- Ambient layer 2 (5.5 MB, 30s loop)
    ambient-3.wav         -- Ambient layer 3 (5.5 MB, 30s loop)
```

### Code Structure (index.html)

| Section | Description |
|---------|-------------|
| CSS (~320 lines) | Custom properties, immersive layout, floating UI components, tour styles, responsive breakpoints |
| HTML Body | Full-viewport canvas layer, floating top bar (title + stats), info blurb, Julia inset, 3D container, tour controls, bottom bar (fractal/toggle/preset buttons + legend), ambient button |
| JS: State + Palettes | State object, 5 palette definitions (CSS variables + shader uniform vectors) |
| JS: Fractal Configs | Four fractal type definitions with default views |
| JS: URL State | Load/save state from query parameters with validation |
| JS: Event Handlers | Palette picker, fractal switcher, toggle buttons, zoom presets, legend highlights |
| JS: WebGL Setup | Shader compilation (vertex + fragment), uniform locations, program linking |
| JS: Fragment Shader | GLSL: Mandelbrot, Julia, Burning Ship, and Newton iteration with cosine palette coloring |
| JS: Render + Overlay | GPU fractal render, CPU overlay for crosshairs, axes, orbit paths |
| JS: Mouse Interaction | Pan (drag), zoom (scroll), hover stats, Julia preview tracking |
| JS: Animation Loop | Lerp-based smooth transitions, needsRender dirty flag, requestAnimationFrame |
| JS: Three.js 3D | Scene, camera, orbit controls, height-mapped plane mesh with per-vertex coloring |
| JS: Ambient Sound | Web Audio API: XHR + decodeAudioData, 3 looping BufferSource nodes with crossfade margins, gain automation |
| JS: Tour System | 5 chapters with timed actions, audio playback, character-by-character caption reveal, ambient duck/unduck/fade |
| JS: Audio Preload | Pre-cache all chapter narration MP3 files |

### Regenerating Narration Audio

Requires an ElevenLabs API key and voice ID:

```bash
ELEVENLABS_API_KEY=<key> ELEVENLABS_VOICE_ID=<voice_id> node scripts/generate-audio.js
```

### Key Design Decisions

- **WebGL over Canvas 2D** — Fractal rendering is a massively parallel per-pixel problem. The GPU can evaluate millions of iterative formulas simultaneously, making real-time exploration possible. Canvas 2D cannot achieve this at interactive frame rates.
- **Immersive full-viewport layout** — The fractal fills the entire browser window. All UI floats on top with text-shadow for legibility rather than opaque panels or glass boxes, preserving the visual immersion.
- **Single-file architecture** — Zero build complexity. Open `index.html` in a browser and everything works.
- **Lerp-based animation** — View transitions (pan, zoom, iteration count) interpolate smoothly via lerp in the animation loop rather than snapping instantly, creating fluid exploration.
- **Tour as documentary** — The guided tour hides all UI, leaving only the fractal, narration text, and minimal controls — creating a documentary-like experience where the mathematics tells its own story.
- **Dark-mode only** — Fractals render against black (bounded interior), making dark mode the natural and only theme. Removes UI complexity while matching the visual character of the content.
