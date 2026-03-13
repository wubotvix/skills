---
name: ela-speaking-listening
description: >
  Elementary speaking and listening tutor (K-6) teaching collaborative
  discussion, oral presentation, active listening, accountable talk, and media
  literacy. Aligned with Common Core SL standards. Use when the learner wants
  to practice speaking, discussion, presentation, or listening skills.
---

# Speaking & Listening (K-6)

Interactive tutor run via `node speaking-listening.js <command>`.

## Skills by Grade

- **K**: take-turns, describe-familiar, speak-audibly, listen-respond
- **Grade 1**: build-on-talk, ask-answer-questions, retell-details, complete-sentences
- **Grade 2**: discuss-with-partner, recount-key-ideas, ask-clarification, audio-recording
- **Grade 3**: prepared-discussion, determine-main-idea-oral, report-with-facts, formal-vs-informal
- **Grade 4**: follow-roles, paraphrase-presentation, identify-evidence-speaker, present-with-facts
- **Grade 5**: pose-respond-questions, summarize-speaker-points, present-with-multimedia, adapt-speech
- **Grade 6**: set-goals-discussion, interpret-diverse-media, evaluate-speaker-argument, present-claims-findings

## Exercise Types

- **Scenario choice**: pick the best response for a speaking/listening situation
- **Respond to partner**: build on what a partner said using accountable talk stems
- **Listening comprehension**: read a passage (simulating listening) and answer questions
- **Discussion prompts**: respond to a topic with reasons and evidence
- **Presentation planning**: organize a presentation using the PREP framework
- **Media analysis**: interpret how media format affects a message
- **Evaluate argument**: assess whether a speaker's claims are supported by evidence
- **Register identification**: distinguish formal from informal language
- **Paraphrase**: restate a speaker's points in your own words

## PREP Framework (Grade 3+)

**P**oint > **R**eason > **E**xample > **P**oint again

## CLI Commands

| Command | Usage |
|---------|-------|
| `start` | `start <id> [grade]` -- create/load student profile |
| `lesson` | `lesson <id>` -- generate a full lesson |
| `exercise` | `exercise <id> [skill]` -- generate practice items |
| `check` | `check <id> <type> <expected> <answer>` -- check an answer |
| `record` | `record <id> <grade> <cat> <skill> <score> <total>` -- record assessment |
| `progress` | `progress <id>` -- show mastery by skill |
| `report` | `report <id>` -- full student report |
| `next` | `next <id> [count]` -- suggest next skills to practice |
| `catalog` | `catalog [grade]` -- list skills for a grade |
| `students` | `students` -- list all student profiles |
| `set-grade` | `set-grade <id> <grade>` -- change student grade |
| `discussion-prompt` | `discussion-prompt <grade>` -- get a discussion prompt with talk stems |

## Mastery Tracking

- Mastery threshold: **0.8** (80%)
- Labels: mastered (90%+), proficient (80%+), developing (60%+), emerging (>0%), not-started
- Based on last 5 attempts per skill
- Profiles stored as JSON in `../../data/ela-speaking-listening/`

## Accountable Talk Stems

| Purpose | Example |
|---------|---------|
| Agree | "I agree because...", "Building on what ___ said..." |
| Disagree | "I see it differently because...", "I respectfully disagree..." |
| Clarify | "Can you explain what you mean by...?", "Are you saying...?" |
| Evidence | "What in the text supports that?", "Can you give an example?" |
| Summarize | "So what you're saying is...", "To summarize..." |
| Connect | "That connects to...", "That reminds me of..." |
