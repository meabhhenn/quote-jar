SPEC: Quote Jar
1. Summary
Quote Jar is a pocket notebook for things people say: funny and out-of-pocket lines, kind words, or famous quotes. User adds a quote and can browse their collection later. Tapping a quote shows it big on screen, so you can show one quote to someone without them seeing the rest.
2. Platform & Tech
	•	Expo SDK 58, React Native, TypeScript
	•	Navigation: Expo Router. Screens live in src/app/.
	•	Two bottom tabs: Add (opens first) and All Quotes.
	•	Persistence: @react-native-async-storage/async-storage (install with npx expo install).
	•	Use only what ships with Expo / React Native (e.g. the built-in Animated API for the shake). Add no other third-party UI or animation libraries.
	•	Tested in Expo Go on an iPhone.
3. Data Model
One type of data is saved: a list of quotes, stored as JSON under a single AsyncStorage key (quotes).
Field
Type
Required
Notes
id
string
yes
Generated on save; unique
text
string
yes
The quote itself; trimmed; cannot be blank
author
string
yes
Who said it; trimmed; cannot be blank
createdAt
string (ISO date)
yes
Set automatically when first saved. Never changed by editing
context
one of Dinner, Class, Hanging out, Text, Other, or null
no
At most one selected
type
Personal or Famous
yes
Defaults to Personal
favorite
boolean
yes
Defaults to false
4. Screens
4.1 Add tab (home screen, src/app/(tabs)/index.tsx)
	•	Title: "Add a Quote"
	•	Shown as a single index card containing:
	◦	Multiline text input: "What did they say?"
	◦	Text input: "Who said it?"
	◦	Context chips: Dinner; Class; Hanging out; Text; Other. Tapping a chip selects it and deselects any other. Tapping the selected chip again deselects it.
	◦	Type toggle: Personal / Famous (Personal selected by default)
	◦	Save button
	•	On a valid save: the quote is stored, a brief "Saved!" message appears for about 1 sec and form resets to its defaults. The user stays on the Add tab.
	•	On an invalid save (quote or author blank, or only spaces): nothing is saved, the card shakes briefly, and message "Who said what again?" appears under the card. The message goes away once the user starts typing.
4.2 All Quotes tab (src/app/(tabs)/all.tsx)
	•	Title: "All Quotes"
	•	Search bar at the top
	•	Scrollable list of index cards, newest first. Each card shows only the quote text (full text, not truncated). A small ★ appears on favorited cards.
	•	Search filters the list live as the user types. It is case-insensitive and matches partial text in either the quote text or the author. For example, "oliv" matches a quote by "Olivia" and a quote that contains the word "olive".
	•	Empty states:
	◦	No quotes saved: "Nothing yet. Go listen to your friends." with a button to the Add tab.
	◦	Search finds nothing: "No quotes match "<search text>"."
	•	Tapping a card opens the Quote Detail view.
4.3 Quote Detail (src/app/quote/[id].tsx, presented as a modal)
	•	Shows just this one quote, in large text and centered, on a single big card. No other quotes are visible.
	•	Below the quote: "— <author>", the date in a readable format (e.g. "Nov 22, 2026"), the context (if set), and the type.
	•	Actions:
	◦	★ Favorite toggle. The change saves immediately, and the star fills or empties right away.
	◦	Edit: opens the same form as the Add tab, pre-filled with this quote's values. Saving updates the quote (keeping its original id and createdAt) and returns to Quote Detail showing the new values. The same blank-field rules apply.
	◦	Delete: shows a confirmation "Delete this quote?" with Cancel and Delete. Delete removes the quote and returns to All Quotes. Cancel does nothing.
	◦	Close (x or swipe down) returns to All Quotes.
5. Look & Feel
	•	Pastel index-card style: rounded cards with soft shadows on a light background, like a stack of notecards.
	•	Bottom tabs styled like folder tabs, with the active tab clearly highlighted.
	•	Palette:
	◦	Background #FFF8F0 (cream)
	◦	Cards #FFFFFF, with a pastel accent per type: Personal #F8D7E3 (pink), Famous #D6E6F5 (blue)
	◦	Primary buttons and selected chips #B8A9E3 (lavender), text #3A3A3A
	•	Text must be readable: body text at least 16pt, and the quote on Quote Detail at least 26pt.
	•	Content stays inside the iPhone safe area, clear of the notch and home indicator.
	•	The keyboard must not cover the Save button on the Add tab.
6. Error Handling
	•	If saved data can't be read or parsed, the app shows an empty list instead of crashing, and logs the error.
	•	If a save to storage fails, the user sees "Couldn't save. Try again." and the form keeps what they typed.
7. Acceptance Criteria
Must have
	1	Opening the app shows the Add tab with the "Add a Quote" form. A bottom tab bar shows Add and All Quotes.
	2	Entering a quote and an author and tapping Save shows "Saved!", clears the form (context unselected, type back to Personal), and the user stays on the Add tab.
	3	After a save, the All Quotes tab shows the new quote at the top of the list.
	4	Tapping Save with the quote blank, the author blank, or either containing only spaces saves nothing. The card shakes and "Who said what again?" appears.
	5	Only one context chip can be selected at a time. Tapping a second chip moves the selection, and tapping the selected chip clears it.
	6	Each card on All Quotes shows only the full quote text, with no author or date, and cards are ordered newest first.
	7	Tapping a card opens Quote Detail showing only that quote, large, plus its author, date, context (if set), and type.
	8	On Quote Detail, tapping Delete shows a confirmation. Cancel keeps the quote. Delete removes it and returns to All Quotes, where it no longer appears.
	9	With no quotes saved, All Quotes shows "Nothing yet. Go listen to your friends." and a button that goes to the Add tab.
	10	Persistence: add two quotes, fully close Expo Go (swipe it away), and reopen the app. Both quotes are still on All Quotes, in the same order, with the same details.
Nice to have
	11	Typing "oliv" in search shows quotes whose author or text contains "Olivia" / "olive", in any capitalization, and hides the rest. Clearing the search shows every quote again.
	12	A search with no matches shows "No quotes match "<search text>"."
	13	Tapping ★ on Quote Detail toggles the favorite. A ★ appears on that quote's card in All Quotes, and the setting survives closing and reopening the app.
	14	Tapping Edit opens the form pre-filled. Changing the author and saving shows the new author on Quote Detail, and the date does not change.
	15	Visual style follows Section 5: pastel cards, the given palette, readable text, nothing under the notch, and the keyboard never covers Save.
8. Out of Scope
	•	Accounts, cloud sync, or sharing
	•	Photos or audio
	•	Custom or user-created context chips
	•	Sorting options other than newest first
	•	Filtering by favorites, context, or type (search only)
