import { View, Text, ScrollView, Image, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { MOCK_EVENTS } from '../../../src/lib/mock-data';
import { useAppStore } from '../../../src/lib/store';
import { MapPin, Users, Calendar, ArrowLeft } from 'lucide-react-native';

export default function VolunteerEventDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const applyForEvent = useAppStore(state => state.applyForEvent);
  const appliedEventsIds = useAppStore(state => state.appliedEvents);
  
  const event = MOCK_EVENTS.find(e => e.id === id);
  const hasApplied = appliedEventsIds.includes(id as string);

  if (!event) return null;

  return (
    <View className="flex-1 bg-background">
      <ScrollView className="flex-1">
        <View className="h-64 bg-muted relative">
          <Image source={{ uri: event.bannerImageUrl }} className="w-full h-full opacity-90" />
          <TouchableOpacity 
            className="absolute top-12 left-4 w-10 h-10 bg-black/40 rounded-full items-center justify-center backdrop-blur-md"
            onPress={() => router.back()}
          >
            <ArrowLeft color="white" size={20} />
          </TouchableOpacity>
        </View>

        <View className="p-6 -mt-6 bg-background rounded-t-3xl">
          <View className="bg-primary/10 self-start px-3 py-1 rounded-sm mb-4">
            <Text className="text-primary font-bold text-xs uppercase tracking-widest">{event.tags[0]}</Text>
          </View>
          
          <Text className="text-3xl font-bold mb-4 text-foreground" style={{ fontFamily: 'Georgia' }}>{event.title}</Text>
          
          <View className="bg-surface border border-border rounded-xl p-4 mb-6 shadow-sm">
            <View className="flex-row items-center mb-3">
              <Calendar size={18} color="#047857" />
              <Text className="ml-3 font-medium text-foreground">{new Date(event.date).toLocaleDateString()} at 10:00 AM</Text>
            </View>
            <View className="flex-row items-center mb-3">
              <MapPin size={18} color="#047857" />
              <Text className="ml-3 font-medium text-foreground">{event.location}</Text>
            </View>
            <View className="flex-row items-center">
              <Users size={18} color="#047857" />
              <Text className="ml-3 font-medium text-foreground">{event.volunteerCount} Volunteers Joined</Text>
            </View>
          </View>

          <Text className="font-bold text-lg mb-2 text-foreground">About this Event</Text>
          <Text className="text-muted-foreground leading-relaxed mb-6">{event.longDescription}</Text>
        </View>
      </ScrollView>

      <View className="border-t border-border/50 bg-surface p-6 pb-10 shadow-[0_-4px_6px_rgba(0,0,0,0.02)]">
        {hasApplied ? (
          <View className="bg-muted py-4 rounded-xl items-center border border-border">
            <Text className="text-foreground font-bold text-lg">Application Received ✓</Text>
          </View>
        ) : (
          <TouchableOpacity 
            className="bg-primary py-4 rounded-xl items-center"
            onPress={() => {
              applyForEvent(event.id);
              router.back();
            }}
          >
            <Text className="text-primary-foreground font-bold text-lg">Apply as Volunteer</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}
