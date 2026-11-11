import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";

import ScreenHeader from "../../components/ScreenHeader";
import Bounce from "../../components/Bounce";
import MoneyInput, { digitsToValue } from "../../components/MoneyInput";
import AccountSwitcher from "../../components/AccountSwitcher";
import PillSelector, { type PillOption } from "../../components/PillSelector";
import { useAccounts } from "../../context/AccountsContext";
import { formatBRL } from "../../utils/format";
import { appColors } from "../../theme/colors";
import { sharedStyles } from "../../theme/styles";

type Mode = "entrada" | "saida" | "transferencia";

const MODES: PillOption<Mode>[] = [
  {
    id: "entrada",
    label: "Adicionar",
    renderIcon: (color) => <Feather name="arrow-down-left" size={15} color={color} />,
  },
  {
    id: "saida",
    label: "Retirar",
    renderIcon: (color) => <Feather name="arrow-up-right" size={15} color={color} />,
  },
  {
    id: "transferencia",
    label: "Transferir",
    renderIcon: (color) => <Feather name="repeat" size={15} color={color} />,
  },
];

export default function Transaction({ navigation }: any) {
  const { accounts, account, addTransaction, transfer } = useAccounts();

  const [mode, setMode] = useState<Mode>("entrada");
  const [digits, setDigits] = useState("");
  const [title, setTitle] = useState("");
  const [destinationId, setDestinationId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const isIncome = mode === "entrada";
  const isTransfer = mode === "transferencia";
  const value = digitsToValue(digits);

  const others = accounts.filter((item) => item.id !== account.id);
  const destination = others.find((item) => item.id === destinationId) ?? others[0];

  const destinationOptions: PillOption<string>[] = others.map((item) => ({
    id: item.id,
    label: item.name,
    renderIcon: (color) => (
      <MaterialCommunityIcons name={item.icon} size={18} color={color} />
    ),
  }));

  function handleSubmit() {
    if (value <= 0) {
      setError("Digite um valor");
      return;
    }
    if (!isIncome && value > account.total) {
      setError(`Saldo insuficiente. Disponível: R$ ${formatBRL(account.total)}`);
      return;
    }

    if (isTransfer) {
      if (!destination) {
        setError("Escolha a conta de destino");
        return;
      }
      transfer(value, destination.id, title.trim());
    } else {
      addTransaction(
        isIncome ? value : -value,
        title.trim() || (isIncome ? "Depósito" : "Retirada"),
      );
    }

    navigation.goBack();
  }

  function submitLabel() {
    if (isTransfer) return `Transferir para ${destination?.name ?? "outra conta"}`;
    return isIncome ? "Adicionar à conta" : "Retirar da conta";
  }

  return (
    <View style={sharedStyles.screen}>
      <StatusBar style="light" />

      <ScreenHeader onBack={() => navigation.goBack()}>
        <Text style={sharedStyles.headerTitle}>Movimentar dinheiro</Text>
        <Text style={sharedStyles.headerSubtitle}>{account.name}</Text>
        <Text style={styles.accountTotal}>Saldo atual: R$ {formatBRL(account.total)}</Text>

        <AccountSwitcher style={styles.accountRow} onChange={() => setError(null)} />
      </ScreenHeader>

      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <PillSelector
          options={MODES}
          value={mode}
          onChange={(next) => {
            setMode(next);
            setError(null);
          }}
        />

        {isTransfer ? (
          <>
            <Text style={styles.label}>Para qual conta</Text>
            <PillSelector
              options={destinationOptions}
              value={destination?.id ?? null}
              onChange={(next) => {
                setDestinationId(next);
                setError(null);
              }}
              variant="card"
            />
          </>
        ) : null}

        <Text style={styles.label}>Valor</Text>
        <MoneyInput
          digits={digits}
          onChangeDigits={(next) => {
            setDigits(next);
            if (error) setError(null);
          }}
          hasError={Boolean(error)}
          autoFocus
        />

        {error ? (
          <Text style={sharedStyles.formErrorText} accessibilityLiveRegion="polite">
            {error}
          </Text>
        ) : null}

        <Text style={styles.label}>Nome da transação</Text>
        <TextInput
          style={sharedStyles.formInput}
          placeholder={isTransfer ? "Transferência" : isIncome ? "Depósito" : "Retirada"}
          placeholderTextColor={appColors.sub}
          value={title}
          onChangeText={setTitle}
        />
        <Text style={styles.hint}>Opcional</Text>
      </ScrollView>

      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <Bounce style={styles.submit} onPress={handleSubmit}>
          <Text style={styles.submitLabel}>{submitLabel()}</Text>
        </Bounce>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  accountTotal: {
    fontSize: 14,
    color: appColors.dim,
    marginTop: 10,
    fontVariant: ["tabular-nums"],
  },
  accountRow: {
    marginTop: 20,
  },
  content: {
    paddingHorizontal: 22,
    paddingTop: 28,
    paddingBottom: 120,
  },
  label: {
    fontSize: 14,
    color: appColors.sub,
    marginTop: 28,
    marginBottom: 8,
  },
  hint: {
    fontSize: 12,
    color: appColors.sub,
    marginTop: 8,
  },
  submit: {
    height: 56,
    marginHorizontal: 22,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: appColors.gold,
    marginBottom: 24,
  },
  submitLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: appColors.actionText,
  },
});
