# Search Context Documentation

A comprehensive React Context system for managing multiple search instances with optional URL synchronization in Next.js applications.

## Overview

The Search Context provides a centralized way to manage multiple search inputs throughout your application. Each search instance can be uniquely identified and optionally synchronized with URL parameters for shareable search states.

## Core Interfaces

### SearchValue

```typescript
interface SearchValue {
    value: string | null;
}
```

Represents a single search query value that can be null or a string.

### Search

```typescript
interface Search {
    [id: string]: {
        query: SearchValue;
        hasUrlSync?: boolean;
    };
}
```

A collection of search instances indexed by unique IDs, where each instance contains a query and optional URL sync configuration.

## SearchProvider

### Setup

Wrap your application or component tree with the SearchProvider:

```typescript
import { SearchProvider } from './contexts/search.context';

function App() {
    return <SearchProvider>{/* Your app components */}</SearchProvider>;
}
```

## useSearchContext Hook

Access the search context functionality using the `useSearchContext` hook:

```typescript
import { useSearchContext } from './contexts/search.context';

function MyComponent() {
    const { addSearchInstance, updateSearchInstance /* ... */ } =
        useSearchContext();
    // Component logic
}
```

## API Reference

### Instance Management

#### `addSearchInstance(id: string, query: SearchValue, hasUrlSync: boolean)`

Adds a new search instance with the specified configuration.

**Parameters:**

-   `id`: Unique identifier for the search instance
-   `query`: Initial search query value
-   `hasUrlSync`: Whether this instance should sync with URL parameters

**Example:**

```typescript
addSearchInstance('header-search', { value: 'initial query' }, true);
```

#### `addSearchInstances(instances: Search)`

Adds multiple search instances at once.

**Example:**

```typescript
addSearchInstances({
    'search-1': { query: { value: 'query1' }, hasUrlSync: true },
    'search-2': { query: { value: 'query2' }, hasUrlSync: false },
});
```

#### `removeSearchInstance(id: string)`

Removes a specific search instance.

**Example:**

```typescript
removeSearchInstance('header-search');
```

#### `removeSearchInstances(instances: Search)`

Removes multiple search instances.

#### `removeAllSearchInstances()`

Clears all search instances from the context.

### Query Updates

#### `updateSearchInstance(id: string, query: SearchValue)`

Updates the query value for a specific search instance.

**Example:**

```typescript
updateSearchInstance('header-search', { value: 'new search term' });
```

#### `updateSearchInstances(instances: Search)`

Updates multiple search instances in bulk.

### URL Synchronization

#### `updateUrlParam(id: string, hasUrlSync: boolean, queryValue?: string)`

Updates URL parameters for a specific search instance.

**Parameters:**

-   `id`: Search instance ID
-   `hasUrlSync`: Whether URL sync should be enabled
-   `queryValue`: Optional query value to use (defaults to stored value)

**Example:**

```typescript
updateUrlParam('header-search', true, 'search term');
```

#### `updateUrlParams(instances: Search)`

Updates URL parameters for multiple search instances.

### Data Retrieval

#### `getSearchInstance(id: string)`

Retrieves a specific search instance.

**Returns:** `{ query: SearchValue; hasUrlSync?: boolean } | undefined`

**Example:**

```typescript
const instance = getSearchInstance('header-search');
if (instance) {
    console.log(instance.query.value); // Current search value
    console.log(instance.hasUrlSync); // URL sync status
}
```

#### `getSearchInstances(ids: string[])`

Retrieves multiple search instances by their IDs.

**Returns:** `Search | undefined`

### Validation Methods

#### `hasSearchInstance(id: string)`

Checks if a specific search instance exists.

**Returns:** `boolean`

#### `hasSearchInstances(instances: Search)`

Checks if all provided instances exist.

**Returns:** `boolean`

#### `hasAnySearchInstance()`

Checks if any search instances are currently active.

**Returns:** `boolean`

### Reset Operations

#### `resetSearchInstance(id: string)`

Resets a specific search instance query to `null`.

#### `resetSearchInstances(instances: Search)`

Resets multiple search instance queries to `null`.

#### `resetAllSearchInstances()`

Resets all search queries to `null` while retaining their structure.

## SearchComponent

### Basic Usage

The `SearchComponent` provides a ready-to-use input component that integrates with the Search Context:

```typescript
import SearchComponent from './components/SearchComponent';

function MyPage() {
    return (
        <div>
            <SearchComponent
                id="main-search"
                hasUrlSync={true}
                placeholder="Search products..."
            />
        </div>
    );
}
```

### Props

#### `id: string` (required)

Unique identifier for the search instance. This ID is used to manage the search state and optionally sync with URL parameters.

#### `hasUrlSync?: boolean` (optional, default: `false`)

When `true`, the search value will be synchronized with URL parameters using the component's `id` as the parameter key.

#### `...props`

All other standard HTML input attributes are supported and passed through to the underlying input element.

### Component Features

