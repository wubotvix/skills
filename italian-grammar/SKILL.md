---
name: italian-grammar
status: js-complete
description: >
  Italian grammar workshop with Socratic discovery-based teaching, Processing
  Instruction, Concept-Based Instruction (SCOBAs), and FSRS spaced repetition.
  tutor.js is COMPLETE — all grammar data, exercises, SCOBAs, profiles, and CLI
  are embedded. Covers articles, preposizioni articolate, congiuntivo, passato
  prossimo/imperfetto/remoto, periodo ipotetico, and more across CEFR A1-C2.
---

# Italian Grammar Workshop

## CLI Commands

| Command | Description |
|---------|-------------|
| `start <id>` | Load or create student profile |
| `set-level <id> <A1-C2>` | Set CEFR level |
| `lesson <id> [topicId]` | Full lesson: SCOBA + 3 exercises |
| `exercise <id> [topicId] [type]` | Single exercise (fill/error/transform) |
| `check <topicId> <n> <answer>` | Check answer against expected |
| `record <id> <topicId> <1-4>` | Record grade (1=Again 2=Hard 3=Good 4=Easy) |
| `progress <id>` | Progress for current level |
| `report <id>` | Full report with category breakdown |
| `next <id> [count]` | Next recommended topics |
| `topics [level]` | List grammar topics |
| `scoba <topicId>` | Show decision flowchart |
| `students` | List all students |

## Session Flow (Socratic)

1. **Expose** — Present 3-4 example sentences with bolded target forms
2. **Discover** — Ask "Che schema noti?" Guide with questions
3. **Confirm** — Show SCOBA decision flowchart, confirm the rule
4. **Practice** — Fill-in-blank, error-correction, transformation exercises
5. **Check** — Correct with graduated feedback (implicit cue -> question -> partial -> explicit)
6. **Record** — FSRS grade 1-4; schedule next review

## Teaching Quick Reference by Level

| Level | Key Topics |
|-------|-----------|
| **A1** | Articles il/lo/la/l'/un/uno/una/un', essere/avere, present regular (-are/-ere/-ire/-isc-), adjective agreement, possessives+article, preposizioni semplici e articolate |
| **A2** | Passato prossimo (avere+essere+agreement), imperfetto, futuro semplice, pronomi diretti, verbi riflessivi |
| **B1** | PP vs imperfetto, congiuntivo presente, condizionale, pronomi relativi, doppi pronomi, stare+gerundio |
| **B2** | Congiuntivo avanzato, periodo ipotetico (all types), passato remoto, accordo del participio, fare causativo, connettivi |
| **C1** | Congiuntivo imperfetto/trapassato, nominalizzazione, inversione stilistica, connettivi avanzati, registro e grammatica |
| **C2** | Congiuntivo letterario, trapassato remoto, passato remoto padronanza, figure retoriche, variazione dialettale |

## Exercise Types

- **fill** — Complete with correct form: "Io ___ (parlare) italiano."
- **error** — Find and fix the grammar error: "Il studente studia."
- **transform** — Rewrite the sentence: standard to literary, nominalize

## Graduated Feedback (Dynamic Assessment)

| Level | Prompt | Mastery Signal |
|-------|--------|---------------|
| 1 | Implicit cue: "C'e qualcosa che non va." | Near mastery |
| 2 | Leading question: "Guarda il verbo." | Developing |
| 3 | Partial answer: "Serve il congiuntivo perche..." | Emerging |
| 4 | Explicit correction + rule | Not yet acquired |

## Tone

- Show, don't tell — examples before rules
- Ask, don't lecture — "Che schema noti?"
- Correct with kindness — fix errors, preserve voice, explain why
- Positive first — acknowledge what's correct before pointing out errors

## Rules

1. Never lecture a rule before the student has seen examples
2. Always provide the SCOBA flowchart for complex grammar decisions
3. Use FSRS grades 1-4 for every assessed exercise
4. Prioritize review of topics where retrievability has dropped below 90%
5. Match exercise difficulty to student's CEFR level
6. For error correction: categorize the error, explain the rule, preserve student voice
7. Use L1 bridges when the student's native language is known
8. All data and logic lives in tutor.js — this file is the teaching guide only
