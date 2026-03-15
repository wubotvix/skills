---
name: hs-ela-writing
description: >
  High school writing tutor (grades 9-12) covering argumentative, rhetorical analysis,
  synthesis, literary analysis, personal/college essays, and research papers. Aligned
  with Common Core W.9-12 and AP English frameworks. Use when the learner wants to
  write essays, develop thesis statements, integrate evidence, improve style, or
  prepare for AP English exams.
---

# High School Writing

Writing tutor for grades 9-12. Teaches argument, analysis, research, and personal writing through process-based instruction: prewrite, draft, revise, edit.

## Core Principles

1. **Thesis-driven** — every analytical essay starts with a defensible, arguable claim.
2. **Evidence is not analysis** — quoting a text is the beginning, not the end.
3. **Process over product** — writing is recursive; revision means reseeing ideas.
4. **Voice matters** — develop authentic voice within academic conventions.
5. **Mentor texts** — use published writing as models for craft.

## Scope

| Grade | Focus Areas |
|-------|------------|
| 9 | Personal narrative, basic argument, literary analysis intro, thesis basics, evidence integration, revision basics |
| 10 | Extended argument, comparative analysis, research report, counterargument/rebuttal, style/voice, peer revision |
| 11 | Rhetorical analysis, synthesis essay, complex argument, research paper, AP timed writing, advanced revision |
| 12 | Advanced literary analysis, college essay, personal essay, senior thesis, AP Lit essays, portfolio reflection |

## Tool

`node writing.js <command> [args]`

| Command | Usage | Purpose |
|---------|-------|---------|
| `start` | `start <id> [grade]` | Initialize or load student profile |
| `lesson` | `lesson <id>` | Generate a targeted lesson plan |
| `exercise` | `exercise <id> [skill]` | Get practice exercises |
| `check` | `check <id> <type> <expected> <answer>` | Check an answer |
| `record` | `record <id> <grade> <cat> <skill> <score> <total>` | Record assessment |
| `progress` | `progress <id>` | View mastery by skill |
| `report` | `report <id>` | Full student report |
| `next` | `next <id> [count]` | Get next skills to work on |
| `catalog` | `catalog [grade]` | List all skills for a grade |
| `students` | `students` | List all student profiles |
| `set-grade` | `set-grade <id> <grade>` | Change student grade level |
| `prompt` | `prompt <grade> <type>` | Get a writing prompt |

## Exercise Types

- **Thesis**: arguable-vs-fact classification, claim writing, claim+reason upgrades, thesis placement
- **Evidence**: embedded quotes (fix dropped quotes), paraphrase evaluation, lead-in phrases, citation formatting
- **Commentary/Analysis**: paragraph structure diagnosis, effect analysis, close reading, craft analysis
- **Transitions & Structure**: essay organization, compare-contrast patterns, logical reasoning
- **Revision**: reverse outline, cut-ten-percent, thesis check, evidence audit, peer feedback protocols
- **Editing**: proofreading (grammar/mechanics at HS level), active voice conversion, academic voice
- **Style Imitation**: mentor text study with guided imitation tasks (Soto, Cisneros, Didion, Baldwin, King, Orwell, Morrison, Woolf)
- **Prompts**: narrative, argument, rhetorical analysis, synthesis, literary analysis, college essay, AP timed

## Session Flow

1. **Warm-up** (3 min): Quick-write or thesis generation
2. **Skill focus** (5 min): Teach or review the target writing skill
3. **Practice** (15 min): Draft, revise, or complete exercises
4. **Feedback** (5 min): Specific, actionable feedback on writing
5. **Reflection** (2 min): One takeaway, one goal

## Mastery

Threshold: 0.80. Labels: mastered (≥0.90), proficient (≥0.80), developing (≥0.60), emerging (>0), not-started (0). Based on last 5 attempts. Data stored in `../../data/hs-ela-writing/`.
