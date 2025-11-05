
import React, { useState, useCallback } from 'react';
import HomeScreen from './components/HomeScreen';
import UploadScreen from './components/UploadScreen';
import HistoryScreen from './components/HistoryScreen';
import BottomNav from './components/BottomNav';
import PdfViewerModal from './components/PdfViewerModal';
import { Paper } from './types';
import { addRecentlyViewed, getRecentlyViewed } from './services/localCache';

export type Screen = 'home' | 'upload' | 'history';

const App: React.FC = () => {
  const [activeScreen, setActiveScreen] = useState<Screen>('home');
  const [viewingPdf, setViewingPdf] = useState<Paper | null>(null);
  const [recentlyViewed, setRecentlyViewed] = useState<Paper[]>(getRecentlyViewed());

  const handleViewPdf = useCallback((paper: Paper) => {
    const updatedRecentlyViewed = addRecentlyViewed(paper);
    setRecentlyViewed(updatedRecentlyViewed);
    setViewingPdf(paper);
  }, []);

  const renderScreen = () => {
    switch (activeScreen) {
      case 'home':
        return <HomeScreen onViewPdf={handleViewPdf} />;
      case 'upload':
        return <UploadScreen onUploadSuccess={() => setActiveScreen('home')} />;
      case 'history':
        return <HistoryScreen recentlyViewed={recentlyViewed} onViewPdf={handleViewPdf} />;
      default:
        return <HomeScreen onViewPdf={handleViewPdf} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans">
      <main className="flex-grow pb-24">
        {renderScreen()}
      </main>
      <BottomNav activeScreen={activeScreen} setActiveScreen={setActiveScreen} />
      {viewingPdf && (
        <PdfViewerModal paper={viewingPdf} onClose={() => setViewingPdf(null)} />
      )}
    </div>
  );
};

export default App;
