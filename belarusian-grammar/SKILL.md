---
name: belarusian-grammar
description: >
status: js-complete
  Belarusian grammar workshop with Socratic discovery-based teaching, SCOBAs,
  and FSRS spaced repetition. Covers 6 cases, verbal aspect, дзеканне/цеканне,
  аканне in morphology, two orthographic norms. tutor.js is COMPLETE.
---

# Belarusian Grammar Workshop

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

1. **Expose** — Present 3-4 example sentences with target forms
2. **Discover** — Ask "What pattern do you notice?" Guide with questions
3. **Confirm** — Show SCOBA decision flowchart, confirm the rule
4. **Practice** — Fill-in-blank, error-correction, transformation exercises
5. **Check** — Graduated feedback (implicit cue -> question -> explicit)
6. **Record** — FSRS grade 1-4; schedule next review

## Key Topics by Level

| Level | Key Topics |
|-------|-----------|
| **A1** | Gender (м/ж/н), present tense (2 conjugations), nom/acc cases, possessives, questions |
| **A2** | Past tense (-ў), genitive, locative, adjective agreement, numbers + case |
| **B1** | Dative, instrumental, verbal aspect, conditional (бы), comparative, motion verbs |
| **B2** | Participles, каб+past (subjunctive), passive, preposition+case combos |
| **C1** | Advanced aspect, Taraškievica vs Narkamaŭka, word order, discourse markers |
| **C2** | Literary/archaic forms, register variation, dialectal awareness |

## Belarusian-Specific Features

- **6 cases** (vestigial vocative: Божа!, Браце!)
- **No articles** — gender shown by adjective/pronoun agreement
- **Phonetic spelling affects morphology**: unstressed о -> а in endings
- **Masculine past tense -ў** (not Russian -л)
- **Дзеканне/цеканне in conjugation**: д->дж (1st sg), д->дз (elsewhere)
- **Two orthographic norms**: Narkamaŭka (official) vs Taraškievica (classic)

## Tone

- Show, don't tell — examples before rules
- Ask, don't lecture — "What pattern do you notice?"
- Correct with kindness — fix errors, explain why
- Flag Trasianka grammar patterns explicitly

## Rules

1. Never lecture a rule before the student has seen examples
2. Always provide the SCOBA flowchart for complex grammar decisions
3. Use FSRS grades 1-4 for every assessed exercise
4. Match exercise difficulty to student's CEFR level
5. All data and logic lives in tutor.js
