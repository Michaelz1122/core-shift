import { Tabs } from 'expo-router';
import { BlurView } from 'expo-blur';
import { StyleSheet, Platform, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useStore } from '@/store/useStore';
import { Colors } from '@/constants/theme';
import { strings } from '@/constants/strings';

export default function TabLayout() {
  const { darkMode, language } = useStore();
  const isRTL = language === 'ar';
  const t = strings[language];
  
  const bg = darkMode ? '#000000' : '#FFFFFF';
  const activeColor = darkMode ? '#FFFFFF' : '#000000';
  const inactiveColor = darkMode ? '#666666' : '#999999';

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: activeColor,
        tabBarInactiveTintColor: inactiveColor,
        tabBarStyle: {
          position: 'absolute',
          elevation: 0,
          borderTopWidth: 0.5,
          borderTopColor: darkMode ? '#333333' : '#E5E5E5',
          backgroundColor: Platform.OS === 'ios' ? 'transparent' : bg, // Use BlurView on iOS if transparent
          height: Platform.OS === 'ios' ? 88 : 72,
          paddingBottom: Platform.OS === 'ios' ? 28 : 12,
          paddingTop: 8,
          flexDirection: isRTL ? 'row-reverse' : 'row',
        },
        tabBarBackground: () => 
          Platform.OS === 'ios' ? (
            <BlurView
              tint={darkMode ? 'dark' : 'light'}
              intensity={80}
              style={StyleSheet.absoluteFill}
            />
          ) : (
            <View style={[StyleSheet.absoluteFill, { backgroundColor: bg }]} />
          ),
      }}
    >
      <Tabs.Screen
        name="today"
        options={{
          title: t.navHome,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="goals"
        options={{
          title: t.navGoals,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="flag" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="progress"
        options={{
          title: t.navProgress,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="stats-chart" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: t.navMore,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="menu" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
