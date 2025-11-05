
import React from 'react';
import { Paper } from '../types';

interface PdfViewerModalProps {
  paper: Paper;
  onClose: () => void;
}

const PdfViewerModal: React.FC<PdfViewerModalProps> = ({ paper, onClose }) => {
  if (!paper.url) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
        <div className="bg-white p-8 rounded-xl shadow-2xl text-center">
            <p className="text-red-500">Error: PDF URL is not available.</p>
            <button onClick={onClose} className="mt-4 bg-gray-200 text-gray-800 px-4 py-2 rounded-lg">Close</button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex flex-col items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl h-full flex flex-col">
        <header className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-bold text-gray-800 truncate">{paper.name}</h2>
          <div className="flex items-center space-x-4">
            <a 
              href={paper.url} 
              download={paper.name}
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Download
            </a>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-800 text-2xl">&times;</button>
          </div>
        </header>
        <div className="flex-grow">
          <iframe 
            src={paper.url}
            title={paper.name}
            className="w-full h-full border-0"
          />
        </div>
      </div>
    </div>
  );
};

export default PdfViewerModal;
