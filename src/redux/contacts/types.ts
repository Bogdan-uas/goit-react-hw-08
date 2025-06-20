export interface Contact {
    id: string;
    name: string;
    number: string;
}

export interface ContactUpdate {
    name?: string;
    number?: string;
}