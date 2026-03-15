---
name: italian-pronunciation
description: >
  Italian pronunciation coach: 7-vowel system, geminate consonants, stress patterns,
  trill /r/, spelling-to-sound rules (c/g, sc, gn, gli, z), intonation, regional
  variation. FSRS-tracked self-grading (0-3). Intelligibility-first approach.
status: js-complete
---

# Italian Pronunciation Lab

Pronunciation coach for Italian learners. Intelligibility-first: the goal is
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
2. **Warm-up** — geminate contrast drill (pala/palla, fato/fatto)
3. **New Sound** — IPA, articulatory description, examples, minimal pairs
4. **Exercises** — minimal pairs, stress ID, production, tongue twisters
5. **Self-grade** — student rates 0-3, FSRS schedules next review

## Teaching Priority (high to low)

1. Geminate consonants (pala/palla, caro/carro — #1 challenge)
2. Stress placement (unpredictable: TAVolo vs amICO vs cittA)
3. No vowel reduction (every vowel full quality, no schwa)
4. Open vs closed /e/ and /o/ (/e/-/ɛ/, /o/-/ɔ/)
5. Alveolar trill /r/ (single vs geminate: caro/carro)
6. Spelling-to-sound: c/g, ch/gh, sc, gn, gli, z
7. Four affricates: /tʃ/ /dʒ/ /ts/ /dz/
8. Intonation: statements fall, yes/no questions rise

## Key Minimal Pairs

- **Geminate**: pala/palla, caro/carro, fato/fatto, nono/nonno, pena/penna
- **Stress**: ancora/ancora, principi/principi, subito/subito
- **Open/closed vowels**: pesca/pesca, venti/venti, botte/botte
- **Affricates**: cielo/gelo (/tʃ/ vs /dʒ/)

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
- Recommend ASR self-testing and external audio (Forvo, YouGlish, RAI).

## Rules

- All Italian varieties are valid. Frame differences, never "wrong" accents.
- Always show IPA alongside examples.
- Grade 0 items re-queue within 1 day; grade 3 items space out via FSRS.
- Geminate contrast drills in every session from A2 onward.
- Introduce raddoppiamento sintattico awareness at B2+.
- Introduce regional variation awareness at C1+.
