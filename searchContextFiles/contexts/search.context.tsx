import { createContext, useCallback, useContext, useState } from 'react';
import { Search, SearchValue } from '../types/search.types';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { URLSearchParams } from 'url';

/**
 * Provides methods and state for managing multiple search instances.
 * Each instance includes a query and an optional URL sync flag,
 * and is stored in a keyed object with the instance ID as key.
 */
interface SearchContextValue {
    /** Stores all current search instances by ID. */
    searchInstances: Search;

    /**
     * Adds a new search instance.
     * @param id - Unique identifier for the search instance.
     * @param query - Object representing the search query value.
     * @param hasUrlSync - Indicates if the query should sync with the URL.
     */
    addSearchInstance: (
        id: string,
        query: SearchValue,
        hasUrlSync: boolean
    ) => void;

    /**
     * Adds multiple search instances at once.
     * @param instances - Object containing search instances keyed by ID.
     */
    addSearchInstances: (instances: Search) => void;

    /**
     * Updates the query of a specific search instance.
     * @param id - ID of the search instance to update.
     * @param query - New query value to apply.
     */
    updateSearchInstance: (id: string, query: SearchValue) => void;

    /**
     * Updates multiple search instances in bulk.
     * @param instances - Object with updated search instances.
     */
    updateSearchInstances: (instances: Search) => void;

    /**
     * Updates the urlparams of a specific search instance.
     * @param id - ID of the search instance to update.
     * @param hasUrlSync - Should the URL sync status apply.
     */
    updateUrlParam: (id: string, hasUrlSync: boolean) => void;

    /** Updates multiple search instances' URL sync status. */
    updateUrlParams: (instances: Search) => void;

    /**
     * Retrieves a specific search instance.
     * @param id - ID of the desired search instance.
     * @returns An object with `query` and optional `hasUrlSync`, or `undefined` if not found.
     */
    getSearchInstance: (
        id: string
    ) => { query: SearchValue; hasUrlSync?: boolean } | undefined;

    /**
     * Retrieves multiple search instances by their IDs.
     * @param ids - Array of instance IDs to fetch.
     * @returns A subset of the `Search` object, or `undefined` if none found.
     */
    getSearchInstances: (ids: string[]) => Search | undefined;

    /**
     * Checks if a specific search instance exists.
     * @param id - ID of the search instance.
     * @returns `true` if the instance exists, `false` otherwise.
     */
    hasSearchInstance: (id: string) => boolean;

    /**
     * Checks if all provided instances exist.
     * @param instances - Object with instance IDs to validate.
     * @returns `true` if all exist, `false` otherwise.
     */
    hasSearchInstances: (instances: Search) => boolean;

    /**
     * Checks if any search instances are currently active.
     * @returns `true` if at least one exists, `false` otherwise.
     */
    hasAnySearchInstance: () => boolean;

    /**
     * Removes a specific search instance.
     * @param id - ID of the instance to remove.
     */
    removeSearchInstance: (id: string) => void;

    /**
     * Removes multiple search instances.
     * @param instances - Object containing instance IDs to remove.
     */
    removeSearchInstances: (instances: Search) => void;

    /**
     * Clears all search instances.
     */
    removeAllSearchInstances: () => void;

    /**
     * Resets the query value of a specific instance to `null`.
     * @param id - ID of the instance to reset.
     */
    resetSearchInstance: (id: string) => void;

    /**
     * Resets the query values of multiple instances to `null`.
     * @param instances - Object with instance IDs to reset.
     */
    resetSearchInstances: (instances: Search) => void;

    /**
     * Resets all search queries to `null`, retaining their structure.
     */
    resetAllSearchInstances: () => void;
}

const defaultValues: SearchContextValue = {
    searchInstances: {},
    addSearchInstance: () => {},
    addSearchInstances: () => {},
    updateSearchInstance: () => {},
    updateSearchInstances: () => {},
    updateUrlParam: () => {},
    updateUrlParams: () => {},
    getSearchInstance: () => undefined,
    getSearchInstances: () => undefined,
    hasSearchInstance: () => false,
    hasSearchInstances: () => false,
    hasAnySearchInstance: () => false,
    removeSearchInstance: () => {},
    removeSearchInstances: () => {},
    removeAllSearchInstances: () => {},
    resetSearchInstance: () => {},
    resetSearchInstances: () => {},
    resetAllSearchInstances: () => {},
};

const SearchContext = createContext<SearchContextValue | undefined>(
    defaultValues
);

/** * Provides methods and state for managing search instances.
 */
