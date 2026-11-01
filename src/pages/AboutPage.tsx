import { motion } from 'framer-motion';
import { Image } from '@/components/ui/image';
import CareerTimeline from '@/components/CareerTimeline';
import { profile, asset, motionSettings } from '@/data/portfolio';

export default function AboutPage() {
  return <motion.main className="about-page" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: .45, ease: motionSettings.ease }}>
    <section className="about-content">
      <motion.div className="about-block about-intro" initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }} transition={{ duration: .8, delay: .2, ease: motionSettings.ease }}>
        <div className="about-experience" aria-label="3 年 AI 产品设计经验，7 年设计经验">
          <span className="about-experience-item"><span className="about-experience-number">3</span><span className="about-experience-label">年 AI 产品设计经验</span></span>
          <span className="about-experience-item"><span className="about-experience-number">7</span><span className="about-experience-label">年设计经验</span></span>
        </div>
        <p className="about-intro-copy">产品体验设计师，{profile.intro}{profile.outro}</p>
      </motion.div>
      <CareerTimeline items={profile.career} />
    </section>
    <motion.figure className="portrait-slot portrait-static" aria-label="个人照片" initial={{ x: '70vw', opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: '70vw', opacity: 0 }} transition={{ duration: 1.2, ease: motionSettings.ease }}>
      <Image src={asset('media/about-portrait.jpg')} alt="吴晓媛手持相机的个人照片" className="portrait-image portrait-photo" loading="eager" />
    </motion.figure>
  </motion.main>;
}
