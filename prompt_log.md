# Prompt Log: Quote Jar (HW10)

## AI Tools Used
- Claude (claude.ai chat / desktop app): brainstorming, setup and troubleshooting help, review overlook, writing the fix prompts below.
- GitHub Copilot Agent mode in VS Code: the agentic build, the review (REVIEW.md), and code fixes.

---

## Phase 1: Brainstorming (Claude chat)

> I want to build a quote log that keeps track of quotes that your friends said or famous quotes. It should be a simple phone app that only has two screens taking in user input. I need to have complete cohesive design; give me questions that I should definitely answer/consider if my app is to be designed well and function appropriately.

*Claude asked eight design questions: what fields get saved, what the screens are, list order, edit/delete, empty state, bad saves, an optional fun feature, and visual style.*

> Number one, what gets saved? The obvious I believe in. Sure, the day. I think the day, maybe the context, but honestly, just keeping it simple, I think, is the biggest incentive to a user using it. Maybe the others can be like clicks, like true false kind of questions, like, oh, dinner, other, etc. A favorite flag, sure. The only two required though, quote and who, I think. Two screens. I think the first, when you open the app, it should be an app quote, or sorry, add quote form, and then a list of all the quotes is the other screen, like view all quotes. Loki, that's enough. I don't really know what would be shown in the card. Maybe it would be nice if you would click on the card and that just like zooms in. So say you're showing this to someone, they can't see all the other quotes that are there, just like the one that's highlighted. Three, how is the list ordered? What does each card show? I would say full quote. They shouldn't be too long. And then when you click on the card, maybe you can see the name and the date and other details, but just the quotes, I think, and from newest to last, maybe. And I think it'd be nice to have a search bar, like, oh, I wonder what Olivia said to me. I wonder if she shows up in here at all. And this would be in the all cards. And maybe there could be a tag just in general, like, is this a personal quote? Like, did my friend say this to me? Or is this a real world quote? Like, am I quoting Einstein? I don't know. Change things. Yeah, delete for sure. Edit for sure. Yeah, you should be able to toggle the favorite. What happens on a bad save? I don't think you should be able to save on a bad save. If there's nothing there, it could be like a little shake of the card and a message: who said what again? Little message. Index cards for type of style, as in folder tabs, and then each one's a little card. Pastel colors. I'm signed in to expo go already but I haven't created the project folder yet.

*Claude organized my decisions, asked follow-up questions about the gaps (chip options, the date, search, delete confirmation, edit, navigation, colors, what happens after saving).*

> Just one for context chips, just one should be selected. Automatic. For the date. It should match just anything if the person saying it is Olivia or the quote includes the name Olivia. I think just search, general search feature there. It should not be case sensitive. I don't know why that would be beneficial. I think an "Are you sure?" confirmation doesn't have to say that, but it's like, oh, click delete. Do you want to, or do you want to delete this? Yeah, it may be a message just to confirm. Reusing the form for edit. Navigation. Yeah, that works. 7. No, it doesn't really matter too much. 8. Just a quick saved message, and then the user can choose to continue to navigate or not. 

*Claude gave me more questions to consider, but I determined that at this point I had considered enough of the design and had a plan for enought of the design that I should go ahead and start writing the spec from the brainstorming. The next phase are prompts I got from claude after showing it where I had gotten in the code so far.*
---

## Phase 2: Agentic Build (IDE agent)

