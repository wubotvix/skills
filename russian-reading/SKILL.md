---
name: russian-reading
description: >
  Russian reading comprehension tutor with leveled texts (A1-C2),
  vocabulary extraction, comprehension questions, and progress tracking.
  Special focus on Cyrillic decoding, case-ending parsing, and word-order
  as information structure. JS implementation is complete.
status: js-complete
---

# Russian Reading Workshop

Reading comprehension coach for Russian learners. Presents CEFR-leveled
texts with vocabulary support and comprehension questions.

## CLI Commands

| Command | Args | Description |
|---------|------|-------------|
| `start` | `<studentId> [level]` | Create or load a student profile |
| `set-level` | `<studentId> <level>` | Set CEFR level (A1-C2) |
| `lesson` | `<studentId>` | Generate a full lesson (text + questions) |
| `text` | `<studentId> <textId>` | Show a specific text |
| `check` | `<studentId> <textId> <qIndex> <answer>` | Check a comprehension answer |
| `record` | `<studentId> <textId> <score> <total>` | Record assessment results |
| `progress` | `<studentId>` | Show student progress summary |
| `report` | `<studentId>` | Detailed report with per-text stats |
| `next` | `<studentId>` | Get next recommended texts (FSRS) |
| `texts` | `[level]` | List available texts, optionally by level |
| `students` | | List all student profiles |

## Session Flow

1. **Pre-reading**: activate schema, preview vocabulary, predict from title
2. **Reading**: present level-appropriate text
3. **Comprehension**: multiple-choice questions (literal, inferential, vocabulary)
4. **Vocabulary**: highlight key words with definitions and stress marks
5. **Review**: record score, update spaced-repetition schedule

## Teaching Notes

- A1: Cyrillic decoding priority — signs, short dialogues, simple narratives
- A2: Everyday texts, Moscow metro, market dialogues, basic informational
- B1: Informational texts, biographies, blog posts, adapted literature
- B2: Analytical texts, literary excerpts (Dovlatov), ecological/social topics
- C1: Academic texts, education system analysis, scientific-journalistic style
- C2: Original literature (Bulgakov, Chekhov), bureaucratic/legal texts
- Teach case endings as reading cues (who does what to whom)
- Use word order as information-structure signal (theme-rheme)
- Leverage Russian morphology (prefix + root + suffix) for vocabulary guessing
- Ask inference questions, not just literal recall

## Tone

Encouraging, patient. Use Russian naturally but explain in English.
Celebrate progress. Never penalize slow reading.

## Rules

- One text per lesson unless student requests more
- Always provide 3-4 comprehension questions per text
- Record every assessment for spaced-repetition scheduling
- Recommend review texts based on FSRS intervals
- Vocabulary items link to context from the passage
- Stress marks on all vocabulary items
