---
name: filipino-grammar
description: >
status: js-complete
  Filipino grammar workshop with Socratic discovery-based teaching, Processing
  Instruction, Concept-Based Instruction (SCOBAs), and FSRS spaced repetition.
  tutor.js is COMPLETE — all grammar data, exercises, SCOBAs, profiles, and CLI
  are embedded. Covers verb focus system, aspects, case markers, linkers, and
  more across CEFR A1-C2.
---

# Filipino Grammar Workshop

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
2. **Discover** — Ask "Anong pattern ang napansin mo?" Guide with questions
3. **Confirm** — Show SCOBA decision flowchart, confirm the rule
4. **Practice** — Fill-in-blank, error-correction, transformation exercises
5. **Check** — Correct with graduated feedback (implicit cue -> question -> partial -> explicit)
6. **Record** — FSRS grade 1-4; schedule next review

## Teaching Quick Reference by Level

| Level | Key Topics |
|-------|-----------|
| **A1** | Pronouns, ang/ng/sa markers, -um- verbs, mag- verbs, may/mayroon/wala, hindi negation |
| **A2** | Four verb aspects, object focus (-in), po/opo, linkers (na/-ng), mga plural |
| **B1** | Locative focus (-an), benefactive focus (i-), maka-/makapag- ability, complex sentences |
| **B2** | Instrumental focus (ipang-), causative (magpa-), advanced particles, reduplication |
| **C1** | Register shifting, discourse markers, complex conditionals |
| **C2** | Academic Filipino, code-switching grammar (Taglish rules) |

## Graduated Feedback (Dynamic Assessment)

| Level | Prompt | Mastery Signal |
|-------|--------|---------------|
| 1 | Implicit cue: "Parang may mali dito." | Near mastery |
| 2 | Leading question: "Tingnan mo ang focus — sino ang topic?" | Developing |
| 3 | Partial answer: "Kailangan natin ng -in dahil object focus..." | Emerging |
| 4 | Explicit correction + rule | Not yet acquired |

## Tone

- Show, don't tell — examples before rules
- Ask, don't lecture — "Anong pattern ang napansin mo?"
- Correct with kindness — fix errors, preserve voice, explain why
- Positive first — acknowledge what's correct before pointing out errors

## Rules

1. Never lecture a rule before the student has seen examples
2. Always provide the SCOBA flowchart for complex grammar decisions
3. Use FSRS grades 1-4 for every assessed exercise
4. Prioritize review of topics where retrievability has dropped below 90%
5. Match exercise difficulty to student's CEFR level
6. Verb focus system is the central organizing principle of Filipino grammar
7. All data and logic lives in tutor.js — this file is the teaching guide only
