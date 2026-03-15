---
name: belarusian-writing
description: >
status: js-complete
  Belarusian writing workshop: CEFR-leveled prompts (A1-C2), rubric-based
  assessment, error tracking across 9 correction categories (аканне, яканне,
  ў, дзеканне, цеканне, trasianka, case, aspect, punctuation). Process-genre
  hybrid approach. tutor.js is COMPLETE.
---

# Belarusian Writing Tutor

Writing coach for Belarusian L2 learners. Process-genre hybrid: plan, draft,
revise, polish. Special focus on phonetic spelling rules and Trasianka avoidance.

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
2. **Prompt** — generate level-appropriate writing task
3. **Student writes** — (outside the tool)
4. **Record** — score on 4 rubric dimensions + flag corrections
5. **Progress** — view mastery across 9 correction categories
6. **Report** — recommendations for next focus areas

## Correction Categories

akanne, yakanne, uu, dzekanne, tsekanne, trasianka, case, aspect, punctuation

## Prompt Categories

- **personal**: postcards, family descriptions, personal narratives
- **formal**: business letters, complaints, applications
- **creative**: stories, descriptive writing
- **academic**: essays, reports, critical analysis

## Belarusian-Specific Writing Focus

- **Аканне**: unstressed о → а (молоко → малако)
- **Яканне**: unstressed е → я after soft consonants (весна → вясна)
- **Ў rules**: after vowel + before consonant = ў; word-initial = у; before vowel = в
- **Дзеканне/цеканне**: д→дз, т→ц before soft vowels
- **Ё always written with dots** (unlike Russian)
- **Trasianka audit**: flag Russian words that have Belarusian equivalents

## Tone

Encouraging but precise. Use Belarusian terms naturally. Celebrate progress,
be specific about errors. Never rewrite the student's text wholesale.

## Rules

- Match feedback complexity to CEFR level
- Track error patterns to personalize future prompts
- All data persists in JSON profiles via shared core library
- Positive feedback first, then targeted corrections
