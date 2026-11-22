# Code Review Against SPEC.md

## Numbered Findings

1. **[PASS] Acceptance Criterion 1 - Initial route and bottom tabs.** The app mounts `QuotesProvider` and a stack navigator in `src/app/_layout.tsx:1-20`. The tabs layout declares exactly Add and All Quotes in `src/app/(tabs)/_layout.tsx:5-17`, and the Add route renders the form in `src/app/(tabs)/index.tsx:5-11`. Expo Router also makes the Add route the first tab.

2. **[PASS] Acceptance Criterion 2 - Valid save and reset.** The form trims both fields and refuses blank values in `src/components/quote-form.tsx:49-59`. A valid add awaits storage, shows `Saved!`, clears the text and author, deselects context, and restores Personal in `src/components/quote-form.tsx:61-76`.

3. **[PASS] Acceptance Criterion 3 - New quotes appear first.** `addQuote` constructs the new quote and prepends it to the array in `src/context/quotes.tsx:75-86`. The All Quotes view consumes that array directly, so a successful save should place the new quote at the top.

4. **[PASS] Acceptance Criterion 4 - Invalid save and shake behavior.** Blank or whitespace-only text or author causes no storage call, sets the exact required error text, and invokes the brief horizontal shake animation in `src/components/quote-form.tsx:49-59` and `src/components/quote-form.tsx:37-47`. Typing in either field clears the error in `src/components/quote-form.tsx:93-108`.

5. **[PASS] Acceptance Criterion 5 - Context chip selection.** The context is a single `QuoteContext | null` state value, and each chip compares itself with that value. Pressing the selected chip sets it to `null`; pressing another sets that chip in `src/components/quote-form.tsx:26-27` and `src/components/quote-form.tsx:111-122`.

6. **[PASS] Acceptance Criterion 6 - Card content and newest-first order.** Each list card renders only `item.text` and an optional star, with no author or date in `src/app/(tabs)/all.tsx:59-70`. No truncation prop or style is used, so full text is shown. New additions are prepended in `src/context/quotes.tsx:81-82`, while no sort/filter mutates that order unless a search is active.

7. **[PASS] Acceptance Criterion 7 - Quote Detail content.** The detail route resolves the quote by id and renders the quote, author, readable formatted date, optional context, and type in `src/app/quote/[id].tsx:6-10` and `src/app/quote/[id].tsx:50-63`.

8. **[PASS] Acceptance Criterion 8 - Delete confirmation and navigation.** The detail screen uses a two-button alert with Cancel and destructive Delete actions in `src/app/quote/[id].tsx:22-36`. Cancel is a no-op; Delete removes the quote and replaces the route with All Quotes in `src/app/quote/[id].tsx:29-36`.

9. **[PASS] Acceptance Criterion 9 - Empty All Quotes state.** When loading is complete and the array is empty, All Quotes shows the exact empty-state sentence and a button in `src/app/(tabs)/all.tsx:28-29` and `src/app/(tabs)/all.tsx:43-49`. The button navigates to the tabs index.

10. **[PASS] Acceptance Criterion 10 - Persistence.** Reads and writes use the single AsyncStorage key `quotes` in `src/context/quotes.tsx:26` and `src/context/quotes.tsx:38-69`. Add, edit, delete, and favorite operations persist the complete array, and provider state is restored on app launch. Normal app restart behavior satisfies the close-and-reopen case.

11. **[PASS] Acceptance Criterion 11 - Live case-insensitive partial search.** Search is derived on every `search`/`quotes` change, trims the query, lowercases it, and searches both text and author in `src/app/(tabs)/all.tsx:17-26`. Clearing the query restores all quotes.

12. **[PASS] Acceptance Criterion 12 - No-match state.** The no-match branch renders when quotes exist but the filtered array is empty in `src/app/(tabs)/all.tsx:29` and `src/app/(tabs)/all.tsx:51-55`. It includes the current search text in the required message.

13. **[WARN] Acceptance Criterion 13 - Favorite behavior is persisted and reflected, but not optimistically.** The star state is stored and reloaded by `toggleFavorite` in `src/context/quotes.tsx:107-116`, and All Quotes derives its star from that state in `src/app/(tabs)/all.tsx:68`. However, `toggleFavorite` awaits AsyncStorage before calling `setQuotes`, so the star will not change immediately if storage is slow or unavailable. For the required “right away” behavior, the UI should update without waiting for persistence.

