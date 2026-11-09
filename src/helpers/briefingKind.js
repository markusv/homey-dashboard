export const BRIEFING_KINDS = ["evening", "next-week"];

export const isBriefingKind = (value) => BRIEFING_KINDS.includes(value);

export const briefingReadPath = (kind) => `/api/read/briefing/${kind}`;
