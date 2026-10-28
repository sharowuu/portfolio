// EXPORTS: IProject{id,title,category,cover,video,sections,website}, ISection{title,text,image,video}, profile, projects, asset, motionSettings
import { OPTIMIZED_MEDIA } from './optimized-media';
export interface ISection { title: string; text: string; image?: string; video?: string }
export interface IProject { id: string; title: string; category: string; cover: string; video?: string; sections: ISection[]; website: string; detailLayout?: 'miaoda' | 'beauty' | 'aily' | 'feishu-card'; reference?: boolean; coverContainsTitle?: boolean }
export interface ICareerItem { period: string; organization: string; role: string; highlights: string[]; logo: string }
const BASE = (import.meta.env.MIAODA_CLIENT_BASE_PATH || '').replace(/\/$/, '') + '/';
export const asset = (path: string) => { const norm = path.replace(/^\//, ''); return `${BASE}${OPTIMIZED_MEDIA[norm] ?? norm}`; };
export const motionSettings = {
  ease: [0.32, 0, 0, 1] as [number, number, number, number],
  easeOut: [0.215, 0.61, 0.355, 1] as [number, number, number, number],
  routeDuration: 1.2,
  spring: { type: 'spring' as const, stiffness: 190, damping: 18, bounce: 0 },
};
// Replace these fields with your own public-facing information. Empty links never send visitors to the reference author's accounts.
export const profile = {
  name: '吴晓媛', role: 'PRODUCT DESIGNER', email: 'sharowuu@gmail.com', phone: '15957109030', socialOne: '', socialTwo: '',
  portrait: 'media/portrait-placeholder.svg',
  portraitCutout: 'media/portrait-cutout.png',
  intro: '一名专注于 AI 产品体验的 UX 设计师。毕业于中国美术学院工业设计专业，曾在腾讯云负责云服务控制台、微搭低代码等复杂系统的体验设计；2022 年从深圳来到杭州，至今于飞书任 AI 产品体验设计师，擅长在复杂业务逻辑中梳理用户路径，平衡技术约束、业务目标与用户感知。',
  outro: '以严谨落地的设计，做有温度、可感知的 AI 产品体验。',
  location: '杭州',
  career: [
    { period: '2016 - 2019', organization: '中国美术学院', role: '工业设计·硕士', highlights: [], logo: 'media/logo-china-academy-of-art.png' },
    { period: '2019 - 2022', organization: '腾讯云·交互设计', role: '', highlights: ['腾讯云控制台', '腾讯云微搭(owner)'], logo: 'media/logo-tencent-cloud.svg' },
    { period: '2022 - 至今', organization: '飞书·产品体验设计', role: '', highlights: ['2022 - 2023 · 飞书卡片(owner)', '2023 - 2025 · 探索企业企业智能伙伴（Aily）', '2025 - 2026 · Aily 工作伙伴', '2025 - 2026 · 飞书妙搭'], logo: 'media/logo-lark.svg' },
  ] as ICareerItem[],
};
export const miaodaContent = {
  summary: '重新设计人与 AI 共创全栈应用的过程，让非专业用户理解、控制并完成应用开发。',
  background: '妙搭是飞书面向企业业务场景的 AI 原生应用开发平台，让业务人员通过自然语言由 AI 完成需求分析、任务规划、页面与服务端开发，快速搭建有数据、有权限、有流程的业务系统，并支持专业研发在此基础上继续做工程化和深度开发。',
  positioning: '妙搭以业务人员、编程小白为核心群体，帮助用户在没有深厚编程基础的情况下，构建具备前端、数据库、API、权限和部署能力的 Web 应用。当前主要聚焦个人及团队的轻量工具，长期一方面拓展到报告、设计稿等 “代码产物”，另一方面增强合规、安全和稳定部署能力，支撑更复杂的企业系统。',
  progression: '三种模式渐进覆盖：灵感（原型） → 应用（全栈） → 专家（复杂系统）',
  system: '为业务部门搭建「围绕已有数据和飞书协同、有权限有流转」的轻业务系统',
  modes: [
    { title: '灵感模式', description: '原型快速验证', icon: 'media/miaoda-mode-inspiration.svg' },
    { title: '应用模式', description: '全栈轻量系统', icon: 'media/miaoda-mode-app.svg' },
    { title: '专家模式', description: '专业复杂系统', icon: 'media/miaoda-mode-expert.svg' },
  ],
};
export const miaodaUserAnalysis = {
  summary: '妙搭以业务人员、编程小白为核心群体，通过自然语言完成应用的 0→60，再让专业研发接力完成 60→100。',
};
export const miaodaDesignStrategy = {
  summary: '通过用户旅程分析可知，【需求触发与表达】【AI 开发过程】以及【测试预览】三个阶段是整个应用开发链路中的核心卡点。',
  watermark: 'DESIGN GOAL',
};
export const miaodaCoreDesign = {
  headline: '把需求输入设计成 “业务对话”，让用户会表达',
  summary: '有效需求通常包含：应用类型、使用场景、具体功能、界面要求和用户群体',
  points: [
    { description: '空输入框虽然自由，但用户不知道怎样描述一个完整应用，因此在输入框下方分场景提供 prompt，并支持结构化扩写，帮助用户快速、完整地表达需求。', image: 'media/miaoda-core-point-1.svg', video: 'media/miaoda-input.mp4' },
    { description: '以 “风格化主题 × 场景 Prompt” 替代应用固定模板，在保证快速上手的同时保留创作灵活性，减少用户反复调试的压力。', image: 'media/miaoda-core-point-2.svg', video: 'media/miaoda-template-v3.mp4' },
    { description: '针对较宽泛的需求，主 Agent 会在执行前分步澄清，渐进式收集关键信息，在减少额外打扰的同时，将模糊想法逐步收敛为明确需求。', image: 'media/miaoda-core-point-4.svg', video: 'media/miaoda-clarification-clean.mp4' },
  ],
};
export const miaodaCoreCollaboration = {
  headline: 'AI 自主执行 vs 用户控制',
  summary: '在妙搭对话流的设计中，持续探索人与 Agent 的协作方式，尝试建立一套逻辑清晰、过程可控的人机交互范式。',
  image: 'media/miaoda-core-collaboration.svg',
};
export const miaodaCoreExecution = {
  headline: 'AI 自主执行 vs 用户控制',
  principles: ['AI 执行过程可见：谁在做、做到哪、做出了什么', '用户可控：可补充、暂停、取消、重试与回滚', '执行过程可信：状态真实、责任明确、结果可验证'],
  points: [
    { description: 'AI 执行过程可见：在对话流中重点区分主 agent 和子 agent 的调度关系、执行状态和执行成果', image: 'media/miaoda-execution-case-1.svg', video: 'media/miaoda-multiagent.mp4' },
    { description: '用户可控：在 agent 执行过程中，通过队列的方式明确引导当前状态可补充信息，可打断执行', image: 'media/miaoda-execution-case-2.svg', video: 'media/miaoda-queue.mp4' },
    { description: '执行过程可信：支持查看各 Agent 调用的工具及相关代码，让执行过程透明、可追溯。', image: 'media/miaoda-execution-case-3.svg', video: 'media/miaoda-execution-trace.mp4' },
  ],
};
export const miaodaCoreDelivery = {
  headline: '让 AI 开发从 “黑盒等待” 转向 “阶段性交付”',
  summary: '完整的应用开发时间较长，用户容易失去耐心，按需逐步输出成功供用户确认',
  points: [
    { description: '应用生成耗时较长（约 20 分钟），且 AI 执行过程缺乏透明度，容易引发用户对漫长等待与 Token 消耗的焦虑。', image: 'media/miaoda-delivery-case-1.svg', video: 'media/miaoda-delivery-before.mp4' },
    { description: '在应用生成前强制进入 spec 开发流程，逐步输出「概要文档」和完整的「开发计划」，用户审核开发文档后开始开发。', image: 'media/miaoda-delivery-case-2.svg', video: 'media/miaoda-delivery-spec.mp4' },
    { description: '取消独立 spec 和概要设计文档，保留「规划-确认-执行」的控制点，用户按需启用 plan，通过对话校准方案', image: 'media/miaoda-delivery-case-3.svg', video: 'media/miaoda-delivery-plan.mp4' },
    { description: '支持阶段性预览：应用生成时优先搭建并渲染整体框架，逐步呈现已完成的界面区块，降低用户的等待焦虑。', image: 'media/miaoda-delivery-case-4.svg', video: 'media/miaoda-delivery-preview.mp4' },
  ],
};
export const miaodaCoreEditing = {
  headline: '低门槛可视化修改',
  summary: '应用生成完成之后，支持用户可视化修改应用界面',
  points: [
    { description: '样式问题实时修改并渲染效果', image: 'media/miaoda-editing-case-1.svg', video: 'media/miaoda-gui-1.mp4' },
    { description: '自然语言修改，更自由灵活', image: 'media/miaoda-editing-case-2.svg', video: 'media/miaoda-gui-2.mp4' },
    { description: '一键提交所有修改，减少等待时间；同时支持撤销单点修改', image: 'media/miaoda-editing-case-3.svg', video: 'media/miaoda-gui-3.mp4' },
  ],
};
export const projects: IProject[] = [
  {
    id: 'project-1', title: '飞书妙搭', category: 'AI 产品体验设计',
    cover: 'media/miaoda-home-cover.png', coverContainsTitle: true, website: 'https://miaoda.feishu.cn/', detailLayout: 'miaoda', reference: false,
    sections: [
      { title: '飞书妙搭', text: miaodaContent.summary, image: 'media/miaoda-hero.svg' },
      { title: '项目简介', text: miaodaContent.background },
    ],
  },
  {
    id: 'project-2', title: '妙搭产物默认好看', category: 'AI 产物生成策略与视觉设计',
    cover: 'media/miaoda-beauty-home-cover.png', coverContainsTitle: true, website: 'https://miaoda.feishu.cn/', detailLayout: 'beauty', reference: false,
    sections: [{ title: '妙搭产物默认好看', text: '妙搭作为企业场景的 AI 原生系统搭建工具，需让默认生成的界面具备足够高的设计水准，减少用户反复调试；设计师因此深度参与产物生成策略调试工作，目标是让每一次默认生成的应用界面都超出预期、带来惊喜。', image: 'media/miaoda-beauty-hero.svg' }, { title: '八个阶段的策略演进', text: '这条专项线从组件和主题的确定性兜底出发，经历素材召回、具象化 PE、Design Guideline 拆 Skill，最终进入模型能力与工程链路协同。\n\n核心不是“让模型自由发挥”，而是在可接受的稳定性边界内，逐步释放设计创造力。', image: 'media/miaoda-beauty-evolution.svg' }, { title: '01 组件统一与主题兜底', text: '2025.07\n\n挑战：同时具备几套设计系统，默认产物缺少统一视觉基线；首要任务是统一组件、素材和PE，而不是立即追求高创意。\n\n做法与效果：下掉 aily-ui，统一收敛到 antd；刷新 RAG 为 antd 版本；清理 code agent 与 page function 的 PE。做出“基本可用”的主题第一版。', image: 'media/miaoda-beauty-stage-01-perspective-v3.svg' }, { title: '02 Prompt 探索与 Shadcn 切换', text: '2025.07-08\n\n挑战：外部对照显示：Claude 能快速产出好看的 UX，但妙搭“默认好看”差距明显；antd 与既有素材难以支撑更丰富的官网视觉。\n\n做法与效果：建立视觉评测维度，开始用 Prompt 把“好看”内置进默认链路。切换 Shadcn，配套页面 Layout、内置主题，区块级 Blocks 素材。', image: 'media/miaoda-beauty-stage-02.svg' }, { title: '03 提供官网 Blocks 素材', text: '2025.10-11\n\n挑战：主题单调、缺装饰元素、Tag 很素、图表不跟随主题、布局结构简单；模型会接受 Card 外壳但重写内部，素材召回和上下文压缩仍不稳定。\n\n做法与效果：收集开源官网 Block 素材，按 Hero、Feature、Testimonial、CTA、Pricing 分类。', image: 'media/miaoda-beauty-stage-03.svg' }, { title: '04 PE 调优', text: '2025.11-2026.01\n\n把抽象审美翻译成模型可执行的设计规则：用 Visual DNA、色彩心理、主导色和 CSS / Tailwind 变量替代空泛形容词；具体规定图片类型、尺寸、风格及布局微交互。', image: 'media/miaoda-beauty-stage-04.svg' }, { title: '05 Design Guideline 拆 Skill', text: '2026.03-04\n\n2 万 token Design Guideline 拆 Skill，精细化治理风格。全局底线放 AGENTS.md，场景细则放规范型 Skill；由 Agent 并行选择多个 Design Skill，并逐项治理图表、密度、卡片层级和生图触发。', image: 'media/miaoda-beauty-stage-05.svg' }],
  },
  {
    id: 'project-3', title: 'Aily 工作伙伴', category: 'AI Agent 协同办公体验设计',
    cover: 'media/aily-home-cover.png', coverContainsTitle: true, website: 'https://aily.feishu.cn/', detailLayout: 'aily', reference: false,
    sections: [{ title: 'Aily 工作伙伴', text: '探索人与 Agent 协同办公，让 AI 持续工作，让人掌握关键节点。\n\n项目时间：2026.04 — 2026.10', image: 'media/aily-hero.png' }, { title: '项目背景', text: '随着 AI 从即时问答走向任务执行，人与 AI 的协作开始超出单次对话：一项工作需要持续迭代，多项工作需要并行管理，不同 Agent 的能力与工作方式也需要被理解和配置。Aily 从个人助手转向企业办公场景的 AI 工作台，旨在将飞书中的轻量 Bot 延伸为可持续的工作协作。\n\n我的范围：主导自动化任务、伙伴管理、个人伙伴详情页框架与详细配置、主动工作以及 Inbox 的体验设计。', image: '' }],
  },
  {
    id:'project-4', title:'飞书卡片', category:'卡片生成与消费体验设计', cover:'media/optimized/feishu-card-cover-v4.webp', website:'https://open.larkoffice.com/cardkit', detailLayout:'feishu-card', reference:false, coverContainsTitle:true,
    sections:[{title:'飞书卡片',text:'飞书卡片是一个覆盖从卡片生成到消费完整链路的产品体系，既关注卡片如何被创建，也关注它如何被触达、展示和使用。\n\n项目时间：2022 - 2023',image:'media/optimized/feishu-card-visual-v2.webp'}]
  },
];