Build prompt (the assignment's prompt plus the last two lines):

```
Read SPEC.md in this project. Implement the full mobile app exactly as specified.
This is an Expo project using Expo Router, so screens belong in src/app/.
Check package.json for the exact Expo SDK version and write code for that version.
Create all necessary files, components, and navigation. Make sure that appropriate data is persistent.
Avoid security risks for sensitive data. Include proper error handling.
Make sure the app starts without errors and displays the home screen correctly.
Implement both the "Must have" and "Nice to have" acceptance criteria, but get the Must-haves working first.
Install AsyncStorage with npx expo install @react-native-async-storage/async-storage.
```

Result: the agent built all the screens, but its verification got stuck. It reported "Static tooling is blocked by the environment's unsupported Node 23 runtime," and its final `npx expo start` check never finished, because a dev server runs until you stop it. I stopped it manually and committed the raw output ("Raw agentic build output").

---

## Phase 3: AI Review (fresh IDE agent session)

```
Review the React Native/Expo code in this project against the spec in SPEC.md.
For each acceptance criterion in the spec, verify whether the code actually implements it correctly.
Also check for:
- Bugs or logic errors
- Missing error handling
- Code quality issues (unclear naming, repeated code, etc.)
- Best practices for React Native or other technologies

Format your review as a numbered list of findings, each marked as [PASS], [FAIL], or [WARN].
Be specific. Reference file names and line numbers.
Do not fix anything in this session. Report only.
Export the review as REVIEW.md at the root of the project.
```

Result: 24 findings: 14 PASS, 3 FAIL (saved-data validation, lint, TypeScript), and 7 WARN. Committed unedited as REVIEW.md.

---

## Phase 4: Fixes After Review (IDE agent)

```
Fix these findings from REVIEW.md: #16, #17, #18, #13, #19, #20, #21, #24.
- #18: delete unused starter files (app-tabs.web.tsx, and app-tabs.tsx if nothing imports it) rather than patching them.
- #21: also change the Saved! message to last 2 seconds, as SPEC.md says.
- #13/#19: update state immediately using functional updates, then persist; roll back and alert if saving fails.
Do not change anything else. When done, run npx expo lint and npx tsc --noEmit and confirm both pass.
```

Result: the agent fixed the listed findings, and lint and typecheck both passed. I chose not to fix #22 (accessibility labels) and #23 (error wording) to keep the app simple; this is explained in the README.

---

## Phase 5: Bugs Found While Testing on My iPhone, and Polish (fresh/new IDE agent)

**1. Couldn't close the keyboard.** Pressing return in the quote box only added new lines, so I couldn't get out of it to test anything.

```
Bug found while testing on iPhone: on the Add/Edit form, the multiline "What did they say?" input has no way to dismiss the keyboard. Pressing return only adds a new line, and tapping outside does nothing.
Fix in src/components/quote-form.tsx:
- Tapping anywhere outside the inputs dismisses the keyboard (Keyboard.dismiss), and dragging the form's scroll view dismisses it too (keyboardDismissMode="on-drag", keyboardShouldPersistTaps="handled").
- Pressing return in the quote field moves focus to the "Who said it?" field instead of adding a new line.
- Pressing return in the "Who said it?" field dismisses the keyboard.
Don't change anything else. Run npx expo lint and npx tsc --noEmit afterwards.
```

**2. Comical quotation marks (my design idea).** My request to Claude was:

> i want the quotes to appear with obvious comical quotation marks around them in the all quotes section

The prompt I gave the IDE agent:

```
Polish request: on the All Quotes screen (src/app/(tabs)/all.tsx), make each quote card look obviously "quoted" in a playful, cartoonish way:
- Add oversized decorative curly quotation marks: a big “ at the top-left of the card and a big ” at the bottom-right, around the quote text.
- Make them comically large compared to the text (roughly 48–60pt), bold, in a serif font (Georgia on iOS), colored lavender #B8A9E3, and slightly tilted (e.g. rotate -8deg and 8deg).
- They're decoration only: they must not overlap or cover the quote text, the ★, or change what text the card shows. Add padding so the text sits comfortably between them.
- Use the same style on the Quote Detail screen (src/app/quote/[id].tsx), scaled up to match the larger quote.
- Keep the existing colors, card style, and layout otherwise unchanged.
Run npx expo lint and npx tsc --noEmit afterwards.
```

**3. Editing stacked detail cards.** I found that after each edit, a new card popped up on top of the old one, so I had to swipe down once per edit.

```
Bug found while testing: after saving an edit, a new Quote Detail screen is pushed on top of the old one, so the user has to swipe down once per edit to close it.
Fix src/app/quote/[id]/edit.tsx so saving goes BACK to the existing Quote Detail (router.back()) instead of pushing a new one. The detail screen should show the updated values. Don't change anything else. Run npx expo lint and npx tsc --noEmit afterwards.
```

---

## Prompts Asking AI to Explain React Native / Expo Concepts

> "Why do I need SafeAreaView?"
```Modern iPhones have parts of the screen your app can't use: the notch or Dynamic Island at the top, the status bar (time, battery), and the home indicator bar at the bottom. React Native draws to the full screen edge by default, so without protection your "Add a Quote" title could sit under the Dynamic Island, and buttons near the bottom could clash with the home swipe gesture.

SafeAreaView (from react-native-safe-area-context) adds padding equal to those areas on whatever phone the app is running on. The amount differs between an iPhone SE, an iPhone 16 and an Android phone, and you don't have to hard-code any of it.

In your Add screen, it's used like this:

tsx
<SafeAreaView edges={['top', 'left', 'right']}>

edges picks which sides get padding. The bottom is left out because the tab bar already handles the bottom safe area, and padding it twice would leave a gap.
```

>"How does the (tabs) folder create the tab bar?"
```Expo Router uses file-based routing: every file in src/app/ becomes a screen, and the folder structure decides the navigation.

Parentheses mean a "group." A folder named (tabs) groups screens without adding its name to the URL or route. So (tabs)/all.tsx is the route /all, not /tabs/all. The name is just for organizing.
_layout.tsx defines how the screens are shown. Inside (tabs)/_layout.tsx, the agent used Expo Router's Tabs navigator and declared two tabs:
index: the Add screen. index is the default route, which is why the app opens on it.
all: the All Quotes screen.

The Tabs component draws the bottom tab bar with those two buttons, and tapping one switches screens.

Layouts nest. The top-level src/app/_layout.tsx is a Stack: screens slide on top of each other. The whole tab bar is one screen in that stack, and quote/[id].tsx (Quote Detail) is another, shown as a modal above the tabs. That's why the detail card covers the tab bar and you swipe it down to get back.
[id] in square brackets is a dynamic route. quote/[id].tsx matches any quote, like /quote/abc123. The screen reads the id with useLocalSearchParams() and looks up that quote.
```

---

## Manual Interventions and Notes
- **Low disk space:** my Mac had about 3 GB free, which made installs and the build crawl. I freed about 27 GB (emptied the Trash, deleted large files) mid-build.
- **Wrong Node version:** I had Node 23, which Expo's tools don't support. Installing LTS from nodejs.org didn't take effect at first because an older Homebrew Node was being used instead. I had to run `sudo xcodebuild -license accept`, uninstall Homebrew's node, then `rm -rf node_modules && npm install`.
- **Two project folders:** my phone kept showing the starter "Welcome to Expo" screen because Expo was running from an untouched copy of the project (`~/quote-jar`) instead of the real one (`~/Documents/quote-jar`). I found it with Claude's help and started Expo from the correct folder.