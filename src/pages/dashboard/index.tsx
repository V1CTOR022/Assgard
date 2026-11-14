import { View, Text, StyleSheet, ScrollView } from "react-native";
import { StatusBar } from "expo-status-bar";
import Animated, { FadeInDown } from "react-native-reanimated";

import ScreenHeader from "../../components/ScreenHeader";
import AccountSwitcher from "../../components/AccountSwitcher";
import { useAccounts, type Transaction } from "../../context/AccountsContext";
import { formatBRL } from "../../utils/format";
import { appColors } from "../../theme/colors";
import { sharedStyles } from "../../theme/styles";

const MAX_DAYS = 7;
const CHART_HEIGHT = 140;

interface DayBar {
  date: string;
  entradas: number;
  saidas: number;
}

function toDayBars(transactions: Transaction[]): DayBar[] {
  const bars: DayBar[] = [];

  for (const transaction of transactions) {
    const last = bars[bars.length - 1];
    const target =
      last && last.date === transaction.date
        ? last
        : (bars.push({ date: transaction.date, entradas: 0, saidas: 0 }),
          bars[bars.length - 1]);

    if (transaction.amount >= 0) target.entradas += transaction.amount;
    else target.saidas += Math.abs(transaction.amount);

    if (bars.length > MAX_DAYS) break;
  }

  return bars.slice(0, MAX_DAYS).reverse();
}

export default function Dashboard({ navigation }: any) {
  const { account } = useAccounts();

  const bars = toDayBars(account.transactions);
  const maior = bars.reduce(
    (max, bar) => Math.max(max, bar.entradas, bar.saidas),
    0,
  );

  const { entradas, saidas } = account.transactions.reduce(
    (totals, transaction) => {
      if (transaction.amount >= 0) totals.entradas += transaction.amount;
      else totals.saidas += Math.abs(transaction.amount);
      return totals;
    },
    { entradas: 0, saidas: 0 },
  );

  const alturaDe = (valor: number) =>
    valor <= 0 ? 0 : Math.max(4, (valor / maior) * CHART_HEIGHT);

  return (
    <View style={sharedStyles.screen}>
      <StatusBar style="light" />

      <ScreenHeader onBack={() => navigation.goBack()}>

        <Text style={sharedStyles.headerTitle}>Dashboard</Text>
        <Text style={sharedStyles.headerSubtitle}>{account.name}</Text>
        <Text style={styles.balance}>R$ {formatBRL(account.total)}</Text>

        <AccountSwitcher style={styles.accountRow} />
      </ScreenHeader>

      <ScrollView
        style={styles.body}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={sharedStyles.screenContent}
      >
        <View style={styles.totals}>
          <View style={styles.total}>
            <Text style={styles.totalLabel}>Entradas</Text>
            <Text style={[styles.totalValue, { color: appColors.success }]}>
              + R$ {formatBRL(entradas)}
            </Text>
          </View>

          <View style={styles.total}>
            <Text style={styles.totalLabel}>Saídas</Text>
            <Text style={[styles.totalValue, { color: appColors.error }]}>
              - R$ {formatBRL(saidas)}
            </Text>
          </View>
        </View>

        <Text style={[sharedStyles.sectionTitle, styles.sectionSpacing]}>Movimentação por dia</Text>

        {bars.length === 0 ? (
          <Text style={sharedStyles.emptyState}>
            Sem movimentação nesta conta ainda.{"\n"}Os lançamentos aparecem aqui como gráfico.
          </Text>
        ) : (
          <>
            <View style={styles.chart}>
              {bars.map((bar, index) => (
                <Animated.View
                  key={bar.date}
                  style={styles.column}
                  entering={FadeInDown.delay(60 * index).duration(420)}
                >
                  <View style={styles.barsArea}>
                    <View style={[styles.bar, styles.barIn, { height: alturaDe(bar.entradas) }]} />
                    <View style={[styles.bar, styles.barOut, { height: alturaDe(bar.saidas) }]} />
                  </View>

                  <Text style={styles.columnLabel} numberOfLines={1}>
                    {bar.date}
                  </Text>
                </Animated.View>
              ))}
            </View>

            <View style={styles.legend}>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: appColors.success }]} />
                <Text style={styles.legendLabel}>Entradas</Text>
              </View>

              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: appColors.error }]} />
                <Text style={styles.legendLabel}>Saídas</Text>
              </View>
            </View>

            <Text style={styles.footnote}>
              {bars.length} {bars.length === 1 ? "dia" : "dias"} com movimentação.
            </Text>
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({

  balance: {
    fontSize: 26,
    fontWeight: "bold",
    color: appColors.text,
    fontVariant: ["tabular-nums"],
    marginTop: 12,
  },
  accountRow: {
    marginTop: 20,
  },

  body: {
    flex: 1,
  },
  totals: {
    flexDirection: "row",
    gap: 12,
  },
  total: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 16,
    backgroundColor: appColors.chromeLight,
    borderWidth: 1,
    borderColor: appColors.strokeLight,
  },
  totalLabel: {
    fontSize: 13,
    color: appColors.sub,
    marginBottom: 4,
  },
  totalValue: {
    fontSize: 16,
    fontWeight: "bold",
    fontVariant: ["tabular-nums"],
  },
  sectionSpacing: {
    marginTop: 28,
    marginBottom: 16,
  },

  chart: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    gap: 8,
  },
  column: {
    flex: 1,
    alignItems: "center",
  },
  barsArea: {
    height: CHART_HEIGHT,
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 3,
  },
  bar: {
    width: 10,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
  barIn: {
    backgroundColor: appColors.success,
  },
  barOut: {
    backgroundColor: appColors.error,
  },
  columnLabel: {
    fontSize: 11,
    color: appColors.sub,
    marginTop: 8,
  },

  legend: {
    flexDirection: "row",
    gap: 20,
    marginTop: 20,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendLabel: {
    fontSize: 13,
    color: appColors.sub,
  },
  footnote: {
    fontSize: 12,
    color: appColors.sub,
    marginTop: 12,
  },
});