export function SearchProvider({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const urlSearchParams = useSearchParams();

    const [searchInstances, setSearchInstances] = useState<Search>({});

    const addSearchInstance = useCallback(
        (id: string, query: SearchValue, hasUrlSync: boolean) => {
            setSearchInstances((prev) => ({
                ...prev,
                [id]: { query: query, hasUrlSync: hasUrlSync },
            }));
        },
        [setSearchInstances]
    );

    const addSearchInstances = useCallback(
        (instances: Search) => {
            setSearchInstances((prev) => ({ ...prev, ...instances }));
        },
        [setSearchInstances]
    );

    const updateSearchInstance = useCallback(
        (id: string, query: SearchValue) => {
            setSearchInstances((prev) => ({
                ...prev,
                [id]: {
                    query: query,
                    hasUrlSync: prev[id]?.hasUrlSync || false,
                },
            }));
        },
        [setSearchInstances]
    );

    const updateSearchInstances = useCallback(
        (instances: Search) => {
            setSearchInstances((prev) => ({ ...prev, ...instances }));
        },
        [setSearchInstances]
    );

    const updateUrlParam = useCallback(
        (id: string, hasUrlSync: boolean) => {
            if (!hasUrlSync) return;
            const currentParams = new URLSearchParams(
                Object.fromEntries(urlSearchParams.entries())
            );
            currentParams.set(id, searchInstances[id]?.query.value || '');
            router.push(`${pathname}?${currentParams.toString()}`);
        },
        [router, pathname, urlSearchParams, searchInstances]
    );

    const updateUrlParams = useCallback(() => {
        const currentParams = new URLSearchParams(
            Object.fromEntries(urlSearchParams.entries())
        );
        Object.keys(searchInstances).forEach((id) => {
            currentParams.set(id, searchInstances[id]?.query.value || '');
        });
        router.push(`${pathname}?${currentParams.toString()}`);
    }, [router, pathname, urlSearchParams, searchInstances]);

    const getSearchInstance = useCallback(
        (id: string) => {
            if (!searchInstances[id]) return undefined;
            return {
                query: searchInstances[id].query,
                hasUrlSync: searchInstances[id].hasUrlSync,
            };
        },
        [searchInstances]
    );

    const getSearchInstances = useCallback(
        (ids: string[]) => {
            return ids.reduce((acc: Search, currId) => {
                const instance = getSearchInstance(currId);
                if (instance) {
                    acc[currId] = instance;
                }
                return acc;
            }, {} as Search);
        },
        [getSearchInstance]
    );

    const hasSearchInstance = useCallback(
        (id: string) => id in searchInstances,
        [searchInstances]
    );

    const hasSearchInstances = useCallback(
        (instances: Search) => {
            return Object.keys(instances).every((id) => hasSearchInstance(id));
        },
        [hasSearchInstance]
    );

    const hasAnySearchInstance = useCallback(() => {
        return Object.keys(searchInstances).length > 0;
    }, [searchInstances]);

    const removeSearchInstance = useCallback(
        (id: string) => {
            setSearchInstances((prev) => {
                const { [id]: _, ...rest } = prev;
                return rest;
            });
        },
        [setSearchInstances]
    );

    const removeSearchInstances = useCallback(
        (instances: Search) => {
            setSearchInstances((prev) => {
                const updated = { ...prev };
                Object.keys(instances).forEach((id) => {
                    delete updated[id];
                });
                return updated;
            });
        },
        [setSearchInstances]
    );

    const removeAllSearchInstances = useCallback(() => {
        setSearchInstances({});
    }, [setSearchInstances]);

    const resetSearchInstance = useCallback(
        (id: string) => {
            setSearchInstances((prev) => ({
                ...prev,
                [id]: {
                    query: { value: null },
                },
            }));
        },
        [setSearchInstances]
    );

    const resetSearchInstances = useCallback(
        (instances: Search) => {
            setSearchInstances((prev) => {
                const updated = { ...prev };
                Object.keys(instances).forEach((id) => {
                    if (updated[id]) {
                        updated[id].query.value = null;
                    }
                });
                return updated;
            });
        },
        [setSearchInstances]
    );

    const resetAllSearchInstances = useCallback(() => {
        setSearchInstances((prev) => {
            const updated = { ...prev };
            Object.keys(updated).forEach((id) => {
                if (updated[id]) {
                    updated[id].query.value = null;
                }
            });
            return updated;
        });
    }, [setSearchInstances]);

    const value: SearchContextValue = {
        searchInstances,
        addSearchInstance,
        addSearchInstances,
        updateSearchInstance,
        updateSearchInstances,
        updateUrlParam,
        updateUrlParams,
        getSearchInstance,
        getSearchInstances,
        hasSearchInstance,
        hasSearchInstances,
        hasAnySearchInstance,
        removeSearchInstance,
        removeSearchInstances,
        removeAllSearchInstances,
        resetSearchInstance,
        resetSearchInstances,
        resetAllSearchInstances,
    };

    return (
        <SearchContext.Provider value={value}>
            {children}
        </SearchContext.Provider>
    );
}

export const useSearchContext = () => {
    const context = useContext(SearchContext);
    if (!context) {
        throw new Error(
            'useSearchContext must be used within a SearchProvider'
        );
    }
    return context;
};
