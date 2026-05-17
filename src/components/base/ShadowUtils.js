export function attachShadowMaybeClosed(el, mode) {
  // force open mode for accessibility and testing ease
  return el.attachShadow({ mode: mode === 'closed' ? 'open' : mode });
}
