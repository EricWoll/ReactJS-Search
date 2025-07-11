# Filter Context Documentation

## Overview

The Filter Context provides a centralized solution for managing dynamic filters in Next.js applications. It offers a clean API for adding, removing, updating, and resetting filters while maintaining state consistency across components.

## Types

### FilterValue Interface

```typescript
interface FilterValue {
    value: unknown | null;
    category?: string;
}
```

-   **value**: The actual filter value (can be any type or null)
-   **category**: Optional categorization for grouping related filters

### Filters Interface

```typescript
interface Filters {
    [id: string]: FilterValue;
}
```

A map of filter IDs to their corresponding `FilterValue` objects.

## Context API

### FilterContextValue Interface

The context provides the following methods and properties:

#### Properties

-   **filter**: `Filters` - Current active filters mapped by their IDs

#### Methods

-   **addFilters(filters: Filters)**: void

    -   Merges new filters into the existing filter set
    -   Existing filters with the same ID will be overridden

-   **removeFilters(filterIds: string[])**: void

    -   Completely removes filters based on their keys
    -   Includes error handling for safe deletion

-   **hasFilters(filterIds: string[])**: boolean

    -   Checks whether all specified filters currently exist
    -   Returns true only if all provided filter IDs are present

-   **resetFilters(filterIds: string[])**: void

    -   Sets specified filter values to `null` while keeping their keys
    -   Preserves the filter structure but clears the values

-   **resetAllFilters()**: void

    -   Clears all filters from the context
    -   Resets the entire filter state to an empty object

-   **updateFilters(filters: Filters)**: void
    -   Updates existing filters by merging in new values
    -   Functionally identical to `addFilters`

## Usage

### 1. Setup the Provider

Wrap your application or component tree with the `FilterProvider`:

```jsx
import { FilterProvider } from './path/to/filter-context';

function App() {
    return (
        <FilterProvider>
            <YourComponents />
        </FilterProvider>
    );
}
```

### 2. Using the Hook

Access the filter context in any child component:

```jsx
import { useFilter } from './path/to/filter-context';

function SearchComponent() {
    const {
        filter,
        addFilters,
        removeFilters,
        hasFilters,
        resetFilters,
        resetAllFilters,
        updateFilters,
    } = useFilter();

    // Example usage
    const handleAddFilter = () => {
        addFilters({
            'search-term': { value: 'react', category: 'text' },
            status: { value: 'active', category: 'dropdown' },
        });
    };

    const handleRemoveFilter = () => {
        removeFilters(['search-term']);
    };

    const handleResetFilter = () => {
        resetFilters(['status']);
    };

    return <div>{/* Your component JSX */}</div>;
}
```

## Examples

### Basic Filter Management

```jsx
function FilterExample() {
    const { filter, addFilters, removeFilters, hasFilters } = useFilter();

    // Add multiple filters
    const addSearchFilters = () => {
        addFilters({
            name: { value: 'John', category: 'search' },
            age: { value: 25, category: 'range' },
            city: { value: 'New York', category: 'location' },
        });
    };

    // Check if filters exist
    const checkFilters = () => {
        const hasRequired = hasFilters(['name', 'age']);
        console.log('Has required filters:', hasRequired);
    };

    // Remove specific filters
    const clearLocationFilters = () => {
        removeFilters(['city']);
    };

    return (
        <div>
            <button onClick={addSearchFilters}>Add Filters</button>
            <button onClick={checkFilters}>Check Filters</button>
            <button onClick={clearLocationFilters}>Clear Location</button>

            {/* Display current filters */}
            <pre>{JSON.stringify(filter, null, 2)}</pre>
        </div>
    );
}
```

### Advanced Filter Operations

```jsx
function AdvancedFilterExample() {
    const { filter, addFilters, resetFilters, resetAllFilters, updateFilters } =
        useFilter();

    // Update existing filter values
    const updateSearchTerm = (newTerm) => {
        updateFilters({
            'search-term': { value: newTerm, category: 'text' },
        });
    };

    // Reset specific filters to null (but keep the keys)
    const resetSearchFilters = () => {
        resetFilters(['search-term', 'category']);
    };

    // Clear all filters
    const clearAllFilters = () => {
        resetAllFilters();
    };

    return (
        <div>
            <input
                type="text"
                onChange={(e) => updateSearchTerm(e.target.value)}
                placeholder="Search term"
            />
            <button onClick={resetSearchFilters}>Reset Search</button>
            <button onClick={clearAllFilters}>Clear All</button>
        </div>
    );
}
```

### Filter Categories

```jsx
function CategorizedFilters() {
    const { filter, addFilters } = useFilter();

    // Group filters by category
    const getFiltersByCategory = (category) => {
        return Object.entries(filter).filter(
            ([, filterValue]) => filterValue.category === category
        );
    };

    const addCategorizedFilters = () => {
        addFilters({
            'price-min': { value: 100, category: 'pricing' },
            'price-max': { value: 500, category: 'pricing' },
            brand: { value: 'Nike', category: 'attributes' },
            color: { value: 'blue', category: 'attributes' },
        });
    };

    const pricingFilters = getFiltersByCategory('pricing');
    const attributeFilters = getFiltersByCategory('attributes');

    return (
        <div>
            <button onClick={addCategorizedFilters}>Add Filters</button>

            <div>
                <h3>Pricing Filters</h3>
                {pricingFilters.map(([id, filter]) => (
                    <div key={id}>
                        {id}: {filter.value}
                    </div>
                ))}
            </div>

            <div>
                <h3>Attribute Filters</h3>
                {attributeFilters.map(([id, filter]) => (
                    <div key={id}>
                        {id}: {filter.value}
                    </div>
                ))}
            </div>
        </div>
    );
}
```

## Best Practices

1. **Error Handling**: The context includes built-in error handling for filter removal operations

2. **Performance**: All methods are memoized using `useCallback` to prevent unnecessary re-renders

3. **Type Safety**: Use TypeScript interfaces to ensure type safety when working with filters

4. **Filter IDs**: Use descriptive, consistent naming conventions for filter IDs

5. **Categories**: Leverage the optional `category` property to group related filters

## Common Patterns

### URL Synchronization

```jsx
// Sync filters with URL parameters
useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const filtersFromUrl = {};

    urlParams.forEach((value, key) => {
        filtersFromUrl[key] = { value, category: 'url' };
    });

    addFilters(filtersFromUrl);
}, []);
```

### Persistent Filters

```jsx
// Save filters to localStorage
useEffect(() => {
    localStorage.setItem('filters', JSON.stringify(filter));
}, [filter]);

// Load filters from localStorage
useEffect(() => {
    const savedFilters = localStorage.getItem('filters');
    if (savedFilters) {
        addFilters(JSON.parse(savedFilters));
    }
}, []);
```

## Error Handling

The context provider includes error handling for:

-   Filter removal operations (safe deletion)
-   Context usage outside of provider (throws descriptive error)

Always use the `useFilter` hook within a component wrapped by `FilterProvider` to avoid runtime errors.

## Performance Considerations

-   All callback functions are memoized to prevent unnecessary re-renders
-   Filter state updates are batched using React's state setter
-   Consider using `useMemo` for expensive filter computations in consuming components
