import { View, Text, StyleSheet, ScrollView } from "react-native";
import { StatusBar } from "expo-status-bar";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import Animated, { FadeInDown } from "react-native-reanimated";

import ScreenHeader from "../../components/ScreenHeader";
import Bounce from "../../components/Bounce";
import { useAccounts } from "../../context/AccountsContext";
import { usePendings, isOpen } from "../../context/PendingContext";
import { formatBRL } from "../../utils/format";
import { appColors } from "../../theme/colors";
import { sharedStyles } from "../../theme/styles";
import ProfileIdentity from "./ProfileIdentity";

export default function Profile({ navigation }: any) {
  const { accounts, selectAccount } = useAccounts();
  const { pendings } = usePendings();

  const open = pendings.filter(isOpen);
  const openTotal = open.reduce((sum, item) => sum + item.amount, 0);

  const { netWorth, entries } = accounts.reduce(
    (totals, item) => {
      totals.netWorth += item.total;
      totals.entries += item.transactions.length;
      return totals;
    },
    { netWorth: 0, entries: 0 },
  );

  function openAccount(index: number) {
    selectAccount(index);
    navigation.navigate("Home");
  }

  function handleLogout() {
    const parent = navigation.getParent();
    if (parent) {
      parent.reset({ index: 0, routes: [{ name: "Login" }] });
      return;
    }
    navigation.navigate("Login");
  }

  return (
    <View style={sharedStyles.screen}>
      <StatusBar style="light" />

      <ScreenHeader
        onBack={() => navigation.navigate("Home")}
        backLabel="Voltar para a tela inicial"
      >
        <ProfileIdentity netWorth={netWorth} />
      </ScreenHeader>

      <ScrollView
        style={styles.list}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={sharedStyles.screenContent}
      >
        <Text style={[sharedStyles.sectionTitle, styles.sectionSpacing]}>Suas contas</Text>

        {accounts.map((item, index) => (
          <Animated.View key={item.id} entering={FadeInDown.delay(50 * index).duration(420)}>
            <Bounce
              style={[sharedStyles.listRow, index > 0 && sharedStyles.listRowDivider]}
              onPress={() => openAccount(index)}
              accessibilityLabel={`Abrir ${item.name}`}
            >
              <View style={sharedStyles.listRowBadge}>
                <MaterialCommunityIcons
                  name={item.icon}
                  size={20}
                  color={appColors.surfaceText}
                />
              </View>

              <View style={sharedStyles.listRowText}>
                <Text style={sharedStyles.listRowName}>{item.name}</Text>
                <Text style={sharedStyles.listRowMeta}>
                  {item.transactions.length}{" "}
                  {item.transactions.length === 1 ? "transação" : "transações"}
                </Text>
              </View>

              <Text style={sharedStyles.listRowValue}>R$ {formatBRL(item.total)}</Text>
            </Bounce>
          </Animated.View>
        ))}

        <Text style={[sharedStyles.sectionTitle, styles.sectionSpacing]}>Resumo</Text>
        <View style={styles.stats}>
          <View style={styles.stat}>
            <Text style={styles.statValue}>{entries}</Text>
            <Text style={sharedStyles.listRowMeta}>Transações</Text>
          </View>

          <Bounce
            style={styles.stat}
            onPress={() => navigation.navigate("Pending")}
            accessibilityLabel="Ver pendências"
          >
            <Text style={[styles.statValue, open.length > 0 && { color: appColors.error }]}>
              {open.length}
            </Text>
            <Text style={sharedStyles.listRowMeta}>
              {open.length === 1 ? "Pendência" : "Pendências"}
            </Text>
            {open.length > 0 ? (
              <Text style={styles.statHint}>R$ {formatBRL(openTotal)}</Text>
            ) : null}
          </Bounce>
        </View>

        <Bounce style={styles.logout} onPress={handleLogout} accessibilityLabel="Sair da conta">
          <Feather name="log-out" size={17} color={appColors.error} />
          <Text style={styles.logoutLabel}>Sair da conta</Text>
        </Bounce>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  list: {
    flex: 1,
  },
  sectionSpacing: {
    marginTop: 8,
    marginBottom: 4,
  },
  stats: {
    flexDirection: "row",
    gap: 12,
    marginTop: 12,
  },
  stat: {
    flex: 1,
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: "center",
    backgroundColor: appColors.chromeLight,
    borderWidth: 1,
    borderColor: appColors.strokeLight,
  },
  statValue: {
    fontSize: 22,
    fontWeight: "bold",
    color: appColors.surfaceText,
    fontVariant: ["tabular-nums"],
  },
  statHint: {
    fontSize: 12,
    fontWeight: "600",
    color: appColors.sub,
    marginTop: 4,
    fontVariant: ["tabular-nums"],
  },
  logout: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    height: 52,
    borderRadius: 26,
    marginTop: 28,
    backgroundColor: appColors.chromeLight,
    borderWidth: 1,
    borderColor: appColors.strokeLight,
  },
  logoutLabel: {
    fontSize: 15,
    fontWeight: "600",
    color: appColors.error,
  },
});
