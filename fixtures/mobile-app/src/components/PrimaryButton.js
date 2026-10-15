import { Pressable, StyleSheet, Text } from 'react-native';
import { theme } from '../theme';

export default function PrimaryButton({ label, onPress, disabled }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: Boolean(disabled) }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [styles.button, pressed && styles.pressed, disabled && styles.disabled]}
    >
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: theme.minTouchTarget,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    borderRadius: 6,
    backgroundColor: theme.colors.brand,
  },
  pressed: { opacity: 0.85 },
  disabled: { opacity: 0.5 },
  label: { color: theme.colors.background, fontSize: theme.type.body, fontWeight: '600' },
});
