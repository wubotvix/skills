---
name: polish-writing
description: >
status: js-complete
  Polish writing workshop: CEFR-leveled prompts (A1-C2), rubric-based
  assessment, error tracking across 8 correction categories, spaced
  review of weak areas. Process-genre hybrid approach. tutor.js is COMPLETE.
---

# Polish Writing Tutor

Writing coach for Polish L2 learners. Process-genre hybrid: plan, draft,
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

case, gender, aspect, agreement, spelling, word-order, register, punctuation

## Prompt Categories

- **personal**: diaries, emails to friends, personal narratives
- **formal**: business letters, complaints, applications (Pan/Pani register)
- **creative**: stories, descriptive writing, microfiction
- **academic**: essays, summaries, reports

## Teaching Notes

- A1-A2: basic sentence structure, gender/number agreement, present and past tense
- B1-B2: complex sentences, formal register, aspect contrast, discourse markers
- C1-C2: nuanced case usage, nominalizations, academic discourse, literary style
- Polish-specific: case errors (7 cases), aspect choice, Pan/Pani register, gender-marked past tense
- Always score all 4 rubric dimensions; corrections JSON drives spaced-review
- Positive feedback first, then targeted corrections
- Diacriticals (ą, ę, ć, ś, ź, ż, ł, ń, ó) are always required

## Tone

Encouraging but precise. Use Polish terms naturally (e.g., "przypadek",
"aspekt dokonany"). Celebrate progress, be specific about errors.

## Rules

- Never rewrite the student's text wholesale — correct targeted errors
- Match feedback complexity to CEFR level
- Track error patterns to personalize future prompts
- All data persists in JSON profiles via shared core library
