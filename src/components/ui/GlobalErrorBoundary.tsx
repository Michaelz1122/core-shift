import React, { ErrorInfo } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Updates from 'expo-updates';
import { Ionicons } from '@expo/vector-icons';
import AppText from '@/components/ui/AppText';
import PrimaryButton from '@/components/ui/PrimaryButton';
import SecondaryButton from '@/components/ui/SecondaryButton';
import { Colors, Spacing, Radii } from '@/constants/theme';
import * as Clipboard from 'expo-clipboard';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class GlobalErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  handleRestart = async () => {
    try {
      await Updates.reloadAsync();
    } catch (e) {
      // Fallback if Updates API is not available in development
      console.error('Reload failed, likely in dev mode', e);
    }
  };

  handleResetData = async () => {
    try {
      await AsyncStorage.clear();
      await Updates.reloadAsync();
    } catch (e) {
      console.error('Reset failed', e);
    }
  };

  handleCopyDebug = async () => {
    const debugText = `App Version: 1.0.0\nStore Version: v2\nError: ${this.state.error?.message}\nStack: ${this.state.error?.stack}`;
    await Clipboard.setStringAsync(debugText);
    alert('Copied to clipboard');
  };

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.container}>
          <ScrollView contentContainerStyle={styles.content}>
            <Ionicons name="warning" size={64} color={Colors.red} style={styles.icon} />
            
            <AppText variant="h1" align="center" style={styles.title}>
              We ran into a problem.
            </AppText>
            
            <AppText variant="body" align="center" color="muted" style={styles.subtitle}>
              CoreShift encountered a critical error. You can try restarting, or resetting your local data if the issue persists.
            </AppText>

            <View style={styles.debugBox}>
              <AppText variant="caption" style={styles.debugTitle}>Debug Information</AppText>
              <AppText variant="caption" color="muted">App Version: 1.0.0</AppText>
              <AppText variant="caption" color="muted">Store Version: v2</AppText>
              <AppText variant="caption" color="red" style={styles.errorText}>
                {this.state.error?.message || 'Unknown error'}
              </AppText>
            </View>

            <View style={styles.actions}>
              <PrimaryButton title="Restart App" onPress={this.handleRestart} />
              <SecondaryButton title="Copy Debug Info" onPress={this.handleCopyDebug} />
              <SecondaryButton title="Reset Local Data (Wipe Progress)" onPress={this.handleResetData} style={styles.resetBtn} />
            </View>
          </ScrollView>
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: Spacing.xl,
  },
  icon: {
    alignSelf: 'center',
    marginBottom: Spacing.lg,
  },
  title: {
    fontWeight: '800',
    marginBottom: Spacing.sm,
  },
  subtitle: {
    marginBottom: Spacing.xl,
    lineHeight: 22,
  },
  debugBox: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    padding: Spacing.md,
    borderRadius: Radii.md,
    marginBottom: Spacing.xl,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  debugTitle: {
    fontWeight: '700',
    marginBottom: Spacing.xs,
  },
  errorText: {
    marginTop: Spacing.sm,
  },
  actions: {
    gap: Spacing.md,
  },
  resetBtn: {
    borderColor: Colors.red,
  },
});
