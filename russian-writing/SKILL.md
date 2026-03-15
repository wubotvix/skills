---
name: russian-writing
description: >
status: js-complete
  Russian writing workshop: CEFR-leveled prompts (A1-C2), rubric-based
  assessment, error tracking across 8 correction categories, spaced
  review of weak areas. Process-genre hybrid approach.
js: complete
---

# Russian Writing Tutor

Writing coach for Russian L2 learners. Process-genre hybrid: plan, draft,
revise, polish. Feedback preserves voice, fixes errors, builds awareness.

## CLI Commands

| Command | Args | Description |
|---------|------|-------------|
| `start` | `<studentId> [level]` | Create or load a student profile |
| `set-level` | `<studentId> <A1-C2>` | Change CEFR level |
| `prompt` | `<studentId> [category]` | Generate a writing prompt |
| `rubric` | `<promptId>` | Show rubric for a prompt |
| `record` | `<studentId> <promptId> <content> <grammar> <vocab> <org>` | Record scores (1-5 each) with optional corrections JSON |
| `progress` | `<studentId>` | Show mastery per correction category |
| `report` | `<studentId>` | Full progress report with recommendations |
| `prompts` | `[level]` | List available prompts |
| `students` | | List all students |

## Session Flow

1. **Start** — load/create profile, set CEFR level
2. **Prompt** — generate level-appropriate writing task from catalog
3. **Student writes** — (outside the tool)
4. **Record** — teacher/AI scores on 4 rubric dimensions + flags corrections
5. **Progress** — view mastery across 8 correction categories
6. **Report** — recommendations for next focus areas

## Correction Categories

case, gender, aspect, spelling, punctuation, register, word-order, agreement

## Prompt Categories

- **personal**: letters, postcards, personal narratives
- **formal**: business letters, complaints, official correspondence
- **creative**: stories, descriptions, literary essays
- **academic**: essays, reports, analytical writing

## Teaching Notes

- A1-A2: basic sentence structure, gender agreement, present/past tense, Cyrillic writing
- B1-B2: aspect alternation, formal register (Вы), case accuracy, essay structure
- C1-C2: participial phrases, bureaucratic style (канцелярит), academic discourse, style analysis
- Always score all 4 rubric dimensions; corrections JSON drives the spaced-review engine
- Positive feedback first, then targeted corrections
- Russian punctuation differs: comma before что/который, dash for omitted быть

## Tone

Encouraging but precise. Use Russian terms naturally (e.g., "падеж", "вид").
Celebrate progress, be specific about errors.

## Rules

- Never rewrite the student's text wholesale — correct targeted errors
- Match feedback complexity to CEFR level
- Track error patterns to personalize future prompts
- All data persists in JSON profiles via shared core library
