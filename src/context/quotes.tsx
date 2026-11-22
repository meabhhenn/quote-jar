import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, ReactNode, useCallback, useContext, useEffect, useState } from 'react';

export type QuoteContext = 'Dinner' | 'Class' | 'Hanging out' | 'Text' | 'Other';
export type QuoteType = 'Personal' | 'Famous';

export type Quote = {
  id: string;
  text: string;
  author: string;
  createdAt: string;
  context: QuoteContext | null;
  type: QuoteType;
  favorite: boolean;
};

type QuotesContextValue = {
  quotes: Quote[];
  loaded: boolean;
  addQuote: (values: Omit<Quote, 'id' | 'createdAt' | 'favorite'>) => Promise<Quote>;
  updateQuote: (id: string, values: Partial<Omit<Quote, 'id' | 'createdAt'>>) => Promise<void>;
  deleteQuote: (id: string) => Promise<void>;
  toggleFavorite: (id: string) => Promise<void>;
};

const STORAGE_KEY = 'quotes';
const QuotesContext = createContext<QuotesContextValue | null>(null);

export function useQuotes() {
  const context = useContext(QuotesContext);
  if (!context) throw new Error('useQuotes must be used within QuotesProvider');
  return context;
}

export function QuotesProvider({ children }: { children: ReactNode }) {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let active = true;
    AsyncStorage.getItem(STORAGE_KEY)
      .then((stored) => {
        if (!active) return;
        if (!stored) {
          setQuotes([]);
          return;
        }
        try {
          const parsed = JSON.parse(stored);
          if (!Array.isArray(parsed)) throw new Error('Stored quotes is not an array');
          setQuotes(parsed);
        } catch (error) {
          console.error('Could not read saved quotes:', error);
          setQuotes([]);
        }
      })
      .catch((error) => {
        console.error('Could not read saved quotes:', error);
        if (active) setQuotes([]);
      })
      .finally(() => {
        if (active) setLoaded(true);
      });
    return () => {
      active = false;
    };
  }, []);

  const persist = useCallback(async (next: Quote[]) => {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }, []);

  const addQuote = useCallback(
    async (values: Omit<Quote, 'id' | 'createdAt' | 'favorite'>) => {
      const quote: Quote = {
        ...values,
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`,
        createdAt: new Date().toISOString(),
        favorite: false,
      };
      const next = [quote, ...quotes];
      await persist(next);
      setQuotes(next);
      return quote;
    },
    [persist, quotes],
  );

  const updateQuote = useCallback(
    async (id: string, values: Partial<Omit<Quote, 'id' | 'createdAt'>>) => {
      const next = quotes.map((quote) => (quote.id === id ? { ...quote, ...values } : quote));
      await persist(next);
      setQuotes(next);
    },
    [persist, quotes],
  );

  const deleteQuote = useCallback(
    async (id: string) => {
      const next = quotes.filter((quote) => quote.id !== id);
      await persist(next);
      setQuotes(next);
    },
    [persist, quotes],
  );

  const toggleFavorite = useCallback(
    async (id: string) => {
      const next = quotes.map((quote) =>
        quote.id === id ? { ...quote, favorite: !quote.favorite } : quote,
      );
      await persist(next);
      setQuotes(next);
    },
    [persist, quotes],
  );

  return (
    <QuotesContext.Provider value={{ quotes, loaded, addQuote, updateQuote, deleteQuote, toggleFavorite }}>
      {children}
    </QuotesContext.Provider>
  );
}
