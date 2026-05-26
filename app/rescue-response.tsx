import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import AppText from '@/components/ui/AppText';
import Card from '@/components/ui/Card';
import PrimaryButton from '@/components/ui/PrimaryButton';
import SecondaryButton from '@/components/ui/SecondaryButton';
import { RESCUE_RESPONSES } from '@/data/mockProgress';
import { FEELING_CONFIG } from '@/components/rescue/RescueFeelingCard';
import { RescueFeeling } from '@/types';
import { useAppStore } from '@/store/useAppStore';
import { Colors, Spacing, Radii, Gradients } from '@/constants/theme';
import { Copy } from '@/constants/copy';

// Custom State Shifting Intervention Components
import KickstartTimer from '@/components/rescue/KickstartTimer';
import InstantRecharge from '@/components/rescue/InstantRecharge';
import BrainDump from '@/components/rescue/BrainDump';
import UrgeSurfer from '@/components/rescue/UrgeSurfer';

type ToolType = 'kickstart' | 'recharge' | 'braindump' | 'urgesurfer';

function getToolForFeeling(feeling: RescueFeeling): ToolType {
  if (feeling === 'laziness' || feeling === 'low-motivation' || feeling === 'feeling-lost') {
    return 'kickstart';
  }
  if (feeling === 'relapse' || feeling === 'sadness') {
    return 'recharge';
  }
  if (feeling === 'anxiety') {
    return 'braindump';
  }
  return 'urgesurfer'; // default for harmful-urge, distraction, loneliness
}

function getToolButtonDetails(tool: ToolType): { label: string; icon: string; colors: readonly [string, string] } {
  switch (tool) {
    case 'kickstart':
      return {
        label: 'Start 2-Min Kickstart (+50 XP)',
        icon: 'flash',
        colors: Gradients.primary,
      };
    case 'recharge':
      return {
        label: 'Start Energy Recharge (+50 XP)',
        icon: 'battery-charging',
        colors: Gradients.success,
      };
    case 'braindump':
      return {
        label: 'Dissolve Looping Thoughts (+50 XP)',
        icon: 'leaf',
        colors: Gradients.purple,
      };
    case 'urgesurfer':
      return {
        label: 'Surf Craving Wave (+50 XP)',
        icon: 'trending-up',
        colors: Gradients.primary,
      };
  }
}

