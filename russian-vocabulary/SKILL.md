---
name: russian-vocabulary
description: >
status: js-complete
  Russian vocabulary builder with spaced repetition. Implementation in tutor.js is COMPLETE.
  Teaches words by CEFR level with gender, aspect pairs, collocations, false friends, and
  contextual exercises. Use when the learner wants to "learn new words", "practice vocabulary",
  "study verbs", or build Russian word knowledge.
---

# Russian Vocabulary Builder

## CLI Commands

| Command | Args | Description |
|---------|------|-------------|
| `start` | `<studentId>` | Load or create student profile |
| `set-level` | `<studentId> <A1-C2>` | Set CEFR level |
| `lesson` | `<studentId>` | Generate lesson (new words + mixed exercises) |
| `exercise` | `<studentId> [type]` | Single exercise: definition, fill-in-blank, matching, context-guess, collocation |
| `check` | `<studentId> <exerciseJSON> <answer>` | Check an answer |
| `record` | `<studentId> <word> <grade>` | Record FSRS grade (1=forgot, 2=hard, 3=good, 4=easy) |
| `review` | `<studentId>` | List words due for spaced-repetition review |
| `progress` | `<studentId>` | Mastery summary per word |
| `report` | `<studentId>` | Full student report |
| `next` | `<studentId>` | Upcoming topics grouped by category |
| `words` | `[level]` | Browse word catalog (all levels or one) |
| `students` | | List all student profiles |

## Session Flow

1. **Start** — `start <id>` loads profile; set level if new
2. **Lesson** — `lesson <id>` returns up to 7 new words with gender, example sentences,
   collocations, aspect pairs, and false friends, plus one exercise per word
3. **Practice** — `exercise <id> [type]` for targeted drill; `check` to verify answers
4. **Record** — `record <id> <word> <grade>` updates FSRS scheduling
5. **Review** — `review <id>` shows words due today; repeat from step 3
6. **Progress** — `progress` or `report` for mastery overview

## Teaching Quick Reference

- **Gender is mandatory**: every noun presented with gender (м/ж/с), never bare
- **Aspect pairs always together**: verbs presented as impf./pf. pairs
- **Context first**: words introduced via example sentences, not isolated lists
- **Collocations**: every word includes common word partnerships
- **False friends flagged**: Russian-English cognate traps marked explicitly
  (e.g., *магази́н* = store, not magazine; *фами́лия* = surname, not family)
- **Stress marks on every word**: critical for Russian pronunciation
- **7 words per session**: cognitive-load cap on new items
- **FSRS spaced repetition**: 4-point grading drives review scheduling
- **10-12 encounters**: target before marking a word "learned"
- **Categories**: greetings, food, family, travel, shopping, weather, health,
  work, emotions, education, aspect-pairs, false-friends, discourse, academic

## Word Bank Coverage

| Level | Words | Focus |
|-------|-------|-------|
| A1 | 20 | Greetings, food, family, everyday objects, time, adjectives |
| A2 | 20 | Travel, shopping, weather, health, motion verbs, aspect pairs |
| B1 | 20 | Opinions, aspect pairs, work, emotions, education, false friends |
| B2 | 20 | Academic register, discourse markers, formal verbs, false friends |
| C1 | 10 | Academic hedging, bureaucratic vocabulary, verbal nouns |
| C2 | 5 | Stylistic terms, advanced discourse markers |

## Tone

Warm, encouraging, bilingual. Use Russian naturally ("Отли́чно!",
"Что, по-ва́шему, означа́ет э́то сло́во?") mixed with English explanations.
Celebrate progress. Correct gently — always show the right answer with context.

## Rules

1. Never present a noun without its gender (м/ж/с)
2. Never present a verb without its aspect pair
3. Always include at least one example sentence per word
4. Flag false friends explicitly when they exist
5. Vary exercise types within a lesson
6. Respect the 7-word-per-session cap
7. Use FSRS grades 1-4 only
8. Track encounters toward the 10-12 mastery threshold
9. Always show stress marks on Russian words
