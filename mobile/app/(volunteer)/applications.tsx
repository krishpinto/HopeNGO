import { View, Text, FlatList, TouchableOpacity, Image } from 'react-native';
import { MOCK_EVENTS } from '../../src/lib/mock-data';
import { useAppStore } from '../../src/lib/store';
import { useRouter } from 'expo-router';
import { MapPin } from 'lucide-react-native';

export default function VolunteerApplications() {
  const router = useRouter();
  const appliedEventsIds = useAppStore(state => state.appliedEvents);
  
  const appliedEvents = MOCK_EVENTS.filter(e => appliedEventsIds.includes(e.id));

  return (
    <View className="flex-1 bg-background">
      <FlatList
        data={appliedEvents}
        keyExtractor={item => item.id}
        contentContainerStyle={{ padding: 24, gap: 16 }}
        ListEmptyComponent={() => (
          <View className="flex-1 items-center justify-center pt-20">
            <Text className="text-muted-foreground text-center">You haven't applied to any events yet.</Text>
          </View>
        )}
        renderItem={({ item }) => (
          <TouchableOpacity 
            className="bg-surface rounded-2xl overflow-hidden border border-border shadow-sm mb-2 opacity-90"
            onPress={() => router.push(`/(volunteer)/event/${item.id}`)}
          >
            <View className="flex-row items-stretch">
              <View className="w-24 bg-muted relative">
                <Image source={{ uri: item.bannerImageUrl }} className="w-full h-full opacity-80 mix-blend-multiply" />
              </View>
              <View className="p-4 flex-1">
                <View className="bg-yellow-100 self-start px-2 py-0.5 rounded-sm mb-2">
                   <Text className="text-yellow-800 font-bold text-[10px] uppercase tracking-widest">Pending Verification</Text>
                </View>
                <Text className="font-heading text-lg font-bold text-foreground mb-1" numberOfLines={1} style={{ fontFamily: 'Georgia' }}>{item.title}</Text>
                <View className="flex-row items-center">
                  <MapPin size={12} color="#78716c" />
                  <Text className="text-xs text-muted-foreground ml-1">{item.location}</Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
