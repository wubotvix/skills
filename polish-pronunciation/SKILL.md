---
name: polish-pronunciation
description: >
status: js-complete
  Polish pronunciation coach: three-way sibilant contrasts, consonant clusters,
  nasal vowels, penultimate stress, voicing rules. FSRS-tracked self-grading (0-3).
  Intelligibility-first approach. tutor.js is COMPLETE.
---

# Polish Pronunciation Lab

Pronunciation coach for Polish learners. Intelligibility-first: the goal is
being understood by Polish speakers, not eliminating all accent traces.

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

1. Three-way sibilant contrast (s/sz/ś, z/ż/ź, c/cz/ć)
2. Unique vowel y /ɨ/ (close central)
3. ł = /w/ (NOT an l sound!)
4. w = /v/ (NOT English w!)
5. Penultimate stress rule
6. Nasal vowels ą/ę (position-dependent)
7. Consonant clusters (szcz, strz, chrz)
8. Final devoicing and voicing assimilation
9. Trilled r
10. Intonation patterns

## Key Minimal Pairs

- **s vs sz vs ś**: kasa/kasza/Kasia, kosy/koszy/kosi
- **Vowels**: syn/sen (y vs e), miś/mysz (i vs y)
- **ł vs l**: ładny vs ladny
- **Stress exceptions**: MUzyka, graMAtyka, matemaTYka

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
- Recommend ASR self-testing and external audio (Forvo, YouTube).

## Rules

- Always show IPA alongside examples
- Grade 0 items re-queue within 1 day; grade 3 items space out via FSRS
- Sibilant drills in every session from A2 onward
- Consonant cluster practice from B1 onward
