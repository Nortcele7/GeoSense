import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  return (
    <>
      <StatusBar style="light" backgroundColor="#4CAF50" />
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen 
          name="modal" 
          options={{ 
            presentation: 'modal',
            headerTitle: 'Settings',
            headerStyle: {
              backgroundColor: '#4CAF50',
            },
            headerTintColor: '#FBC02D',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }} 
        />
      </Stack>
    </>
  );
}