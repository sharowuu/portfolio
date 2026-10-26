import { motion } from 'framer-motion';
import { motionSettings, asset, type ICareerItem } from '@/data/portfolio';
import { Image } from '@/components/ui/image';

interface CareerTimelineProps { items: ICareerItem[] }

export default function CareerTimeline({ items }: CareerTimelineProps) {
  return (
    <section className="career-section" aria-label="工作与教育经历">
      <ol className="career-timeline">
        {items.map((item, index) => (
          <motion.li
            className="career-item"
            key={`${item.period}-${item.organization}`}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: .25 }}
            transition={{ duration: .55, delay: index * .1, ease: motionSettings.easeOut }}
          >
            <div className="career-brand" aria-hidden="true">
              <Image src={asset(item.logo)} alt="" className={`career-logo career-logo-${index}`} loading="eager" />
            </div>
            <div className="career-axis" aria-hidden="true"><span className="career-dot" /></div>
            <div className="career-detail">
              <time>{item.period}</time>
              <div className="career-description">
                <h3>{item.organization}</h3>
                {item.role ? <p>{item.role}</p> : null}
                {item.highlights.length > 0 && <ul>{item.highlights.map(highlight => <li key={highlight}>{highlight}</li>)}</ul>}
              </div>
            </div>
          </motion.li>
        ))}
      </ol>
    </section>
  );
}
