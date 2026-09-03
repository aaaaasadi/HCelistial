import React from 'react';
import { DemoProvider, useDemo } from './context/DemoContext';
import { AppShell } from './components/layout/AppShell';
import { DashboardView } from './components/dashboard/DashboardView';
import { MyJourneyView } from './components/journey/MyJourneyView';
import { LiveMonitorView } from './components/monitor/LiveMonitorView';
import { RecoveryCenterView } from './components/recovery/RecoveryCenterView';
import { AITravelGuideView } from './components/ai/AITravelGuideView';
import { PreferencesView } from './components/preferences/PreferencesView';
import { NotificationsView } from './components/notifications/NotificationsView';
import { DestinationExplorerView } from './components/destinations/DestinationExplorerView';

const MainView: React.FC = () => {
  const { currentTab } = useDemo();

  return (
    <div key={currentTab} className="view-transition">
      {(() => {
        switch (currentTab) {
          case 'dashboard':
            return <DashboardView />;
          case 'destinations':
            return <DestinationExplorerView />;
          case 'journey':
            return <MyJourneyView />;
          case 'monitor':
            return <LiveMonitorView />;
          case 'recovery':
            return <RecoveryCenterView />;
          case 'ai':
            return <AITravelGuideView />;
          case 'preferences':
            return <PreferencesView />;
          case 'notifications':
            return <NotificationsView />;
          default:
            return <DashboardView />;
        }
      })()}
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <DemoProvider>
      <AppShell>
        <MainView />
      </AppShell>
    </DemoProvider>
  );
};

export default App;
