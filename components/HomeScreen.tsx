
import React, { useState, useMemo } from 'react';
import { Paper, SearchFilters } from '../types';
import { usePapers } from '../hooks/usePapers';
import { CLASSES, BOARDS, SUBJECTS, YEARS } from '../constants';
import Spinner from './Spinner';

interface HomeScreenProps {
  onViewPdf: (paper: Paper) => void;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ onViewPdf }) => {
  const { papers, loading, error, refreshPapers } = usePapers();
  const [filters, setFilters] = useState<SearchFilters>({
    class: '',
    board: '',
    subject: '',
    year: '',
  });

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const filteredPapers = useMemo(() => {
    if (!papers) return [];
    return papers.filter(paper => {
      return (
        (filters.class ? paper.class === filters.class : true) &&
        (filters.board ? paper.board === filters.board : true) &&
        (filters.subject ? paper.subject === filters.subject : true) &&
        (filters.year ? paper.year === filters.year : true)
      );
    });
  }, [papers, filters]);

  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto">
      <header className="text-center mb-6">
        <h1 className="text-4xl font-bold text-primary">PastPaperPK</h1>
        <p className="text-gray-600 mt-1">Find past papers for your exams</p>
      </header>

      <div className="bg-white p-6 rounded-xl shadow-lg mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <SelectInput name="class" value={filters.class} onChange={handleFilterChange} options={CLASSES} placeholder="Class" />
          <SelectInput name="board" value={filters.board} onChange={handleFilterChange} options={BOARDS} placeholder="Board" />
          <SelectInput name="subject" value={filters.subject} onChange={handleFilterChange} options={SUBJECTS} placeholder="Subject" />
          <SelectInput name="year" value={filters.year} onChange={handleFilterChange} options={YEARS} placeholder="Year" />
        </div>
      </div>
      
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold text-gray-800">Available Papers</h2>
        <button onClick={refreshPapers} disabled={loading} className="text-primary hover:text-blue-800 disabled:opacity-50">
            {loading ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      {loading && <div className="flex justify-center p-10"><Spinner /></div>}
      {error && <p className="text-center text-red-500 bg-red-100 p-4 rounded-lg">{error}</p>}
      {!loading && !error && (
        <div className="space-y-4">
          {filteredPapers.length > 0 ? (
            filteredPapers.map(paper => <PaperCard key={paper.id} paper={paper} onViewPdf={onViewPdf} />)
          ) : (
            <p className="text-center text-gray-500 bg-gray-100 p-6 rounded-lg">No papers found matching your criteria. Try adjusting the filters or refreshing the list.</p>
          )}
        </div>
      )}
    </div>
  );
};

interface SelectInputProps {
  name: keyof SearchFilters;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: string[];
  placeholder: string;
}

const SelectInput: React.FC<SelectInputProps> = ({ name, value, onChange, options, placeholder }) => (
  <select
    name={name}
    value={value}
    onChange={onChange}
    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition"
  >
    <option value="">All {placeholder}s</option>
    {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
  </select>
);

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

export default HomeScreen;
