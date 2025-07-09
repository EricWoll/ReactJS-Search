# 🧩 React Filter Context

A lightweight and flexible context provider and hook for managing dynamic filters in a React application.

---

## 🚀 What It Is

This module defines a `FilterProvider` and `useFilter` hook to centralize the state and behavior of filters in your React app. It enables adding, updating, removing, resetting, and querying filters—perfect for search interfaces, dashboards, or any UI that needs dynamic filtering logic.

---

## 📦 Features

-   🧠 Centralized filter state with React Context
-   ➕ Add or update multiple filters at once
-   ❌ Remove specific filters
-   🔍 Check for filter presence
-   🔁 Reset individual filters or clear all

---

## 🛠️ Installation

This module assumes a typical React + TypeScript setup.

```bash
# No install required — copy and then import the module
```

## 💡 Why Use This?

This abstraction keeps your component logic clean while offering robust filter control. Ideal for:

-   Complex filter interfaces (e.g. dashboards, search UIs)
-   Multi-step workflows needing persistent filters
-   Future enhancements like localStorage syncing, URL filters, or analytics integration

---

## 📁 Suggested File Structure

```
components/
  └── context/
        └── filter-context.tsx
types/
  └── filter.types.ts
```

## 🧑‍💻 Usage

### Wrap Your App

```tsx
import { FilterProvider } from './path/to/filter-context';

function App() {
    return (
        <FilterProvider>
            <MyComponent />
        </FilterProvider>
    );
}
```

## 🧩 Use in a Component

```tsx
import { useFilter } from './path/to/filter-context';

function MyComponent() {
    const { filter, addFilters, removeFilters, resetAllFilters } = useFilter();

    const handleAdd = () =>
        addFilters({ status: { value: 'active', category: 'status' } });

    return (
        <>
            <button onClick={handleAdd}>Add Filter</button>
            <button onClick={resetAllFilters}>Clear All</button>
        </>
    );
}
```

## 🔧 API Reference

| Function                 | Description                                               |
| ------------------------ | --------------------------------------------------------- |
| `filter`                 | The current filters object                                |
| `addFilters(filters)`    | Adds or overrides filters                                 |
| `removeFilters(ids)`     | Removes specific filters by ID                            |
| `resetFilters(ids)`      | Sets filter values to `null` while preserving keys        |
| `resetAllFilters()`      | Clears all filters                                        |
| `updateFilters(filters)` | Merges updated filter values into existing ones           |
| `hasFilters(ids)`        | Returns `true` if all given IDs exist in the filter state |

---

## 🧾 Type Definitions

```ts
export interface FilterValue {
    value: unknown | null;
    category?: string;
}

export interface Filters {
    [id: string]: FilterValue;
}
```

## 🧼 Error Handling

If `useFilter` is used outside of a `FilterProvider`, it throws a descriptive error:

```ts
throw new Error('useFilter must be used within a FilterProvider');
```

## 🧪 Examples

```tsx
// Add filters
addFilters({
    sortBy: { value: 'price', category: 'sorting' },
    inStock: { value: true },
});

// Remove a filter
removeFilters(['inStock']);

// Update an existing filter
updateFilters({
    sortBy: { value: 'rating' },
});

// Check if filters exist
hasFilters(['sortBy']); // true

// Reset a filter's value to null
resetFilters(['sortBy']);

// Clear all filters
resetAllFilters();
```
