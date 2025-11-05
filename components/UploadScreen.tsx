
import React, { useState, useCallback } from 'react';
import { Paper } from '../types';
import { uploadPaper } from '../services/firebase';
import { addPaperToIndex } from '../services/localCache';
import { CLASSES, BOARDS, SUBJECTS, YEARS } from '../constants';

interface UploadScreenProps {
  onUploadSuccess: () => void;
}

type UploadStatus = 'idle' | 'uploading' | 'success' | 'error';

const UploadScreen: React.FC<UploadScreenProps> = ({ onUploadSuccess }) => {
  const [formData, setFormData] = useState({
    class: CLASSES[0],
    board: BOARDS[0],
    subject: SUBJECTS[0],
    year: YEARS[0],
  });
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<UploadStatus>('idle');
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError('Please select a PDF file to upload.');
      return;
    }
    setError('');
    setStatus('uploading');
    setProgress(0);

    try {
      const newPaperData: Omit<Paper, 'id' | 'path'> = {
        name: file.name,
        ...formData,
      };

      const uploadedPaper = await uploadPaper(file, newPaperData, setProgress);
      addPaperToIndex(uploadedPaper);

      setStatus('success');
      setTimeout(() => {
        onUploadSuccess();
      }, 2000);
    } catch (err: any) {
      console.error("Upload failed:", err);
      setStatus('error');
      setError(err.message || 'An unknown error occurred during upload.');
    }
  }, [file, formData, onUploadSuccess]);

  return (
    <div className="p-4 md:p-6 max-w-lg mx-auto">
      <header className="text-center mb-6">
        <h1 className="text-4xl font-bold text-primary">Upload Paper</h1>
        <p className="text-gray-600 mt-1">Contribute to the collection</p>
      </header>
      
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-lg space-y-6">
        <SelectInput label="Class" name="class" value={formData.class} onChange={handleInputChange} options={CLASSES} />
        <SelectInput label="Board" name="board" value={formData.board} onChange={handleInputChange} options={BOARDS} />
        <SelectInput label="Subject" name="subject" value={formData.subject} onChange={handleInputChange} options={SUBJECTS} />
        <SelectInput label="Year" name="year" value={formData.year} onChange={handleInputChange} options={YEARS} />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Paper (PDF)</label>
          <input
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-light file:text-primary hover:file:bg-blue-200"
            required
          />
        </div>
        
        {status === 'uploading' && (
          <div>
            <p className="text-sm text-center text-gray-600 mb-2">Uploading... {Math.round(progress)}%</p>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div className="bg-primary h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
            </div>
          </div>
        )}

        {status === 'success' && <p className="text-center text-green-600 bg-green-100 p-3 rounded-lg">Upload successful! Redirecting...</p>}
        {status === 'error' && <p className="text-center text-red-600 bg-red-100 p-3 rounded-lg">{error}</p>}
        
        <button 
          type="submit" 
          disabled={status === 'uploading' || status === 'success'}
          className="w-full bg-primary text-white font-bold py-3 px-4 rounded-lg shadow-md hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
        >
          {status === 'uploading' ? 'Uploading...' : 'Upload Paper'}
        </button>
      </form>
    </div>
  );
};

const SelectInput: React.FC<{
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: string[];
}> = ({ label, name, value, onChange, options }) => (
  <div>
    <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <select
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition"
    >
      {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
    </select>
  </div>
);

export default UploadScreen;
