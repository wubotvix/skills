---
name: ela-reading-literature
description: >
  Elementary reading literature tutor (K-6) teaching comprehension of fiction,
  poetry, and drama. Covers story elements, theme, character analysis, point of
  view, figurative language, text structure, and comparing texts. Aligned with
  Common Core RL standards. Use when the learner wants to understand a story,
  analyze a character, find the theme, read poetry, or improve literary
  comprehension.
---

# Reading: Literature (K-6)

Interactive CLI tutor for literary reading comprehension.
Run: `node reading-literature.js <command> [args]`

## Commands

| Command | Usage | Action |
|---------|-------|--------|
| `start` | `start <id> [grade]` | Initialize student, optionally set grade |
| `lesson` | `lesson <id>` | Generate a full lesson targeting weakest skill |
| `exercise` | `exercise <id> [skill]` | Generate practice items for a skill |
| `check` | `check <id> <expected> <answer>` | Check a student answer |
| `record` | `record <id> <grade> <cat> <skill> <score> <total>` | Record assessment |
| `progress` | `progress <id>` | Show mastery for current grade |
| `report` | `report <id>` | Full student report with recent history |
| `next` | `next <id> [count]` | Recommend next skills to practice |
| `catalog` | `catalog [grade]` | List skills for a grade |
| `students` | `students` | List all student profiles |
| `set-grade` | `set-grade <id> <grade>` | Change student grade level |
| `passage` | `passage <grade> [topic]` | Get a short reading passage |

## Skills by Grade

- **K**: character-identification, setting-identification, retell-events, problem-solution-basic, picture-clues
- **Grade 1**: character-description, setting-importance, key-details-retell, problem-solution, text-to-self
- **Grade 2**: character-response, lesson-moral, character-viewpoints, beginning-middle-end, context-vocabulary
- **Grade 3**: character-traits-motives, theme-message, narrator-vs-character-pov, chapters-scenes-stanzas, literal-vs-figurative, compare-same-author
- **Grade 4**: theme-with-evidence, character-depth, first-vs-third-person, simile-metaphor-idiom, structure-analysis, compare-themes-genres
- **Grade 5**: multiple-themes, character-comparison, narrator-influence, personification-hyperbole, structure-fit, compare-across-cultures
- **Grade 6**: theme-development, character-development, author-pov-craft, word-choice-tone, structural-analysis, genre-comparison

## Architecture

- **No dependencies** — pure Node.js
- **SKILLS** object maps grades to categories to skill arrays
- **EXERCISE_BANKS** contain short passages (2-4 sentences) with comprehension questions
- **PASSAGE_BANK** provides standalone reading passages tagged by topic
- **Student profiles** stored as JSON in `../../data/ela-reading-literature/`
- **Mastery threshold**: 0.8 (last 5 attempts averaged)
- **Labels**: mastered (>=0.9), proficient (>=0.8), developing (>=0.6), emerging (>0), not-started

## Approach

- **Close reading**: Short passages read deeply, not long passages superficially
- **Text evidence**: Every answer must be supported by what the text says
- **Gradual release**: Model thinking, guided practice, independent practice
- **Joy of reading**: Love the story first, then analyze
