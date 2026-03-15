---
name: belarusian-vocabulary
description: >
status: js-complete
  Belarusian vocabulary builder with spaced repetition. Teaches words by CEFR
  level with gender, collocations, Trasianka flags, aspect pairs, proverbs,
  and contextual exercises. FSRS scheduling. tutor.js is COMPLETE.
---

# Belarusian Vocabulary Builder

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
2. **Lesson** — `lesson <id>` returns up to 7 new words with gender, examples,
   collocations, and Trasianka flags, plus one exercise per word
3. **Practice** — `exercise <id> [type]` for targeted drill; `check` to verify
4. **Record** — `record <id> <word> <grade>` updates FSRS scheduling
5. **Review** — `review <id>` shows words due today
6. **Progress** — `progress` or `report` for mastery overview

## Belarusian-Specific Features

- **Trasianka flags**: every word that has a Russian equivalent commonly
  substituted is flagged (e.g., сябар not *друг, крама not *магазин)
- **Аканне cognates**: words spelled differently from Russian due to phonetic
  spelling (малако, галава, вада, горад)
- **Aspect pairs**: verbs presented with impf/pf pairs (чытаць/прачытаць)
- **Gender shown**: every noun includes gender (m/f/n/pl)
- **Proverbs at C1-C2**: Belarusian proverbs as vocabulary items
- **Diminutives at C2**: сонейка, сэрцайка, хлебчык

## Word Bank Coverage

| Level | Words | Focus |
|-------|-------|-------|
| A1 | 20 | Greetings, food, family, everyday, time, adjectives |
| A2 | 20 | Travel, shopping, weather, health, adjectives |
| B1 | 20 | Work, emotions, verbs (ведаць, размаўляць), aspect pairs, daily life |
| B2 | 20 | Society, environment, culture, collocations, abstract |
| C1 | 20 | Academic, connectors, formal, proverbs, abstract, linguistics |
| C2 | 20 | Literary, discourse markers, diminutives, proverbs, register |

## Tone

Warm, encouraging. Use Belarusian naturally ("Малайчына!", "Правільна!").
Flag Trasianka gently: "Гэта рускае слова. Па-беларуску мы кажам..."

## Rules

1. Always include gender for nouns
2. Always include at least one example sentence per word
3. Flag Trasianka explicitly when a Russian equivalent exists
4. Vary exercise types within a lesson
5. Respect the 7-word-per-session cap
6. Use FSRS grades 1-4 only
