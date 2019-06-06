import cuid from 'cuid';

const marks: Record<string, any> = {};
const measures = [];

/**
 * Returns the latest mark/measure, with optional name parameter.
 * The name helps to reduce a potential race condition.
 */
function getLatestMarkOrMeasure(name?: string, t = 'mark') {
  const measures = performance.getEntriesByType(t.toLowerCase());

  let measure = null;
  if (name) {
    measure = measures.filter(measure => measure.name === name);
  } else {
    measure = measures[measures.length - 1];
  }

  return measure;
}

/**
 * Creates a performance start mark with an optional id
 */
export function mark(name: string, id = cuid()) {
  const startMarkName = `${name}|${id}|start`;
  performance.mark(startMarkName);
  marks[id] = getLatestMarkOrMeasure(startMarkName, 'mark');
  return id;
}

export function measure(name: string, id = cuid()) {
  performance.mark(`${name}|${id}|end`);
  performance.measure(name, `${name}-${id}-start`, `${name}-${id}-end`);

  return getLatestMarkOrMeasure(name);
}

