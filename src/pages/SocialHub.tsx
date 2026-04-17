import Navbar from '@/components/v2/Navbar';
import Footer from '@/components/v2/Footer';
import SignalHubContent from '@/components/v2/SignalHub/SignalHubContent';

const SocialHubPage = () => {
  return (
    <div className="min-h-screen bg-[#131313] text-[#e5e2e1]">
      <Navbar />
      <main className="pt-28 pb-20 px-6 max-w-7xl mx-auto">
        <SignalHubContent 
          title="Social Hub" 
          description="Discover and copy top-performing traders with real-time verified data." 
        />
      </main>
      <Footer />
    </div>
  );
};

export default SocialHubPage;
