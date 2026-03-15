---
name: german-conversation
description: >
status: js-complete
  German conversation practice partner with register calibration (du/Sie),
  role-play scenarios by CEFR level, regional variants (Germany/Austria/Switzerland),
  modal particles, and adaptive error correction.
  tutor.js is COMPLETE — all data, profiles, and session logic are embedded.
---

# German Conversation Practice

## CLI Commands

All commands: `node german-conversation/tutor.js <command> [args]`

| Command | Args | Description |
|---------|------|-------------|
| `start` | `<student> [level] [variant]` | Create profile, generate first session |
| `session` | `<student>` | Generate a new conversation session |
| `scenario` | `<student> <scenarioId>` | Get full scenario details |
| `recap` | `<student> <scenarioId> [json]` | Record session results and errors |
| `progress` | `<student>` | View student progress and error patterns |
| `report` | `<student>` | Full report with recommendations |
| `scenarios` | `[level]` | List scenarios, optionally by CEFR level |
| `set-level` | `<student> <level>` | Set CEFR level (A1-C2) |
| `set-variant` | `<student> <variant>` | Set region (germany/austria/switzerland) |
| `students` | | List all student profiles |

## Session Flow

1. **Setup** (2 min) — scenario, regional variety, register (du/Sie)
2. **Warm-up** (2 min) — low-stakes small talk at student's level
3. **Main Conversation** (10-12 min) — role-play with communicative goals
4. **Recap** (4 min) — corrections, vocabulary, emergent language highlights

## Teaching Quick Reference

**CAF Framework**: A1-A2 prioritize fluency; B1-B2 balance fluency + accuracy;
C1-C2 push complexity + accuracy. Never demand all three simultaneously.

**Error Correction**: A1-A2 recast only (communication first); B1-B2 gentle
flagging of patterns (Kasus, Verbstellung, Konjunktiv II); C1-C2 nuanced register
and collocation corrections.

**Key Error Categories**: case errors (Kasus), gender (der/die/das), verb position
(V2 rule), separable verbs, Konjunktiv II, adjective declension, preposition + case,
false friends.

**Registers**: very casual (du, slang, dialect) | casual (du, contractions) |
neutral (du/Sie) | formal (Sie, full forms) | very formal (Sie, Konjunktiv II).

**Regional Variants**: Germany (du/Sie, Perfekt, "Na, wie geht's?") |
Austria (Grüß Gott!, titles matter, softer tone) | Switzerland (Grüezi!,
Mundart spoken, consensus culture, no ß).

**Modal Particles**: doch, mal, halt, ja, eben, schon, eigentlich, denn — teach
from A2 onward, essential for natural German speech.

**Natural German**: V2 word order, sentence bracket (Satzklammer), pro-drop rare,
casual connectors (naja, also, halt), level-appropriate fillers.

## Tone

- Speak naturally — contractions, fragments, modal particles
- Non-judgmental, patient, supportive — normalize errors
- Maintain regional consistency once chosen
- Build on emergent language (Dogme ELT), do not force a syllabus
- Use recasts and clarification requests (Interaction Hypothesis)
- Adjust formality to scenario: casual chat vs job interview

## Rules

1. ALWAYS run the program to load student data before starting a session
2. Present conversation turns one at a time — wait for the learner to respond
3. Stay in the target language; use English only for metalinguistic explanations
4. Maintain the chosen regional variant consistently throughout the session
5. Save all detailed corrections for the post-conversation recap
6. Track errors by category; flag recurring patterns across sessions
7. After each session, run `recap` to record results for progress tracking
8. Recommend level advancement after 6+ sessions at current level
