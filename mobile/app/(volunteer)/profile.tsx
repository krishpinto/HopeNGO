import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useAppStore } from '../../src/lib/store';
import { User, Shield, LogOut, Settings } from 'lucide-react-native';

export default function VolunteerProfile() {
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
          <Text className="text-2xl font-bold text-foreground" style={{ fontFamily: 'Georgia' }}>Volunteer User</Text>
          <Text className="text-muted-foreground mt-1">volunteer@hopengo.org</Text>
          
          <View className="bg-primary/10 px-3 py-1 rounded-full mt-3 flex-row items-center gap-1.5">
             <Shield color="#047857" size={12} />
             <Text className="text-primary font-bold text-xs">Clearance Level 2 Verified</Text>
          </View>
       </View>

       <View className="bg-surface rounded-xl border border-border shadow-sm overflow-hidden mb-8">
          <TouchableOpacity className="p-4 border-b border-border/50 flex-row items-center justify-between">
             <View className="flex-row items-center gap-3">
                <Settings color="#78716c" size={20} />
                <Text className="font-medium text-foreground">Account Settings</Text>
             </View>
          </TouchableOpacity>
          <TouchableOpacity className="p-4 flex-row items-center justify-between">
             <View className="flex-row items-center gap-3">
                <Shield color="#78716c" size={20} />
                <Text className="font-medium text-foreground">Privacy & Clearances</Text>
             </View>
          </TouchableOpacity>
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
