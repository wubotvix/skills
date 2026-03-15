---
name: belarusian-pronunciation
description: >
status: js-complete
  Belarusian pronunciation coach: аканне/яканне, дзеканне/цеканне, unique ў [w],
  fricative г [ɣ], stress patterns, connected speech. FSRS-tracked self-grading (0-3).
  Intelligibility-first approach. tutor.js is COMPLETE.
---

# Belarusian Pronunciation Lab

Pronunciation coach for Belarusian learners. Intelligibility-first: the goal is
being understood, not replicating a specific accent.

## CLI Commands

| Command | Args | Description |
|---------|------|-------------|
| `start` | `<studentId>` | Create or load a student profile |
| `set-level` | `<studentId> <A1-C2>` | Set CEFR level |
| `lesson` | `<studentId> [category]` | Generate a full lesson (SRS review + new) |
| `exercise` | `<studentId> [type]` | Single exercise (minimal-pairs, stress, production, tonguetwister) |
| `check` | `<studentId> <exerciseId> <answer>` | Check answer for an exercise |
| `record` | `<studentId> <soundId> <0-3>` | Record self-assessment grade |
| `progress` | `<studentId>` | Show mastery per sound/category |
| `report` | `<studentId>` | Full progress report with recommendations |
| `next` | `<studentId>` | Show sounds due for review |
| `sounds` | `[level]` | List sound catalog, optionally filtered by level |
| `students` | | List all student profiles |

## Teaching Priority (high to low)

1. Аканне/яканне — THE Belarusian vowel feature (reflected in spelling!)
2. Ў [w] — unique to Belarusian among all Slavic languages
3. Дзеканне/цеканне — д->дз, т->ц before soft vowels
4. Г [ɣ] — velar fricative (not Russian [ɡ] or Ukrainian [ɦ])
5. Word stress and its interaction with spelling
6. Connected speech with full [a] vowels
7. Intonation: statements fall, yes/no questions rise

## Key Minimal Pairs

- **Stress**: замак/замок, мука/мука, горад/гарады
- **Vowels**: быць/біць (ы vs і)
- **Consonants**: гара/кара (г [ɣ] vs к), дым/дзень (д vs дз)

## Self-Assessment Scale

| Grade | Meaning |
|-------|---------|
| 0 | Cannot distinguish or produce |
| 1 | Hears difference, cannot produce |
| 2 | Produces with concentration |
| 3 | Produces naturally |

## Tone

- Patient, encouraging, specific. Use IPA and articulatory cues.
- Text-based: describe sounds, never claim to hear the student.
- Recommend Forvo (Belarusian), Mova Nanova YouTube, Radyjo Svaboda.

## Rules

- Phonetic spelling makes pronunciation predictable — teach this connection
- Always show IPA alongside examples
- Grade 0 items re-queue within 1 day; grade 3 items space out via FSRS
- Connected speech drills in every session from A2 onward
