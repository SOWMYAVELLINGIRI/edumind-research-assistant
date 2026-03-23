
import React, { useState, useEffect } from 'react';
import SearchBar from '../components/SearchBar';
import PaperList from '../components/PaperList';
import PaperDetails from '../components/PaperDetails';
import { useAppContext } from '../context/AppContext';

const HomePage = () => {
    const { applyFilters } = useAppContext();
    const [activeFilters, setActiveFilters] = useState({ year: 'All', sortBy: 'default', highCitation: false });

    useEffect(() => {
        applyFilters(activeFilters);
    }, [activeFilters, applyFilters]);

    const handleYearChange = (year: string) => {
        setActiveFilters(prev => ({
            ...prev,
            year: prev.year === year ? 'All' : year,
        }));
    };

    const handleHighCitationToggle = () => {
        setActiveFilters(prev => ({
            ...prev,
            highCitation: !prev.highCitation,
        }));
    };
        
    const FilterButton = ({ label, value }: {label:string, value:string}) => (
        <button
            onClick={() => handleYearChange(value)}
            className={`px-4 py-1.5 text-sm font-medium rounded-full transition-colors ${
                activeFilters.year === value
                ? 'bg-blue-600 text-white shadow'
                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-300'
            }`}
        >
            {label}
        </button>
    );

    return (
        <div className="max-w-7xl mx-auto">
            <SearchBar />
            
            <div className="flex justify-center items-center flex-wrap gap-2 mb-8">
                <span className="text-sm font-semibold text-gray-600 mr-2">Filters:</span>
                <FilterButton label="2025" value="2025" />
                <FilterButton label="2024" value="2024" />
                <FilterButton label="2023" value="2023" />
                <FilterButton label="2022" value="2022" />
                <FilterButton label="2021" value="2021" />
                <button
                    onClick={handleHighCitationToggle}
                    className={`px-4 py-1.5 text-sm font-bold rounded-full transition-colors border ${
                        activeFilters.highCitation
                        ? 'bg-blue-800 text-white shadow border-blue-800'
                        : 'bg-white text-blue-600 hover:bg-gray-100 border-blue-600'
                    }`}
                >
                    High Citation
                </button>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1">
                    <PaperList />
                </div>
                <div className="lg:col-span-2">
                    <PaperDetails />
                </div>
            </div>
        </div>
    );
};

export default HomePage;