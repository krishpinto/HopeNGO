import { Tabs } from 'expo-router';
import { Home, Calendar, Award, User } from 'lucide-react-native';

export default function VolunteerLayout() {
  return (
    <Tabs screenOptions={{
      tabBarActiveTintColor: '#047857',
      tabBarInactiveTintColor: '#a8a29e',
      headerStyle: { backgroundColor: '#faf9f6' },
      headerTitleStyle: { fontFamily: 'Georgia', color: '#047857', fontSize: 20 },
      tabBarStyle: { backgroundColor: '#ffffff', borderTopColor: '#e7e5e4' },
      headerShadowVisible: false,
    }}>
      <Tabs.Screen 
        name="dashboard" 
        options={{ title: 'Home', tabBarIcon: ({ color }) => <Home color={color} size={24} /> }} 
      />
      <Tabs.Screen 
        name="events" 
        options={{ title: 'Opportunities', tabBarIcon: ({ color }) => <Calendar color={color} size={24} /> }} 
      />
      <Tabs.Screen 
        name="applications" 
        options={{ title: 'My Apps', tabBarIcon: ({ color }) => <User color={color} size={24} /> }} 
      />
      <Tabs.Screen 
        name="certificates" 
        options={{ title: 'Certificates', tabBarIcon: ({ color }) => <Award color={color} size={24} /> }} 
      />
      <Tabs.Screen 
        name="profile" 
        options={{ title: 'Profile', tabBarIcon: ({ color }) => <User color={color} size={24} /> }} 
      />
      {/* Hidden Screens */}
      <Tabs.Screen name="event/[id]" options={{ title: 'Event Details', href: null }} />
    </Tabs>
  );
}
