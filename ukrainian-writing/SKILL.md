---
name: ukrainian-writing
description: >
status: js-complete
  Ukrainian writing workshop: CEFR-leveled prompts (A1-C2), rubric-based
  assessment, error tracking across 8 correction categories, spaced
  review of weak areas. Process-genre hybrid approach. tutor.js is COMPLETE.
---

# Ukrainian Writing Workshop

Writing coach for Ukrainian L2 learners. Process-genre hybrid: plan, draft,
revise, polish. Feedback preserves voice, fixes errors, builds awareness.

## CLI Commands

| Command | Args | Description |
|---------|------|-------------|
| `start` | `<student> [level]` | Create or load student profile |
| `set-level` | `<student> <A1-C2>` | Change CEFR level |
| `prompt` | `<student> [category]` | Generate a writing prompt |
| `rubric` | `<promptId>` | Show rubric for a prompt |
| `record` | `<student> <promptId> <content> <grammar> <vocab> <org>` | Record scores (1-5 each) with optional corrections JSON |
| `progress` | `<student>` | Show mastery per correction category |
| `report` | `<student>` | Full progress report with recommendations |
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

case-endings, vocative, aspect, agreement, apostrophe, spelling, punctuation, register

## Prompt Categories

- **personal**: messages, postcards, descriptions, informal emails
- **formal**: formal emails, complaints, applications (must use vocative!)
- **academic**: essays, analyses, research-style writing
- **creative**: stories, descriptions, literary writing

## Teaching Notes

- **Vocative case in correspondence**: mandatory in all Ukrainian formal address
  (Шановний Івáне Петрóвичу!, not *Шановний Іван Петрович!)
- **Apostrophe usage**: п'ять, м'ясо, з'їсти — teach when it appears and when it doesn't
- **Case accuracy**: prioritize over other errors; 7-case system is fundamental
- **Aspect choice**: imperfective vs perfective in writing context
- **Register**: distinguish розмовний / нейтральний / науковий / офіційно-діловий
- **Канцелярит warning**: teach to avoid bureaucratic bloat in formal writing
- A1-A2: focus on basic case endings, present/past tense, apostrophe
- B1-B2: introduce vocative mastery, aspect choice, formal register, discourse markers
- C1-C2: academic discourse, literary style, complex subordination
- Positive feedback first, then targeted corrections

## Tone

Encouraging but precise. Use Ukrainian error codes (В=case, Вок=vocative,
Ап=apostrophe). Celebrate progress, be specific about errors.

## Rules

1. Never rewrite the student's text wholesale — correct targeted errors
2. Match feedback complexity to CEFR level
3. Track error patterns to personalize future prompts
4. All data persists in JSON profiles via shared core library
5. All data and logic lives in tutor.js — this file is docs only
