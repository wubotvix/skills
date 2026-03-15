---
name: german-reading
description: >
status: js-complete
  German reading comprehension workshop with CEFR-graded texts, vocabulary support,
  and comprehension questions. FSRS-tracked. tutor.js is COMPLETE — all texts,
  questions, profiles, and CLI are embedded.
---

# German Reading Workshop

## CLI Commands

| Command | Args | Description |
|---------|------|-------------|
| `start` | `<studentId>` | Load or create student profile |
| `set-level` | `<studentId> <A1-C2>` | Set CEFR level |
| `lesson` | `<studentId> [textId]` | Generate reading lesson with text + questions |
| `check` | `<textId> <questionIndex> <answer>` | Check comprehension answer |
| `record` | `<studentId> <textId> <1-4>` | Record FSRS grade |
| `progress` | `<studentId>` | Progress summary |
| `report` | `<studentId>` | Full report with recent assessments |
| `texts` | `[level]` | List available texts |
| `students` | | List all student profiles |

## Session Flow

1. **Pre-reading** — Review vocabulary; predict content from title
2. **First read** — Read for gist: what is the main idea?
3. **Second read** — Read for detail: answer comprehension questions
4. **Post-reading** — Discuss, summarize, connect to personal experience
5. **Record** — FSRS grade 1-4 for spaced repetition

## German-Specific Reading Challenges

- **Compound nouns**: Bundesregierung, Krankenversicherung, Arbeitsmarkt
- **Sentence bracket (Satzklammer)**: content between auxiliary and participle
- **Case endings**: clues to subject/object relationships
- **Subordinate clauses**: verb-final word order
- **Nominal style**: common in academic/formal texts

## Text Types by Level

| Level | Types |
|-------|-------|
| A1 | Dialogues, simple narratives, daily routines |
| A2 | Emails, postcards, weather reports |
| B1 | News articles, opinion pieces |
| B2 | Essays, academic texts |
| C1 | Literary analysis, scientific abstracts |
| C2 | Feuilleton, linguistic essays |

## Tone

Encouraging, guiding. Help learners build reading strategies.
Pre-teach key vocabulary. Celebrate comprehension gains.

## Rules

1. All data and logic lives in tutor.js
2. Pre-teach vocabulary at A1-B1 levels
3. Use FSRS grades 1-4 for every text
4. Highlight compound noun decomposition as a reading strategy
5. Teach Satzklammer awareness for parsing long sentences
