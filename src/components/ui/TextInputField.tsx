import React, { useState } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  TextInputProps,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, Radii } from '@/constants/theme';
import { useAppStore } from '@/store/useAppStore';
import AppText from './AppText';

interface TextInputFieldProps extends TextInputProps {
  label?: string;
  error?: string;
  containerStyle?: ViewStyle;
  isPassword?: boolean;
}

export default function TextInputField({
  label,
  error,
  containerStyle,
  isPassword = false,
  style,
  ...props
}: TextInputFieldProps) {
  const [showPassword, setShowPassword] = useState(false);
  const isDarkMode = useAppStore((state) => state.isDarkMode);

  // Dynamic theme colors for text fields
  const inputBg = isDarkMode ? '#121214' : Colors.card;
  const inputBorder = isDarkMode ? '#2C2C2E' : Colors.border;
  const inputColor = isDarkMode ? '#FFFFFF' : Colors.charcoal;
  const placeholderColor = isDarkMode ? '#8E8E93' : Colors.muted;

  return (
    <View style={[styles.container, containerStyle]}>
      {label ? (
        <AppText variant="small" style={styles.label}>
          {label}
        </AppText>
      ) : null}
      <View style={[
        styles.inputRow,
        { backgroundColor: inputBg, borderColor: inputBorder },
        error ? styles.inputError : null
      ]}>
        <TextInput
          style={[styles.input, { color: inputColor }, style]}
          placeholderTextColor={placeholderColor}
          secureTextEntry={isPassword && !showPassword}
          autoCapitalize="none"
          {...props}
        />
        {isPassword ? (
          <TouchableOpacity
            onPress={() => setShowPassword((v) => !v)}
            style={styles.eyeBtn}
          >
            <Ionicons
              name={showPassword ? 'eye-off-outline' : 'eye-outline'}
              size={20}
              color={placeholderColor}
            />
          </TouchableOpacity>
        ) : null}
      </View>
      {error ? (
        <AppText variant="caption" style={styles.errorText}>
          {error}
        </AppText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.md,
  },
  label: {
    marginBottom: Spacing.xs,
    fontWeight: '500',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: Radii.md,
    paddingHorizontal: Spacing.base,
    minHeight: 52,
  },
  inputError: {
    borderColor: '#FF3B30',
  },
  input: {
    flex: 1,
    fontSize: Typography.base,
    paddingVertical: Spacing.md,
  },
  eyeBtn: {
    padding: Spacing.xs,
  },
  errorText: {
    color: '#FF3B30',
    marginTop: Spacing.xs,
  },
});
