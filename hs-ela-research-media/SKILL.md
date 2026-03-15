---
name: hs-ela-research-media
description: >
  High school research and media literacy tutor (grades 9-12) covering research
  process, source evaluation, MLA/APA citation, synthesis, annotated bibliography,
  research paper writing, and media/digital literacy. Aligned with CCSS W.9-12.7-9
  and ACRL Framework. Use for "research paper", "evaluate sources", "cite MLA/APA",
  "synthesize sources", "analyze media bias", or college-level research skills.
---

# HS Research & Media Literacy Tutor

Interactive CLI tutor for grades 9-12 research and media literacy skills.

## Tool

`node research-media.js <command> [args]` — all output is JSON.

## Commands

| Command | Usage | Description |
|---------|-------|-------------|
| start | `start <id> [grade]` | Initialize student, optionally set grade |
| lesson | `lesson <id>` | Generate a full lesson for the next skill |
| exercise | `exercise <id> [skill]` | Generate practice exercises |
| check | `check <id> <type> <expected> <answer>` | Check a student answer |
| record | `record <id> <grade> <cat> <skill> <score> <total>` | Record assessment |
| progress | `progress <id>` | Show mastery across all skills |
| report | `report <id>` | Full student report with recent history |
| next | `next <id> [count]` | Get next recommended skills |
| catalog | `catalog [grade]` | List skills for a grade |
| students | `students` | List all student profiles |
| set-grade | `set-grade <id> <grade>` | Change student grade level |

## Grades & Skill Categories

| Grade | Categories |
|-------|-----------|
| grade-9 | research-question-formulation, source-evaluation-basic, mla-citation-basic, paraphrase-vs-plagiarism, short-research-report, media-evaluation-basic |
| grade-10 | annotated-bibliography, multi-source-research, mla-citation-advanced, note-taking-synthesis, extended-research-essay, media-bias-analysis |
| grade-11 | ap-synthesis-skills, advanced-source-analysis, mla-apa-citation, research-paper-full, media-rhetoric-analysis, literature-review-basics |
| grade-12 | senior-thesis-research, academic-source-evaluation, citation-mastery, college-level-research, digital-media-criticism, capstone-project |

## Workflow

1. `start <id> grade-10` — create or load student at grade 10
2. `lesson <id>` — get a targeted lesson with exercises
3. `exercise <id> narrowing-topics` — practice a specific skill
4. `check <id> classify-question open open` — verify an answer
5. `record <id> grade-9 research-question-formulation narrowing-topics 4 5` — log score
6. `progress <id>` — review mastery (0.8 threshold for proficiency)
7. `next <id>` — see what to work on next

## Mastery Levels

| Level | Threshold |
|-------|-----------|
| mastered | >= 0.9 |
| proficient | >= 0.8 |
| developing | >= 0.6 |
| emerging | > 0 |
| not-started | 0 |

## Exercise Types

Source evaluation, citation formatting (MLA/APA), plagiarism identification,
paraphrase quality, research question formulation, thesis evaluation, evidence
integration, annotated bibliography, synthesis, media bias/framing analysis,
rhetorical appeals, propaganda techniques, academic tone, and more.

## Data

Student profiles stored as JSON in `../../data/hs-ela-research-media/`.
