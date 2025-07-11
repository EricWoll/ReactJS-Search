# 🔍 Search Context Module

A lightweight and flexible context provider and hook for managing dynamic Search inputs in a React application.

---

## 🚀 What It Is

This React context module provides a unified way to manage multiple search instances within an application. Each instance tracks a query and an optional `hasUrlSync` flag, allowing flexible local state management and external synchronization if needed.

It is ideal for complex UI flows where multiple components need shared access to independent search states, such as dashboards, filters, or nested search interfaces.

---

## 📦 Features

-   Add, update, and reset individual or multiple search instances
-   Retrieve instances by ID or in bulk
-   Determine instance existence with precise checks
-   Optional syncing to reflect URL-based behavior
-   Clean reset and removal utilities for full control

---

## 📦 Installation

This module is framework-agnostic within React projects. Simply copy the context file into your app:

```bash
# no package install needed -- copy then import the module
```

## Why Use This?

Managing multiple independent search bars or filters across complex React apps can get messy fast. This context centralizes search logic, enabling scalable, consistent handling of queries, sync flags, and state updates — all without prop drilling or redundant code.

Use this module when:

-   You have multiple dynamic search inputs (e.g., dashboards, modals, tabs).
-   You need to selectively sync queries with the URL.
-   You want consistent query management across components.

---

## 📁 Suggested File Structure

```
src/
  └── context/
        └── SearchContext.tsx
```

## 🚀 Usage

### 1. Wrap your app in the `SearchProvider`

```tsx
import { SearchProvider } from './SearchContext';

function App() {
    return (
        <SearchProvider>
            <MainApp />
        </SearchProvider>
    );
}
```

## ⚙️ Use in a Component

```tsx
import { useSearchContext } from './SearchContext';

function SearchInput({ id }: { id: string }) {
    const { getSearchInstance, addSearchInstance, resetSearchInstance } =
        useSearchContext();

    const value = getSearchInstance(id)?.query.value ?? '';

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        addSearchInstance(id, { value: e.target.value }, true);
    };

    return (
        <div>
            <input
                value={value}
                onChange={handleChange}
                placeholder="Search..."
            />
            <button onClick={() => resetSearchInstance(id)}>Reset</button>
        </div>
    );
}
```

## 🧪 API Reference

| Method                                     | Description                                       |
| ------------------------------------------ | ------------------------------------------------- |
| `addSearchInstance(id, query, hasUrlSync)` | Adds a new search instance                        |
| `addSearchInstances(instances)`            | Adds multiple search instances                    |
| `updateSearchInstance(id, query)`          | Updates an existing instance’s query              |
| `updateSearchInstances(instances)`         | Updates multiple instances                        |
| `getSearchInstance(id)`                    | Retrieves a single search instance                |
| `getSearchInstances(ids)`                  | Retrieves several instances by their IDs          |
| `hasSearchInstance(id)`                    | Checks if a specific instance exists              |
| `hasSearchInstances(instances)`            | Checks if all given instances exist               |
| `hasAnySearchInstance()`                   | Returns `true` if any instances exist             |
| `removeSearchInstance(id)`                 | Removes one instance by ID                        |
| `removeSearchInstances(instances)`         | Removes multiple instances                        |
| `removeAllSearchInstances()`               | Clears all search instances                       |
| `resetSearchInstance(id)`                  | Resets the query of a specific instance to `null` |
| `resetSearchInstances(instances)`          | Resets queries of multiple instances              |
| `resetAllSearchInstances()`                | Resets all instance queries to `null`             |

---

## 📚 Type Definitions

```ts
export interface SearchValue {
    value: string | null;
}

export interface Search {
    [id: string]: {
        query: SearchValue;
        hasUrlSync?: boolean;
    };
}
```

## ❗ Error Handling

-   `useSearchContext()` throws an error if called outside of the `<SearchProvider>`:

```ts
if (!context) {
    throw new Error('useSearchContext must be used within a SearchProvider');
}
```

## 🧪 Examples

```ts
addSearchInstance('inventorySearch', { value: 'potions' }, true);

const query = getSearchInstance('inventorySearch')?.query.value ?? '';

resetSearchInstance('inventorySearch');

removeSearchInstances({
    weapons: { query: { value: 'swords' } },
    armor: { query: { value: 'leather' }, hasUrlSync: true },
});

updateSearchInstances({
    category: { query: { value: 'accessories' } },
    vendor: { query: { value: 'artisan guild' } },
});

const exists = hasSearchInstance('inventorySearch'); // true or false

removeAllSearchInstances();

resetAllSearchInstances();
```
