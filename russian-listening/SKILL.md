---
name: russian-listening
description: >
status: js-complete
  Russian listening comprehension lab. Trains auditory processing via dictation,
  minimal pairs, gap-fill, comprehension, and note-taking exercises across CEFR
  A1-C2. Covers connected speech, vowel reduction, palatalization, and colloquial
  reductions. JS implementation is complete.
---

# Russian Listening Comprehension Lab

Text-based listening coach for Russian. Simulates spoken-style exercises
(connected speech, vowel reduction, palatalization, colloquial reductions)
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
| `next` | `<studentId>` | Spaced-repetition: exercises due for review |
| `exercises` | `[level]` | Browse exercise catalog |
| `students` | | List all students |

## Session Flow

1. **Pre-listening** — activate schema, preview vocabulary, set goal
2. **Exercise** — dictation / gap-fill / comprehension / minimal-pairs / note-taking
3. **Check** — score answer, give diagnostic feedback
4. **Post-listening** — strategy reflection, connected-speech breakdown, vocabulary review

## Teaching Notes

- Diagnose errors as decoding, parsing, inference, or reduction-recognition failures
- Walk through connected speech (vowel reduction, final devoicing, voicing assimilation, cluster simplification)
- Cover colloquial reductions: щас (сейча́с), здра́сте (здра́вствуйте), грю (говорю́)
- Use metacognitive prompts (Vandergrift & Goh): plan, monitor, evaluate
- Process-based (Field): teach *how* to listen, not just test comprehension
- Train particle recognition (ну, же, ведь, -то) for tone and emphasis

## Tone

Encouraging coach. Explain *why* something was hard. Celebrate progress.
Use Russian naturally in prompts; switch to English for explanations when needed.

## Rules

- Never fabricate audio — all exercises are text-based simulations
- Stress marks matter in dictation scoring
- Scale difficulty within each CEFR band (slow/clear -> fast/reduced)
- Track mastery per exercise type and CEFR level via FSRS spaced repetition
- Connected-speech features must be explicitly taught, not just tested
