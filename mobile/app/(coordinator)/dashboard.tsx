import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { MOCK_EVENTS } from '../../src/lib/mock-data';
import { useRouter } from 'expo-router';
import { MapPin, Users, CheckCircle2 } from 'lucide-react-native';

export default function CoordinatorDashboard() {
  const router = useRouter();
  const myEvents = MOCK_EVENTS.filter(e => e.coordinatorId === 'u4');

  return (
    <ScrollView className="flex-1 bg-background p-6">
      <View className="mb-6">
        <Text className="text-muted-foreground text-sm">Active deployments requesting your oversight and leadership.</Text>
      </View>

      <View className="gap-6 pb-12">
        {myEvents.map(event => {
          const isCompleted = event.status === 'completed' || !!event.coordinatorReport;

          return (
            <TouchableOpacity 
              key={event.id} 
              className={`bg-surface border border-border rounded-xl overflow-hidden shadow-sm ${isCompleted ? 'opacity-80' : ''}`}
              onPress={() => router.push(`/(coordinator)/event/${event.id}`)}
              activeOpacity={0.8}
            >
              <View className="h-32 bg-muted relative">
                 <Image source={{ uri: event.bannerImageUrl }} className="w-full h-full opacity-90 grayscale-[20%]" />
              </View>
              <View className="p-5">
                <View className="flex-row items-start justify-between mb-2">
                  <Text className="flex-1 font-heading font-bold text-xl text-primary leading-tight" style={{ fontFamily: 'Georgia' }}>{event.title}</Text>
                  {isCompleted && (
                     <View className="ml-2 bg-green-100 px-2 py-1 rounded-[4px] border border-green-200">
                        <CheckCircle2 color="#15803d" size={14} />
                     </View>
                  )}
                </View>
                
                <View className="flex-row items-center mt-2 mb-1">
                  <MapPin size={14} color="#78716c" />
                  <Text className="text-xs text-muted-foreground ml-1.5">{event.location}</Text>
                </View>

                <View className="flex-row items-center mb-4">
                  <Users size={14} color="#78716c" />
                  <Text className="text-xs text-muted-foreground ml-1.5">{event.volunteerCount} Volunteers Assigned</Text>
                </View>
                
                {!isCompleted ? (
                   <View className="border-t border-border/40 pt-4 flex-row items-center justify-between">
                     <Text className="text-primary font-bold text-sm">Manage Event</Text>
                     <Text className="text-muted-foreground tracking-widest uppercase text-[10px] font-bold">{new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric'})}</Text>
                   </View>
                ) : (
                   <View className="border-t border-border/40 pt-4 flex-row items-center justify-between">
                     <Text className="text-muted-foreground text-sm font-medium">Report Delivered</Text>
                   </View>
                )}
              </View>
            </TouchableOpacity>
          )
        })}
      </View>
    </ScrollView>
  );
}
