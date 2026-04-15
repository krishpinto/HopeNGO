import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { MOCK_EVENTS } from '../../../src/lib/mock-data';
import { MapPin, Users, Calendar, ArrowLeft } from 'lucide-react-native';

export default function CoordinatorEventDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const event = MOCK_EVENTS.find(e => e.id === id);

  if (!event) return null;

  const isCompleted = event.status === 'completed' || !!event.coordinatorReport;

  return (
    <View className="flex-1 bg-background">
      <ScrollView className="flex-1">
        <View className="h-48 bg-muted relative">
          <Image source={{ uri: event.bannerImageUrl }} className="w-full h-full opacity-90 grayscale-[20%]" />
          <TouchableOpacity 
            className="absolute top-12 left-4 w-10 h-10 bg-black/40 rounded-full items-center justify-center backdrop-blur-md"
            onPress={() => router.back()}
          >
            <ArrowLeft color="white" size={20} />
          </TouchableOpacity>
        </View>

        <View className="p-6 -mt-6 bg-background rounded-t-3xl">
          <Text className="text-3xl font-bold mb-4 text-primary" style={{ fontFamily: 'Georgia' }}>{event.title}</Text>
          
          <View className="bg-surface border border-border rounded-xl p-4 mb-8 shadow-sm">
            <View className="flex-row items-center mb-3">
              <Calendar size={18} color="#78716c" />
              <Text className="ml-3 font-medium text-muted-foreground">{new Date(event.date).toLocaleDateString()}</Text>
            </View>
            <View className="flex-row items-center mb-3">
              <MapPin size={18} color="#78716c" />
              <Text className="ml-3 font-medium text-muted-foreground">{event.location}</Text>
            </View>
            <View className="flex-row items-center">
              <Users size={18} color="#78716c" />
              <Text className="ml-3 font-medium text-muted-foreground">{event.volunteerCount} Volunteers Expected</Text>
            </View>
          </View>

          {isCompleted && event.coordinatorReport && (
             <View className="bg-surface-container-low border border-border rounded-xl p-4 mb-8 shadow-sm">
                <Text className="font-bold text-foreground mb-2 text-sm uppercase tracking-wider">Submitted Notes</Text>
                <Text className="text-muted-foreground leading-relaxed">"{event.coordinatorReport.notes}"</Text>
             </View>
          )}

          {!isCompleted && (
            <View className="gap-4">
              <TouchableOpacity 
                className="bg-primary py-4 rounded-xl items-center shadow-sm"
                onPress={() => router.push(`/(coordinator)/event/${event.id}/report`)}
              >
                <Text className="text-primary-foreground font-bold text-lg">Submit Execution Report</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                className="bg-surface border-2 border-primary py-4 rounded-xl items-center shadow-sm"
                onPress={() => router.push(`/(coordinator)/event/${event.id}/roster`)}
              >
                <Text className="text-primary font-bold text-lg">View Volunteer Roster</Text>
              </TouchableOpacity>
            </View>
          )}

          <View className="h-10" />
        </View>
      </ScrollView>
    </View>
  );
}
