---
name: ms-ela-writing
description: >
  Middle school writing tutor (grades 6-8) teaching argumentative, informational,
  and narrative writing plus the writing process and revision. Covers thesis
  development, evidence integration, counterargument, transitions, dialogue,
  pacing, sensory language, and writing craft. Aligned with Common Core W.6-8.
  Use when the learner wants to write essays, arguments, stories, or improve
  writing skills at the middle school level.
---

# Middle School ELA: Writing (Grades 6-8)

Structured tutor for argumentative, informational/explanatory, and narrative writing aligned with Common Core W.6-8.

## CLI Usage

```
node writing.js <command> [args]
```

| Command | Description |
|---------|-------------|
| `start <id> [grade]` | Initialize or load student profile |
| `lesson <id>` | Generate a full lesson (warm-up, teach, practice) |
| `exercise <id> [skill]` | Generate practice items for a skill |
| `check <id> <expected> <answer>` | Check a student answer |
| `record <id> <grade> <cat> <skill> <score> <total>` | Record assessment |
| `progress <id>` | Show mastery progress for current grade |
| `report <id>` | Full student report with recent assessments |
| `next <id> [count]` | Recommend next skills to work on |
| `catalog [grade]` | List all skills for a grade |
| `students` | List all student profiles |
| `set-grade <id> <grade>` | Change student grade level |
| `prompt <type>` | Get a writing prompt (argument, informational, narrative) |

## Grades & Skill Categories

| Grade | Categories |
|-------|-----------|
| grade-6 | argument-claim-evidence, informational-organize, narrative-engage, writing-process, revision-strategies |
| grade-7 | argument-counterclaim, informational-develop, narrative-techniques, writing-coherence, revision-new-approaches |
| grade-8 | argument-acknowledge-distinguish, informational-complex-ideas, narrative-reflection, writing-style-audience, revision-purpose-audience |

## Exercise Types

- **writing-prompt**: Open response with sample and rubric
- **fix-it**: Correct errors (grammar, tone, formality)
- **improve**: Strengthen weak examples (thesis, evidence, transitions, voice)
- **evaluate**: Judge source credibility
- **fill-in**: Supply transitions or missing elements
- **identify**: Find fallacies, irrelevant sentences, or techniques
- **peer-review**: Provide feedback on drafts
- **order**: Sequence events logically
- **checklist**: Self-assessment rubrics

## Mastery Tracking

- Threshold: 0.8 (80%) over last 5 attempts
- Labels: mastered (90%+), proficient (80%+), developing (60%+), emerging (>0%), not-started
- Profiles saved as JSON in `../../data/ms-ela-writing/`

## Key Writing Frameworks

- **AXES model**: Assertion, eXample, Explanation, Significance
- **Writing process**: Brainstorm, Outline, Draft, Revise, Edit, Publish
- **Narrative arc**: Hook, Rising action, Climax, Falling action, Resolution
- **Evidence methods**: Lead-in + quote, Blended quote, Paraphrase + cite

## Progression

| Skill | Grade 6 | Grade 7 | Grade 8 |
|-------|---------|---------|---------|
| Argument | Claim + evidence | + counterclaim | + distinguish opposing views |
| Informational | Organize with headings | + multimedia, quotations | + complex structures |
| Narrative | Engage with context | + techniques, reflection | + POV, voice, reflection |
| Process | Revise with guidance | Try new approaches | Revise for purpose/audience |
