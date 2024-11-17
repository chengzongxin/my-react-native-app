import { Stack } from 'expo-router';
import { RealmContext } from './config/realm';

const { RealmProvider } = RealmContext;

export default function Layout() {
  return (
    <RealmProvider>
      <Stack
        screenOptions={({ route }) => ({
          headerShown: route.name !== '(tabs)',
          title: route.name,
        })}
      />
    </RealmProvider>
  );
}
