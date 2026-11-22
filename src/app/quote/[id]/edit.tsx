import { QuoteForm } from '@/components/quote-form';
import { useQuotes } from '@/context/quotes';
import { router, useLocalSearchParams } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function EditQuoteScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { quotes } = useQuotes();
  const quote = quotes.find((item) => item.id === id);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right', 'bottom']}>
      <View style={styles.container}>
        {quote ? (
          <QuoteForm
            key={quote.id}
            quote={quote}
            onSaved={() => router.back()}
            onCancelEdit={() => router.back()}
          />
        ) : (
          <View style={styles.center}>
            <Pressable onPress={() => router.replace('/(tabs)/all')}>
              <Text style={styles.missing}>This quote is no longer available.</Text>
            </Pressable>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFF8F0' },
  container: { flex: 1, paddingHorizontal: 20, paddingTop: 14 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  missing: { fontSize: 18, color: '#3A3A3A' },
});
