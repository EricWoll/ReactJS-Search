export interface SearchValue {
    value: string | null;
}

export interface Search {
    [id: string]: {
        query: SearchValue;
        hasUrlSync?: boolean;
    };
}
