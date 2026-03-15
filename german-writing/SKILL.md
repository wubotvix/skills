---
name: german-writing
description: >
status: js-complete
  German writing workshop with process-genre approach (Planen, Entwerfen,
  Ueberarbeiten, Feilen), CEFR-graded prompts, and structured feedback.
  FSRS-tracked. tutor.js is COMPLETE — all prompts, correction categories,
  profiles, and CLI are embedded.
---

# German Writing Workshop

## CLI Commands

| Command | Args | Description |
|---------|------|-------------|
| `start` | `<studentId>` | Load or create student profile |
| `set-level` | `<studentId> <A1-C2>` | Set CEFR level |
| `lesson` | `<studentId> [promptId]` | Generate writing lesson with prompt + guidance |
| `check` | `<promptId> <text>` | Check submitted writing with structured feedback |
| `record` | `<studentId> <promptId> <1-4>` | Record FSRS grade |
| `progress` | `<studentId>` | Progress summary |
| `report` | `<studentId>` | Full report with recent assessments |
| `prompts` | `[level]` | List available writing prompts |
| `students` | | List all student profiles |

## Session Flow

1. **Planen** — Identify audience, purpose, register (Sie/du); create Gliederung
2. **Entwerfen** — Write first draft following outline; ideas before polish
3. **Ueberarbeiten** — Revise for structure, argumentation, coherence
4. **Feilen** — Polish grammar, spelling, Kommasetzung, register consistency
5. **Record** — FSRS grade 1-4 for spaced repetition

## Writing Types by Level

| Level | Types |
|-------|-------|
| A1 | Postkarten, simple emails, forms, short descriptions |
| A2 | Personal emails, short messages, weekend narratives |
| B1 | Informal/formal letters, short essays, blog entries |
| B2 | Eroerterung (linear/dialectical), Bewerbungsschreiben, Beschwerdebriefe |
| C1 | Scientific abstracts, Fachberichte, Literaturkritik |
| C2 | Feuilleton, creative writing, publication-ready articles |

## German-Specific Writing Features

- **Noun capitalization**: all nouns uppercase, including nominalizations
- **Compound nouns (Komposita)**: written as one word with Fugenelemente
- **Eszett rules**: ss after short vowels, ss after long vowels/diphthongs
- **Comma rules (Kommaregeln)**: mandatory before Nebensaetze, relative clauses
- **Register (Sie/du)**: formal vs informal address affects entire text
- **Eroerterung structure**: BBB (Behauptung-Begruendung-Beispiel) argumentation
- **Nominal style (Nominalstil)**: formal/academic register uses nominalizations
- **German quotation marks**: unten-oben style, not English-style

## Correction Categories

| Code | Category | Example |
|------|----------|---------|
| GEN | Genus | das Maedchen (neuter) not die Maedchen |
| KAS | Kasus | mit dem Mann (Dativ) not mit den Mann |
| WS | Wortstellung | Gestern bin ich... not Gestern ich bin... |
| ADJ | Adjektivendung | ein grosser Mann not ein grosses Mann |
| KOM | Komposita | Handschuh not Hand Schuh |
| KO | Kommasetzung | Ich weiss, dass... not Ich weiss dass... |
| RS | Rechtschreibung | Strasse spelling corrections |
| REG | Register | formal/informal mismatch |

## Tone

Encouraging writing coach. Guide the process, not just correct the product.
Positive feedback first, then prioritized corrections calibrated to level.

## Rules

1. All data and logic lives in tutor.js
2. Use FSRS grades 1-4 for every writing task
3. Follow process-genre approach: Planen, Entwerfen, Ueberarbeiten, Feilen
4. Calibrate feedback to CEFR level (focused direct at A1-A2, indirect at C1-C2)
5. Teach Eroerterung structure explicitly from B2
6. Highlight register (Sie/du) and Kommasetzung as persistent focus areas
