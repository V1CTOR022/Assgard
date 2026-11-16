import { useState } from "react";
import { View, Text, StyleSheet, Image, ScrollView, ActivityIndicator } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient";
import { Feather } from "@expo/vector-icons";
import Animated, { FadeInDown } from "react-native-reanimated";

import RollingCounter from "../../components/RollingCounter";
import Bounce from "../../components/Bounce";
import AccountSwitcher from "../../components/AccountSwitcher";
import TransactionRow from "../../components/TransactionRow";
import { useRates } from "../../hooks/useRates";
import { useAccounts } from "../../context/AccountsContext";
import { appColors } from "../../theme/colors";
import { sharedStyles } from "../../theme/styles";

export default function Home({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const { accounts, selectedIndex, account, selectAccount } = useAccounts();
  const { rates, loading } = useRates();
  const usd = rates.find((rate) => rate.code === "USD");
  const balanceUSD = usd ? account.total / usd.bid : 0;

  const [hidden, setHidden] = useState(false);

  return (
    <View style={sharedStyles.screen}>
      <StatusBar style="light" />

      <View style={[styles.card, { paddingTop: insets.top + 16 }]}>
        <LinearGradient
          colors={appColors.cardGradient as unknown as [string, string, string]}
          start={{ x: 0.1, y: 0 }}
          end={{ x: 0.9, y: 1 }}
          style={StyleSheet.absoluteFill}
          pointerEvents="none"
        />

        <View style={styles.cardHeader}>
          <Image source={require("../../assets/logo.png")} style={styles.logo} />

          <Text style={styles.accountName}>{account.name}</Text>
        </View>

        <View style={styles.balanceBlock}>
          {hidden ? (
            <Text style={styles.balance}>R$ ••••••</Text>
          ) : (
            <RollingCounter value={account.total} style={styles.balance} />
          )}

          <View style={styles.subRow}>
            {hidden ? (
              <Text style={styles.balanceSub}>US$ ••••</Text>
            ) : loading && !usd ? (
              <ActivityIndicator size="small" color={appColors.dim} />
            ) : (
              <RollingCounter value={balanceUSD} prefix="US$ " style={styles.balanceSub} />
            )}
            <Text style={styles.ticker}>USD</Text>

            <Bounce
              style={styles.visibility}
              onPress={() => setHidden((current) => !current)}
              accessibilityLabel={hidden ? "Mostrar saldo" : "Ocultar saldo"}
            >
              <Feather
                name={hidden ? "eye-off" : "eye"}
                size={13}
                color={appColors.dim}
              />
            </Bounce>
          </View>

          <AccountSwitcher style={styles.accountRow} />
        </View>

        <View style={styles.actions}>
          <Bounce style={styles.pill} onPress={() => navigation.navigate("History")}>
            <Feather name="clock" size={15} color={appColors.text} />
            <Text style={styles.pillLabel}>Histórico</Text>
          </Bounce>

          <Bounce
            style={styles.plus}
            onPress={() => navigation.navigate("Transaction")}
            accessibilityLabel="Movimentar dinheiro"
          >
            <Feather name="plus" size={24} color={appColors.actionText} />
          </Bounce>

          <Bounce style={styles.pill} onPress={() => navigation.navigate("Pending")}>
            <Feather name="file-text" size={15} color={appColors.text} />
            <Text style={styles.pillLabel}>Pendências</Text>
          </Bounce>
        </View>

        <Bounce
          style={styles.dashboard}
          onPress={() => navigation.navigate("Dashboard")}
        >
          <Feather name="bar-chart-2" size={16} color={appColors.text} />
          <Text style={styles.dashboardLabel}>Dashboard</Text>
        </Bounce>

      </View>

      <ScrollView
        style={styles.list}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={sharedStyles.screenContent}
      >
        <View style={styles.listHeader}>
          <Text style={styles.sectionTitle}>Histórico de transações</Text>
        </View>

        {account.transactions.length === 0 ? (
          <Text style={sharedStyles.emptyState}>
            Nenhuma transação ainda.{"\n"}Toque no + para lançar a primeira.
          </Text>
        ) : null}

        {account.transactions.map((transaction, index) => (
          <Animated.View
            key={transaction.id}
            entering={FadeInDown.delay(60 * index).duration(420)}
          >
            <TransactionRow transaction={transaction} first={index === 0} />
          </Animated.View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({

  card: {
    paddingBottom: 40,
    borderBottomLeftRadius: 55,
    borderBottomRightRadius: 55,
    overflow: "hidden",
    backgroundColor: appColors.ink,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    height: 54,
  },
  logo: {
    width: 54,
    height: 54,
    resizeMode: "contain",
    tintColor: appColors.text,
  },
  accountName: {
    position: "absolute",
    left: 0,
    right: 0,
    textAlign: "center",
    fontSize: 15,
    fontWeight: "500",
    color: appColors.text,
  },

  balanceBlock: {
    alignItems: "center",
    marginTop: 38,
  },
  balance: {
    fontSize: 46,
    letterSpacing: -1.5,
    color: appColors.text,
    textAlign: "center",
  },
  balanceSub: {
    fontSize: 15,
    fontWeight: "500",
    color: appColors.dim,
  },
  subRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 12,
  },
  accountRow: {
    marginTop: 24,
  },
  ticker: {
    fontSize: 15,
    fontWeight: "500",
    color: appColors.dim,
  },
  visibility: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: appColors.chrome,
    borderWidth: 1,
    borderColor: appColors.stroke,
    marginLeft: 4,
  },

  actions: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 14,
    marginTop: 28,
  },
  pill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    height: 46,
    paddingHorizontal: 20,
    borderRadius: 23,
    backgroundColor: appColors.chrome,
    borderWidth: 1,
    borderColor: appColors.stroke,
  },
  pillLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: appColors.text,
  },
  dashboard: {
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 18,
    height: 42,
    paddingHorizontal: 20,
    borderRadius: 21,
    backgroundColor: appColors.chrome,
    borderWidth: 1,
    borderColor: appColors.stroke,
  },
  dashboardLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: appColors.text,
  },
  plus: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: appColors.gold,
  },

  list: {
    flex: 1,
  },
  listHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  sectionTitle: {
    fontSize: 21,
    fontWeight: "700",
    color: appColors.surfaceText,
  },

});
