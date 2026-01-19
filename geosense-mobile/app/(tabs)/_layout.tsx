import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function TabLayout() {
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#4CAF50',
        tabBarInactiveTintColor: '#689F38',

        tabBarStyle: {
          backgroundColor: '#F1F8E9',
          borderTopWidth: 1,
          borderTopColor: '#DCEDC8',

          // 🔥 MAIN FIX
          height: 55 + insets.bottom,
          paddingBottom: insets.bottom,
          paddingTop: 6,
        },

        headerShown: true,

        headerStyle: {
          backgroundColor: '#4CAF50',
        },
        headerTintColor: '#FBC02D',
      }}
    >

      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          headerTitle: 'GeoSense AI',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons 
              name={focused ? 'home' : 'home-outline'} 
              size={24} 
              color={color} 
            />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Map',
          headerTitle: 'Geo Map',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons 
              name={focused ? 'map' : 'map-outline'} 
              size={24} 
              color={color} 
            />
          ),
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: 'Chat',
          headerTitle: 'GeoSense Bot',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons 
              name={focused ? 'chatbubble' : 'chatbubble-outline'} 
              size={24} 
              color={color} 
            />
          ),
        }}
      />
    </Tabs>
  );
}