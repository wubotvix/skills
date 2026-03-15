---
name: ms-ela-speaking-listening
description: >
  Middle school speaking and listening tutor (grades 6-8) teaching collaborative
  discussion, presentations, active listening, evaluating speakers, adapting speech,
  and multimedia presentations. Aligned with Common Core SL.6-8. Use when the learner
  wants to "prepare a presentation", "practice discussion", "debate", "improve public
  speaking", "learn to listen better", or develop speaking and listening skills.
---

# Middle School ELA: Speaking & Listening (Grades 6-8)

Structured tutor for speaking and listening skills aligned with Common Core SL.6-8.

## Tool

`node speaking-listening.js <command> [args]` — all output is JSON.

| Command | Args | Purpose |
|---------|------|---------|
| `start` | `<id> [grade]` | Initialize or load student profile |
| `lesson` | `<id>` | Generate a full lesson targeting weakest skill |
| `exercise` | `<id> [skill]` | Generate practice items (auto-selects next skill if omitted) |
| `check` | `<id> <type> <expected> <answer>` | Check a student answer |
| `record` | `<id> <grade> <cat> <skill> <score> <total> [notes]` | Record assessment results |
| `progress` | `<id>` | Show mastery across all skills for current grade |
| `report` | `<id>` | Full report with recent assessments |
| `next` | `<id> [count]` | Recommend next skills to practice |
| `catalog` | `[grade]` | List all skills for a grade (or list grades) |
| `students` | | List all student profiles |
| `set-grade` | `<id> <grade>` | Set student grade level |
| `discussion-prompt` | `<grade>` | Get a random discussion prompt |

## Grades & Skill Categories

**Grade 6:** discussion-preparation, discussion-norms, pose-respond-questions, review-key-ideas, interpret-media, evaluate-speaker, present-claims, multimedia-presentations, formal-informal

**Grade 7:** prepared-evidence, track-goals, elicit-elaboration, build-on-ideas, analyze-media-main-ideas, evaluate-reasoning, present-organized, multimedia-emphasis, adapt-speech

**Grade 8:** connect-ideas, propel-conversations, respond-track-evidence, acknowledge-new-perspectives, evaluate-media-motives, evaluate-argument-evidence, present-logical-argument, strategic-multimedia, command-formal-english

## Mastery

- Threshold: 0.80 (proficient), 0.90 (mastered)
- Based on last 5 attempts per skill
- Labels: not-started, emerging, developing, proficient, mastered

## Exercise Types

scenario-analysis, prompt-response, improve-question, elaborate, follow-up, identify-claims, evaluate-support, sequence, sort-details, register-choice, fix-register, evaluate-soundness, evaluate-relevance, evaluate-sufficiency, open-ended, respectful-rewrite, qualify-statement, media-analysis, detect-bias, identify-fallacy, find-irrelevant, match-register

## Content Banks

- Discussion prompts per grade (opinion, literary-analysis, ethical, philosophical, media-literacy, policy, critical-analysis, sociolinguistic)
- Listening scenarios (media interpretation, speaker evaluation, bias detection)
- Presentation tasks (sequencing, detail selection, multimedia integration)
- Speaker evaluation exercises (claim identification, evidence quality, reasoning soundness)
- Media analysis scenarios (purpose, motive, bias, framing)

## Session Flow

1. **Warm-up** — Discussion prompt or pair-share
2. **Teach** — Mini-lesson on target skill
3. **Practice** — Complete exercise items
4. **Reflect** — Self-assess and set goals

## Data

Student profiles stored as JSON in `../../data/ms-ela-speaking-listening/`.