14. **[PASS] Acceptance Criterion 14 - Edit preserves identity and createdAt.** The edit form is prefilled from the selected quote in `src/components/quote-form.tsx:23-35`, and update uses the existing id while mapping the existing object fields so `createdAt` and `id` remain unchanged in `src/context/quotes.tsx:89-97`. Saving returns to the detail route in `src/app/quote/[id]/edit.tsx:15-21`.

15. **[PASS] Acceptance Criterion 15 - Core visual and input layout.** The implementation uses the specified cream, white, pink, blue, lavender, and text colors throughout `src/app/(tabs)/all.tsx:78-107`, `src/app/quote/[id].tsx:97-121`, and `src/components/quote-form.tsx:161-204`. Safe-area components protect the iPhone content edges, and `KeyboardAvoidingView` plus a scroll view keeps the form and Save control usable while typing.

16. **[FAIL] Stored-data parsing does not validate the Quote data model.** `JSON.parse` is accepted whenever the result is an array in `src/context/quotes.tsx:45-52`; no element validation verifies required fields, enum values, ISO dates, or booleans. A persisted array containing `null`, missing `text`, or a malformed `createdAt` can cause search `.toLowerCase()` calls or detail date formatting to throw or behave incorrectly instead of showing an empty list. The spec requires unreadable or malformed saved data to fall back safely.

17. **[FAIL] The lint task currently fails.** `src/app/(tabs)/all.tsx:53` contains unescaped JSX quotation characters, producing the `react/no-unescaped-entities` lint errors. `src/components/quote-form.tsx:31` has React Compiler/ref lint errors for creating and reading `Animated.Value` through `useRef(...).current`, and `src/components/quote-form.tsx:34` has lint errors for synchronously setting state from an effect.

18. **[FAIL] TypeScript validation currently fails in an existing source file.** `src/components/app-tabs.web.tsx:27` uses an invalid `/explore` route, and `src/components/app-tabs.web.tsx:38` has a ref/type incompatibility between the Expo Router `TabTrigger` slot and `CustomTabList`. Because `npx tsc --noEmit` exits with code 2, the project is not currently type-checking cleanly.

19. **[WARN] Quote mutations rely on render-time closure state and can lose concurrent updates.** `addQuote`, `updateQuote`, `deleteQuote`, and `toggleFavorite` capture `quotes` and construct a new array from that snapshot in `src/context/quotes.tsx:73-116`. Rapid taps or overlapping async operations can therefore persist stale state. Mutations should derive the next array from a functional state update or serialize operations against the latest state.

20. **[WARN] Quote edit has no missing-quote fallback.** If an edit route is opened for an id that no longer exists or is not loaded, `EditQuoteScreen` renders an empty safe-area view because it only returns a form when `quote` exists in `src/app/quote/[id]/edit.tsx:9-22`. A clear fallback or navigation back to detail/All Quotes would prevent a blank screen.

21. **[WARN] The add-screen Saved! timeout is not tracked or cleaned up.** `setTimeout(() => setSaved(false), 1000)` in `src/components/quote-form.tsx:72` is not cancelled on unmount or superseding saves. It can clear the Saved state earlier than intended if another save happens within the first second, and React state updates from an old callback are not explicitly prevented.

22. **[WARN] Accessibility is weak for interactive controls.** The star, edit, delete, close, chips, and tab actions do not provide explicit accessibility roles or labels in `src/app/quote/[id].tsx:50-80` and `src/components/quote-form.tsx:111-150`. Icon-only or ambiguous controls should have labels and selected-state semantics for VoiceOver.

23. **[WARN] Persistence read and save errors are partly inconsistent.** Read failures and parse failures are logged and reset to an empty list as required in `src/context/quotes.tsx:38-64`, and add/save errors are shown by the form in `src/components/quote-form.tsx:77-81`. Delete and favorite also have user-facing alerts in `src/app/quote/[id].tsx:29-36` and `src/app/quote/[id].tsx:69-78`. The delete and favorite error strings are reasonable, but only Add has the exact `Couldn't save. Try again.` storage-failure requirement.

24. **[WARN] Repeated mutation and persistence logic could be simplified.** The context repeats the same `persist(next)` followed by `setQuotes(next)` pattern for add, edit, delete, and favorite in `src/context/quotes.tsx:68-116`. The unused `created` local also remains in `src/components/quote-form.tsx:67`. This is not an acceptance failure, but a small helper or functional-update approach would reduce error-prone duplication.
