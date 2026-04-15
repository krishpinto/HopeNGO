import { View, Text, TouchableOpacity, SafeAreaView, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { useAppStore } from '../src/lib/store';

export default function LoginScreen() {
  const router = useRouter();
  const setRole = useAppStore(state => state.setRole);

  const handleLogin = (role: "volunteer" | "coordinator") => {
    setRole(role);
    if (role === "volunteer") {
      router.replace('/(volunteer)/dashboard');
    } else {
      router.replace('/(coordinator)/dashboard');
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1 px-8 justify-center pb-20">
        <View className="mb-12">
          <Text className="text-primary font-bold text-5xl tracking-widest text-center" style={{ fontFamily: 'Georgia' }}>HOPENGO</Text>
          <Text className="text-center text-muted-foreground mt-4 text-base tracking-wide">
            Digital Operations Portal
          </Text>
        </View>

        <View className="bg-surface rounded-2xl p-6 shadow-sm border border-border">
          <Text className="text-xl font-bold mb-6 text-center text-foreground">Select Demo Role</Text>
          
          <TouchableOpacity 
            className="bg-primary py-4 rounded-xl items-center mb-4"
            onPress={() => handleLogin('volunteer')}
          >
            <Text className="text-primary-foreground font-bold text-lg">Enter as Volunteer</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            className="bg-surface border-2 border-primary py-4 rounded-xl items-center"
            onPress={() => handleLogin('coordinator')}
          >
            <Text className="text-primary font-bold text-lg">Enter as Coordinator</Text>
          </TouchableOpacity>
        </View>

        <View className="mt-8">
           <Text className="text-center text-xs text-muted-foreground uppercase opacity-70 tracking-widest">Auth Flow Bypassed for MVP</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}
