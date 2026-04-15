import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useAppStore } from '../../src/lib/store';
import { MOCK_EVENTS, MOCK_CERTIFICATES } from '../../src/lib/mock-data';
import { useRouter } from 'expo-router';
import { MapPin } from 'lucide-react-native';

export default function VolunteerDashboard() {
  const appliedEventsIds = useAppStore(state => state.appliedEvents);
  const myApplications = MOCK_EVENTS.filter(e => appliedEventsIds.includes(e.id));
  const router = useRouter();

  return (
    <ScrollView className="flex-1 bg-background p-6">
      <View className="mb-8">
        <Text className="text-3xl font-bold text-foreground" style={{ fontFamily: 'Georgia' }}>Welcome back,</Text>
        <Text className="text-3xl font-bold text-primary" style={{ fontFamily: 'Georgia' }}>User!</Text>
        <Text className="text-muted-foreground mt-2">Ready to make an impact today?</Text>
      </View>

      <View className="flex-row gap-4 mb-8">
        <View className="flex-1 bg-surface p-4 rounded-xl border border-border shadow-sm">
          <Text className="text-3xl font-bold text-primary">{myApplications.length}</Text>
          <Text className="text-xs uppercase font-bold text-muted-foreground mt-1">Active Apps</Text>
        </View>
        <View className="flex-1 bg-surface p-4 rounded-xl border border-border shadow-sm">
          <Text className="text-3xl font-bold text-primary">{MOCK_CERTIFICATES.length}</Text>
          <Text className="text-xs uppercase font-bold text-muted-foreground mt-1">Certificates</Text>
        </View>
      </View>

      <View className="mb-4 flex-row justify-between items-center">
        <Text className="text-lg font-bold text-foreground">Your Applications</Text>
        <TouchableOpacity onPress={() => router.push('/(volunteer)/applications')}>
          <Text className="text-primary font-bold text-sm">View All</Text>
        </TouchableOpacity>
      </View>

      {myApplications.slice(0, 3).map(event => (
        <TouchableOpacity 
          key={event.id} 
          className="bg-surface rounded-xl overflow-hidden mb-4 border border-border flex-row items-center p-3 shadow-sm"
          onPress={() => router.push(`/(volunteer)/event/${event.id}`)}
        >
          <Image source={{ uri: event.bannerImageUrl }} className="w-16 h-16 rounded-md opacity-90 grayscale-[20%]" />
          <View className="ml-4 flex-1">
            <Text className="font-bold text-foreground text-sm" numberOfLines={1}>{event.title}</Text>
            <View className="flex-row items-center mt-1">
              <MapPin size={12} color="#78716c" />
              <Text className="text-xs text-muted-foreground ml-1">{event.location}</Text>
            </View>
          </View>
        </TouchableOpacity>
      ))}

      <TouchableOpacity 
        className="mt-4 bg-primary py-4 rounded-xl items-center shadow-sm"
        onPress={() => router.push('/(volunteer)/events')}
      >
        <Text className="text-primary-foreground font-bold text-lg">Browse Opportunities</Text>
      </TouchableOpacity>
      <View className="h-10" />
    </ScrollView>
  );
}
