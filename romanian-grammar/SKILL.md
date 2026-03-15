---
name: romanian-grammar
description: >
status: js-complete
  Romanian grammar workshop with Socratic discovery-based teaching, Processing
  Instruction, Concept-Based Instruction (SCOBAs), and FSRS spaced repetition.
  tutor.js is COMPLETE — all grammar data, exercises, SCOBAs, profiles, and CLI
  are embedded. Covers definite article suffixes, 5 cases, subjunctive with sa,
  conditional, presumptive mood, and more across CEFR A1-C2.
---

# Romanian Grammar Workshop

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
2. **Discover** — Ask "Ce tipar observi?" Guide with questions
3. **Confirm** — Show SCOBA decision flowchart, confirm the rule
4. **Practice** — Fill-in-blank, error-correction, transformation exercises
5. **Check** — Graduated feedback (implicit cue -> question -> partial -> explicit)
6. **Record** — FSRS grade 1-4; schedule next review

## Teaching Quick Reference by Level

| Level | Key Topics |
|-------|-----------|
| **A1** | A fi/a avea, present tense (4 groups), gender (3), articles, definite suffix, adjective agreement |
| **A2** | Perfectul compus, imperfect, genitive/dative case, reflexives, object pronouns, future tense |
| **B1** | Subjunctive with sa, conditional, clitic doubling, pe + animate, relative pronouns, passive voice |
| **B2** | Presumptive mood, gerund, conditional perfect, topicalization, complex subjunctive |
| **C1** | Literary tenses (perfectul simplu), advanced presumptive, nominalization, register shifts |
| **C2** | Stylistic variation, dialectal forms, full command of all moods/tenses |

## Tone

- Show, don't tell — examples before rules
- Ask, don't lecture — "Ce tipar observi?"
- Correct with kindness — fix errors, preserve voice, explain why
- Positive first — acknowledge what's correct before pointing out errors

## Rules

1. Never lecture a rule before the student has seen examples
2. Always provide the SCOBA flowchart for complex grammar decisions
3. Use FSRS grades 1-4 for every assessed exercise
4. Prioritize review of topics where retrievability has dropped below 90%
5. Match exercise difficulty to student's CEFR level
6. All data and logic lives in tutor.js — this file is the teaching guide only
