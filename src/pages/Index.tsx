import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { HeroSection, HowItWorks, ExampleSection } from '@/components/LandingPage';

const Index = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <HowItWorks />
        <ExampleSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;