import React from 'react';
import { Screen } from '../App';

interface BottomNavProps {
  activeScreen: Screen;
  setActiveScreen: (screen: Screen) => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ activeScreen, setActiveScreen }) => {
  // FIX: Replaced JSX.Element with React.ReactElement to resolve namespace error.
  const navItems: { screen: Screen; label: string; icon: React.ReactElement }[] = [
    { screen: 'home', label: 'Home', icon: <HomeIcon /> },
    { screen: 'upload', label: 'Upload', icon: <UploadIcon /> },
    { screen: 'history', label: 'History', icon: <HistoryIcon /> },
  ];

  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-white shadow-[0_-2px_10px_rgba(0,0,0,0.1)]">
      <div className="flex justify-around max-w-md mx-auto">
        {navItems.map(({ screen, label, icon }) => (
          <button
            key={screen}
            onClick={() => setActiveScreen(screen)}
            className={`flex flex-col items-center justify-center w-full py-3 transition-colors duration-200 ${
              activeScreen === screen ? 'text-primary' : 'text-gray-500 hover:text-primary'
            }`}
          >
            <div className={`w-6 h-6 mb-1 ${activeScreen === screen ? 'scale-110' : ''} transition-transform`}>{icon}</div>
            <span className="text-xs font-semibold">{label}</span>
          </button>
        ))}
      </div>
    </footer>
  );
};

const HomeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955a1.5 1.5 0 012.122 0l8.954 8.955M3 10.5v9.75a1.5 1.5 0 001.5 1.5h15a1.5 1.5 0 001.5-1.5V10.5M9 21V12h6v9" />
  </svg>
);

const UploadIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
  </svg>
);

const HistoryIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

export default BottomNav;
