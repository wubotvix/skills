---
name: portuguese-grammar
description: >
status: js-complete
  Portuguese grammar workshop with Socratic discovery-based teaching, Processing
  Instruction, Concept-Based Instruction (SCOBAs), and FSRS spaced repetition.
  tutor.js is COMPLETE — all grammar data, exercises, SCOBAs, profiles, and CLI
  are embedded. Covers ser/estar/ficar, personal infinitive, future subjunctive,
  clitic placement, and more across CEFR A1-C2.
---

# Portuguese Grammar Workshop

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
2. **Discover** — Ask "What pattern do you notice?" Guide with questions
3. **Confirm** — Show SCOBA decision flowchart, confirm the rule
4. **Practice** — Fill-in-blank, error-correction, transformation exercises
5. **Check** — Correct with graduated feedback (implicit cue -> question -> partial -> explicit)
6. **Record** — FSRS grade 1-4; schedule next review

## Teaching Quick Reference by Level

| Level | Key Topics |
|-------|-----------|
| **A1** | Ser/estar/ficar, present regular+irregular, gender/articles, adjective agreement, gostar de, ter/haver |
| **A2** | Pretérito perfeito regular+irregular, reflexives, ir + infinitive, direct object pronouns, comparatives |
| **B1** | Imperfeito, perfeito vs imperfeito, pretérito perfeito composto (ter + particípio), conjuntivo presente (WEIRDO), por/para, condicional, personal infinitive (intro) |
| **B2** | Full conjuntivo, imperfeito do conjuntivo, si clauses, passive (ser/estar + particípio), advanced ser/estar/ficar, reported speech, personal infinitive (advanced) |
| **C1** | Mais-que-perfeito do conjuntivo, future subjunctive, concessive clauses, verbal periphrases, discourse markers, clitic placement (mesoclisis) |
| **C2** | Future subjunctive in formal/legal, register mastery (tu/você/o senhor), subtle mood distinctions, BR vs EP grammar differences |

## Exercise Types

- **fill** — Complete with correct form: "Eu ___ (falar) português."
- **error** — Find and fix the grammar error: "Eu sou cansado."
- **transform** — Rewrite the sentence: active to passive, indicative to conjuntivo

## Graduated Feedback (Dynamic Assessment)

| Level | Prompt | Mastery Signal |
|-------|--------|---------------|
| 1 | Implicit cue: "Something's not quite right." | Near mastery |
| 2 | Leading question: "Look at the time expression." | Developing |
| 3 | Partial answer: "We need conjuntivo because..." | Emerging |
| 4 | Explicit correction + rule | Not yet acquired |

Start at level 1, escalate only if needed.

## Tone

- Show, don't tell — examples before rules
- Ask, don't lecture — "What pattern do you notice?"
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
