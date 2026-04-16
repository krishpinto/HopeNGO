import { View, Text, ScrollView, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { useAppStore } from '../../src/lib/store';
import { useRouter } from 'expo-router';
import { MapPin } from 'lucide-react-native';
import { getEvents, getVolunteerCertificates } from '../../lib/db-service';
import { useEffect, useState } from 'react';
import { auth } from '../../lib/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';

export default function VolunteerDashboard() {
  const appliedEventsIds = useAppStore(state => state.appliedEvents);
  const router = useRouter();
  
  const [events, setEvents] = useState<any[]>([]);
  const [certs, setCerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function init() {
      // Auto-login volunteer user for MVP demo
      if (!auth?.currentUser) {
        try { await signInWithEmailAndPassword(auth, 'john@example.com', 'password123'); } catch(e) {}
      }
      
      const evts = await getEvents();
      setEvents(evts);
      
      if (auth?.currentUser) {
         const userCerts = await getVolunteerCertificates(auth.currentUser.uid);
         setCerts(userCerts);
      }
      setLoading(false);
    }
    init();
  }, []);

  const myApplications = events.filter(e => appliedEventsIds.includes(e.id));

  if (loading) {
    return <View className="flex-1 items-center justify-center bg-background"><ActivityIndicator size="large" color="#0f5238"/></View>;
  }

  return (
    <ScrollView className="flex-1 bg-background p-6">
      <View className="mb-8 mt-10">
        <Text className="text-3xl font-bold text-foreground" style={{ fontFamily: 'Georgia' }}>Welcome back,</Text>
        <Text className="text-3xl font-bold text-primary" style={{ fontFamily: 'Georgia' }}>Volunteer!</Text>
        <Text className="text-muted-foreground mt-2">Ready to make an impact today?</Text>
      </View>

      <View className="flex-row gap-4 mb-8">
        <View className="flex-1 bg-surface p-4 rounded-xl border border-border shadow-sm">
          <Text className="text-3xl font-bold text-primary">{myApplications.length}</Text>
          <Text className="text-xs uppercase font-bold text-muted-foreground mt-1">Active Apps</Text>
        </View>
        <View className="flex-1 bg-surface p-4 rounded-xl border border-border shadow-sm">
          <Text className="text-3xl font-bold text-primary">{certs.length}</Text>
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

      {myApplications.length === 0 && (
         <Text className="text-muted-foreground italic mb-4">No active applications currently.</Text>
      )}

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
