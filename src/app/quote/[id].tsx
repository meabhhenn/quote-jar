import { useQuotes } from '@/context/quotes';
import { router, useLocalSearchParams } from 'expo-router';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function QuoteDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { quotes, deleteQuote, toggleFavorite } = useQuotes();
  const quote = quotes.find((item) => item.id === id);

  if (!quote) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <Pressable style={styles.closeButton} onPress={() => router.replace('/(tabs)/all')}>
          <Text style={styles.closeText}>×</Text>
        </Pressable>
        <View style={styles.center}>
          <Text style={styles.missing}>This quote is no longer available.</Text>
        </View>
      </SafeAreaView>
    );
  }

  const date = new Intl.DateTimeFormat(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(quote.createdAt));

  const confirmDelete = () => {
    Alert.alert('Delete this quote?', undefined, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteQuote(quote.id);
            router.replace('/(tabs)/all');
          } catch (error) {
            console.error('Could not delete quote:', error);
            Alert.alert("Couldn't delete. Try again.");
          }
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right', 'bottom']}>
      <Pressable style={styles.closeButton} onPress={() => router.replace('/(tabs)/all')}>
        <Text style={styles.closeText}>×</Text>
      </Pressable>
      <View style={styles.container}>
        <View
          style={[
            styles.card,
            quote.type === 'Famous' ? styles.cardFamous : styles.cardPersonal,
          ]}>
          <View style={styles.quoteWrap}>
            <Text style={styles.openQuote} accessibilityElementsHidden importantForAccessibility="no">
              “
            </Text>
            <Text style={styles.quoteText}>{quote.text}</Text>
            <Text
              style={styles.closeQuote}
              accessibilityElementsHidden
              importantForAccessibility="no">
              ”
            </Text>
          </View>
          <Text style={styles.author}>— {quote.author}</Text>
          <Text style={styles.meta}>{date}</Text>
          {quote.context ? <Text style={styles.meta}>{quote.context}</Text> : null}
          <Text style={styles.meta}>{quote.type}</Text>
        </View>

        <View style={styles.actions}>
          <Pressable
            style={styles.actionButton}
            onPress={async () => {
              try {
                await toggleFavorite(quote.id);
              } catch (error) {
                console.error('Could not update favorite:', error);
                Alert.alert("Couldn't save. Try again.");
              }
            }}>
            <Text style={styles.actionText}>{quote.favorite ? '★ Favorite' : '☆ Favorite'}</Text>
          </Pressable>
          <Pressable
            style={styles.actionButton}
            onPress={() => router.push({ pathname: '/quote/[id]/edit', params: { id: quote.id } })}>
            <Text style={styles.actionText}>Edit</Text>
          </Pressable>
          <Pressable style={[styles.actionButton, styles.deleteButton]} onPress={confirmDelete}>
            <Text style={[styles.actionText, styles.deleteText]}>Delete</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFF8F0' },
  closeButton: { position: 'absolute', right: 16, top: 12, zIndex: 10, width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  closeText: { fontSize: 34, lineHeight: 38, color: '#3A3A3A' },
  container: { flex: 1, justifyContent: 'center', paddingHorizontal: 20, paddingBottom: 20 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  missing: { fontSize: 18, color: '#3A3A3A' },
  card: {
    minHeight: 360,
    borderRadius: 22,
    padding: 28,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#806F62',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.16,
    shadowRadius: 14,
    elevation: 6,
  },
  cardPersonal: { backgroundColor: '#F8D7E3' },
  cardFamous: { backgroundColor: '#D6E6F5' },
  quoteWrap: { width: '100%', paddingHorizontal: 18, marginBottom: 22 },
  openQuote: {
    alignSelf: 'flex-start',
    height: 62,
    marginLeft: -8,
    marginTop: -14,
    marginBottom: -4,
    fontFamily: 'Georgia',
    fontSize: 72,
    lineHeight: 72,
    fontWeight: '900',
    color: '#B8A9E3',
    transform: [{ rotate: '-8deg' }],
  },
  quoteText: { fontSize: 30, lineHeight: 40, fontWeight: '700', color: '#3A3A3A', textAlign: 'center' },
  closeQuote: {
    alignSelf: 'flex-end',
    height: 62,
    marginRight: -8,
    marginTop: -4,
    marginBottom: -14,
    fontFamily: 'Georgia',
    fontSize: 72,
    lineHeight: 72,
    fontWeight: '900',
    color: '#B8A9E3',
    transform: [{ rotate: '8deg' }],
  },
  author: { fontSize: 20, lineHeight: 28, color: '#3A3A3A', textAlign: 'center', marginBottom: 10 },
  meta: { fontSize: 16, lineHeight: 23, color: '#5D5955', textAlign: 'center' },
  actions: { flexDirection: 'row', gap: 8, marginTop: 14 },
  actionButton: { flex: 1, minHeight: 48, borderRadius: 12, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#E7DED3' },
  actionText: { fontSize: 16, fontWeight: '700', color: '#3A3A3A' },
  deleteButton: { borderColor: '#A64B58' },
  deleteText: { color: '#A64B58' },
});
