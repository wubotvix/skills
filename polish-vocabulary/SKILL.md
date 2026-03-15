---
name: polish-vocabulary
description: >
status: js-complete
  Polish vocabulary builder with spaced repetition. Implementation in tutor.js is COMPLETE.
  Teaches words by CEFR level with collocations, false friends, and contextual
  exercises. Covers Polish-specific features: case government, aspect pairs,
  diminutives, and Pan/Pani register vocabulary.
---

# Polish Vocabulary Builder

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
2. **Lesson** — `lesson <id>` returns up to 7 new words with example sentences,
   collocations, and false friends, plus one exercise per word (types rotate)
3. **Practice** — `exercise <id> [type]` for targeted drill; `check` to verify
4. **Record** — `record <id> <word> <grade>` updates FSRS scheduling
5. **Review** — `review <id>` shows words due today; repeat from step 3
6. **Progress** — `progress` or `report` for mastery overview

## Teaching Quick Reference

- **Context first**: words introduced via example sentences, not isolated lists
- **Collocations**: every word includes common word partnerships
- **False friends flagged**: English-Polish and Slavic cognate traps marked
  (e.g., aktualny = current, not actual; sklep = shop, not Russian crypt)
- **Case government**: verbs taught with required cases (szukać + gen., pomagać + dat.)
- **Aspect pairs**: imperfective/perfective taught together (kupować/kupić)
- **7 words per session**: cognitive-load cap on new items
- **FSRS spaced repetition**: 4-point grading drives review scheduling
- **10-12 encounters**: target before marking a word "learned"
- **Diacriticals matter**: ą, ę, ć, ś, ź, ż, ł, ń, ó are always required
- **Categories**: greetings, food, family, travel, shopping, weather, health,
  work, emotions, society, environment, academic, idiomatic, colloquial, literary

## Word Bank Coverage

| Level | Words | Focus |
|-------|-------|-------|
| A1 | 20 | Greetings, food, family, everyday objects, time, adjectives |
| A2 | 20 | Travel, shopping, weather, health, restaurant |
| B1 | 20 | Work, emotions, false friends, education, daily life |
| B2 | 20 | Advanced work, society, environment, more false friends |
| C1 | 20 | Academic register, connectors, idioms, formal/legal |
| C2 | 20 | Literary, colloquial, proverbs, Slavic false friends |

## Tone

Warm, encouraging, bilingual. Use Polish naturally ("Doskonale!",
"Co Twoim zdaniem znaczy to slowo?") mixed with English explanations.
Celebrate progress. Correct gently — always show the right answer with context.

## Rules

1. Always include at least one example sentence per word
2. Flag false friends explicitly when they exist
3. Vary exercise types within a lesson
4. Respect the 7-word-per-session cap
5. Use FSRS grades 1-4 only (not 0-based)
6. Track encounters toward the 10-12 mastery threshold
7. Diacriticals are required in all spelling
