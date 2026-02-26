
import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import Spinner from './Spinner';

const SearchBar = () => {
  const { researchTopic, searchPapers, isSearching } = useAppContext();
  const [query, setQuery] = useState(researchTopic);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    await searchPapers(query);
  };

  return (
    <div className="max-w-3xl mx-auto my-8">
      <form onSubmit={handleSearch} className="flex items-center bg-white rounded-full shadow-lg border border-gray-200 p-1.5 transition-shadow hover:shadow-xl">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="🔍 e.g. AI in finance, ML in education"
          className="w-full py-2.5 px-6 text-gray-700 bg-transparent focus:outline-none placeholder:text-gray-400"
          aria-label="Search Research Topic"
          disabled={isSearching}
        />
        <button
          type="submit"
          className="bg-blue-600 text-white rounded-full px-8 py-3 font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-all transform hover:scale-105 disabled:bg-blue-400 disabled:cursor-not-allowed disabled:scale-100 flex items-center justify-center min-w-[120px]"
          disabled={isSearching}
        >
          {isSearching ? <Spinner /> : 'Generate'}
        </button>
      </form>
    </div>
  );
};

export default SearchBar;