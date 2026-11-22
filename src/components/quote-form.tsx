import { Quote, QuoteContext, QuoteType, useQuotes } from '@/context/quotes';
import { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import type { TextInputInstance } from 'react-native';

type Props = {
  quote?: Quote;
  onSaved?: (quote: Quote) => void;
  onCancelEdit?: () => void;
};

const contexts: QuoteContext[] = ['Dinner', 'Class', 'Hanging out', 'Text', 'Other'];

export function QuoteForm({ quote, onSaved, onCancelEdit }: Props) {
  const { addQuote, updateQuote } = useQuotes();
  const [text, setText] = useState(quote?.text ?? '');
  const [author, setAuthor] = useState(quote?.author ?? '');
  const [context, setContext] = useState<QuoteContext | null>(quote?.context ?? null);
  const [type, setType] = useState<QuoteType>(quote?.type ?? 'Personal');
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);
  const [shake] = useState(() => new Animated.Value(0));
  const savedTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const authorInputRef = useRef<TextInputInstance>(null);

  useEffect(() => {
    return () => {
      if (savedTimer.current) clearTimeout(savedTimer.current);
    };
  }, []);

  const shakeCard = () => {
    shake.setValue(0);
    Animated.sequence([
      Animated.timing(shake, { toValue: 12, duration: 55, useNativeDriver: true }),
      Animated.timing(shake, { toValue: -12, duration: 55, useNativeDriver: true }),
      Animated.timing(shake, { toValue: 9, duration: 55, useNativeDriver: true }),
      Animated.timing(shake, { toValue: -6, duration: 55, useNativeDriver: true }),
      Animated.timing(shake, { toValue: 0, duration: 55, useNativeDriver: true }),
    ]).start();
  };

  const save = async () => {
    const trimmedText = text.trim();
    const trimmedAuthor = author.trim();
    if (!trimmedText || !trimmedAuthor) {
      setSaved(false);
      setError('Who said what again?');
      shakeCard();
      return;
    }

    setError('');
    try {
      if (quote) {
        await updateQuote(quote.id, { text: trimmedText, author: trimmedAuthor, context, type });
        onSaved?.({ ...quote, text: trimmedText, author: trimmedAuthor, context, type });
      } else {
        await addQuote({ text: trimmedText, author: trimmedAuthor, context, type });
        setSaved(true);
        setText('');
        setAuthor('');
        setContext(null);
        setType('Personal');
        if (savedTimer.current) clearTimeout(savedTimer.current);
        savedTimer.current = setTimeout(() => setSaved(false), 2000);
      }
    } catch (storageError) {
      console.error('Could not save quote:', storageError);
      setSaved(false);
      setError("Couldn't save. Try again.");
    }
  };

  return (
    <Pressable style={styles.keyboardView} onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}>
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardDismissMode="on-drag"
          keyboardShouldPersistTaps="handled">
          <Animated.View style={[styles.card, { transform: [{ translateX: shake }] }]}>
            <Text style={styles.title}>{quote ? 'Edit Quote' : 'Add a Quote'}</Text>
            <TextInput
              style={[styles.input, styles.quoteInput]}
              value={text}
              onChangeText={(value) => {
                setText(value);
                if (error) setError('');
                setSaved(false);
              }}
              placeholder="What did they say?"
              placeholderTextColor="#8A8178"
              multiline
              blurOnSubmit
              returnKeyType="next"
              onSubmitEditing={() => authorInputRef.current?.focus()}
              textAlignVertical="top"
            />
            <TextInput
              ref={authorInputRef}
              style={styles.input}
              value={author}
              onChangeText={(value) => {
                setAuthor(value);
                if (error) setError('');
                setSaved(false);
              }}
              placeholder="Who said it?"
              placeholderTextColor="#8A8178"
              returnKeyType="done"
              onSubmitEditing={() => Keyboard.dismiss()}
            />

          <Text style={styles.label}>Context</Text>
          <View style={styles.chips}>
            {contexts.map((item) => {
              const selected = context === item;
              return (
                <Pressable
                  key={item}
                  onPress={() => setContext(selected ? null : item)}
                  style={[styles.chip, selected && styles.chipSelected]}>
                  <Text style={[styles.chipText, selected && styles.chipTextSelected]}>{item}</Text>
                </Pressable>
              );
            })}
          </View>

          <Text style={styles.label}>Type</Text>
          <View style={styles.toggle}>
            {(['Personal', 'Famous'] as QuoteType[]).map((item) => {
              const selected = type === item;
              return (
                <Pressable
                  key={item}
                  onPress={() => setType(item)}
                  style={[styles.toggleOption, selected && styles.toggleSelected]}>
                  <Text style={[styles.toggleText, selected && styles.toggleTextSelected]}>{item}</Text>
                </Pressable>
              );
            })}
          </View>

          {error ? <Text style={styles.error}>{error}</Text> : null}
          {saved ? <Text style={styles.saved}>Saved!</Text> : null}

          <Pressable style={styles.saveButton} onPress={save}>
            <Text style={styles.saveText}>{quote ? 'Save Changes' : 'Save'}</Text>
          </Pressable>
          {quote ? (
            <Pressable style={styles.cancelButton} onPress={onCancelEdit}>
              <Text style={styles.cancelText}>Cancel</Text>
            </Pressable>
          ) : null}
        </Animated.View>
      </ScrollView>
      </KeyboardAvoidingView>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  keyboardView: { flex: 1 },
  scroll: { flexGrow: 1, justifyContent: 'center', paddingBottom: 16 },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#806F62',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.14,
    shadowRadius: 12,
    elevation: 5,
  },
  title: { fontSize: 24, fontWeight: '700', color: '#3A3A3A', marginBottom: 16 },
  input: {
    minHeight: 50,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E7DED3',
    backgroundColor: '#FFFEFC',
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    color: '#3A3A3A',
    marginBottom: 12,
  },
  quoteInput: { minHeight: 104 },
  label: { fontSize: 16, fontWeight: '700', color: '#3A3A3A', marginTop: 4, marginBottom: 8 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 12 },
  chip: { borderRadius: 999, backgroundColor: '#F1ECE6', paddingHorizontal: 12, paddingVertical: 9 },
  chipSelected: { backgroundColor: '#B8A9E3' },
  chipText: { fontSize: 14, color: '#3A3A3A' },
  chipTextSelected: { fontWeight: '700' },
  toggle: { flexDirection: 'row', backgroundColor: '#F1ECE6', borderRadius: 12, padding: 4, marginBottom: 12 },
  toggleOption: { flex: 1, alignItems: 'center', borderRadius: 9, paddingVertical: 10 },
  toggleSelected: { backgroundColor: '#B8A9E3' },
  toggleText: { fontSize: 16, color: '#777777' },
  toggleTextSelected: { color: '#3A3A3A', fontWeight: '700' },
  error: { color: '#A64B58', fontSize: 16, textAlign: 'center', marginBottom: 8 },
  saved: { color: '#3A7D44', fontSize: 16, textAlign: 'center', fontWeight: '700', marginBottom: 8 },
  saveButton: { backgroundColor: '#B8A9E3', borderRadius: 14, alignItems: 'center', paddingVertical: 15 },
  saveText: { color: '#3A3A3A', fontSize: 17, fontWeight: '800' },
  cancelButton: { alignItems: 'center', paddingTop: 14 },
  cancelText: { color: '#777777', fontSize: 16 },
});
