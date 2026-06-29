import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TextInputProps,
  StyleSheet,
  StyleProp,
  ViewStyle,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors, FontSize, Spacing, Radius } from "@/lib/theme";

import { useThemedStyles } from "@/lib/useTheme";
interface Props extends TextInputProps {
  label?: string;
  icon?: keyof typeof Ionicons.glyphMap;
  required?: boolean;
  hint?: string;
  containerStyle?: StyleProp<ViewStyle>;
}

/**
 * Labelled text input with optional leading icon and an animated amber
 * focus ring. The shared field primitive for every form in the app.
 */
export function Field({
  label,
  icon,
  required,
  hint,
  containerStyle,
  style,
  multiline,
  onFocus,
  onBlur,
  ...rest
}: Props) {
  const styles = useThemedStyles(makeStyles);
  const [focused, setFocused] = useState(false);

  return (
    <View style={[styles.wrap, containerStyle]}>
      {label ? (
        <Text style={styles.label}>
          {label}
          {required ? <Text style={styles.req}> *</Text> : null}
        </Text>
      ) : null}
      <View
        style={[
          styles.inputWrap,
          multiline && styles.inputWrapMultiline,
          focused && styles.inputWrapFocused,
        ]}
      >
        {icon ? (
          <Ionicons
            name={icon}
            size={18}
            color={focused ? Colors.accent : Colors.inkMuted}
            style={[styles.icon, multiline && styles.iconMultiline]}
          />
        ) : null}
        <TextInput
          style={[styles.input, multiline && styles.inputMultiline, style]}
          placeholderTextColor={Colors.inkMuted}
          multiline={multiline}
          textAlignVertical={multiline ? "top" : "center"}
          selectionColor={Colors.accent}
          onFocus={(e) => {
            setFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            onBlur?.(e);
          }}
          {...rest}
        />
      </View>
      {hint ? <Text style={styles.hint}>{hint}</Text> : null}
    </View>
  );
}

const makeStyles = () => StyleSheet.create({
  wrap: { marginTop: Spacing.lg },
  label: {
    fontSize: FontSize.sm,
    fontWeight: "600",
    color: Colors.inkSecondary,
    marginBottom: Spacing.sm,
    letterSpacing: 0.2,
  },
  req: { color: Colors.accent },
  inputWrap: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.surfaceSunken,
    borderRadius: Radius.md,
    borderWidth: 1.5,
    borderColor: "transparent",
    paddingHorizontal: Spacing.md,
  },
  inputWrapMultiline: { alignItems: "flex-start" },
  inputWrapFocused: {
    borderColor: Colors.accent,
    backgroundColor: Colors.surface,
  },
  icon: { marginRight: Spacing.sm },
  iconMultiline: { marginTop: Spacing.md },
  input: {
    flex: 1,
    paddingVertical: Spacing.md,
    fontSize: FontSize.base,
    color: Colors.ink,
  },
  inputMultiline: { minHeight: 88 },
  hint: {
    fontSize: FontSize.xs,
    color: Colors.inkMuted,
    marginTop: Spacing.xs,
    marginLeft: Spacing.xs,
  },
});
