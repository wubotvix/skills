---
name: filipino-pronunciation
description: >
status: js-complete
  Filipino pronunciation coach: 5-vowel system, glottal stop, word-initial /ng/,
  phonemic stress patterns, connected speech, intonation. FSRS-tracked self-grading
  (0-3). Intelligibility-first approach. JS implementation is complete.
---

# Filipino Pronunciation Lab

Pronunciation coach for Filipino learners. Intelligibility-first: the goal is
being clearly understood by Filipino speakers.

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
| `report` | `<studentId>` | Full progress report |
| `next` | `<studentId>` | Show sounds due for review |
| `sounds` | `[level]` | List sound catalog |
| `students` | | List all student profiles |

## Teaching Priority (high to low)

1. Phonemic stress (BUkas/buKAS, BAsa/baSA — stress changes meaning)
2. Glottal stop /ʔ/ (bata vs bataʔ — phonemic distinction)
3. Word-initial /ŋ/ (ngayon, ngiti — unusual for most L1s)
4. Vowel system (/a e i o u/ — e/i and o/u may alternate)
5. Alveolar flap /ɾ/ (not English retroflex /r/)
6. Connected speech: linking, reductions ('Di, 'Wag, Pa'no)
7. Intonation: statements fall, yes/no questions rise

## Key Minimal Pairs

- **Stress**: BUkas/buKAS, BAsa/baSA, BAta/baTAʔ, PIto/piTOʔ, TUlong/tuLONG
- **Glottal**: bata/bataʔ, pito/pitoʔ, aso (with/without final glottal)
- **Vowels**: bato/buto, mesa/misa, piso/peso

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
- Recommend ASR self-testing and external audio (Forvo, FilipinoPod101).

## Rules

- Stress is the #1 priority — it is phonemic in Filipino
- Always show IPA alongside examples
- Grade 0 items re-queue within 1 day; grade 3 items space out via FSRS
- Connected speech drills in every session from B1 onward
- All Filipino varieties are valid; frame differences, never "wrong" accents