-   **Automatic Registration**: Automatically registers itself with the Search Context on mount
-   **URL Initialization**: Initializes from URL parameters when `hasUrlSync` is enabled
-   **Enter Key Handling**: Triggers search on Enter key press
-   **Cleanup**: Automatically removes itself from context on unmount
-   **URL Synchronization**: Updates URL parameters when search is triggered (if enabled)

### Example with URL Sync

```typescript
// URL: /products?category-search=electronics&price-filter=100-500

function ProductsPage() {
    return (
        <div>
            <SearchComponent
                id="category-search"
                hasUrlSync={true}
                placeholder="Search categories..."
            />
            <SearchComponent
                id="price-filter"
                hasUrlSync={true}
                placeholder="Price range..."
            />
        </div>
    );
}
```

## Usage Patterns

### Basic Search Implementation

```typescript
import { useSearchContext } from './contexts/search.context';
import SearchComponent from './components/SearchComponent';

function ProductSearch() {
    const { getSearchInstance } = useSearchContext();

    const handleSearch = () => {
        const searchInstance = getSearchInstance('product-search');
        if (searchInstance?.query.value) {
            // Perform search with searchInstance.query.value
            console.log('Searching for:', searchInstance.query.value);
        }
    };

    return (
        <div>
            <SearchComponent
                id="product-search"
                hasUrlSync={true}
                placeholder="Search products..."
            />
            <button onClick={handleSearch}>Search</button>
        </div>
    );
}
```

### Multiple Search Instances

```typescript
function AdvancedSearch() {
    const {
        getSearchInstances,
        updateSearchInstances,
        resetAllSearchInstances,
    } = useSearchContext();

    const performAdvancedSearch = () => {
        const searches = getSearchInstances([
            'name-search',
            'category-search',
            'price-search',
        ]);

        if (searches) {
            // Process multiple search criteria
            Object.entries(searches).forEach(([id, instance]) => {
                console.log(`${id}: ${instance.query.value}`);
            });
        }
    };

    const clearAllSearches = () => {
        resetAllSearchInstances();
    };

    return (
        <div>
            <SearchComponent
                id="name-search"
                hasUrlSync={true}
                placeholder="Product name..."
            />
            <SearchComponent
                id="category-search"
                hasUrlSync={true}
                placeholder="Category..."
            />
            <SearchComponent
                id="price-search"
                hasUrlSync={true}
                placeholder="Price range..."
            />

            <button onClick={performAdvancedSearch}>Search All</button>
            <button onClick={clearAllSearches}>Clear All</button>
        </div>
    );
}
```

### Programmatic Search Management

```typescript
function SearchManager() {
    const {
        addSearchInstance,
        updateSearchInstance,
        hasSearchInstance,
        removeSearchInstance,
    } = useSearchContext();

    const initializeSearch = () => {
        if (!hasSearchInstance('dynamic-search')) {
            addSearchInstance(
                'dynamic-search',
                { value: 'default query' },
                true
            );
        }
    };

    const updateSearch = (newValue: string) => {
        updateSearchInstance('dynamic-search', { value: newValue });
    };

    const cleanup = () => {
        removeSearchInstance('dynamic-search');
    };

    return (
        <div>
            <button onClick={initializeSearch}>Initialize Search</button>
            <button onClick={() => updateSearch('new query')}>
                Update Search
            </button>
            <button onClick={cleanup}>Remove Search</button>
        </div>
    );
}
```

## Best Practices

### 1. Unique IDs

Always use unique, descriptive IDs for search instances:

```typescript
// Good
<SearchComponent id="product-name-search" />
<SearchComponent id="category-filter" />

// Avoid
<SearchComponent id="search1" />
<SearchComponent id="search2" />
```

### 2. URL Sync Consideration

Enable URL sync for searches that should be shareable or bookmarkable:

```typescript
// Enable for main search functionality
<SearchComponent id="main-search" hasUrlSync={true} />

// Disable for temporary or UI-only searches
<SearchComponent id="suggestion-search" hasUrlSync={false} />
```

### 3. Cleanup Management

For programmatically created instances, ensure proper cleanup:

```typescript
useEffect(() => {
    addSearchInstance('temp-search', { value: null }, false);

    return () => {
        removeSearchInstance('temp-search');
    };
}, []);
```

### 4. Error Handling

Always check for instance existence before using:

```typescript
const instance = getSearchInstance('my-search');
if (instance && instance.query.value) {
    // Safe to use instance.query.value
}
```

## Integration with Next.js

### Router Integration

The context automatically integrates with Next.js router for URL synchronization:

```typescript
// URL updates automatically when search is performed
// Example: /products → /products?search=laptops&category=electronics
```

### SSR Considerations

The context initializes search instances from URL parameters, making it compatible with server-side rendering and client-side hydration.

### Performance

-   Search instances are managed efficiently with React's state management
-   URL updates use Next.js router for optimal performance
-   Components automatically clean up on unmount to prevent memory leaks

## Error Handling

The context includes built-in error handling:

-   Attempting to use `useSearchContext` outside of a `SearchProvider` throws a descriptive error
-   Invalid operations (like accessing non-existent instances) return `undefined`
-   URL parameter updates are safely handled with proper encoding
