---
name: ukrainian-vocabulary
description: >
status: js-complete
  Ukrainian vocabulary builder with spaced repetition. Teaches words by CEFR level
  with gender, stress, collocations, aspect pairs, Ukrainian-Russian false friends,
  and contextual exercises. tutor.js is COMPLETE.
---

# Ukrainian Vocabulary Builder

## CLI Commands

| Command | Args | Description |
|---------|------|-------------|
| `start` | `<student>` | Load or create student profile |
| `set-level` | `<student> <A1-C2>` | Set CEFR level |
| `lesson` | `<student>` | Generate lesson (new words + mixed exercises) |
| `exercise` | `<student> [type]` | Single exercise: definition, fill-in-blank, matching, context-guess, collocation |
| `check` | `<student> <exerciseJSON> <answer>` | Check an answer |
| `record` | `<student> <word> <grade>` | Record FSRS grade (1=forgot, 2=hard, 3=good, 4=easy) |
| `review` | `<student>` | List words due for spaced-repetition review |
| `progress` | `<student>` | Mastery summary per word |
| `report` | `<student>` | Full student report |
| `next` | `<student>` | Upcoming topics grouped by category |
| `words` | `[level]` | Browse word catalog (all levels or one) |
| `students` | | List all student profiles |

## Session Flow

1. **Start** — `start <id>` loads profile; set level if new
2. **Lesson** — `lesson <id>` returns up to 7 new words with gender, stress, example
   sentences, collocations, and false friends, plus one exercise per word
3. **Practice** — `exercise <id> [type]` for targeted drill; `check` to verify
4. **Record** — `record <id> <word> <grade>` updates FSRS scheduling
5. **Review** — `review <id>` shows words due today; repeat from step 3
6. **Progress** — `progress` or `report` for mastery overview

## Teaching Quick Reference

- **Gender is mandatory**: every noun presented with ч/ж/с (чоловічий/жіночий/середній)
- **Stress marks**: Ukrainian has free stress — always mark it on new words
- **Context first**: words introduced via example sentences, not isolated lists
- **Collocations**: every word includes common word partnerships with case government
- **False friends flagged**: Ukrainian-Russian cognate traps marked explicitly
  (e.g., *вродливий* = beautiful, NOT ugly; *неділя* = Sunday, NOT week)
- **Aspect pairs**: verbs always shown with imperfective/perfective pair
- **Vocative forms**: nouns used in direct address show vocative (друже!, мамо!, лікарю!)
- **7 words per session**: cognitive-load cap on new items
- **FSRS spaced repetition**: 4-point grading drives review scheduling
- **Categories**: greetings, food, family, everyday, time, travel, shopping, weather,
  health, work, emotions, function words, education, society, environment, academic,
  connectors, idiomatic, formal, literary, diminutive, colloquial, regional

## Word Bank Coverage

| Level | Words | Focus |
|-------|-------|-------|
| A1 | 20 | Greetings (дякую, будь ласка), food, family, everyday objects, time, adjectives |
| A2 | 20 | Travel, shopping, weather, health, Ukrainian-Russian differences (вибачте) |
| B1 | 18 | Work, emotions, function words (але, або, дуже, завжди), education |
| B2 | 18 | Society, environment, false friends (вродливий, неділя, чоловік), heritage |
| C1 | 16 | Academic register, connectors (водночас, натомість), formal/legal, idioms |
| C2 | 14 | Literary, proverbs, diminutives (сонечко), regional words (файний), academic |

## Tone

Warm, encouraging, bilingual. Use Ukrainian naturally ("Чудово!", "Молодець!",
"Що означає це слово?") mixed with English explanations. Celebrate progress.
Correct gently — always show the right answer with context.

## Rules

1. Never present a noun without its gender (ч/ж/с)
2. Always include stress marks on new words
3. Flag false friends explicitly when they exist (especially Ukrainian vs Russian)
4. Vary exercise types within a lesson
5. Respect the 7-word-per-session cap
6. Use FSRS grades 1-4 only (not 0-based)
7. Track encounters toward the 10-12 mastery threshold
8. All data and logic lives in tutor.js — this file is docs only
