---
name: hs-ela-literature
description: >
  High school literature analysis tutor (grades 9-12) covering close reading,
  literary criticism, figurative language, text structure, and analysis of fiction,
  poetry, drama, and nonfiction. Aligned with Common Core RL.9-12. Use when the
  learner wants to "analyze literature", "close read", "study literary devices",
  or "practice literary analysis".
---

# High School Literature Analysis

Tutor for grades 9-12 literature analysis. Runs via `node literature.js <command>`.

## Commands

| Command | Usage | Description |
|---------|-------|-------------|
| `start` | `start <id> [grade]` | Initialize or load student profile |
| `lesson` | `lesson <id>` | Generate a targeted lesson plan |
| `exercise` | `exercise <id> [skill]` | Generate passage-analysis exercises |
| `check` | `check <expected> <answer>` | Check a student's answer |
| `record` | `record <id> <grade> <cat> <skill> <score> <total> [notes]` | Record assessment results |
| `progress` | `progress <id>` | Show mastery progress for current grade |
| `report` | `report <id>` | Full student report with recent assessments |
| `next` | `next <id> [count]` | Get next skills to work on |
| `catalog` | `catalog [grade]` | List skills for a grade |
| `students` | `students` | List all student profiles |
| `set-grade` | `set-grade <id> <grade>` | Change student's grade level |
| `passage` | `passage <grade> <skill>` | Get a single passage with question |

## Grades & Skill Categories

**Grade 9:** cite-evidence, theme-objective-summary, character-development, figurative-connotative, text-structure, author-pov, compare-source-material, compare-themes-topics

**Grade 10:** cite-strong-evidence, theme-analysis, complex-characters, cumulative-word-impact, structural-choices, cultural-pov, multimedia-comparison, foundational-texts

**Grade 11:** cite-thorough-evidence, two-themes-interaction, author-choices-structure, figurative-language-advanced, beauty-meaning-structure, satire-sarcasm-irony, multiple-sources-interpretation, foundational-american

**Grade 12:** demonstrate-knowledge, universal-themes, character-complexity, ambiguity-nuance, innovative-structure, unreliable-narrator, critical-lenses, world-literature

## Mastery Tracking

- Threshold: 0.80 (proficient), 0.90 (mastered)
- Labels: not-started, emerging, developing, proficient, mastered
- Based on rolling window of last 5 attempts per skill
- Profiles saved as JSON in `../../data/hs-ela-literature/`

## Exercise Format

Each exercise presents a short literary passage (3-6 sentences) with an analytical question. Passages cover fiction, poetry, drama, nonfiction across genres and periods. Multiple-choice options provided where applicable.

## Session Flow

1. `start <id> grade-10` — initialize student
2. `lesson <id>` — get targeted lesson with exercises
3. `exercise <id>` — practice next skill or specific skill
4. `record <id> grade-10 theme-analysis theme-emergence 4 5` — record results
5. `progress <id>` — check mastery levels
6. `next <id>` — find what to work on next
