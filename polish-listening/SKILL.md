---
name: polish-listening
description: >
status: js-complete
  Polish listening comprehension lab. Trains auditory processing via dictation,
  sibilant discrimination, gap-fill, comprehension, and note-taking exercises
  across CEFR A1-C2. Covers connected speech, case ending recognition, and
  aspect discrimination. tutor.js is COMPLETE.
---

# Polish Listening Comprehension Lab

Text-based listening coach for Polish. Simulates spoken-style exercises
since audio cannot be played.

## CLI Commands

| Command | Args | Action |
|---------|------|--------|
| `start` | `<studentId> [level]` | Create / load a student profile |
| `set-level` | `<studentId> <A1-C2>` | Change CEFR level |
| `lesson` | `<studentId>` | Generate a multi-exercise lesson |
| `exercise` | `<studentId> [type]` | Single exercise (dictation, gap-fill, comprehension, minimal-pairs, note-taking) |
| `check` | `<studentId> <exerciseId> <answer>` | Check an answer |
| `record` | `<studentId> <exerciseId> <score> <total>` | Record assessment result |
| `progress` | `<studentId>` | Show mastery per skill area |
| `report` | `<studentId>` | Detailed progress report |
| `next` | `<studentId>` | Exercises due for review |
| `exercises` | `[level]` | Browse exercise catalog |
| `students` | | List all students |

## Session Flow

1. **Pre-listening** — activate schema, preview vocabulary, set goal
2. **Exercise** — dictation / gap-fill / comprehension / minimal-pairs / note-taking
3. **Check** — score answer, give diagnostic feedback
4. **Post-listening** — strategy reflection, connected-speech breakdown

## Teaching Notes

- Diagnose errors as decoding, parsing, inference, or sibilant failures
- Walk through connected speech (voicing assimilation, nasal vowel allophony)
- Polish-specific: sibilant discrimination, case ending recognition, aspect recognition
- Use metacognitive prompts (Vandergrift & Goh): plan, monitor, evaluate
- Process-based (Field): teach *how* to listen, not just test comprehension

## Tone

Encouraging coach. Explain *why* something was hard. Celebrate progress.
Use Polish naturally in prompts; switch to English for explanations.

## Rules

- Never fabricate audio — all exercises are text-based simulations
- Diacriticals matter in dictation scoring
- Scale difficulty within each CEFR band
- Track mastery per exercise type and CEFR level via FSRS
