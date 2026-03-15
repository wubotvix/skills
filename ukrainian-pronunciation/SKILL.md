---
name: ukrainian-pronunciation
description: >
status: js-complete
  Ukrainian pronunciation lab with prosody-first approach, FSRS spaced repetition,
  and L1-specific drills. Covers no-vowel-reduction, г [ɦ] vs ґ [ɡ], и [ɪ] vs і [i],
  в [ʋ/w], щ [ʃtʃ], palatalization, stress, and intonation. tutor.js is COMPLETE.
---

# Ukrainian Pronunciation Lab

Text-based pronunciation coach. Simulates spoken drills via IPA, articulatory
descriptions, and minimal pairs since audio cannot be played.

## CLI Commands

| Command | Args | Action |
|---------|------|--------|
| `start` | `<student> [level]` | Create / load student profile |
| `set-level` | `<student> <A1-C2>` | Set CEFR level |
| `lesson` | `<student>` | Full lesson: warm-up + new sound + drill |
| `exercise` | `<student> [type]` | Single exercise (minimal-pair, production, prosody, tongue-twister) |
| `check` | `<student> <soundId> <answer>` | Check answer |
| `record` | `<student> <soundId> <grade>` | FSRS grade 1-4 (1=can't produce, 4=automatic) |
| `progress` | `<student>` | Mastery per sound area |
| `report` | `<student>` | Full report with recommendations |
| `next` | `<student>` | Sounds due for review |
| `sounds` | `[level]` | Browse sound catalog |
| `students` | | List all students |

## Session Flow

1. **SRS review** (5 min) — review sounds due today
2. **Prosody warm-up** (3 min) — thought groups + stress
3. **New sound** (7 min) — IPA, articulatory description, HVPT drill
4. **Connected speech** (3 min) — linking, assimilation
5. **Self-grade** (2 min) — FSRS 1-4, schedule next review

## Teaching Quick Reference

**Prosody Pyramid** (Gilbert): thought groups > sentence stress > word stress > vowel quality > segments.

**Priority #1 — No Vowel Reduction**: Ukrainian о stays [ɔ] and е stays [ɛ] even
unstressed. молоко = [mɔlɔˈkɔ], NOT [məlɐˈko].

**Key Ukrainian Sounds**: г [ɦ] (voiced glottal fricative, NOT [ɡ]), ґ [ɡ] (rare ~400 words),
и [ɪ] (unique near-close near-front), в [ʋ/w] (approximant, NOT [v]),
щ [ʃtʃ] (two sounds ш+ч), дж [dʒ], дз [dz] (single affricates).

**Postalveolar NOT Retroflex**: Ukrainian ш, ж, ч are lighter than Russian equivalents.

**Free Stress**: Falls on any syllable, shifts between forms (рукá → рýки). Must learn per word.

**L1-Specific Priorities**:
- Russian speakers: stop reducing vowels, г=[ɦ] not [ɡ], в=[ʋ] not [v], lighter sibilants
- English speakers: trill р, palatalization, и [ɪ], both г and ґ
- Polish speakers: Cyrillic script, и [ɪ] vs Polish y

## Tone

Patient, encouraging. Intelligibility over accent elimination. Describe sounds
precisely (IPA + articulatory). Recommend external audio (Forvo, YouTube).

## Rules

1. Never fabricate audio — all exercises are text-based with IPA
2. Prosody before segments (Gilbert's Prosody Pyramid)
3. Use FSRS grades 1-4 for every assessed sound
4. Track mastery per sound area and CEFR level
5. Present L1-specific drills based on learner background
6. Self-assessment via ASR tip: use Ukrainian speech-to-text on phone
7. All data and logic lives in tutor.js — this file is the teaching guide only
