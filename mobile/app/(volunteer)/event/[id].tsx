import { View, Text, ScrollView, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useAppStore } from '../../../src/lib/store';
import { Calendar, MapPin, Users, ChevronLeft, CheckCircle2 } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { getEventById, createApplication } from '../../../lib/db-service';
import { auth } from '../../../lib/firebase';

export default function EventDetail() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);

  const appliedEvents = useAppStore(state => state.appliedEvents);
  const applyToEvent = useAppStore(state => state.applyForEvent);

  useEffect(() => {
    getEventById(id as string).then(e => {
        setEvent(e);
        setLoading(false);
    });
  }, [id]);

  if (loading) return <View className="flex-1 items-center justify-center bg-background"><ActivityIndicator size="large" color="#0f5238"/></View>;
  if (!event) return <View className="flex-1 items-center justify-center bg-background"><Text>Event not found</Text></View>;

  const applied = appliedEvents.includes(event.id);
  const isCompleted = event.status === 'completed';

  const handleApply = async () => {
    if (!auth?.currentUser) return alert("Please log in first!");
    setApplying(true);
    try {
      await createApplication(event.id, auth.currentUser.uid);
      applyToEvent(event.id);
    } catch(e) {
      alert("Failed to apply");
    } finally {
      setApplying(false);
    }
  };

  return (
    <View className="flex-1 bg-background relative">
      <ScrollView className="flex-1" bounces={false}>
        <View className="h-72 w-full relative">
          <Image source={{ uri: event.bannerImageUrl }} className="w-full h-full" />
          <View className="absolute inset-0 bg-black/40" />
          
          <TouchableOpacity 
            className="absolute top-14 left-4 w-10 h-10 bg-black/30 rounded-full items-center justify-center border border-white/20"
            onPress={() => router.back()}
          >
            <ChevronLeft color="white" size={24} />
          </TouchableOpacity>

          <View className="absolute bottom-6 left-6 right-6">
            <View className="bg-primary px-3 py-1 self-start rounded mb-3">
              <Text className="text-primary-foreground font-bold text-[10px] uppercase tracking-widest">
                {isCompleted ? 'Completed' : 'Upcoming'}
              </Text>
            </View>
            <Text className="text-white font-bold text-3xl mb-1" style={{ fontFamily: 'Georgia' }}>{event.title}</Text>
          </View>
        </View>

        <View className="p-6">
          <View className="flex-row items-center gap-4 border-b border-border/50 pb-6 mb-6">
            <View className="flex-1 bg-surface p-3 rounded-xl border border-border items-center">
              <Calendar size={20} color="#0f5238" className="mb-2" />
              <Text className="text-[10px] uppercase font-bold text-muted-foreground mb-1">Date</Text>
              <Text className="text-sm font-bold text-foreground text-center">
                {new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </Text>
            </View>
            <View className="flex-1 bg-surface p-3 rounded-xl border border-border items-center">
              <MapPin size={20} color="#0f5238" className="mb-2" />
              <Text className="text-[10px] uppercase font-bold text-muted-foreground mb-1">Location</Text>
              <Text className="text-sm font-bold text-foreground text-center" numberOfLines={1}>
                {event.location.split(',')[0]}
              </Text>
            </View>
            <View className="flex-1 bg-surface p-3 rounded-xl border border-border items-center">
              <Users size={20} color="#0f5238" className="mb-2" />
              <Text className="text-[10px] uppercase font-bold text-muted-foreground mb-1">Volunteers</Text>
              <Text className="text-sm font-bold text-foreground text-center">
                {event.volunteerCount}/{event.maxVolunteers || '∞'}
              </Text>
            </View>
          </View>

          <Text className="text-xl font-bold text-foreground mb-4" style={{ fontFamily: 'Georgia' }}>About the Initiative</Text>
          <Text className="text-base text-muted-foreground leading-relaxed mb-6">
            {event.longDescription || event.description}
          </Text>

          {isCompleted && (
             <View className="bg-surface border border-border rounded-xl p-5 mb-8">
               <View className="flex-row items-center mb-3">
                 <CheckCircle2 color="#0f5238" size={20} />
                 <Text className="font-bold text-lg ml-2" style={{ fontFamily: 'Georgia' }}>Event Report</Text>
               </View>
               <Text className="text-muted-foreground italic mb-4">"The event was successfully completed."</Text>
             </View>
          )}

          <View className="h-20" />
        </View>
      </ScrollView>

      {!isCompleted && (
        <View className="absolute bottom-0 left-0 right-0 p-6 bg-background border-t border-border/50">
          {applied ? (
             <View className="bg-green-100 p-4 rounded-xl flex-row items-center justify-center">
               <CheckCircle2 color="#166534" size={20} />
               <Text className="text-green-800 font-bold ml-2">You've applied!</Text>
             </View>
          ) : (
            <TouchableOpacity 
              className="bg-primary py-4 rounded-xl items-center shadow-sm"
              onPress={handleApply}
              disabled={applying}
            >
              <Text className="text-primary-foreground font-bold text-lg">{applying ? 'Applying...' : 'Apply as Volunteer'}</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
}
