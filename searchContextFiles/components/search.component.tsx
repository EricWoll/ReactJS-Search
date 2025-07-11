import { useContext, useEffect, useState } from 'react';
import { SearchValue } from '../types/search.types';
import { useSearchContext } from '../contexts/search.context';
import { useSearchParams } from 'next/navigation';

interface SearchComponentProps extends React.HTMLAttributes<HTMLInputElement> {
    id: string;
    hasUrlSync?: boolean;
}

const SearchComponent: React.FC<SearchComponentProps> = ({
    id,
    hasUrlSync = false,
    ...props
}) => {
    const {
        addSearchInstance,
        removeSearchInstance,
        updateSearchInstance,
        updateUrlParam,
        getSearchInstance,
    } = useSearchContext();

    const urlSearchParams = useSearchParams();

    const [inputValue, setInputValue] = useState<string>('');

    useEffect(() => {
        const urlValue = urlSearchParams.get(id);
        const initialQuery = urlValue ? { value: urlValue } : { value: null };

        addSearchInstance(id, initialQuery, hasUrlSync);

        return () => {
            removeSearchInstance(id);
        };
    }, [id, hasUrlSync, addSearchInstance, removeSearchInstance]);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(event.target.value);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            const searchValue = e.currentTarget.value;

            // Update the context state
            updateSearchInstance(id, { value: searchValue });

            // Update URL with the current value
            if (hasUrlSync) {
                updateUrlParam(id, hasUrlSync, searchValue);
            }
        }
    };

    return (
        <input
            id={id}
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Search..."
            {...props}
        />
    );
};

SearchComponent.displayName = 'SearchComponent';
export default SearchComponent;