export default function RescueResponseScreen() {
  const { feeling } = useLocalSearchParams<{ feeling: RescueFeeling }>();
  const [activeTool, setActiveTool] = useState<ToolType | null>(null);
  const { addXp, isDarkMode } = useAppStore();

  const activeFeeling = feeling ?? 'laziness';
  const response = RESCUE_RESPONSES[activeFeeling] ?? RESCUE_RESPONSES['laziness'];
  const config = FEELING_CONFIG[activeFeeling];
  const targetTool = getToolForFeeling(activeFeeling);
  const btnDetails = getToolButtonDetails(targetTool);

  const handleToolComplete = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    addXp(50); // Award the promised +50 XP!
    setActiveTool(null);
    router.replace('/(tabs)/today');
  };

  const themeBg = isDarkMode ? '#121214' : Colors.background;

  // If an active shifter tool is launched, render it full screen
  if (activeTool) {
    return (
      <SafeAreaView style={[styles.safe, { backgroundColor: themeBg }]} edges={['top', 'bottom']}>
        <View style={styles.headerBar}>
          <TouchableOpacity onPress={() => setActiveTool(null)} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={22} color={isDarkMode ? '#FFFFFF' : Colors.charcoal} />
          </TouchableOpacity>
          <AppText variant="label" color="primaryBlue">
            {btnDetails.label.split(' (+')[0]}
          </AppText>
          <View style={styles.backBtn} />
        </View>
        <ScrollView 
          style={[styles.toolScroll, { backgroundColor: themeBg }]} 
          contentContainerStyle={styles.toolContent}
          showsVerticalScrollIndicator={false}
        >
          {activeTool === 'kickstart' && (
            <KickstartTimer onComplete={handleToolComplete} onBack={() => setActiveTool(null)} />
          )}
          {activeTool === 'recharge' && (
            <InstantRecharge onComplete={handleToolComplete} onBack={() => setActiveTool(null)} />
          )}
          {activeTool === 'braindump' && (
            <BrainDump onComplete={handleToolComplete} onBack={() => setActiveTool(null)} />
          )}
          {activeTool === 'urgesurfer' && (
            <UrgeSurfer onComplete={handleToolComplete} onBack={() => setActiveTool(null)} />
          )}
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: themeBg }]} edges={['top', 'bottom']}>
      <View style={styles.headerBar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={isDarkMode ? '#FFFFFF' : Colors.charcoal} />
        </TouchableOpacity>
        <AppText variant="label" color="primaryBlue">
          {Copy.rescue.header}
        </AppText>
        <View style={styles.backBtn} />
      </View>

      <ScrollView 
        style={[styles.scroll, { backgroundColor: themeBg }]} 
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Feeling badge */}
        <View style={styles.feelingBadge}>
          <AppText style={styles.feelingEmoji}>{config?.emoji}</AppText>
          <AppText variant="small" color="primaryBlue">
            {config?.label}
          </AppText>
        </View>

        {/* Main message */}
        <View style={styles.messageBlock}>
          <AppText variant="h1" style={styles.pause}>
            {Copy.rescue.responseTitle}
          </AppText>
          <AppText variant="body" style={styles.messageBody}>
            {response.message}
          </AppText>
        </View>

        {/* Action card */}
        <Card style={styles.actionCard} variant="highlighted">
          <AppText variant="label" color="primaryBlue" style={styles.actionLabel}>
            {Copy.rescue.actionTitle}
          </AppText>
          <AppText variant="bodyMedium" style={styles.actionText}>
            {response.action}
          </AppText>
        </Card>

        {/* English support quote */}
        <AppText variant="body" align="center" style={styles.supportQuote}>
          {Copy.rescue.englishSupport}
        </AppText>

        {/* Interactive Active Intervention Launcher */}
        <TouchableOpacity
          style={styles.launchBtn}
          onPress={() => setActiveTool(targetTool)}
        >
          <LinearGradient
            colors={btnDetails.colors}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.launchGradient}
          >
            <Ionicons name={btnDetails.icon as any} size={20} color={Colors.white} />
            <AppText variant="bodyMedium" style={styles.launchBtnText}>
              {btnDetails.label}
            </AppText>
          </LinearGradient>
        </TouchableOpacity>

        {/* Buttons */}
        <View style={styles.buttons}>
          <SecondaryButton
            title={Copy.rescue.writeNote}
            onPress={() => {
              router.replace('/note-new');
            }}
            variant="outline"
          />
          <TouchableOpacity onPress={() => router.replace('/(tabs)/today')}>
            <AppText variant="small" color="muted" align="center">
              {Copy.rescue.backToToday}
            </AppText>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
  },
  backBtn: { width: 36 },
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.xl,
    gap: Spacing.xl,
    paddingBottom: Spacing.xxl,
  },
  toolScroll: {
    flex: 1,
  },
  toolContent: {
    paddingHorizontal: Spacing.base,
    paddingBottom: Spacing.xxl,
  },
  feelingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.blueLight,
    alignSelf: 'flex-start',
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.sm,
    borderRadius: Radii.full,
  },
  feelingEmoji: {
    fontSize: 18,
  },
  messageBlock: {
    gap: Spacing.sm,
  },
  pause: {
    letterSpacing: -0.3,
  },
  messageBody: {
    lineHeight: 24,
  },
  actionCard: {
    gap: Spacing.sm,
  },
  actionLabel: {
    marginBottom: Spacing.xs,
  },
  actionText: {
    lineHeight: 24,
  },
  supportQuote: {
    fontStyle: 'italic',
    lineHeight: 22,
    color: Colors.charcoalSoft,
    paddingHorizontal: Spacing.md,
  },
  launchBtn: {
    width: '100%',
    borderRadius: Radii.lg,
    overflow: 'hidden',
    marginTop: Spacing.base,
  },
  launchGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs,
    paddingVertical: Spacing.md,
  },
  launchBtnText: {
    color: Colors.white,
    fontWeight: '700',
  },
  buttons: {
    gap: Spacing.sm,
    marginTop: Spacing.lg,
    paddingBottom: Spacing.lg,
  },
});
