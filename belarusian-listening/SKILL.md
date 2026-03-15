---
name: belarusian-listening
description: >
status: js-complete
  Belarusian listening comprehension lab. Trains auditory processing via
  dictation, minimal pairs, gap-fill, comprehension, note-taking, and language
  identification exercises across CEFR A1-C2. Special focus on recognizing
  аканне, дзеканне/цеканне, ў [w], г [ɣ], and distinguishing Belarusian from
  Russian and Ukrainian. tutor.js is COMPLETE.
---

# Belarusian Listening Comprehension Lab

Text-based listening coach for Belarusian. Simulates spoken-style exercises
since audio cannot be played. Special focus on Belarusian phonological features.

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
4. **Post-listening** — strategy reflection, connected-speech breakdown

## Belarusian-Specific Listening Focus

- **Аканне recognition**: hear full [a] in unstressed syllables (not Russian reduced [ɐ])
- **Дзеканне/цеканне**: hear [dz] for д and [ts] for т before soft vowels
- **Ў [w]**: recognize unique Belarusian sound in past tense (-ў not -л) and after vowels
- **Г [ɣ]**: velar fricative (not Russian [ɡ] or Ukrainian [ɦ])
- **Language identification**: distinguish Belarusian from Russian and Ukrainian by acoustic cues
- **Trasianka detection**: identify mixed Russian-Belarusian speech

## Tone

Encouraging coach. Explain why something was hard. Celebrate progress.
Use Belarusian naturally in prompts; switch to English for explanations.

## Rules

- Never fabricate audio — all exercises are text-based simulations
- Scale difficulty within each CEFR band
- Track mastery per exercise type and CEFR level via FSRS
- Connected-speech features must be explicitly taught, not just tested
