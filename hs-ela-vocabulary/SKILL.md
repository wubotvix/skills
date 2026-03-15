---
name: hs-ela-vocabulary
description: >
  High school vocabulary tutor (grades 9-12) teaching SAT/ACT vocabulary, morphological
  analysis, etymology, academic vocabulary, connotation/register, and vocabulary in context.
  Aligned with Common Core L.9-12.4-6. Use for "build vocabulary", "SAT/ACT prep",
  "word roots", "academic words", or advanced word knowledge.
---

# High School Vocabulary (9-12)

Vocabulary tutor emphasizing deep word knowledge over memorization. Connects words to roots, histories, connotations, and contexts.

## Tool

`node hs-ela-vocabulary/vocabulary.js <command> [args]`

## Commands

| Command | Args | Description |
|---------|------|-------------|
| `start` | `<id> [grade]` | Initialize student, optionally set grade |
| `lesson` | `<id>` | Generate a full lesson (word-of-day + skill focus + exercises) |
| `exercise` | `<id> [skill]` | Generate exercises for a skill (or next recommended) |
| `check` | `<expected> <answer>` | Check a student answer against expected |
| `record` | `<id> <grade> <cat> <skill> <score> <total> [notes]` | Record assessment |
| `progress` | `<id>` | Show mastery across all skills for current grade |
| `report` | `<id>` | Detailed report with recent assessments |
| `next` | `<id> [count]` | Recommend next skills to work on |
| `catalog` | `[grade]` | List all skills for a grade (or list grades) |
| `students` | | List all student profiles |
| `set-grade` | `<id> <grade>` | Change student grade level |
| `word-of-day` | | Get today's word with definition, etymology, and family |

## Grades & Skill Categories

- **grade-9**: context-clues-advanced, greek-latin-roots-tier1, word-families, academic-vocabulary-9, connotation-spectrum, dictionary-strategies
- **grade-10**: sat-act-vocabulary, connotation-register, advanced-roots, domain-vocabulary-10, figurative-expression, word-nuance
- **grade-11**: advanced-morphology, discipline-specific-terms, etymology-patterns, ap-vocabulary, word-analysis-complex, semantic-fields
- **grade-12**: precise-diction, tone-through-word-choice, college-vocabulary, register-flexibility, vocabulary-as-style, advanced-etymology

## Mastery Tracking

Threshold: 0.8. Labels: mastered (>=0.9), proficient (>=0.8), developing (>=0.6), emerging (>0), not-started. Based on last 5 attempts per skill.

## Content Coverage

- **SAT/ACT words**: tone/attitude, argument/rhetoric, change/development, positive/negative attributes
- **Roots**: 20 prefixes, 18 roots, 7 suffixes with examples
- **Connotation**: 10 synonym spectrums ranked negative-to-positive
- **Etymology**: word histories, semantic drift, doublets/cognates, language borrowing
- **Register**: 5 formality levels (intimate to frozen) with examples
- **Domain vocabulary**: literary analysis, rhetoric, philosophy, science, social science
- **Word of the day**: 14-word rotating bank with definitions, roots, and word families

## Approach

1. Depth over breadth: usage, connotation, nuance, register matter more than list memorization
2. Words in context: teach through authentic passages, not isolated flashcards
3. Morphological awareness: roots/prefixes/suffixes unlock thousands of unfamiliar words
4. Etymology as story: word histories illuminate meaning and aid retention
5. Connotation precision: synonyms are rarely interchangeable

## Data

Profiles stored as JSON in `data/hs-ela-vocabulary/<studentId>.json`.
