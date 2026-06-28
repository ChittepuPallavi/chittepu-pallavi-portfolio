import Portfolio from '../components/Portfolio';

export const metadata = {
  title: 'Chittepu Pallavi — Software Developer & AI Enthusiast',
  description: 'Portfolio of Chittepu Pallavi — B.Tech CS student, Java Developer, AI Enthusiast, and Full Stack Learner.',
};

export default function Home() {
  return (
    <main style={{ margin: 0, padding: 0, background: '#000' }}>
      <Portfolio />
    </main>
  );
}

