# Quote Jar

Quote Jar is a place to keep and search quotes you really like from anyone, including your friends and famous people.

I chose this idea because I have screenshots, notes, writings, and more of what people said that I would like to remember; this app puts them all in one place for me but keeps it simple enough so that it retains the original impulse I had when I stored quotes in the past.

## Screens

Add: On the Add screen, the user can add what was said and by who, which are required inputs. Optionally, the user can enter the context as well as toggle between whether it was said by a personal acquaintance or a famous individual. If you don't include what was said or who said it, you'll be reminded to do so before it is saved successfully.

All Quotes: Toggle over to the All Quotes screen, and the user can see all quotes they ever entered, including via search of who said it and the quote itself. These quotes appear in cards that can be tapped to be enlarged, so if you were to show it to someone, then they wouldn't see all your quotes ever.

Quote Detail (enlarged card): Upon enlargement, the user has options to favorite, edit, and delete the quote/card.

## Setup and Running

- Expo SDK: 58 (Expo Router, TypeScript)
- Device: iPhone, running the app in **Expo Go** from the App Store
- Node.js: an LTS version, 22.13 or newer (Node 23 did not work with Expo's tools)

```bash
git clone <this repo's URL>
cd quote-jar
npm install
npx expo start
```

1. Install Expo Go on your phone and sign in with a free Expo account.
2. Run `npx expo login` on your computer with the **same** Expo account.
3. With your phone and computer on the same Wi-Fi, scan the QR code (iPhone: Camera app; Android: inside Expo Go).
4. If the QR code doesn't connect, use `npx expo start --tunnel`. If the app seems stale, use `npx expo start -c` to clear the cache.

Quotes are saved on the device with AsyncStorage, so they stay after Expo Go is closed and reopened.

## Spec, Build, and Review

- `SPEC.md`: the spec, committed before any code
- `REVIEW.md`: the review from a second, fresh agent, kept as it wrote it

Review findings I fixed: #13, #16, #17, #18, #19, #20, #21, #24 (saved-data validation, lint and TypeScript errors, the favorite star updating immediately, stale-state updates, the missing-quote fallback on Edit, the Saved! timer, and small cleanups).

Review findings I chose not to fix:
- #22 (accessibility labels) and #23 (error message wording): I wanted the app to stay simple. These would make the app better in some ways, but I had to draw the line somewhere, and neither is part of the spec.

Issues the review missed (found while testing on my phone):
- The "Saved!" message lasted 1 second instead of the about 2 seconds the spec asks for. Fixed.
- The multiline quote box had no way to close the keyboard on iPhone, because pressing return just added a new line. Fixed so that return moves to the "Who said it?" field, and tapping outside or dragging closes the keyboard.
- After editing a quote, a new copy of the detail card opened on top of the old one, so you had to swipe down once for every edit to close it. Fixed so that saving an edit goes back to the existing card.

Additions beyond the spec: big, tilted quotation marks around each quote on All Quotes and the detail screen, and the keyboard behavior above.

## What Surprised Me

With a specific spec, it went much much faster than apps I made where I did use Expo Go and did it incrementally. It's nice to get the big picture of the app down and then refine rather than build up to your end goal, in a way. Perhaps this goes for non-mobile projects too. Specifically for mobile, it was pretty convenient to test on my phone. Overall, my experience with mobile development in this fashion isn't too different from my experience with website development and stuff.