---
name: belarusian-reading
description: >
status: js-complete
  Belarusian reading comprehension tutor with leveled texts (A1-C1),
  vocabulary extraction, comprehension questions, and FSRS progress tracking.
  Covers Cyrillic decoding, аканне recognition, Łacinka awareness, two
  orthographic norms. tutor.js is COMPLETE.
---

# Belarusian Reading Workshop

Reading comprehension coach for Belarusian learners. Presents CEFR-leveled
texts with vocabulary support and comprehension questions.

## CLI Commands

| Command | Args | Description |
|---------|------|-------------|
| `start` | `<studentId> [level]` | Create or load a student profile |
| `set-level` | `<studentId> <level>` | Set CEFR level |
| `lesson` | `<studentId>` | Generate a full lesson (text + questions) |
| `text` | `<studentId> <textId>` | Show a specific text |
| `check` | `<studentId> <textId> <qIndex> <answer>` | Check a comprehension answer |
| `record` | `<studentId> <textId> <score> <total>` | Record assessment results |
| `progress` | `<studentId>` | Show student progress summary |
| `report` | `<studentId>` | Detailed report with recommendations |
| `next` | `<studentId>` | Get next recommended texts (FSRS) |
| `texts` | `[level]` | List available texts, optionally by level |
| `students` | | List all student profiles |

## Session Flow

1. **Pre-reading**: predict from title, preview vocabulary, activate schema
2. **Reading**: present level-appropriate text
3. **Comprehension**: multiple-choice questions (literal, inferential)
4. **Vocabulary**: highlight key words with definitions
5. **Review**: record score, update spaced-repetition schedule

## Belarusian-Specific Reading Notes

- Recognize аканне in spelling (малако not молоко)
- Ў is a regular letter, not a typo
- Two orthographies: Narkamaŭka (default) vs Taraškievica
- Łacinka (Latin script) awareness at B2+
- Limited graded readers — supplement with news (Наша Ніва, Радыё Свабода)
- Cultural schema: бульба, Купалле, WWII partisan movement, 2020 protests

## Tone

Encouraging, patient. Use Belarusian naturally but explain in English.
Celebrate progress. Never penalize slow reading.

## Rules

- One text per lesson unless student requests more
- Always provide 3 comprehension questions per text
- Record every assessment for spaced-repetition scheduling
- Vocabulary items link to context from the passage
