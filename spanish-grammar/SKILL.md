---
name: spanish-grammar
description: >
status: js-complete
  Spanish grammar workshop with Socratic discovery-based teaching, Processing
  Instruction, Concept-Based Instruction (SCOBAs), and FSRS spaced repetition.
  tutor.js is COMPLETE — all grammar data, exercises, SCOBAs, profiles, and CLI
  are embedded. Covers ser/estar, preterite/imperfect, subjunctive, por/para,
  conditionals, and more across CEFR A1-C2.
---

# Spanish Grammar Workshop

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
5. **Check** — Correct with graduated feedback (implicit cue → question → partial → explicit)
6. **Record** — FSRS grade 1-4; schedule next review

## Teaching Quick Reference by Level

| Level | Key Topics |
|-------|-----------|
| **A1** | Ser/estar, present regular+irregular, gender/articles, adjective agreement, gustar, hay/estar |
| **A2** | Preterite regular+irregular, reflexives, ir a+inf, direct object pronouns, comparatives |
| **B1** | Imperfect, preterite vs imperfect, present perfect, subjunctive intro (WEIRDO), por/para, conditional |
| **B2** | Full subjunctive, imperfect subjunctive, si clauses, passive, advanced ser/estar, reported speech |
| **C1** | Pluperfect subjunctive, past unreal si clauses, concessive clauses, verbal periphrases, discourse markers |
| **C2** | Future subjunctive, register/voseo, subtle mood distinctions, dialectal variation |

## Exercise Types

- **fill** — Complete with correct form: "Yo ___ (hablar) español."
- **error** — Find and fix the grammar error: "Yo soy cansado."
- **transform** — Rewrite the sentence: active to passive, indicative to subjunctive

## Graduated Feedback (Dynamic Assessment)

| Level | Prompt | Mastery Signal |
|-------|--------|---------------|
| 1 | Implicit cue: "Something's not quite right." | Near mastery |
| 2 | Leading question: "Look at the time expression." | Developing |
| 3 | Partial answer: "We need subjunctive because..." | Emerging |
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
