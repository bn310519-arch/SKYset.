import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Destination {
  id: string;
  name: string;
  country: string;
  image: string;
  description: string;
  rating: number;
  priceLevel: string;
  tags: string[];
}

export interface ItineraryItem {
  id: string;
  day: number;
  time: string;
  activity: string;
  location: string;
  cost: number;
  type: 'flight' | 'hotel' | 'activity' | 'transit';
}

export interface Trip {
  id: string;
  destination: string;
  description?: string;
  startDate: string;
  endDate: string;
  budget: number;
  participants: string[];
  itinerary: ItineraryItem[];
  status: 'planning' | 'booked' | 'completed';
}

export interface UserReview {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface JournalEntry {
  id: string;
  tripId: string;
  title: string;
  content: string;
  date: string;
  images: string[];
}

export interface AppState {
  searchHistory: string[];
  trips: Trip[];
  journal: JournalEntry[];
  loyaltyPoints: number;
  addSearch: (query: string) => void;
  addTrip: (trip: Trip) => void;
  updateTrip: (trip: Trip) => void;
  deleteTrip: (id: string) => void;
  addJournalEntry: (entry: JournalEntry) => void;
  addLoyaltyPoints: (points: number) => void;
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      searchHistory: [],
      trips: [],
      journal: [],
      loyaltyPoints: 0,
      addSearch: (query) => set((state) => ({ 
        searchHistory: [query, ...state.searchHistory.filter(q => q !== query)].slice(0, 5) 
      })),
      addTrip: (trip) => set((state) => ({ trips: [...state.trips, trip] })),
      updateTrip: (updatedTrip) => set((state) => ({
        trips: state.trips.map(t => t.id === updatedTrip.id ? updatedTrip : t)
      })),
      deleteTrip: (id) => set((state) => ({
        trips: state.trips.filter(t => t.id !== id)
      })),
      addJournalEntry: (entry) => set((state) => ({
        journal: [...state.journal, entry]
      })),
      addLoyaltyPoints: (points) => set((state) => ({
        loyaltyPoints: state.loyaltyPoints + points
      })),
    }),
    {
      name: 'voyageer-storage',
    }
  )
);
