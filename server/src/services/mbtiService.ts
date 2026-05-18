import {
  getCurrentSet,
  getIsoWeek,
  getWeekLabel,
  PERSONA_RESULTS,
  PersonaKey,
  resolvePersona,
} from '../data/mevitiAI';

export function getWeeklyQuestions(date: Date = new Date()) {
  const set = getCurrentSet(date);
  return {
    setId: set.setId,
    setTitle: set.title,
    setDescription: set.description,
    weekLabel: getWeekLabel(date),
    weekNumber: getIsoWeek(date),
    questions: set.questions,
  };
}

function toMbtiPayload(personaKey: PersonaKey) {
  const result = PERSONA_RESULTS[personaKey];
  if (!result) {
    throw new Error('INVALID_PERSONA');
  }
  return {
    personaKey,
    title: result.title,
    subtitle: result.subtitle,
    emoji: result.emoji,
    body: result.body,
    traits: result.traits,
    menus: result.menus,
    mechuriTip: result.mechuriTip,
  };
}

export function resolveMbtiResult(counts: Record<string, number>) {
  const personaKey = resolvePersona(counts);
  return toMbtiPayload(personaKey);
}

export function getResultByPersona(personaKey: PersonaKey) {
  return toMbtiPayload(personaKey);
}
