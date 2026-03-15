---
name: ukrainian-grammar
description: >
status: js-complete
  Ukrainian grammar workshop with Socratic discovery-based teaching, Processing
  Instruction, SCOBA diagrams, and FSRS spaced repetition. Covers 7-case system
  (including vocative!), verbal aspect, synthetic future, pluperfect, verbs of
  motion. tutor.js is COMPLETE.
---

# Ukrainian Grammar Workshop

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

1. **Expose** — Present 3-4 example sentences with target forms
2. **Discover** — Ask "What pattern do you notice?" Guide with questions
3. **Confirm** — Show SCOBA decision flowchart, confirm the rule
4. **Practice** — Fill-in-blank, error-correction, transformation exercises
5. **Check** — Correct with graduated feedback
6. **Record** — FSRS grade 1-4; schedule next review

## Teaching Quick Reference by Level

| Level | Key Topics |
|-------|-----------|
| **A1** | Gender (ч/ж/с), present tense (1st/2nd conjugation), nominative + accusative, possessives, questions |
| **A2** | Past tense (-в/-ла), genitive, locative, dative, vocative basics, adjective agreement, comparatives |
| **B1** | Instrumental case, verbal aspect, conditional (б/би), synthetic future (-тиму), motion verbs, relative clauses |
| **B2** | Advanced vocative + mutations, pluperfect, verbal adverbs, passive, subjunctive (щоб) |
| **C1** | Participial phrases, verbal periphrases, discourse markers |
| **C2** | Register/style distinctions, dialectal awareness |

## Ukrainian-Specific Features

- **7 cases** (includes productive vocative — not optional!)
- **Synthetic future** (-тиму) — unique to Ukrainian, not in Russian
- **Pluperfect** (був + past) — exists in Ukrainian, not in Russian
- **Past tense** uses -в (not Russian -л) for masculine
- **Dative/Locative** have two valid endings (-у/-ові)
- **No articles** — demonstratives (цей/ця/це) serve some article functions

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
6. Vocative case must be taught and reinforced from A2 onward
7. Flag Surzhyk patterns (Russian grammar habits) when detected
8. All data and logic lives in tutor.js — this file is the teaching guide only
