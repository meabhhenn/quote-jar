import { NativeTabs } from 'expo-router/native-tabs';

export default function TabsLayout() {
  return (
    <NativeTabs
      backgroundColor="#FFF8F0"
      indicatorColor="#D6E6F5"
      labelStyle={{ selected: { color: '#3A3A3A' }, default: { color: '#777777' } }}>
      <NativeTabs.Trigger name="index">
        <NativeTabs.Trigger.Label>Add</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="plus" />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="all">
        <NativeTabs.Trigger.Label>All Quotes</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="quote.bubble" />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
