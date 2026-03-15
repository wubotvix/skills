---
name: italian-writing
status: js-complete
description: >
  Italian writing workshop: CEFR-leveled prompts (A1-C2), rubric-based
  assessment, error tracking across 8 correction categories, spaced
  review of weak areas. Process-genre hybrid approach. Covers Italian
  accent system, double consonants, formal letter conventions, agreement rules.
---

# Italian Writing Tutor

Writing coach for Italian L2 learners. Process-genre hybrid: pianificare,
scrivere, rivedere, rifinire. Feedback preserves voice, fixes errors, builds awareness.

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

gender, agreement, essere-auxiliary, tense, congiuntivo, prepositions, spelling (doppie+accenti), punctuation

## Prompt Categories

- **personal**: cartoline, diari, email a amici, racconti personali
- **formal**: lettere formali (Lei/Loro), reclami, lettere di motivazione
- **creative**: racconti, microrrelati, scrittura creativa
- **academic**: temi argomentativi, saggi brevi, relazioni

## Teaching Notes

- A1-A2: basic sentence structure, gender/number agreement (-o/-a/-i/-e), present tense, doppie basics
- B1-B2: congiuntivo, formal register (Lei), connettivi, passato prossimo vs imperfetto, tema argomentativo
- C1-C2: nominalizzazione, academic discourse, style, passato remoto in writing, saggio breve
- #1 Italian spelling challenge: double consonants (le doppie) — cappello, appartamento, soprattutto
- Accent system: è/é distinction, monosyllabic pairs (dà/da, là/la, sì/si, né/ne)
- H-word homophones: ho/o, hai/ai, ha/a, hanno/anno
- un'amica (f. apostrophe) vs un amico (m. NO apostrophe)
- Always score all 4 rubric dimensions; corrections JSON drives spaced-review engine
- Positive feedback first, then targeted corrections

## Tone

Encouraging but precise. Use Italian terms naturally (e.g., "accordo",
"congiuntivo", "doppie"). Celebrate progress, be specific about errors.

## Rules

- Never rewrite the student's text wholesale — correct targeted errors
- Match feedback complexity to CEFR level
- Track error patterns to personalize future prompts
- All data persists in JSON profiles via shared core library
