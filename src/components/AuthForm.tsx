import { useState, type ReactNode } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Feather, FontAwesome } from "@expo/vector-icons";

import Bounce from "./Bounce";
import GoogleLogo from "./GoogleLogo";
import { authColors } from "../theme/colors";

interface LayoutProps {
  title: string;
  subtitle: string;
  children: ReactNode;
}

export function AuthLayout({ title, subtitle, children }: LayoutProps) {
  const insets = useSafeAreaInsets();

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <StatusBar style="dark" />

      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingTop: insets.top + 20, paddingBottom: insets.bottom + 40 },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Image source={require("../assets/logo.png")} style={styles.logo} />

        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>

        <View style={styles.form}>{children}</View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

interface FieldProps {
  icon: ReactNode;
  error?: string;
  trailing?: ReactNode;
  children: ReactNode;
}

function Field({ icon, error, trailing, children }: FieldProps) {
  return (
    <View>
      <View style={[styles.field, error ? styles.fieldError : null]}>
        <View style={styles.fieldIcon}>{icon}</View>
        <View style={styles.fieldRule} />
        {children}
        {trailing}
      </View>

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
    <Field icon={<Feather name="mail" size={17} color={authColors.subtext} />} error={error}>
      <TextInput
        style={styles.input}
        placeholder="Seu email"
        placeholderTextColor={authColors.placeholder}
        value={value}
        onChangeText={onChangeText}
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
      />
    </Field>
  );
}

interface PasswordProps {
  placeholder: string;
  value: string;
  error?: string;
  onChangeText: (text: string) => void;
}

export function PasswordField({ placeholder, value, error, onChangeText }: PasswordProps) {
  const [visible, setVisible] = useState(false);

  return (
    <Field
      icon={<Feather name="lock" size={17} color={authColors.subtext} />}
      error={error}
      trailing={
        <Bounce
          onPress={() => setVisible((current) => !current)}
          accessibilityLabel={visible ? "Ocultar senha" : "Mostrar senha"}
        >
          <Feather
            name={visible ? "eye" : "eye-off"}
            size={17}
            color={authColors.subtext}
          />
        </Bounce>
      }
    >
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
    </Field>
  );
}

export function AuthButton({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <Bounce style={styles.action} onPress={onPress} accessibilityLabel={label}>
      <Text style={styles.actionLabel}>{label}</Text>
      <Feather name="arrow-right" size={18} color={authColors.actionText} />
    </Bounce>
  );
}

export function AuthMessage({ text }: { text?: string }) {
  if (!text) return null;

  return (
    <View style={styles.message}>
      <Feather name="info" size={15} color={authColors.subtext} />
      <Text style={styles.messageText} accessibilityLiveRegion="polite">
        {text}
      </Text>
    </View>
  );
}

export function AuthDivider() {
  return (
    <View style={styles.divider}>
      <View style={styles.dividerRule} />
      <Text style={styles.dividerLabel}>ou</Text>
      <View style={styles.dividerRule} />
    </View>
  );
}

interface SocialProps {
  provider: "google" | "apple";
  label: string;
  onPress: () => void;
}

export function SocialButton({ provider, label, onPress }: SocialProps) {
  return (
    <Bounce style={styles.social} onPress={onPress} accessibilityLabel={label}>
      {provider === "google" ? (
        <GoogleLogo size={18} />
      ) : (
        <FontAwesome name="apple" size={18} color={authColors.text} />
      )}
      <Text style={styles.socialLabel}>{label}</Text>
    </Bounce>
  );
}

export function AuthFootnote({
  question,
  action,
  onPress,
}: {
  question: string;
  action: string;
  onPress: () => void;
}) {
  return (
    <View style={styles.footnote}>
      <Text style={styles.footnoteText}>{question} </Text>
      <Bounce onPress={onPress} accessibilityLabel={action}>
        <Text style={styles.footnoteAction}>{action}</Text>
      </Bounce>
    </View>
  );
}

export function AuthInlineLink({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <Bounce style={styles.inlineLink} onPress={onPress} accessibilityLabel={label}>
      <Text style={styles.inlineLinkLabel}>{label}</Text>
    </Bounce>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: authColors.background,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: 28,
  },
  logo: {
    width: 124,
    height: 124,
    resizeMode: "contain",
    alignSelf: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: authColors.text,
    textAlign: "center",
    marginTop: 18,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 24,
    color: authColors.subtext,
    textAlign: "center",
    marginTop: 8,
  },
  form: {
    marginTop: 32,
    gap: 14,
  },
  field: {
    flexDirection: "row",
    alignItems: "center",
    height: 58,
    paddingHorizontal: 16,
    borderRadius: 16,
    backgroundColor: authColors.field,
    borderWidth: 1,
    borderColor: authColors.border,
  },
  fieldError: {
    borderColor: authColors.error,
  },
  fieldIcon: {
    width: 24,
    alignItems: "center",
  },
  fieldRule: {
    width: 1,
    height: 22,
    marginHorizontal: 12,
    backgroundColor: authColors.divider,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: authColors.text,
    padding: 0,
  },
  errorText: {
    fontSize: 13,
    color: authColors.error,
    marginTop: 7,
    marginLeft: 4,
  },
  action: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    height: 58,
    borderRadius: 29,
    backgroundColor: authColors.actionBg,
    marginTop: 6,
  },
  actionLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: authColors.actionText,
  },
  message: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 14,
    backgroundColor: authColors.blob,
  },
  messageText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 18,
    color: authColors.subtext,
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    marginVertical: 6,
  },
  dividerRule: {
    flex: 1,
    height: 1,
    backgroundColor: authColors.divider,
  },
  dividerLabel: {
    fontSize: 14,
    color: authColors.subtext,
  },
  social: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    height: 56,
    borderRadius: 16,
    backgroundColor: authColors.field,
    borderWidth: 1,
    borderColor: authColors.border,
  },
  socialLabel: {
    fontSize: 15,
    fontWeight: "600",
    color: authColors.text,
  },
  footnote: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 12,
  },
  footnoteText: {
    fontSize: 14,
    color: authColors.subtext,
  },
  footnoteAction: {
    fontSize: 14,
    fontWeight: "bold",
    color: authColors.text,
  },
  inlineLink: {
    alignSelf: "flex-end",
    marginTop: -4,
  },
  inlineLinkLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: authColors.text,
  },
});
