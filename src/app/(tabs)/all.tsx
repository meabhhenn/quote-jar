import { useQuotes } from '@/context/quotes';
import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function AllQuotesScreen() {
  const { quotes, loaded } = useQuotes();
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    const needle = search.trim().toLowerCase();
    if (!needle) return quotes;
    return quotes.filter(
      (quote) =>
        quote.text.toLowerCase().includes(needle) ||
        quote.author.toLowerCase().includes(needle),
    );
  }, [quotes, search]);

  const noQuotes = loaded && quotes.length === 0;
  const noMatches = loaded && quotes.length > 0 && filtered.length === 0;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <View style={styles.container}>
        <Text style={styles.title}>All Quotes</Text>
        <TextInput
          style={styles.search}
          value={search}
          onChangeText={setSearch}
          placeholder="Search quotes"
          placeholderTextColor="#8A8178"
          clearButtonMode="while-editing"
        />

        {noQuotes ? (
          <View style={styles.empty}>
            <Text style={styles.emptyText}>Nothing yet. Go listen to your friends.</Text>
            <Pressable style={styles.addButton} onPress={() => router.navigate('/(tabs)')}>
              <Text style={styles.addButtonText}>Go to Add</Text>
            </Pressable>
          </View>
        ) : noMatches ? (
          <View style={styles.empty}>
            <Text style={styles.emptyText}>{`No quotes match "${search}".`}</Text>
          </View>
        ) : (
          <FlatList
            data={filtered}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.list}
            renderItem={({ item }) => (
              <Pressable
                onPress={() => router.push({ pathname: '/quote/[id]', params: { id: item.id } })}
                style={[
                  styles.card,
                  item.type === 'Famous' ? styles.cardFamous : styles.cardPersonal,
                ]}>
                <View style={styles.quoteWrap}>
                  <Text style={styles.openQuote} accessibilityElementsHidden importantForAccessibility="no">
                    “
                  </Text>
                  <Text style={styles.quoteText}>{item.text}</Text>
                  <Text
                    style={styles.closeQuote}
                    accessibilityElementsHidden
                    importantForAccessibility="no">
                    ”
                  </Text>
                </View>
                {item.favorite ? <Text style={styles.star}>★</Text> : null}
              </Pressable>
            )}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFF8F0' },
  container: { flex: 1, paddingHorizontal: 20, paddingTop: 14 },
  title: { fontSize: 28, fontWeight: '800', color: '#3A3A3A', marginBottom: 12 },
  search: {
    height: 48,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E7DED3',
    paddingHorizontal: 14,
    fontSize: 16,
    color: '#3A3A3A',
    marginBottom: 14,
  },
  list: { gap: 12, paddingBottom: 24 },
  card: {
    borderRadius: 16,
    padding: 18,
    minHeight: 84,
    justifyContent: 'center',
    shadowColor: '#806F62',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 3,
  },
  cardPersonal: { backgroundColor: '#F8D7E3' },
  cardFamous: { backgroundColor: '#D6E6F5' },
  quoteWrap: { paddingHorizontal: 24, paddingVertical: 8 },
  openQuote: {
    alignSelf: 'flex-start',
    height: 42,
    marginLeft: -10,
    marginTop: -10,
    marginBottom: -2,
    fontFamily: 'Georgia',
    fontSize: 52,
    lineHeight: 52,
    fontWeight: '900',
    color: '#B8A9E3',
    transform: [{ rotate: '-8deg' }],
  },
  quoteText: {
    fontSize: 17,
    lineHeight: 24,
    color: '#3A3A3A',
  },
  closeQuote: {
    alignSelf: 'flex-end',
    height: 42,
    marginRight: 28,
    marginTop: -2,
    marginBottom: -10,
    fontFamily: 'Georgia',
    fontSize: 52,
    lineHeight: 52,
    fontWeight: '900',
    color: '#B8A9E3',
    transform: [{ rotate: '8deg' }],
  },
  star: { position: 'absolute', right: 12, bottom: 8, fontSize: 20, color: '#3A3A3A' },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingBottom: 100 },
  emptyText: { fontSize: 18, lineHeight: 26, textAlign: 'center', color: '#3A3A3A', marginBottom: 18 },
  addButton: { backgroundColor: '#B8A9E3', borderRadius: 14, paddingHorizontal: 22, paddingVertical: 14 },
  addButtonText: { color: '#3A3A3A', fontSize: 16, fontWeight: '800' },
});
