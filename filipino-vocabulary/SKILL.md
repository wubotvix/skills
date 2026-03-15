---
name: filipino-vocabulary
description: >
status: js-complete
  Filipino vocabulary builder with spaced repetition. Implementation in tutor.js
  is COMPLETE. Teaches words by CEFR level with roots, affixes, collocations,
  Spanish loanwords, idioms (sawikain), and proverbs (salawikain). Contextual
  exercises with FSRS scheduling.
---

# Filipino Vocabulary Builder

## CLI Commands

| Command | Args | Description |
|---------|------|-------------|
| `start` | `<studentId>` | Load or create student profile |
| `set-level` | `<studentId> <A1-C2>` | Set CEFR level |
| `lesson` | `<studentId>` | Generate lesson (new words + mixed exercises) |
| `exercise` | `<studentId> [type]` | Single exercise: definition, fill-in-blank, matching, context-guess, collocation |
| `check` | `<studentId> <exerciseJSON> <answer>` | Check an answer |
| `record` | `<studentId> <word> <grade>` | Record FSRS grade (1=forgot, 2=hard, 3=good, 4=easy) |
| `review` | `<studentId>` | List words due for review |
| `progress` | `<studentId>` | Mastery summary |
| `report` | `<studentId>` | Full student report |
| `next` | `<studentId>` | Upcoming topics by category |
| `words` | `[level]` | Browse word catalog |
| `students` | | List all students |

## Session Flow

1. **Start** — load profile; set level if new
2. **Lesson** — up to 7 new words with roots, examples, collocations, loanword notes
3. **Practice** — exercises rotate through 5 types automatically
4. **Record** — FSRS grade updates scheduling
5. **Review** — words due today; repeat practice
6. **Progress** — mastery overview

## Teaching Quick Reference

- **Roots unlock families**: teach root + affixes (aral -> mag-aral, aralin, pag-aaral, paaralan)
- **Spanish loanwords flagged**: mesa, silya, eskwela, kumusta (~20-33% of vocabulary)
- **Context first**: words introduced via example sentences, never isolated
- **Collocations**: common word partnerships included
- **Sawikain (idioms)**: balat-sibuyas, matigas ang ulo, etc. at B1+
- **Salawikain (proverbs)**: "Kapag may tiyaga, may nilaga" at B1+
- **False friends**: "salvage" in Filipino = extrajudicial killing (C2)
- **7 words per session**: cognitive-load cap
- **FSRS spaced repetition**: 4-point grading drives review scheduling

## Word Bank Coverage

| Level | Words | Focus |
|-------|-------|-------|
| A1 | 20 | Greetings, food, family, everyday objects, time, adjectives |
| A2 | 20 | Transport, shopping, weather, health, daily life, feelings, actions |
| B1 | 15 | Work, abstract concepts, idioms, education, connectors, salawikain |
| B2 | 10 | Academic, society, formal connectors, more idioms |
| C1 | 5 | Formal Filipino, literary connectors |
| C2 | 4 | Literary, false friends, cultural vocabulary |

## Tone

Warm, encouraging, bilingual. Use Filipino naturally ("Magaling!", "Tama!")
mixed with English explanations. Celebrate progress. Correct gently.

## Rules

1. Always include example sentence per word
2. Flag Spanish loanwords and false friends explicitly
3. Show root + affix breakdown when applicable
4. Vary exercise types within a lesson
5. Respect the 7-word-per-session cap
6. Use FSRS grades 1-4; track encounters toward mastery
