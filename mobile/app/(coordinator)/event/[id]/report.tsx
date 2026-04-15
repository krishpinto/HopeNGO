import { View, Text, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { useAppStore } from '../../../../src/lib/store';
import { CheckCircle2, UploadCloud } from 'lucide-react-native';

export default function CoordinatorEventReport() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const submitCoordinatorReport = useAppStore(state => state.submitCoordinatorReport);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = () => {
    setIsSubmitted(true);
    submitCoordinatorReport(id as string);
    setTimeout(() => {
      router.replace('/(coordinator)/dashboard');
    }, 2500);
  };

  if (isSubmitted) {
    return (
      <View className="flex-1 bg-background items-center justify-center p-8">
         <View className="items-center mb-6">
            <CheckCircle2 color="#047857" size={64} />
         </View>
         <Text className="text-3xl font-heading font-bold text-foreground mb-4 text-center" style={{ fontFamily: 'Georgia' }}>Report Submitted</Text>
         <Text className="text-muted-foreground text-center leading-relaxed">
           Thank you. The execution dataset has been securely uploaded to the HopeNGO operational archive. It will be validated by the global board.
         </Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background">
      <ScrollView className="flex-1" contentContainerStyle={{ padding: 24, paddingBottom: 100 }}>
         
         <View className="mb-8">
            <Text className="text-xl font-bold text-foreground">Post-Event Summary</Text>
            <Text className="text-sm text-muted-foreground mt-1">Please provide accurate metrics to help quantify impact.</Text>
         </View>

         <View className="gap-6">
            <View>
              <Text className="font-bold text-sm mb-2 text-foreground">Activities Conducted</Text>
              <TextInput 
                className="bg-surface border border-border rounded-xl p-4 min-h-[100px] shadow-sm text-foreground"
                placeholder="Briefly summarize primary tasks accomplished..."
                placeholderTextColor="#a8a29e"
                multiline
                textAlignVertical="top"
              />
            </View>

            <View>
              <Text className="font-bold text-sm mb-2 text-foreground">Challenges</Text>
              <TextInput 
                className="bg-surface border border-border rounded-xl p-4 min-h-[80px] shadow-sm text-foreground"
                placeholder="Logistical blocks, volunteer drop-offs..."
                placeholderTextColor="#a8a29e"
                multiline
                textAlignVertical="top"
              />
            </View>

            <View>
              <Text className="font-bold text-sm mb-2 text-foreground">Upload Visual Evidence</Text>
              <TouchableOpacity className="bg-surface border-2 border-dashed border-border rounded-xl p-8 items-center justify-center shadow-sm">
                 <UploadCloud color="#047857" size={32} />
                 <Text className="font-bold text-primary mt-2">Tap to select photos</Text>
                 <Text className="text-xs text-muted-foreground mt-1">JPEG, PNG only</Text>
              </TouchableOpacity>
            </View>
         </View>

      </ScrollView>

      <View className="absolute bottom-0 left-0 right-0 bg-surface border-t border-border/50 p-6 shadow-[0_-4px_6px_rgba(0,0,0,0.02)]">
        <TouchableOpacity 
          className="bg-primary py-4 rounded-xl items-center"
          onPress={handleSubmit}
        >
          <Text className="text-primary-foreground font-bold text-lg">Finalize & Submit Report</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
