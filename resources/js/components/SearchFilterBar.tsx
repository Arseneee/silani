import { AnimatePresence, motion } from 'framer-motion';
import { Filter, Search } from 'lucide-react';

interface SearchFilterBarProps {
    searchTerm: string;
    setSearchTerm: (value: string) => void;
    kategoriFilter: string;
    setKategoriFilter: (value: string) => void;
    onReset: () => void;
    isFilterOpen: boolean;
    setIsFilterOpen: (value: boolean) => void;
    searchPlaceholder?: string;
    filterOptions?: string[];
    filterLabel?: string;
}

export default function SearchFilterBar({
    searchTerm,
    setSearchTerm,
    kategoriFilter,
    setKategoriFilter,
    onReset,
    isFilterOpen,
    setIsFilterOpen,
    searchPlaceholder = 'Cari...',
    filterOptions = [],
    filterLabel = 'Filter berdasarkan kategori:',
}: SearchFilterBarProps) {
    return (
        <div className="mb-6 w-full">
            {/* Search + Buttons */}
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                {/* Search Input */}
                <div className="relative w-full md:max-w-sm">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <Search className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                    </div>
                    <input
                        type="text"
                        aria-label="Cari"
                        placeholder={searchPlaceholder}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 pl-10 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                    />
                </div>

                {/* Buttons */}
                <div className="flex flex-wrap items-center gap-2">
                    {filterOptions.length > 0 && (
                        <button
                            type="button"
                            onClick={() => setIsFilterOpen(!isFilterOpen)}
                            className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 focus:ring-4 focus:ring-blue-300 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600 dark:focus:ring-blue-800"
                        >
                            <Filter className="h-4 w-4" />
                            Filter
                        </button>
                    )}
                    <button
                        type="button"
                        onClick={onReset}
                        className="rounded-lg bg-blue-50 px-4 py-2.5 text-sm font-medium text-blue-700 hover:bg-blue-100 focus:ring-4 focus:ring-blue-300 focus:outline-none dark:bg-blue-900 dark:text-blue-200 dark:hover:bg-blue-800 dark:focus:ring-blue-800"
                    >
                        Reset
                    </button>
                </div>
            </div>

            {/* Dropdown Filter (Animated Below) */}
            <AnimatePresence>
                {isFilterOpen && filterOptions.length > 0 && (
                    <motion.div
                        key="dropdown-filter"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="mt-4 w-full rounded-lg border border-gray-200 bg-gray-50 p-4 shadow-sm dark:border-gray-600 dark:bg-gray-700"
                    >
                        <h3 className="mb-3 text-sm font-medium text-gray-900 dark:text-white">{filterLabel}</h3>
                        <div className="flex flex-wrap gap-2">
                            {filterOptions.map((kategori) => {
                                const isActive = kategoriFilter === kategori;
                                return (
                                    <button
                                        key={kategori}
                                        type="button"
                                        aria-pressed={isActive}
                                        onClick={() => {
                                            setKategoriFilter(isActive ? '' : kategori);
                                            setIsFilterOpen(false); // auto-tutup
                                        }}
                                        className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                                            isActive
                                                ? 'bg-blue-500 text-white dark:bg-blue-600'
                                                : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 dark:border-gray-500 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500'
                                        }`}
                                    >
                                        {kategori}
                                    </button>
                                );
                            })}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
