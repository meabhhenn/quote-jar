import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, ReactNode, useCallback, useContext, useEffect, useRef, useState } from 'react';

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

const contexts: QuoteContext[] = ['Dinner', 'Class', 'Hanging out', 'Text', 'Other'];
const types: QuoteType[] = ['Personal', 'Famous'];

function isQuote(value: unknown): value is Quote {
  if (!value || typeof value !== 'object') return false;
  const quote = value as Partial<Quote>;
  return (
    typeof quote.id === 'string' &&
    typeof quote.text === 'string' &&
    typeof quote.author === 'string' &&
    typeof quote.createdAt === 'string' &&
    Number.isFinite(new Date(quote.createdAt).getTime()) &&
    (quote.context === null ||
      (quote.context !== undefined && contexts.includes(quote.context))) &&
    typeof quote.type === 'string' &&
    types.includes(quote.type) &&
    typeof quote.favorite === 'boolean'
  );
}

export function useQuotes() {
  const context = useContext(QuotesContext);
  if (!context) throw new Error('useQuotes must be used within QuotesProvider');
  return context;
}

export function QuotesProvider({ children }: { children: ReactNode }) {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loaded, setLoaded] = useState(false);
  const quotesRef = useRef<Quote[]>([]);

  useEffect(() => {
    let active = true;
    AsyncStorage.getItem(STORAGE_KEY)
      .then((stored) => {
        if (!active) return;
        if (!stored) {
          quotesRef.current = [];
          setQuotes([]);
          return;
        }
        try {
          const parsed = JSON.parse(stored);
          if (!Array.isArray(parsed)) throw new Error('Stored quotes is not an array');
          if (!parsed.every(isQuote)) throw new Error('Stored quotes contain invalid data');
          quotesRef.current = parsed;
          setQuotes(parsed);
        } catch (error) {
          console.error('Could not read saved quotes:', error);
          quotesRef.current = [];
          setQuotes([]);
        }
      })
      .catch((error) => {
        console.error('Could not read saved quotes:', error);
        if (active) {
          quotesRef.current = [];
          setQuotes([]);
        }
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
      const next = [quote, ...quotesRef.current];
      quotesRef.current = next;
      setQuotes((previous) => [quote, ...previous]);
      try {
        await persist(next);
        return quote;
      } catch (error) {
        quotesRef.current = quotesRef.current.filter((item) => item.id !== quote.id);
        setQuotes((previous) => previous.filter((item) => item.id !== quote.id));
        throw error;
      }
    },
    [persist],
  );

  const updateQuote = useCallback(
    async (id: string, values: Partial<Omit<Quote, 'id' | 'createdAt'>>) => {
      const original = quotesRef.current.find((quote) => quote.id === id);
      const next = quotesRef.current.map((quote) =>
        quote.id === id ? { ...quote, ...values } : quote,
      );
      quotesRef.current = next;
      setQuotes((previous) =>
        previous.map((quote) => (quote.id === id ? { ...quote, ...values } : quote)),
      );
      try {
        await persist(next);
      } catch (error) {
        if (original) {
          quotesRef.current = quotesRef.current.map((quote) =>
            quote.id === id ? original : quote,
          );
          setQuotes((previous) =>
            previous.map((quote) => (quote.id === id ? original : quote)),
          );
        }
        throw error;
      }
    },
    [persist],
  );

  const deleteQuote = useCallback(
    async (id: string) => {
      const removedIndex = quotesRef.current.findIndex((quote) => quote.id === id);
      const removed = removedIndex >= 0 ? quotesRef.current[removedIndex] : undefined;
      const next = quotesRef.current.filter((quote) => quote.id !== id);
      quotesRef.current = next;
      setQuotes((previous) => previous.filter((quote) => quote.id !== id));
      try {
        await persist(next);
      } catch (error) {
        if (removed) {
          quotesRef.current = [
            ...quotesRef.current.slice(0, removedIndex),
            removed,
            ...quotesRef.current.slice(removedIndex),
          ];
          setQuotes((previous) => {
            if (previous.some((quote) => quote.id === id)) return previous;
            const restored = [...previous];
            restored.splice(Math.min(removedIndex, restored.length), 0, removed);
            return restored;
          });
        }
        throw error;
      }
    },
    [persist],
  );

  const toggleFavorite = useCallback(
    async (id: string) => {
      const original = quotesRef.current.find((quote) => quote.id === id);
      if (!original) return;
      const next = quotesRef.current.map((quote) =>
        quote.id === id ? { ...quote, favorite: !quote.favorite } : quote,
      );
      quotesRef.current = next;
      setQuotes((previous) =>
        previous.map((quote) =>
          quote.id === id ? { ...quote, favorite: !quote.favorite } : quote,
        ),
      );
      try {
        await persist(next);
      } catch (error) {
        quotesRef.current = quotesRef.current.map((quote) =>
          quote.id === id ? original : quote,
        );
        setQuotes((previous) =>
          previous.map((quote) => (quote.id === id ? original : quote)),
        );
        throw error;
      }
    },
    [persist],
  );

  return (
    <QuotesContext.Provider value={{ quotes, loaded, addQuote, updateQuote, deleteQuote, toggleFavorite }}>
      {children}
    </QuotesContext.Provider>
  );
}
