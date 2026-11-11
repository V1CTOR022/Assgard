import { useMemo, useState } from "react";
import { View, Text, StyleSheet, ScrollView, TextInput } from "react-native";
import { StatusBar } from "expo-status-bar";
import { Feather } from "@expo/vector-icons";
import Animated, { FadeInDown } from "react-native-reanimated";

import ScreenHeader from "../../components/ScreenHeader";
import Bounce from "../../components/Bounce";
import AccountSwitcher from "../../components/AccountSwitcher";
import TransactionRow from "../../components/TransactionRow";
import { useAccounts, type Transaction } from "../../context/AccountsContext";
import { formatBRL } from "../../utils/format";
import { todayLabel, yesterdayLabel } from "../../utils/date";
import { appColors } from "../../theme/colors";
import { sharedStyles } from "../../theme/styles";

const ACCENTS: Record<string, string> = {
  á: "a", à: "a", â: "a", ã: "a", ä: "a",
  é: "e", è: "e", ê: "e", ë: "e",
  í: "i", ì: "i", î: "i", ï: "i",
  ó: "o", ò: "o", ô: "o", õ: "o", ö: "o",
  ú: "u", ù: "u", û: "u", ü: "u",
  ç: "c",
};

function normalize(text: string): string {
  return text
    .toLowerCase()
    .split("")
    .map((char) => ACCENTS[char] ?? char)
    .join("");
}

function matches(transaction: Transaction, query: string): boolean {
  const term = normalize(query.trim());
  if (!term) return true;

  if (normalize(transaction.title).includes(term)) return true;

  const formatted = formatBRL(Math.abs(transaction.amount));
  if (formatted.includes(term)) return true;

  const digits = term.replace(/\D/g, "");
  return digits.length > 0 && formatted.replace(/\D/g, "").includes(digits);
}

interface DayGroup {
  date: string;
  label: string;
  items: Transaction[];
}

function groupByDay(transactions: Transaction[]): DayGroup[] {
  const hoje = todayLabel();
  const ontem = yesterdayLabel();
  const groups: DayGroup[] = [];

  for (const transaction of transactions) {
    const last = groups[groups.length - 1];

    if (last && last.date === transaction.date) {
      last.items.push(transaction);
      continue;
    }

    groups.push({
      date: transaction.date,
      label:
        transaction.date === hoje
          ? "Hoje"
          : transaction.date === ontem
            ? "Ontem"
            : transaction.date,
      items: [transaction],
    });
  }

  return groups;
}

export default function History({ navigation }: any) {
  const { account } = useAccounts();
  const [query, setQuery] = useState("");

  const { entradas, saidas } = account.transactions.reduce(
    (totals, transaction) => {
      if (transaction.amount >= 0) totals.entradas += transaction.amount;
      else totals.saidas += Math.abs(transaction.amount);
      return totals;
    },
    { entradas: 0, saidas: 0 },
  );

  const groups = useMemo(() => {
    const filtered = account.transactions.filter((item) => matches(item, query));
    return groupByDay(filtered);
  }, [account.transactions, query]);

  const total = groups.reduce((sum, group) => sum + group.items.length, 0);
  const searching = query.trim().length > 0;

  return (
    <View style={sharedStyles.screen}>
      <StatusBar style="light" />

      <ScreenHeader
        onBack={() => navigation.navigate("Home")}
        backLabel="Voltar para a tela inicial"
      >
        <Text style={sharedStyles.headerTitle}>Histórico</Text>
        <Text style={sharedStyles.headerSubtitle}>{account.name}</Text>

        <View style={styles.summary}>
          <View>
            <Text style={styles.summaryLabel}>Entradas</Text>
            <Text style={[styles.summaryValue, { color: appColors.success }]}>
              + R$ {formatBRL(entradas)}
            </Text>
          </View>

          <View>
            <Text style={styles.summaryLabel}>Saídas</Text>
            <Text style={[styles.summaryValue, { color: appColors.error }]}>
              - R$ {formatBRL(saidas)}
            </Text>
          </View>
        </View>

        <AccountSwitcher style={styles.accountRow} />
      </ScreenHeader>

      <ScrollView
        style={styles.list}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.search}>
          <Feather name="search" size={18} color={appColors.sub} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar por nome ou valor"
            placeholderTextColor={appColors.sub}
            value={query}
            onChangeText={setQuery}
            autoCorrect={false}
          />
          {searching ? (
            <Bounce onPress={() => setQuery("")} accessibilityLabel="Limpar busca">
              <Feather name="x" size={18} color={appColors.sub} />
            </Bounce>
          ) : null}
        </View>

        <Text style={styles.count}>
          {total} {total === 1 ? "transação" : "transações"}
        </Text>

        {total === 0 ? (
          <Text style={sharedStyles.emptyState}>
            {searching
              ? `Nada encontrado para "${query.trim()}".`
              : "Nenhuma transação nesta conta.\nToque no + da tela inicial para lançar a primeira."}
          </Text>
        ) : null}

        {groups.map((group, groupIndex) => (
          <View key={group.date} style={styles.group}>
            <Text style={styles.groupLabel}>{group.label}</Text>

            {group.items.map((transaction, index) => (
              <Animated.View
                key={transaction.id}
                entering={FadeInDown.delay(40 * (groupIndex + index)).duration(420)}
              >
                <TransactionRow transaction={transaction} first={index === 0} />
              </Animated.View>
            ))}
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({

  summary: {
    flexDirection: "row",
    gap: 36,
    marginTop: 24,
  },
  summaryLabel: {
    fontSize: 13,
    color: appColors.dim,
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: "bold",
    fontVariant: ["tabular-nums"],
  },
  accountRow: {
    marginTop: 24,
  },

  list: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 22,
    paddingTop: 20,
    paddingBottom: 120,
  },
  search: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    height: 48,
    paddingHorizontal: 16,
    borderRadius: 24,
    backgroundColor: appColors.chromeLight,
    borderWidth: 1,
    borderColor: appColors.strokeLight,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: appColors.surfaceText,
    padding: 0,
  },
  count: {
    fontSize: 13,
    color: appColors.sub,
    marginTop: 16,
  },
  group: {
    marginTop: 20,
  },
  groupLabel: {
    fontSize: 15,
    fontWeight: "bold",
    color: appColors.surfaceText,
    marginBottom: 2,
  },
});
