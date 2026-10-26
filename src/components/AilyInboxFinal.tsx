import { Check } from 'lucide-react';
import { asset } from '@/data/portfolio';
import './AilyInboxFinal.css';

const receiveTypes = [
  { label: '待我确认', checked: true },
  { label: '新增回复', checked: false },
  { label: '执行失败', checked: false },
];
const receiveScope = [
  { label: '包含自动化任务', checked: false },
  { label: '包含子任务', checked: true },
];

function SettingOption({ label, checked }: { label: string; checked: boolean }) {
  return <div className="aily-inbox-option"><span className={`aily-inbox-check${checked ? ' is-checked' : ''}`}>{checked && <Check/>}</span><span>{label}</span></div>;
}

export default function AilyInboxFinal() {
  return <section className="miaoda-project-hero aily-inbox-final" aria-label="核心设计 03：收件箱，持续运行但不持续打扰">
    <div className="aily-inbox-problem">
      <h2>核心矛盾</h2>
      <p>后台工作提醒可能与任务列表重复；每次事件都提醒，不等于帮助用户掌握进展。</p>
    </div>
    <div className="aily-inbox-principle">
      <h2>收件箱</h2>
      <p>按工作聚合，而非堆事件：让用户先看“哪件事有变化”，再进入详情理解上下文</p>
      <p>让接收设置与筛选分开：筛选是“此刻看什么”，接收设置是“以后收什么”。</p>
    </div>
    <img className="aily-inbox-label aily-inbox-label-before" src={asset('media/aily-inbox-before-label.png')} alt="Before" draggable={false}/>
    <img className="aily-inbox-label aily-inbox-label-after" src={asset('media/aily-inbox-after-label.png')} alt="After" draggable={false}/>
    <div className="aily-inbox-column aily-inbox-column-before">
      <img src={asset('media/aily-final-1.png')} alt="改版前：按事件堆叠的收件箱长列表" draggable={false}/>
    </div>
    <div className="aily-inbox-column aily-inbox-column-after">
      <img src={asset('media/aily-final-2.png')} alt="改版后：按工作聚合并呈现上下文的收件箱" draggable={false}/>
    </div>
    <section className="aily-inbox-settings" aria-label="收件箱接收设置示例">
      <h3>接收类型</h3>
      {receiveTypes.map(item => <SettingOption key={item.label} {...item}/>)}
      <hr/>
      <h3>接收范围</h3>
      {receiveScope.map(item => <SettingOption key={item.label} {...item}/>)}
    </section>
  </section>;
}
