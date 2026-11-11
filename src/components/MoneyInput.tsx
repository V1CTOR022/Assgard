import { View, Text, StyleSheet, TextInput, type StyleProp, type ViewStyle } from "react-native";

import { formatBRL } from "../utils/format";
import { appColors } from "../theme/colors";
import { sharedStyles } from "../theme/styles";

const MAX_DIGITS = 11;

export const onlyDigits = (text: string) =>
  text.replace(/\D/g, "").replace(/^0+/, "").slice(0, MAX_DIGITS);

export const digitsToValue = (digits: string) => Number(digits || "0") / 100;

interface MoneyInputProps {
  digits: string;
  onChangeDigits: (digits: string) => void;
  hasError?: boolean;
  autoFocus?: boolean;
  style?: StyleProp<ViewStyle>;
}

export default function MoneyInput({
  digits,
  onChangeDigits,
  hasError,
  autoFocus,
  style,
}: MoneyInputProps) {
  return (
    <View style={[styles.field, hasError && sharedStyles.formInputError, style]}>
      <Text style={styles.currency}>R$</Text>
      <Text style={[styles.amount, !digits && styles.placeholder]}>
        {digits ? formatBRL(digitsToValue(digits)) : "0,00"}
      </Text>

      <TextInput
        style={styles.hiddenInput}
        keyboardType="number-pad"
        value={digits}
        onChangeText={(text) => onChangeDigits(onlyDigits(text))}
        caretHidden
        autoFocus={autoFocus}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  field: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    height: 60,
    paddingHorizontal: 16,
    borderRadius: 16,
    backgroundColor: appColors.chromeLight,
    borderWidth: 1,
    borderColor: appColors.strokeLight,
  },
  currency: {
    fontSize: 20,
    fontWeight: "bold",
    color: appColors.sub,
  },
  amount: {
    flex: 1,
    fontSize: 28,
    fontWeight: "bold",
    color: appColors.surfaceText,
    fontVariant: ["tabular-nums"],
  },
  placeholder: {
    color: appColors.sub,
  },
  hiddenInput: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0,
  },
});
