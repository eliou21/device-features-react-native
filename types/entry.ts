export interface TravelEntry {
    id: string;
    imageUris: string[];
    description?: string;
    address: string;
    timestamp: string;
    saved?: boolean;
    location: {
        latitude: number;
        longitude: number;
    } | null;
}

export interface SavedEntry extends TravelEntry {
    savedAt: string;
}
  