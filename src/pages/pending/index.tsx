import { useState } from "react";
import { Text, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import { StatusBar } from "expo-status-bar";
import Animated, { FadeInDown } from "react-native-reanimated";

import ScreenHeader from "../../components/ScreenHeader";
import { usePendings, type Pending } from "../../context/PendingContext";
import { useAccounts } from "../../context/AccountsContext";
import { formatBRL } from "../../utils/format";
import { appColors } from "../../theme/colors";
import { sharedStyles } from "../../theme/styles";
import { splitPendings } from "./helpers";
import PendingForm from "./PendingForm";
import { PendingRow, PaidPendingRow } from "./PendingRow";

export default function Pendencies({ navigation }: any) {
  const { pendings, addPending, markPaid, removePending } = usePendings();
  const { account, addTransaction } = useAccounts();
  const [error, setError] = useState<string | null>(null);

  const { open, paid, total } = splitPendings(pendings);

  function handlePay(pending: Pending) {
    if (pending.amount > account.total) {
      setError(
        `Saldo insuficiente em ${account.name}. Disponível: R$ ${formatBRL(account.total)}`,
      );
      return;
    }

    addTransaction(-pending.amount, pending.title);
    markPaid(pending.id);
    setError(null);
  }

  return (
    <KeyboardAvoidingView
      style={sharedStyles.screen}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <StatusBar style="light" />

      <ScreenHeader onBack={() => navigation.goBack()}>
        <Text style={sharedStyles.headerTitle}>Pendências</Text>
        <Text style={sharedStyles.headerSubtitle}>
          {open.length} {open.length === 1 ? "conta em aberto" : "contas em aberto"}
        </Text>

        <Text style={styles.totalLabel}>Total a pagar</Text>
        <Text style={sharedStyles.headerAmount}>R$ {formatBRL(total)}</Text>
      </ScreenHeader>

      <ScrollView
        style={styles.list}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        keyboardShouldPersistTaps="handled"
      >
        <PendingForm
          externalError={error}
          onDirty={() => setError(null)}
          onSubmit={addPending}
        />

        <Text style={[sharedStyles.sectionTitle, styles.sectionSpacing]}>Em aberto</Text>

        {open.length === 0 ? (
          <Text style={sharedStyles.emptyState}>Nenhuma conta em aberto.</Text>
        ) : null}

        {open.map((item, index) => (
          <Animated.View key={item.id} entering={FadeInDown.delay(40 * index).duration(420)}>
            <PendingRow
              item={item}
              divider={index > 0}
              onPay={() => handlePay(item)}
              onRemove={() => removePending(item.id)}
            />
          </Animated.View>
        ))}

        {paid.length > 0 ? (
          <>
            <Text style={[sharedStyles.sectionTitle, styles.sectionSpacing]}>Pagas</Text>

            {paid.map((item, index) => (
              <PaidPendingRow
                key={item.id}
                item={item}
                divider={index > 0}
                accountName={account.name}
                onRemove={() => removePending(item.id)}
              />
            ))}
          </>
        ) : null}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  totalLabel: {
    fontSize: 13,
    color: appColors.dim,
    marginTop: 20,
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 22,
    paddingTop: 24,
    paddingBottom: 200,
  },
  sectionSpacing: {
    marginTop: 24,
    marginBottom: 10,
  },
});
