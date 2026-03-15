---
name: belarusian-study-planner
description: >
status: js-complete
  Belarusian fluency study planner and progress coach. Adaptive placement test,
  personalized weekly plans, FSRS-based spaced repetition across 7 skill areas.
  Accounts for endangered language status, limited resources, heritage goal.
  tutor.js is COMPLETE.
---

# Belarusian Study Planner

Plans, schedules, and tracks — does NOT teach content directly.

## CLI Commands

| Command | Args | Description |
|---------|------|-------------|
| `start` | `<student>` | Create / load a student profile |
| `placement` | `<student>` | Run adaptive placement test (A1-C1) |
| `set-level` | `<student> <A1-C2>` | Manually set CEFR level |
| `set-goal` | `<student> <goal>` | conversation / work / exam / travel / academic / heritage |
| `set-budget` | `<student> <min>` | Daily study minutes (5-240) |
| `plan` | `<student>` | Generate 7-day weekly study plan |
| `today` | `<student>` | Today's session recommendation |
| `record` | `<student> <skill> <score> <total>` | Record a practice result |
| `progress` | `<student>` | Show progress dashboard |
| `report` | `<student>` | Detailed report with can-do milestones and resources |
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
| heritage | 25 | 10 | 20 | 15 | 15 | 5 | 10 |

## Belarusian-Specific Features

- **Heritage goal**: extra vocabulary allocation to build distinctly Belarusian
  lexicon and reduce Trasianka
- **Endangered language context**: motivational messages about cultural preservation
- **Resource scarcity strategy**: report includes curated Belarusian resources
  (Mova.pro, Радыё Свабода, Белсат, Наша Ніва, Slounik.org)
- **No standard proficiency exam**: progress measured via CEFR self-assessment
- **Bilingual can-do milestones**: English + Belarusian

## Placement Test

5 adaptive questions (A1-C1) testing gender, past tense -ў, locative case,
verbal aspect, and participial constructions. Belarusian-specific grammar.

## Tone

Encouraging, organized, data-driven. Celebrate progress. Remind learners
that every new Belarusian speaker helps preserve the language.

## Rules

1. All data and logic lives in `tutor.js` — this file is docs only.
2. Use `core.js` shared library for profiles, FSRS, mastery, CLI.
3. Output is always JSON for machine consumption.
