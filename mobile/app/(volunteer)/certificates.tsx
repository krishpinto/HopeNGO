import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { MOCK_CERTIFICATES } from '../../src/lib/mock-data';
import { Award, Download, Eye } from 'lucide-react-native';

export default function VolunteerCertificates() {
  const myCertificates = MOCK_CERTIFICATES;

  return (
    <ScrollView className="flex-1 bg-background p-6">
      <View className="mb-6">
        <Text className="text-muted-foreground text-sm">Your verified participation certificates from completed initiatives.</Text>
      </View>

      <View className="gap-4 pb-12">
        {myCertificates.map(cert => (
          <View key={cert.id} className="bg-surface border border-border rounded-xl p-5 shadow-sm mb-2">
            <View className="flex-row gap-4 mb-4">
              <View className="w-12 h-12 bg-primary/10 rounded-full items-center justify-center">
                <Award color="#047857" size={24} />
              </View>
              <View className="flex-1 justify-center">
                <Text className="font-heading font-bold text-lg text-foreground leading-tight" style={{ fontFamily: 'Georgia' }}>{cert.eventTitle}</Text>
                <Text className="text-xs text-muted-foreground mt-1 tracking-wider uppercase font-medium">Issued: {new Date(cert.date).toLocaleDateString()}</Text>
              </View>
            </View>
            
            <View className="flex-row gap-3 pt-4 border-t border-border/40">
              <TouchableOpacity 
                className="flex-1 flex-row items-center gap-2 justify-center bg-surface-container-highest py-2.5 rounded-lg border border-border/50"
                onPress={() => Alert.alert('Certificate Preview', `Certificate of Excellence\n\nAwarded to ${cert.recipientName}\nfor ${cert.eventTitle}`)}
              >
                <Eye size={16} color="#047857" />
                <Text className="font-bold text-sm text-foreground">View PDF</Text>
              </TouchableOpacity>
              
              <TouchableOpacity className="flex-1 flex-row items-center gap-2 justify-center bg-primary py-2.5 rounded-lg border border-transparent">
                <Download size={16} color="#ffffff" />
                <Text className="font-bold text-sm text-primary-foreground">Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}
