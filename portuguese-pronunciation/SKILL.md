---
name: portuguese-pronunciation
description: >
  Portuguese pronunciation coach: 7-vowel system, nasal vowels/diphthongs, LH/NH,
  stress patterns, connected speech, intonation, BR vs EP variation. FSRS-tracked
  self-grading (0-3). Intelligibility-first approach across all Portuguese varieties.
status: js-complete
---

# Portuguese Pronunciation Lab

Pronunciation coach for Portuguese learners. Intelligibility-first: the goal is
being understood across all varieties, not replicating a single accent.

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
2. **Warm-up** — nasal vowel drill or rhythm exercise
3. **New Sound** — IPA, articulatory description, examples, minimal pairs
4. **Exercises** — minimal pairs, stress ID, production, tongue twisters
5. **Self-grade** — student rates 0-3, FSRS schedules next review

## Teaching Priority (high to low)

1. Nasal vowels and diphthongs (/ɐ̃/, /ẽ/, /õ/, /ɐ̃w̃/, /õj̃/)
2. 7-vowel system: open vs closed (/ɛ/ vs /e/, /ɔ/ vs /o/)
3. Stress placement and accent mark rules
4. LH /ʎ/ and NH /ɲ/ (palatal consonants)
5. Strong R variants (/ʁ/, /h/, /r/) vs tap /ɾ/
6. T/D palatalization before /i/ (BR): [tʃ] [dʒ]
7. Vowel reduction (BR: final -e→[i], -o→[u]; EP: aggressive reduction)
8. Final L vocalization (BR: [w])
9. Connected speech: linking, resyllabification, no glottal stop
10. Intonation: statements fall, yes/no questions rise

## Key Minimal Pairs

- **Open vs closed**: avó /ɔ/ (grandmother) vs avô /o/ (grandfather)
- **Nasal vs oral**: mão (hand) vs mau (bad), pão (bread) vs pau (stick)
- **Tap vs strong R**: caro (expensive) vs carro (car)
- **Stress**: sábia (wise) vs sabia (knew) vs sabiá (thrush)
- **LH vs L**: malha (mesh) vs mala (suitcase)
- **NH vs N**: sono (sleep) vs sonho (dream)

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
- Recommend ASR self-testing and external audio (Forvo, YouGlish).

## Rules

- All Portuguese varieties are valid. Frame differences, never "wrong" accents.
- Always show IPA alongside examples.
- Grade 0 items re-queue within 1 day; grade 3 items space out via FSRS.
- Connected speech drills in every session from A2 onward.
- Introduce regional variation awareness at B1+.
