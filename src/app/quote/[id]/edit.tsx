import { QuoteForm } from '@/components/quote-form';
import { useQuotes } from '@/context/quotes';
import { router, useLocalSearchParams } from 'expo-router';
import { StyleSheet, View } from 'react-native';
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
            quote={quote}
            onSaved={() => router.replace({ pathname: '/quote/[id]', params: { id } })}
            onCancelEdit={() => router.back()}
          />
        ) : null}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFF8F0' },
  container: { flex: 1, paddingHorizontal: 20, paddingTop: 14 },
});
