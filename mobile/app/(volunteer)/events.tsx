import { View, Text, FlatList, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { useAppStore } from '../../src/lib/store';
import { useRouter } from 'expo-router';
import { MapPin, Calendar } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { getEvents } from '../../lib/db-service';

export default function VolunteerEvents() {
  const router = useRouter();
  const appliedEventsIds = useAppStore(state => state.appliedEvents);
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getEvents().then(e => {
        setEvents(e);
        setLoading(false);
    });
  }, []);

  // Exclude applied events from "Available" feed
  const availableEvents = events.filter(e => !appliedEventsIds.includes(e.id) && e.status !== "completed");

  if (loading) {
    return <View className="flex-1 items-center justify-center bg-background"><ActivityIndicator size="large" color="#0f5238"/></View>;
  }

  return (
    <View className="flex-1 bg-background">
      <FlatList
        data={availableEvents}
        keyExtractor={item => item.id}
        contentContainerStyle={{ padding: 24, gap: 16 }}
        ListEmptyComponent={() => <Text className="text-center mt-10 text-muted-foreground text-lg">No more events available right now.</Text>}
        renderItem={({ item }) => (
          <TouchableOpacity 
            className="bg-surface rounded-2xl overflow-hidden border border-border shadow-sm mb-2"
            onPress={() => router.push(`/(volunteer)/event/${item.id}`)}
          >
            <View className="h-40 bg-muted relative">
              <Image source={{ uri: item.bannerImageUrl }} className="w-full h-full opacity-90" />
              <View className="absolute top-3 left-3 bg-surface/90 px-3 py-1 rounded-sm border border-border">
                <Text className="text-primary font-bold text-xs uppercase tracking-widest">
                  {new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </Text>
              </View>
            </View>
            <View className="p-5">
              <Text className="font-heading text-xl font-bold text-foreground mb-2" style={{ fontFamily: 'Georgia' }}>{item.title}</Text>
              <Text className="text-sm text-muted-foreground mb-4" numberOfLines={2}>{item.description}</Text>
              <View className="flex-row items-center justify-between mt-auto">
                <View className="flex-row items-center">
                  <MapPin size={14} color="#78716c" />
                  <Text className="text-xs text-muted-foreground ml-1.5">{item.location}</Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
