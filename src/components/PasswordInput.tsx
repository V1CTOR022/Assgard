import { useState } from "react";
import { View, TextInput, StyleSheet, type StyleProp, type ViewStyle } from "react-native";
import { Feather } from "@expo/vector-icons";

import Bounce from "./Bounce";
import { authColors } from "../theme/colors";

interface PasswordInputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  hasError?: boolean;
  style?: StyleProp<ViewStyle>;
}

export default function PasswordInput({
  value,
  onChangeText,
  placeholder,
  hasError,
  style,
}: PasswordInputProps) {
  const [visible, setVisible] = useState(false);

  return (
    <View style={[styles.field, hasError && styles.fieldError, style]}>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor={authColors.placeholder}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={!visible}
        autoCapitalize="none"
        autoCorrect={false}
        textContentType="password"
        autoComplete="password"
      />

      <Bounce
        onPress={() => setVisible((current) => !current)}
        accessibilityLabel={visible ? "Ocultar senha" : "Mostrar senha"}
      >
        <Feather
          name={visible ? "eye-off" : "eye"}
          size={18}
          color={authColors.muted}
        />
      </Bounce>
    </View>
  );
}

const styles = StyleSheet.create({
  field: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    height: 45,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: authColors.border,
    borderRadius: 8,
  },
  fieldError: {
    borderColor: authColors.error,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: authColors.text,
    padding: 0,
  },
});
