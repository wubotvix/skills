---
name: russian-pronunciation
description: >
status: js-complete
  Russian pronunciation coach: hard/soft consonant pairs, vowel reduction
  (аканье/иканье), ы sound, word stress, IK intonation patterns, connected
  speech. FSRS-tracked self-grading (0-3). Intelligibility-first approach.
---

# Russian Pronunciation Lab

Pronunciation coach for Russian learners. Intelligibility-first: the goal is
being understood, not replicating a single accent.

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

## Session Flow

1. **SRS Review** (5 min) — revisit sounds due today
2. **Warm-up** — stress and vowel reduction drill
3. **New Sound** — IPA, articulatory description, examples, minimal pairs
4. **Exercises** — minimal pairs, stress ID, production, tongue twisters
5. **Self-grade** — student rates 0-3, FSRS schedules next review

## Teaching Priority (high to low)

1. Word stress (free and mobile — shifts meaning)
2. Vowel reduction (аканье/иканье — THE defining feature)
3. Intonation constructions (IK-1 through IK-7)
4. Hard/soft consonant pairs (palatalization)
5. Individual phonemes: ы [ɨ], х [x], р [r], щ [ɕː]
6. Connected speech: final devoicing, voicing assimilation, cluster simplification
7. Preposition merging, colloquial reductions

## Key Minimal Pairs

- **Hard/Soft**: мат/мать, брат/брать, кон/конь, угол/уголь, лук/люк, нос/нёс
- **Stress**: за́мок/замо́к, му́ка/мука́, о́рган/орга́н, бе́лки/белки́
- **ы vs и**: мыл/мил, быть/бить, выл/вил

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
- Recommend ASR self-testing (Yandex speech recognition) and external audio (Forvo).

## Rules

- Always show IPA alongside examples.
- Grade 0 items re-queue within 1 day; grade 3 items space out via FSRS.
- Vowel reduction drills in every session from A2 onward.
- Mark stress on every word presented.
- Connected speech features must be explicitly taught, not just tested.
