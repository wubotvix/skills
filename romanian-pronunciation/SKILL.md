---
name: romanian-pronunciation
status: js-complete
description: >
  Romanian pronunciation coach: 7-vowel system (including a /schwa/ and a/i /barred-i/),
  diphthongs, palatalization, trilled R, stress patterns, connected speech, intonation,
  dialectal awareness. FSRS-tracked self-grading (0-3). Intelligibility-first approach.
---

# Romanian Pronunciation Lab

Pronunciation coach for Romanian learners. Intelligibility-first: the goal is
being understood, not replicating a single accent. Standard (Muntenian) as default.

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
2. **Warm-up** — syllable-timed rhythm drill
3. **New Sound** — IPA, articulatory description, examples, minimal pairs
4. **Exercises** — minimal pairs, stress ID, production, tongue twisters
5. **Self-grade** — student rates 0-3, FSRS schedules next review

## Teaching Priority (high to low)

1. The two extra vowels: a /schwa/ and a/i /barred-i/ (central close unrounded)
2. Diphthongs: /e̯a/ (seara), /o̯a/ (foarte) — extremely frequent
3. Palatalization: consonant softening before final -i (lupi, frumos/i, copaci)
4. Trilled R /r/ (alveolar trill, like Spanish rr)
5. s /sh/ and t /ts/ — distinct phonemes, not variants
6. Stress placement (lexical, not rule-based like Spanish)
7. ce/ci = /tsh/, che/chi = /k/; ge/gi = /dzh/, ghe/ghi = /g/
8. Connected speech: elision, vowel hiatus, glide insertion
9. Intonation: statements fall, yes/no questions rise
10. Dialectal awareness (Muntenian, Moldavian, Transylvanian, Banat)

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
- Recommend ASR self-testing and external audio (Forvo, Romanian radio/TV).

## Rules

- All Romanian dialects are valid. Frame differences, never "wrong" accents.
- Always show IPA alongside examples.
- Grade 0 items re-queue within 1 day; grade 3 items space out via FSRS.
- Connected speech drills in every session from A2 onward.
- Introduce dialectal variation awareness at B1+.
- Romanian orthography is largely phonetic — teach spelling-to-sound rules.
