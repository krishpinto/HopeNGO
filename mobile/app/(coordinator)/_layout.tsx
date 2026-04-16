import { Tabs } from 'expo-router';
import { Briefcase, List, User } from 'lucide-react-native';

export default function CoordinatorLayout() {
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
        options={{ title: 'Assignments', tabBarIcon: ({ color }) => <Briefcase color={color} size={24} /> }} 
      />
      <Tabs.Screen 
        name="profile" 
        options={{ title: 'Profile', tabBarIcon: ({ color }) => <User color={color} size={24} /> }} 
      />
      <Tabs.Screen 
        name="event/[id]" 
        options={{ href: null, title: 'Event Details' }} 
      />
      <Tabs.Screen 
        name="event/[id]/roster" 
        options={{ href: null, title: 'Volunteer Roster' }} 
      />
      <Tabs.Screen 
        name="event/[id]/report" 
        options={{ href: null, title: 'Execution Report' }} 
      />
    </Tabs>
  );
}
