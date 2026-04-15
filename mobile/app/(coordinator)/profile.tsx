import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useAppStore } from '../../src/lib/store';
import { User, LogOut } from 'lucide-react-native';

export default function CoordinatorProfile() {
  const router = useRouter();
  const setRole = useAppStore(state => state.setRole);

  const handleLogout = () => {
    setRole(null);
    router.replace('/');
  };

  return (
    <ScrollView className="flex-1 bg-background p-6">
       <View className="items-center mb-8 mt-4">
          <View className="w-24 h-24 bg-primary/10 rounded-full items-center justify-center mb-4">
             <User color="#047857" size={40} />
          </View>
          <Text className="text-2xl font-bold text-foreground" style={{ fontFamily: 'Georgia' }}>Coordinator User</Text>
          <Text className="text-muted-foreground mt-1">coordinator@hopengo.org</Text>
       </View>

       <TouchableOpacity 
         className="bg-red-50 py-4 rounded-xl items-center border border-red-100 flex-row justify-center gap-2 shadow-sm"
         onPress={handleLogout}
       >
         <LogOut color="#dc2626" size={18} />
         <Text className="text-red-600 font-bold text-lg">Log Out & Return to Demo Menu</Text>
       </TouchableOpacity>
    </ScrollView>
  );
}
