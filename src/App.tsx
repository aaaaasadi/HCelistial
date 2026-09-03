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
import { AnimatePresence, motion } from 'motion/react';
import { DestinationExplorerView } from './components/destinations/DestinationExplorerView';

const MainView: React.FC = () => {
  const { currentTab } = useDemo();

  return (
    <AnimatePresence mode="wait">
      <motion.div 
        key={currentTab}
        initial={{ opacity: 0, y: 12, scale: 0.995 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -8, scale: 0.995 }}
        transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
        className="w-full"
      >
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
      </motion.div>
    </AnimatePresence>
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
