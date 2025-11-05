
import React from 'react';
import { Paper } from '../types';

interface HistoryScreenProps {
  recentlyViewed: Paper[];
  onViewPdf: (paper: Paper) => void;
}

const HistoryScreen: React.FC<HistoryScreenProps> = ({ recentlyViewed, onViewPdf }) => {
  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto">
      <header className="text-center mb-6">
        <h1 className="text-4xl font-bold text-primary">Recently Viewed</h1>
        <p className="text-gray-600 mt-1">Papers you have recently opened</p>
      </header>

      <div className="space-y-4">
        {recentlyViewed.length > 0 ? (
          recentlyViewed.map(paper => (
            <PaperCard key={`recent-${paper.id}`} paper={paper} onViewPdf={onViewPdf} />
          ))
        ) : (
          <p className="text-center text-gray-500 bg-white p-8 rounded-xl shadow-lg">You haven't viewed any papers yet. Go to the home page to start exploring!</p>
        )}
      </div>
    </div>
  );
};

const PaperCard: React.FC<{ paper: Paper; onViewPdf: (paper: Paper) => void }> = ({ paper, onViewPdf }) => (
  <div className="bg-white p-5 rounded-xl shadow-md flex items-center justify-between transition-transform hover:scale-105">
    <div>
      <h3 className="text-lg font-bold text-gray-800">{paper.name}</h3>
      <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
        <span>{paper.subject}</span>
        <span>&bull;</span>
        <span>{paper.year}</span>
        <span>&bull;</span>
        <span>{paper.board}</span>
         <span>&bull;</span>
        <span>Class {paper.class}</span>
      </div>
    </div>
    <button
      onClick={() => onViewPdf(paper)}
      className="bg-primary text-white font-semibold px-6 py-2 rounded-lg shadow-sm hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
    >
      View
    </button>
  </div>
);

export default HistoryScreen;
