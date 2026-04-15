import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { MOCK_VOLUNTEER_APPLICATIONS, MOCK_USERS } from '../../../../src/lib/mock-data';
import { CheckSquare, UserCircle } from 'lucide-react-native';

export default function CoordinatorVolunteerRoster() {
  const { id } = useLocalSearchParams<{ id: string }>();

  // Use dummy applications mapping.
  const applications = MOCK_VOLUNTEER_APPLICATIONS.filter(a => a.eventId === id);
  const mockRoster = applications.map(app => {
    const user = MOCK_USERS.find(u => u.id === app.volunteerId) || MOCK_USERS[1];
    return { ...app, user };
  });

  const extendedRoster = [...mockRoster];
  if (extendedRoster.length < 5) {
     for(let i=0; i<8; i++) {
         extendedRoster.push({
             id: `m-${i}`, eventId: id as string, volunteerId: `v-${i}`, status: 'approved',
             user: { id: `uv-${i}`, name: `Local Volunteer ${i+1}`, email: `vol${i}@example.com`, role: 'volunteer', isApproved: true }
         })
     }
  }

  return (
    <View className="flex-1 bg-background">
      <View className="p-6 pb-2">
         <Text className="text-sm text-muted-foreground">Confirm attendance to populate the internal metrics tracking.</Text>
      </View>
      <FlatList
        data={extendedRoster}
        keyExtractor={item => item.id}
        contentContainerStyle={{ padding: 24, paddingTop: 8, gap: 12 }}
        renderItem={({ item }) => (
          <View className="bg-surface rounded-xl p-4 border border-border shadow-sm flex-row items-center gap-4">
             <View className="w-10 h-10 bg-surface-container-low rounded-full items-center justify-center">
                <UserCircle color="#047857" size={24} />
             </View>
             <View className="flex-1">
                <Text className="font-bold text-foreground">{item.user.name}</Text>
                <Text className="text-xs text-muted-foreground">{item.user.email}</Text>
             </View>
             <TouchableOpacity className="border border-border/50 px-3 py-2 rounded-md flex-row items-center gap-1.5 active:bg-muted">
                <Text className="text-xs font-bold text-muted-foreground">Verify Px.</Text>
             </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}
