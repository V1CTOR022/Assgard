import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { StatusBar } from "expo-status-bar";

import PasswordInput from "./PasswordInput";
import { authColors } from "../theme/colors";

export function AuthLayout({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <StatusBar style="dark" />

      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Image source={require("../assets/logo.png")} style={styles.image} />
        <Text style={styles.title}>{title}</Text>

        {children}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      {children}
      {error ? (
        <Text style={styles.errorText} accessibilityLiveRegion="polite">
          {error}
        </Text>
      ) : null}
    </View>
  );
}

interface EmailProps {
  value: string;
  error?: string;
  onChangeText: (text: string) => void;
}

export function EmailField({ value, error, onChangeText }: EmailProps) {
  return (
    <Field label="Email" error={error}>
      <TextInput
        style={[styles.input, error ? styles.inputError : null]}
        placeholder="Digite seu email"
        placeholderTextColor={authColors.placeholder}
        value={value}
        onChangeText={onChangeText}
        keyboardType="email-address"
        autoCapitalize="none"
      />
    </Field>
  );
}

interface PasswordProps {
  label: string;
  placeholder: string;
  value: string;
  error?: string;
  onChangeText: (text: string) => void;
}

export function PasswordField({
  label,
  placeholder,
  value,
  error,
  onChangeText,
}: PasswordProps) {
  return (
    <Field label={label} error={error}>
      <PasswordInput
        placeholder={placeholder}
        hasError={Boolean(error)}
        value={value}
        onChangeText={onChangeText}
      />
    </Field>
  );
}

export function AuthLink({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <Text style={styles.link} onPress={onPress}>
      {label}
    </Text>
  );
}

export function AuthButton({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Text style={styles.buttonText}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: authColors.background,
  },
  container: {
    flexGrow: 1,
    justifyContent: "flex-start",
    paddingTop: 100,
    padding: 20,
    paddingBottom: 60,
  },
  image: {
    width: 200,
    height: 200,
    alignSelf: "center",
    marginBottom: 20,
  },
  title: {
    color: authColors.text,
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 30,
    textAlign: "center",
  },
  field: {
    marginBottom: 15,
  },
  label: {
    color: authColors.text,
    marginBottom: 5,
    fontSize: 16,
  },
  input: {
    width: "100%",
    height: 45,
    borderWidth: 1,
    borderColor: authColors.border,
    borderRadius: 8,
    paddingHorizontal: 10,
  },
  inputError: {
    borderColor: authColors.error,
  },
  errorText: {
    color: authColors.error,
    fontSize: 13,
    marginTop: 6,
  },
  link: {
    color: authColors.text,
    marginBottom: 10,
    textAlign: "center",
  },
  button: {
    width: "100%",
    height: 45,
    backgroundColor: authColors.actionBg,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    marginTop: 10,
  },
  buttonText: {
    color: authColors.actionText,
    fontSize: 16,
    fontWeight: "bold",
  },
});
