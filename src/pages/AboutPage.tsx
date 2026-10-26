import { motion } from 'framer-motion';
import { Image } from '@/components/ui/image';
import CareerTimeline from '@/components/CareerTimeline';
import { profile, asset, motionSettings } from '@/data/portfolio';

export default function AboutPage() {
  return <motion.main className="about-page" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: .3 }}>
    <section className="about-content">
      <div className="about-block about-intro">
        <motion.p initial={{ y: 30, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} viewport={{ once: true }} transition={{ duration: .55, ease: motionSettings.easeOut }}><strong>产品体验设计师。</strong>{profile.intro}</motion.p>
        <motion.p initial={{ y: 30, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} viewport={{ once: true }} transition={{ duration: .55, delay: .08, ease: motionSettings.easeOut }}><strong>现居{profile.location}</strong>，开放 AI 产品体验与复杂系统设计交流。</motion.p>
      </div>
      <CareerTimeline items={profile.career} />
    </section>
    <motion.figure className="portrait-slot portrait-static" aria-label="个人照片" initial={{ x: '70vw', opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 1.2, ease: motionSettings.ease }}>
      <Image src={asset('media/about-portrait.jpg')} alt="吴晓媛手持相机的个人照片" className="portrait-image portrait-photo" loading="eager" />
    </motion.figure>
  </motion.main>;
}
