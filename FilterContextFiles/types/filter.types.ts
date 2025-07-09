export interface FilterValue {
    value: unknown | null;
    category?: string;
}

export interface Filters {
    [id: string]: FilterValue;
}
