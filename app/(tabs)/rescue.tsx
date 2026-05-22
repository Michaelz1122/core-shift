import { View, StyleSheet, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppText from '@/components/ui/AppText';
import RescueFeelingCard from '@/components/rescue/RescueFeelingCard';
import { Colors, Spacing } from '@/constants/theme';
import { Copy } from '@/constants/copy';
import { RescueFeeling } from '@/types';

const FEELINGS: RescueFeeling[] = [
  'laziness',
  'distraction',
  'low-motivation',
  'harmful-urge',
  'relapse',
  'sadness',
  'anxiety',
  'loneliness',
  'feeling-lost',
];

export default function RescueScreen() {
  const handleFeeling = (feeling: RescueFeeling) => {
    router.push({ pathname: '/rescue-response', params: { feeling } });
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <AppText variant="label" color="primaryBlue" style={styles.label}>
            {Copy.rescue.header}
          </AppText>
          <AppText variant="h1" style={styles.title}>
            {Copy.rescue.title}
          </AppText>
          <AppText variant="body">{Copy.rescue.subtitle}</AppText>
        </View>

        <View style={styles.feelings}>
          {FEELINGS.map((feeling) => (
            <RescueFeelingCard
              key={feeling}
              feeling={feeling}
              onPress={() => handleFeeling(feeling)}
            />
          ))}
        </View>

        <View style={styles.footer}>
          <AppText variant="caption" color="muted" align="center">
            Rescue Mode is not a substitute for professional support.
          </AppText>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  content: {
    paddingHorizontal: Spacing.base,
    paddingBottom: Spacing.xxxl,
  },
  header: {
    paddingTop: Spacing.xl,
    marginBottom: Spacing.xl,
    gap: Spacing.sm,
  },
  label: {
    marginBottom: Spacing.xs,
  },
  title: {
    letterSpacing: -0.3,
  },
  feelings: {
    gap: 0,
  },
  footer: {
    marginTop: Spacing.xl,
  },
});
