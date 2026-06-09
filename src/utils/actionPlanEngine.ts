import { ACTION_TEMPLATES, ActionTemplate, ActionDifficulty } from '@/data/actionTemplates';
import { ALL_QUIZ_QUESTIONS } from '@/data/quizQuestions';
import type { Action, ChallengeId, Language } from '@/types';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ScoredAction {
  template: ActionTemplate;
  score: number;
}

// ─── Core engine ──────────────────────────────────────────────────────────────

/**
 * Generates a personalised action list from quiz answers.
 * Returns 8–12 Action objects resolved in the given language.
 */
export function generateActionPlan(
  challengeIds: ChallengeId[],
  quizAnswers: Record<string, string>,
  language: Language
): Action[] {
  // ── 1. Determine difficulty level from "change-size" answer ────────────────
  const changeSizeAnswer = quizAnswers['change-size'];
  let targetDifficulties: ActionDifficulty[] = ['beginner'];

  if (changeSizeAnswer === 'small')      targetDifficulties = ['beginner'];
  if (changeSizeAnswer === 'medium')     targetDifficulties = ['beginner', 'intermediate'];
  if (changeSizeAnswer === 'big')        targetDifficulties = ['intermediate', 'advanced'];

  // If user failed before because plan was too hard → force beginner
  if (quizAnswers['past-failure'] === 'too-hard') {
    targetDifficulties = ['beginner'];
  }

  // ── 2. Collect all quiz answer tags ──────────────────────────────────────────
  const answerTags = new Set<string>();
  for (const [qId, optId] of Object.entries(quizAnswers)) {
    const q = ALL_QUIZ_QUESTIONS.find(x => x.id === qId);
    if (!q) continue;
    const opt = q.options.find(x => x.id === optId);
    if (opt && opt.tags) {
      opt.tags.forEach(t => answerTags.add(t));
    }
  }

  // ── 3. Score each template ─────────────────────────────────────────────────
  const scored: ScoredAction[] = [];

  for (const template of ACTION_TEMPLATES) {
    // Must relate to at least one selected challenge
    const challengeMatch = template.challengeIds.some((id) => challengeIds.includes(id));
    if (!challengeMatch) continue;

    // Must match target difficulty OR be beginner (always acceptable as fallback)
    if (!targetDifficulties.includes(template.difficulty) && template.difficulty !== 'beginner') {
      continue;
    }

    let score = 1;

    // +2 per challenge matched
    score += template.challengeIds.filter((id) => challengeIds.includes(id)).length * 2;

    // +3 per quiz-answer tag matched
    score += template.tags.filter((tag) => answerTags.has(tag)).length * 3;

    // +1 for beginner (prefer easy first)
    if (template.difficulty === 'beginner') score += 1;

    // +1 for core (tie-breaker), +0.5 for supportive
    if (template.tier === 'core') score += 1;
    if (template.tier === 'supportive') score += 0.5;

    scored.push({ template, score });
  }

  // ── 4. Sort by score desc ──────────────────────────────────────────────────
  scored.sort((a, b) => b.score - a.score);

  // ── 5. Pick top unique actions (target 8–12) ───────────────────────────────
  const seen = new Set<string>();
  const result: Action[] = [];

  for (const { template } of scored) {
    if (seen.has(template.id)) continue;
    seen.add(template.id);

    result.push(templateToAction(template, language));
    if (result.length >= 12) break;
  }

  // ── 6. Pad to 8 if needed (relax difficulty filter) ───────────────────────
  if (result.length < 8) {
    for (const template of ACTION_TEMPLATES) {
      if (seen.has(template.id)) continue;
      const challengeMatch = template.challengeIds.some((id) => challengeIds.includes(id));
      if (!challengeMatch) continue;

      seen.add(template.id);
      result.push(templateToAction(template, language));
      if (result.length >= 8) break;
    }
  }

  return result;
}

export function getSmallerVersionFallback(template: ActionTemplate) {
  if (template.smallerVersion) return template.smallerVersion;
  return {
    label: {
      en: 'Just start: ' + template.label.en,
      ar: 'جرب بس: ' + template.label.ar,
    },
    duration: {
      en: '2 min',
      ar: 'دقيقتين',
    }
  };
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function templateToAction(template: ActionTemplate, language: Language): Action {
  return {
    id: template.id,
    title: template.label[language],
    emoji: template.emoji,
    challengeId: template.challengeIds[0],
    frequency: template.frequency,
    difficulty: template.difficulty,
    originalTemplateId: template.id,
    selectedVersion: 'standard',
  };
}
