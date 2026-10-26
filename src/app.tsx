import { Routes, Route } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import HomePage from '@/pages/HomePage/HomePage';
import NotFoundPage from '@/pages/NotFoundPage/NotFoundPage';
import AboutPage from '@/pages/AboutPage';
import ProjectPage from '@/pages/ProjectPage';
import TravelPage from '@/pages/TravelPage';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="project/:id" element={<ProjectPage />} />
        <Route path="travel" element={<TravelPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
