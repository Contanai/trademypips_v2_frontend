import DashboardLayoutV2 from '@/components/dashboard/v2/DashboardLayoutV2';
import SignalHubContent from '@/components/v2/SignalHub/SignalHubContent';

const SignalHubPage = () => {
  return (
    <DashboardLayoutV2>
      <div className="max-w-7xl mx-auto py-8">
        <SignalHubContent 
          title="Signal Hub" 
          description="Manage and monitor your active signal strategies and copy-trading parameters." 
        />
      </div>
    </DashboardLayoutV2>
  );
};

export default SignalHubPage;
