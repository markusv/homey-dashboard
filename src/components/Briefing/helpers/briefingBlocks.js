import { briefingRuns } from "./briefingRuns";

const EMOJI_PATTERN =
  /(?:\p{Regional_Indicator}{2}|[#*0-9]\uFE0F?\u20E3|\p{Extended_Pictographic}(?:\uFE0F|\uFE0E|\p{Emoji_Modifier})*(?:\u200D\p{Extended_Pictographic}(?:\uFE0F|\uFE0E|\p{Emoji_Modifier})*)*)/gu;

const TWEMOJI_SVG_BASE =
  "https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.1.0/assets/svg";

export const twemojiCode = (emoji) => {
  const source = emoji.includes("\u200D")
    ? emoji
    : emoji.replaceAll("\uFE0F", "").replaceAll("\uFE0E", "");
  return Array.from(source)
    .map((char) => char.codePointAt(0).toString(16))
    .join("-");
};

export const twemojiSrc = (emoji) =>
  `${TWEMOJI_SVG_BASE}/${twemojiCode(emoji)}.svg`;

const emojiParts = (text) => {
  const parts = [];
  let last = 0;
  for (const match of text.matchAll(EMOJI_PATTERN)) {
    const index = match.index ?? 0;
    if (index > last) {
      parts.push({ emoji: false, text: text.slice(last, index) });
    }
    parts.push({ emoji: true, text: match[0] });
    last = index + match[0].length;
  }
  if (last < text.length) {
    parts.push({ emoji: false, text: text.slice(last) });
  }
  return parts;
};

export const briefingBlocks = (text) =>
  text
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .map((line) =>
      briefingRuns(line).flatMap((run) =>
        emojiParts(run.text).map((part) => ({
          bold: run.bold,
          emoji: part.emoji,
          text: part.text,
        }))
      )
    );
