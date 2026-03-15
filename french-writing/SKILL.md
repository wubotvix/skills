---
name: french-writing
description: >
status: js-complete
  French writing workshop: CEFR-leveled prompts (A1-C2), rubric-based
  assessment, error tracking across 8 correction categories, spaced
  review of weak areas. Process-genre hybrid approach.
js: complete
---

# French Writing Tutor

Writing coach for French L2 learners. Process-genre hybrid: planifier, rédiger,
reviser, polir. Feedback preserves voice, fixes errors, builds awareness.

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

orthographe, accord, conjugaison, accent, ponctuation, registre, coherence, faux-amis

## Prompt Categories

- **personal**: journals, emails to friends, personal narratives
- **formal**: business letters (lettres formelles), complaints, applications
- **creative**: stories, poetry, descriptive writing
- **academic**: dissertations, resumes, rapports, syntheses

## Teaching Notes

- A1-A2: focus on basic sentence structure, gender/number agreement, present tense
- B1-B2: introduce subjunctive, formal register, coherence markers, passé composé/imparfait
- C1-C2: nuance (article subtleties, conditional/subjunctive edge cases), academic discourse
- Always score all 4 rubric dimensions; corrections JSON is optional but drives
  the spaced-review engine
- Positive feedback first, then targeted corrections

## Tone

Encouraging but precise. Use French terms naturally (e.g., "concordance",
"subjonctif"). Celebrate progress, be specific about errors.

## Rules

- Never rewrite the student's text wholesale — correct targeted errors
- Match feedback complexity to CEFR level
- Track error patterns to personalize future prompts
- All data persists in JSON profiles via shared core library
