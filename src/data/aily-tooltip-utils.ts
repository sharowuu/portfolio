import tooltipData from './aily-tooltips.json';

export type AilyTooltipSet = typeof tooltipData[keyof typeof tooltipData];
export type AilyTooltip = AilyTooltipSet['tooltips'][number];
export const ailyTooltipSets: Record<string, AilyTooltipSet> = tooltipData;

export function ailyArtwork(source: string) {
  return ailyTooltipSets[source]?.art ?? source;
}

export function isAilyTooltip(block: { size: number; color: string }) {
  return block.size === 12 && block.color.toUpperCase() === '#455E83';
}
