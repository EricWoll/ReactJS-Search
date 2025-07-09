'use client';

import { createContext, useCallback, useContext, useState } from 'react';
import { Filters } from '../types/filter.types';

/**
 * Provides methods and state for managing dynamic filters.
 */
interface FilterContextValue {
    /** Current active filters mapped by their IDs */
    filter: Filters;

    /**
     * Merges new filters into the existing filter set.
     * @param filters - A map of filters to add or override
     */
    addFilters: (filters: Filters) => void;

    /**
     * Removes filters based on their keys.
     * @param filterIds - Array of filter IDs to remove
     */
    removeFilters: (filterIds: string[]) => void;

    /**
     * Checks whether all specified filters currently exist.
     * @param filterIds - Array of filter IDs to check
     * @returns True if all filters are present; false otherwise
     */
    hasFilters: (filterIds: string[]) => boolean;

    /**
     * Sets specified filter values to `null` while keeping their keys.
     * @param filterIds - Array of filter IDs to reset
     */
    resetFilters: (filterIds: string[]) => void;

    /**
     * Clears all filters from the context.
     */
    resetAllFilters: () => void;

    /**
     * Updates existing filters by merging in new values.
     * @param filters - Partial filter set to update
     */
    updateFilters: (filters: Filters) => void;
}

const FilterContext = createContext<FilterContextValue | undefined>(undefined);

/**
 * Provider component that wraps children with filter management state and logic.
 */
export function FilterProvider({ children }: { children: React.ReactNode }) {
    const [filters, setFilters] = useState<Filters>({});

    const addFilters = useCallback(
        (filters: Filters) => {
            setFilters((prev) => ({ ...prev, ...filters }));
        },
        [filters]
    );

    const updateFilters = useCallback(
        (filters: Filters) => {
            setFilters((prev) => ({ ...prev, ...filters }));
        },
        [filters]
    );

    const removeFilters = useCallback(
        (filterIds: string[]) => {
            setFilters((prev) => {
                const updated = { ...prev };
                filterIds.forEach((id) => {
                    try {
                        delete updated[id];
                    } catch (error) {
                        console.error(`Error removing filter ${id}:`, error);
                    }
                });
                return updated;
            });
        },
        [filters]
    );

    const hasFilters = useCallback(
        (filterIds: string[]) => {
            return filterIds.every((id) => filters[id] !== undefined);
        },
        [filters]
    );

    const resetFilters = useCallback(
        (filterIds: string[]) => {
            setFilters((prev) => {
                const updated = { ...prev };
                filterIds.forEach((id) => {
                    if (updated[id]) {
                        updated[id].value = null;
                    }
                });
                return updated;
            });
        },
        [filters]
    );

    const resetAllFilters = useCallback(() => {
        setFilters({});
    }, []);

    const value: FilterContextValue = {
        filter: filters,
        addFilters,
        removeFilters,
        hasFilters,
        resetFilters,
        resetAllFilters,
        updateFilters,
    };

    return (
        <FilterContext.Provider value={value}>
            {children}
        </FilterContext.Provider>
    );
}

/**
 * Hook to access the FilterContext in consuming components.
 * @throws Will throw an error if used outside a FilterProvider
 * @returns Context containing current filters and manipulation functions
 */
export function useFilter() {
    const context = useContext(FilterContext);
    if (!context) {
        throw new Error('useFilter must be used within a FilterProvider');
    }
    return context;
}
