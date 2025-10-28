import { Tabs } from 'expo-router';
import React from 'react';

import { AnimatedTabBar } from '@/components/tabs/AnimatedTabBar';

export default function TabLayout() {
  return (
    <Tabs
      tabBar={(props) => <AnimatedTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
        }}
      />
      <Tabs.Screen
        name="rooms"
        options={{
          title: 'Rooms',
        }}
      />
      <Tabs.Screen
        name="my-booking"
        options={{
          title: 'My Booking',
        }}
      />
      <Tabs.Screen
        name="payment"
        options={{
          title: 'Payment',
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}
