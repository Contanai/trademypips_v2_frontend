import Navbar from '../components/v2/Navbar';
import Hero from '../components/v2/Hero';
import LiveStrip from '../components/v2/LiveStrip';
import PlatformGrid from '../components/v2/PlatformGrid';
import ProcessSteps from '../components/v2/ProcessSteps';
import StatsGrid from '../components/v2/StatsGrid';
import LogTerminal from '../components/v2/LogTerminal';
import PricingPlans from '../components/v2/PricingPlans';
import SystemPowerBento from '../components/v2/SystemPowerBento';
import FinalCTA from '../components/v2/FinalCTA';
import Footer from '../components/v2/Footer';

const Index = () => {
  return (
    <div className="min-h-screen bg-surface text-on-surface font-body selection:bg-primary-container selection:text-on-primary">
      <Navbar />
      <main>
        <Hero />
        <LiveStrip />
        <PlatformGrid />
        <ProcessSteps />
        <StatsGrid />
        <LogTerminal />
        <PricingPlans />
        <SystemPowerBento />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
