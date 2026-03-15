---
name: ms-ela-vocabulary
description: >
  Middle school vocabulary tutor (grades 6-8) teaching context clues, Greek/Latin
  roots, figurative language, connotation/denotation, word relationships, and
  academic vocabulary. Aligned with Common Core L.6-8.4-6. Use when the learner
  wants to learn new words, understand word parts, figure out word meaning, study
  vocabulary, or improve word knowledge at the middle school level.
---

# Middle School ELA: Vocabulary (Grades 6-8)

Structured vocabulary tutor aligned with Common Core L.6-8.4-6. Builds word knowledge through morphological analysis, context clue strategies, and progressive complexity.

## Tool

`node ms-ela-vocabulary/vocabulary.js <command> [args]`

## Commands

| Command | Args | Description |
|---------|------|-------------|
| `start` | `<id> [grade]` | Initialize student; optionally set grade |
| `lesson` | `<id>` | Generate full lesson (word of day + exercise) |
| `exercise` | `<id> [skill]` | Generate practice items for a skill |
| `check` | `<expected> <answer>` | Check a student answer |
| `record` | `<id> <grade> <cat> <skill> <score> <total>` | Record assessment |
| `progress` | `<id>` | Show mastery across all skills |
| `report` | `<id>` | Full report with recent assessments |
| `next` | `<id> [count]` | Recommend next skills to work on |
| `catalog` | `[grade]` | List skills for a grade |
| `students` | | List all students |
| `set-grade` | `<id> <grade>` | Change student grade level |
| `word-of-day` | `[grade]` | Get word of the day |

## Grades & Skills

**Grade 6:** context-clues-sentence, greek-latin-affixes, reference-materials, verify-meaning, figurative-personification, word-relationships-cause-part, connotation-denotation, academic-vocab-6

**Grade 7:** context-clues-advanced, greek-latin-roots, reference-specialized, verify-context, figurative-allusions, word-analogies, connotation-nuance, academic-vocab-7

**Grade 8:** context-clues-complex, greek-latin-patterns, reference-etymology, verify-multiple, figurative-verbal-irony, word-relationships-advanced, connotation-tone, academic-vocab-8

## Categories per Grade

Each grade has 8 categories: `context-clues`, `word-parts`, `reference`, `verify`, `figurative`, `relationships`, `connotation`, `academic`

## Mastery

- Threshold: 0.80 (proficient), 0.90 (mastered)
- Based on rolling average of last 5 attempts
- Labels: not-started, emerging, developing, proficient, mastered

## Workflow

1. `start <id> grade-7` -- create/load student
2. `lesson <id>` -- get word of the day + targeted exercise
3. Present exercise items to student, collect answers
4. `check <expected> <answer>` -- verify each response
5. `record <id> grade-7 context-clues context-clues-advanced 4 5` -- log results
6. `next <id>` -- find what to work on next
7. `progress <id>` -- review mastery dashboard

## Data

Profiles stored as JSON in `data/ms-ela-vocabulary/<studentId>.json`.

## Approach

- Words in context, not isolated lists
- Morphological analysis (roots, prefixes, suffixes)
- Deep processing: connotation, usage, relationships
- Strategic independence: build skills to unlock unfamiliar words
- Tiered vocabulary: prioritize Tier 2 academic words
