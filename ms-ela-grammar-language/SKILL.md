---
name: ms-ela-grammar-language
description: >
  Middle school grammar and language conventions tutor (grades 6-8). Covers pronoun
  case, intensive/vague pronouns, sentence patterns/variety, nonrestrictive punctuation,
  style-tone, phrases-clauses, sentence types, misplaced modifiers, coordinate adjective
  commas, precise language, wordiness, verbals, active/passive voice, verb mood,
  ellipsis-dash, advanced sentence combining, and formal/informal register.
  Aligned with Common Core L.6-8.1-3.
---

# MS ELA Grammar & Language (Grades 6-8)

grammar-language.js is COMPLETE -- run it directly. No dependencies.

## Commands

| Command | Usage | Action |
|---------|-------|--------|
| start | `node grammar-language.js start <id> [grade]` | Create/load student, optionally set grade |
| lesson | `node grammar-language.js lesson <id>` | Generate full lesson: mentor sentence + exercises |
| exercise | `node grammar-language.js exercise <id> [skill]` | Generate practice (auto-picks next skill if omitted) |
| check | `node grammar-language.js check <id> <type> <expected> <answer>` | Check a student answer |
| record | `node grammar-language.js record <id> <grade> <cat> <skill> <score> <total> [notes]` | Record assessment result |
| progress | `node grammar-language.js progress <id>` | Show mastery for all skills at student grade |
| report | `node grammar-language.js report <id>` | Full report with recent assessments |
| next | `node grammar-language.js next <id> [count]` | Recommend next skills to practice |
| catalog | `node grammar-language.js catalog [grade]` | List all skills for a grade |
| students | `node grammar-language.js students` | List all student profiles |
| set-grade | `node grammar-language.js set-grade <id> <grade>` | Change student grade level |
| mentor | `node grammar-language.js mentor <grade>` | Get a mentor sentence for analysis |

## Session Flow

1. `start` student with grade (grade-6, grade-7, grade-8)
2. `lesson` generates mentor sentence + targeted exercises for weakest skill
3. Student works exercises; tutor uses `check` to verify answers
4. `record` stores scores; mastery auto-updates (threshold: 0.80)
5. `next` recommends what to practice; `progress`/`report` track growth

## Mastery Labels

| Label | Threshold |
|-------|-----------|
| mastered | >= 0.90 |
| proficient | >= 0.80 |
| developing | >= 0.60 |
| emerging | > 0.00 |
| not-started | 0.00 |

## Skill Map

**Grade 6:** pronoun-case, intensive-pronouns, vague-pronouns, sentence-patterns, sentence-variety, nonrestrictive-punctuation, style-tone
**Grade 7:** phrases-clauses, sentence-types, misplaced-modifiers, coordinate-adjective-commas, precise-language, eliminate-wordiness
**Grade 8:** verbals-gerunds-participles-infinitives, active-passive-voice, verb-mood, ellipsis-dash, sentence-combining-advanced, formal-informal-register

## Teaching Approach

- Grammar in context through mentor sentences and authentic writing
- Error-pattern focus: target each student's weakest skills first
- Exercise types: fix-it, fill-in, identify, classify, rewrite, combine, tone-fix
- Mentor sentence analysis: notice, compare, imitate, combine, celebrate

## Tone & Rules

- Encouraging, clear, and direct -- like a skilled ELA teacher
- Always explain WHY a rule exists, not just what it is
- Connect every concept to real writing improvement
- Never skip the mentor sentence warm-up in a full lesson
- Data stored in `../../data/ms-ela-grammar-language/` as JSON profiles
