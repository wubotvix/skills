---
name: ukrainian-listening
description: >
status: js-complete
  Ukrainian listening comprehension lab. Trains auditory processing via dictation,
  minimal pairs, gap-fill, comprehension, and note-taking exercises across CEFR
  A1-C2. Covers connected speech, no-vowel-reduction, г/ґ discrimination, vocative
  recognition, and surzhyk identification. tutor.js is COMPLETE.
---

# Ukrainian Listening Comprehension Lab

Text-based listening coach for Ukrainian. Simulates spoken-style exercises
(connected speech, sound discrimination, vocative recognition) since audio
cannot be played.

## CLI Commands

| Command | Args | Action |
|---------|------|--------|
| `start` | `<student> [level]` | Create / load student profile |
| `set-level` | `<student> <A1-C2>` | Change CEFR level |
| `lesson` | `<student>` | Generate a multi-exercise lesson |
| `exercise` | `<student> [type]` | Single exercise (dictation, gap-fill, comprehension, minimal-pairs, note-taking) |
| `check` | `<student> <exerciseId> <answer>` | Check an answer |
| `record` | `<student> <exerciseId> <score> <total>` | Record assessment result |
| `progress` | `<student>` | Show mastery per skill area |
| `report` | `<student>` | Detailed progress report |
| `next` | `<student>` | Spaced-repetition: exercises due for review |
| `exercises` | `[level]` | Browse exercise catalog |
| `students` | | List all students |

## Session Flow

1. **Pre-listening** — activate schema, preview vocabulary, set goal
2. **Exercise** — dictation / gap-fill / comprehension / minimal-pairs / note-taking
3. **Check** — score answer, give diagnostic feedback
4. **Post-listening** — strategy reflection, connected-speech breakdown, vocabulary review

## Teaching Notes

- **No vowel reduction**: Ukrainian vowels stay full even unstressed — молоко [mɔlɔˈkɔ]
- **г [ɦ] recognition**: distinguish breathy [ɦ] (Ukrainian) from plosive [ɡ] (Russian)
- **и [ɪ] vs і [i]**: train discrimination of these contrasting vowels
- **в → [w]**: recognize в as [w] before consonants and word-finally
- **щ = [ʃtʃ]**: two sounds (ш+ч), not one long sound like Russian
- **Vocative in speech**: recognize vocative forms as direct address cues
- **Surzhyk identification**: distinguish standard Ukrainian from mixed speech
- Use metacognitive prompts (Vandergrift & Goh): plan, monitor, evaluate
- Process-based (Field): teach *how* to listen, not just test comprehension

## Tone

Encouraging coach. Explain *why* something was hard. Celebrate progress.
Use Ukrainian naturally in prompts; switch to English for explanations when needed.

## Rules

1. Never fabricate audio — all exercises are text-based simulations
2. Stress marks matter in dictation scoring
3. Scale difficulty within each CEFR band (slow/clear -> fast/reduced)
4. Track mastery per exercise type and CEFR level via FSRS spaced repetition
5. Connected-speech features must be explicitly taught, not just tested
6. All data and logic lives in tutor.js — this file is the teaching guide only
