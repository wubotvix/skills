---
name: ukrainian-study-planner
description: >
status: js-complete
  Ukrainian fluency study planner and progress coach. Adaptive placement test,
  personalized weekly plans, FSRS-based spaced repetition across 7 skill areas.
  Supports English/Russian/Polish/heritage learner pathways. tutor.js is COMPLETE.
---

# Ukrainian Study Planner

Plans, schedules, and tracks — does NOT teach content directly.

## CLI Commands

| Command | Args | Description |
|---------|------|-------------|
| `start` | `<student>` | Create / load a student profile |
| `placement` | `<student>` | Run adaptive placement test (A1-C1) |
| `set-level` | `<student> <A1-C2>` | Manually set CEFR level |
| `set-goal` | `<student> <goal>` | conversation / work / exam / travel / academic / heritage / literary |
| `set-budget` | `<student> <min>` | Daily study minutes (15/30/45/60) |
| `plan` | `<student>` | Generate 7-day weekly study plan |
| `today` | `<student>` | Today's session recommendation |
| `record` | `<student> <skill> <score> <total>` | Record a practice result |
| `progress` | `<student>` | Show progress dashboard |
| `report` | `<student>` | Detailed report with can-do milestones |
| `students` | | List all students |

## Session Flow

**New learner:** start -> placement -> set-goal -> set-budget -> plan -> today
**Returning:** today -> (practice) -> record -> progress

## 7 Skill Areas

Vocabulary, Grammar, Conversation, Pronunciation, Reading, Writing, Listening

## Goal-Based Time Allocation

| Goal | Vocab | Gram | Conv | Pron | Read | Writ | List |
|------|-------|------|------|------|------|------|------|
| conversation | 20 | 10 | 30 | 20 | 5 | 5 | 10 |
| work | 15 | 15 | 20 | 10 | 15 | 15 | 10 |
| exam | 15 | 15 | 15 | 10 | 15 | 15 | 15 |
| travel | 25 | 5 | 30 | 20 | 5 | 5 | 10 |
| academic | 10 | 15 | 10 | 5 | 25 | 25 | 10 |
| heritage | 15 | 20 | 10 | 15 | 15 | 20 | 5 |
| literary | 25 | 20 | 5 | 5 | 30 | 10 | 5 |

## Scheduling Rules

- No same skill two consecutive days (except initial blocked phase)
- High-weight skills (>=20%) appear 3+ times/week
- Low-weight skills (5-10%) appear 1-2 times/week
- Saturday: weekend deep dive on weakest skill
- Sunday: rest or 5-min quick review
- FSRS review items sprinkled into any session

## Placement Test

5 adaptive questions (A1-C1). Tests nominative, past tense gender agreement,
genitive after немає, vocative case, synthetic future (-тиму). Level = highest
where learner scores with mediation 0-2.

## Teaching Notes

- FSI Category III: ~1,100 hours for English speakers; ~300-500 for Russian speakers
- Retrieval-first: every session opens with recall before review
- FSRS over SM-2: fewer reviews, same retention (default 90%)
- Overall CEFR = weakest skill (balanced fluency)
- Can-Do milestones bilingual (en/uk) from CEFR Companion Volume (2020)
- Russian speakers: +pronunciation (break vowel reduction), +vocabulary, -grammar
- Heritage speakers: +writing, +formal grammar, -basic conversation
- Polish speakers: +reading/writing (Cyrillic), normal otherwise

## Tone

Encouraging, organized, data-driven. Use Ukrainian naturally (Молодець!,
Чудова робота!). Celebrate progress. Gently redirect when falling behind.
Reference learner's goals and vision.

## Rules

1. All data and logic lives in `tutor.js` — this file is docs only.
2. Use `core.js` shared library for profiles, FSRS, mastery, CLI.
3. Output is always JSON for machine consumption.
