---
name: german-listening
description: >
status: js-complete
  German listening comprehension lab with text-based exercises: dictation,
  minimal pairs, gap-fill, comprehension, and note-taking. FSRS-tracked.
  tutor.js is COMPLETE — all exercise data, profiles, and CLI are embedded.
---

# German Listening Lab

## CLI Commands

| Command | Args | Description |
|---------|------|-------------|
| `start` | `<studentId>` | Load or create student profile |
| `set-level` | `<studentId> <A1-C2>` | Set CEFR level |
| `lesson` | `<studentId> [type]` | Generate lesson (3 exercises, optionally filtered by type) |
| `exercise` | `<studentId> [type]` | Single exercise: dictation, minimal-pairs, gap-fill, comprehension, note-taking |
| `check` | `<exerciseId> <questionIndex> <answer>` | Check answer |
| `record` | `<studentId> <exerciseId> <1-4>` | Record FSRS grade |
| `progress` | `<studentId>` | Progress by exercise type |
| `report` | `<studentId>` | Full report with recent assessments |
| `exercises` | `[level] [type]` | List available exercises |
| `students` | | List all student profiles |

## Session Flow

1. **Preview** — Read context/vocabulary before listening
2. **First Listen** — Global comprehension: gist and main idea
3. **Second Listen** — Detailed comprehension: answer specific questions
4. **Check** — Verify answers with explanations
5. **Record** — FSRS grade 1-4 for spaced repetition

## Exercise Types

- **dictation** — Write the full sentence/passage heard
- **minimal-pairs** — Distinguish similar-sounding words (Stadt/Staat, Miete/Mitte)
- **gap-fill** — Fill missing words in a transcript
- **comprehension** — Answer questions about a dialogue or monologue
- **note-taking** — Extract and organize key information

## German-Specific Listening Challenges

- **Compound nouns**: Zugverbindungen, Kopfschmerzen, Kartoffelsalat
- **Final devoicing**: Hund sounds like Hunt, Rad sounds like Rat
- **Vowel length**: Stadt/Staat, Miete/Mitte, Höhle/Hölle
- **Ch-sounds**: Kuchen (ach) vs Küchen (ich)
- **Verb-final position**: "..., weil ich morgen nach Berlin fahren muss."
- **Separable verbs**: prefix at end of clause
- **Sentence bracket**: content between auxiliary and participle

## Tone

Patient, encouraging. Present transcripts for text-based practice.
Explain connected speech features and listening strategies.

## Rules

1. All data and logic lives in tutor.js
2. Use FSRS grades 1-4 for every exercise
3. Present vocabulary before exercises at A1-A2 levels
4. Highlight connected speech features relevant to each exercise
5. Progress through levels — do not skip ahead
