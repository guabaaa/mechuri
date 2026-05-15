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

export function resolveMbtiResult(counts: Record<string, number>) {
  const personaKey = resolvePersona(counts);
  const result = PERSONA_RESULTS[personaKey];
  return {
    personaKey,
    title: result.title,
    body: result.body,
    menus: result.menus,
  };
}

export function getResultByPersona(personaKey: PersonaKey) {
  const result = PERSONA_RESULTS[personaKey];
  if (!result) {
    throw new Error('INVALID_PERSONA');
  }
  return {
    personaKey,
    title: result.title,
    body: result.body,
    menus: result.menus,
  };
}
