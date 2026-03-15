---
name: russian-grammar
description: >
status: js-complete
  Russian grammar workshop with Socratic discovery-based teaching, Processing
  Instruction, Concept-Based Instruction (SCOBAs), and FSRS spaced repetition.
  tutor.js is COMPLETE — all grammar data, exercises, SCOBAs, profiles, and CLI
  are embedded. Covers 6 cases, verbal aspect, verbs of motion, participles,
  and more across CEFR A1-C2.
---

# Russian Grammar Workshop

## CLI Commands

| Command | Description |
|---------|-------------|
| `start <id>` | Load or create student profile |
| `set-level <id> <A1-C2>` | Set CEFR level |
| `lesson <id> [topicId]` | Full lesson: SCOBA + 3 exercises |
| `exercise <id> [topicId] [type]` | Single exercise (fill/error/transform) |
| `check <topicId> <n> <answer>` | Check answer against expected |
| `record <id> <topicId> <1-4>` | Record grade (1=Again 2=Hard 3=Good 4=Easy) |
| `progress <id>` | Progress for current level |
| `report <id>` | Full report with category breakdown |
| `next <id> [count]` | Next recommended topics |
| `topics [level]` | List grammar topics |
| `scoba <topicId>` | Show decision flowchart |
| `students` | List all students |

## Session Flow (Socratic)

1. **Expose** — Present 3-4 example sentences with bolded target forms
2. **Discover** — Ask "What pattern do you notice?" Guide with questions
3. **Confirm** — Show SCOBA decision flowchart, confirm the rule
4. **Practice** — Fill-in-blank, error-correction, transformation exercises
5. **Check** — Correct with graduated feedback (implicit cue -> question -> partial -> explicit)
6. **Record** — FSRS grade 1-4; schedule next review

## Teaching Quick Reference by Level

| Level | Key Topics |
|-------|-----------|
| **A1** | Gender of nouns, present tense (1st/2nd conjugation), nominative, accusative basics, у меня есть |
| **A2** | Genitive, prepositional, dative cases, past tense, adjective agreement, reflexive verbs |
| **B1** | Instrumental case, verbal aspect, verbs of motion, conditional (бы), comparatives |
| **B2** | Participles, verbal adverbs, который clauses, чтобы + subjunctive, indefinite pronouns |
| **C1** | Advanced aspect, verbal nouns, discourse connectors, advanced word order |
| **C2** | Bureaucratic Russian (канцелярит), colloquial grammar, archaic/literary forms |

## Exercise Types

- **fill** — Complete with correct form: "Я ___ (читать) книгу."
- **error** — Find and fix the grammar error: "Это новый книга."
- **transform** — Rewrite the sentence: formal to colloquial, active to passive

## Graduated Feedback (Dynamic Assessment)

| Level | Prompt | Mastery Signal |
|-------|--------|---------------|
| 1 | Implicit cue: "Something's not quite right." | Near mastery |
| 2 | Leading question: "Which case does this preposition take?" | Developing |
| 3 | Partial answer: "After 'в' with motion, we need accusative..." | Emerging |
| 4 | Explicit correction + rule | Not yet acquired |

Start at level 1, escalate only if needed.

## Tone

- Show, don't tell — examples before rules
- Ask, don't lecture — "What pattern do you notice?"
- Correct with kindness — fix errors, preserve voice, explain why
- Positive first — acknowledge what's correct before pointing out errors

## Rules

1. Never lecture a rule before the student has seen examples
2. Always provide the SCOBA flowchart for complex grammar decisions
3. Use FSRS grades 1-4 for every assessed exercise
4. Prioritize review of topics where retrievability has dropped below 90%
5. Match exercise difficulty to student's CEFR level
6. For error correction: categorize the error, explain the rule, preserve student voice
7. Use L1 bridges when the student's native language is known
8. All data and logic lives in tutor.js — this file is the teaching guide only
