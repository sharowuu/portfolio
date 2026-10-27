// 媒体优化映射：源码里仍按原路径 asset('media/old.ext') 引用，构建/运行时重写到 media/optimized/。
// 原件保留在 public/media/ 不删不移；构建时仅从 dist/output 删除被替换的原件 basename。
// 条目均为项目相对路径（无工作区绝对路径）。
export const OPTIMIZED_MEDIA: Record<string, string> = {
  // Shard A
  'media/miaoda-input.mp4': 'media/optimized/miaoda-input.mp4',
  'media/miaoda-delivery-before.mp4': 'media/optimized/miaoda-delivery-before.mp4',
  'media/miaoda-delivery-spec.mp4': 'media/optimized/miaoda-delivery-spec.mp4',
  'media/miaoda-beauty-stage-03.mp4': 'media/optimized/miaoda-beauty-stage-03.mp4',
  'media/miaoda-beauty-deep-space.mp4': 'media/optimized/miaoda-beauty-deep-space.mp4',
  'media/aily-team-management.mp4': 'media/optimized/aily-team-management.mp4',
  'media/miaoda-beauty-hero.svg': 'media/optimized/miaoda-beauty-hero.svg',
  'media/miaoda-home-cover.png': 'media/optimized/miaoda-home-cover.webp',
  'media/miaoda-beauty-home-cover.png': 'media/optimized/miaoda-beauty-home-cover.webp',
  'media/feishu-card-visual.png': 'media/optimized/feishu-card-visual.webp',
  'media/about-portrait.jpg': 'media/optimized/about-portrait.webp',
  // Shard B
  'media/feishu-card-editor.mp4': 'media/optimized/feishu-card-editor.mp4',
  'media/miaoda-queue.mp4': 'media/optimized/miaoda-queue.mp4',
  'media/miaoda-execution-trace.mp4': 'media/optimized/miaoda-execution-trace.mp4',
  'media/miaoda-delivery-plan.mp4': 'media/optimized/miaoda-delivery-plan.mp4',
  'media/miaoda-gui-1.mp4': 'media/optimized/miaoda-gui-1.mp4',
  'media/aily-automation.mp4': 'media/optimized/aily-automation.mp4',
  'media/miaoda-beauty-stage-03.svg': 'media/optimized/miaoda-beauty-stage-03.svg',
  'media/miaoda-beauty-stage-03-intro.svg': 'media/optimized/miaoda-beauty-stage-03-intro.svg',
  'media/aily-home-cover.png': 'media/optimized/aily-home-cover.webp',
  'media/aily-hero.png': 'media/optimized/aily-hero.webp',
  'media/aily-final-1.png': 'media/optimized/aily-final-1.webp',
  'media/aily-final-2.png': 'media/optimized/aily-final-2.webp',
  // Shard C
  'media/miaoda-template-v3.mp4': 'media/optimized/miaoda-template-v3.mp4',
  'media/miaoda-clarification-clean.mp4': 'media/optimized/miaoda-clarification-clean.mp4',
  'media/miaoda-multiagent.mp4': 'media/optimized/miaoda-multiagent.mp4',
  'media/miaoda-delivery-preview.mp4': 'media/optimized/miaoda-delivery-preview.mp4',
  'media/miaoda-gui-2.mp4': 'media/optimized/miaoda-gui-2.mp4',
  'media/miaoda-gui-3.mp4': 'media/optimized/miaoda-gui-3.mp4',
  'media/aily-partner-management.mp4': 'media/optimized/aily-partner-management.mp4',
  'media/aily-proactive-work.mp4': 'media/optimized/aily-proactive-work.mp4',
  'media/miaoda-beauty-stage-01-perspective-v3.svg': 'media/optimized/miaoda-beauty-stage-01-perspective-v3.svg',
  'media/miaoda-beauty-stage-05.svg': 'media/optimized/miaoda-beauty-stage-05.svg',
  'media/miaoda-beauty-stage-05-intro.svg': 'media/optimized/miaoda-beauty-stage-05-intro.svg',
  'media/miaoda-hero.svg': 'media/optimized/miaoda-hero.svg',
  'media/aily-core-partner-1.png': 'media/optimized/aily-core-partner-1.webp',
  'media/aily-core-partner-2.png': 'media/optimized/aily-core-partner-2.webp',
  // 与 aily-core-partner-1.png md5 相同，共用同一物理 webp，不另复制
  'media/aily-partner-before.png': 'media/optimized/aily-core-partner-1.webp',
  'media/aily-partner-after.png': 'media/optimized/aily-partner-after.webp',
  'media/logo-china-academy-of-art.png': 'media/optimized/logo-china-academy-of-art.webp',
};
