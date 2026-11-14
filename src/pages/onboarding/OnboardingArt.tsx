import { View, Text, StyleSheet } from "react-native";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";

import { authColors } from "../../theme/colors";

export type ArtVariant = "contas" | "pendencias" | "grafico";

export default function OnboardingArt({ variant }: { variant: ArtVariant }) {
  return (
    <View style={styles.stage}>
      <View style={styles.blobBack} />
      <View style={styles.blobFront} />

      {variant === "contas" ? <ContasArt /> : null}
      {variant === "pendencias" ? <PendenciasArt /> : null}
      {variant === "grafico" ? <GraficoArt /> : null}
    </View>
  );
}

function ContasArt() {
  return (
    <>
      <View style={styles.card}>
        <Text style={styles.cardLabel}>Saldo</Text>
        <Text style={styles.cardValue}>R$ 2.480,00</Text>

        <View style={styles.accountRow}>
          <View style={[styles.accountDot, styles.accountDotActive]}>
            <MaterialCommunityIcons name="wallet" size={15} color={authColors.black} />
          </View>
          <View style={styles.accountDot}>
            <MaterialCommunityIcons name="piggy-bank" size={15} color={authColors.muted} />
          </View>
          <View style={styles.accountDot}>
            <MaterialCommunityIcons name="finance" size={15} color={authColors.muted} />
          </View>
        </View>
      </View>

      <View style={styles.floatPill}>
        <Feather name="arrow-down-left" size={13} color={authColors.success} />
        <Text style={styles.floatLabel}>+ R$ 500</Text>
      </View>
    </>
  );
}

function PendenciasArt() {
  return (
    <>
      <View style={styles.card}>
        <Text style={styles.cardLabel}>Em aberto</Text>

        <View style={styles.listLine}>
          <View style={styles.listBadge}>
            <Feather name="zap" size={13} color={authColors.black} />
          </View>
          <View style={styles.listText}>
            <View style={[styles.bar, { width: 74 }]} />
            <View style={[styles.bar, styles.barFaint, { width: 48 }]} />
          </View>
          <View style={styles.listTag} />
        </View>

        <View style={styles.listLine}>
          <View style={styles.listBadge}>
            <Feather name="home" size={13} color={authColors.black} />
          </View>
          <View style={styles.listText}>
            <View style={[styles.bar, { width: 60 }]} />
            <View style={[styles.bar, styles.barFaint, { width: 38 }]} />
          </View>
          <View style={styles.listTag} />
        </View>
      </View>

      <View style={styles.floatRound}>
        <Feather name="bell" size={17} color={authColors.black} />
      </View>
    </>
  );
}

function GraficoArt() {
  const bars = [34, 58, 44, 82, 66];

  return (
    <>
      <View style={styles.card}>
        <Text style={styles.cardLabel}>Movimentação</Text>

        <View style={styles.chart}>
          {bars.map((height, index) => (
            <View key={index} style={styles.chartSlot}>
              <View
                style={[
                  styles.chartBar,
                  { height, backgroundColor: index % 2 ? authColors.gold : authColors.text },
                ]}
              />
            </View>
          ))}
        </View>
      </View>

      <View style={styles.floatPill}>
        <Feather name="trending-up" size={13} color={authColors.text} />
        <Text style={styles.floatLabel}>Este mês</Text>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  stage: {
    height: 260,
    alignItems: "center",
    justifyContent: "center",
  },
  blobBack: {
    position: "absolute",
    width: 240,
    height: 200,
    borderRadius: 100,
    backgroundColor: authColors.blob,
    transform: [{ rotate: "-14deg" }],
    left: 36,
  },
  blobFront: {
    position: "absolute",
    width: 150,
    height: 150,
    borderRadius: 64,
    backgroundColor: authColors.blobDeep,
    right: 44,
    top: 26,
    transform: [{ rotate: "18deg" }],
  },
  card: {
    width: 232,
    padding: 18,
    borderRadius: 22,
    backgroundColor: authColors.field,
    borderWidth: 1,
    borderColor: authColors.border,
  },
  cardLabel: {
    fontSize: 12,
    color: authColors.subtext,
  },
  cardValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: authColors.text,
    fontVariant: ["tabular-nums"],
    marginTop: 4,
  },
  accountRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 16,
  },
  accountDot: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: authColors.blob,
  },
  accountDotActive: {
    backgroundColor: authColors.gold,
  },
  listLine: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 14,
  },
  listBadge: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: authColors.blob,
  },
  listText: {
    flex: 1,
    gap: 5,
  },
  bar: {
    height: 7,
    borderRadius: 4,
    backgroundColor: authColors.blobDeep,
  },
  barFaint: {
    backgroundColor: authColors.blob,
  },
  listTag: {
    width: 34,
    height: 14,
    borderRadius: 7,
    backgroundColor: authColors.gold,
  },
  chart: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 10,
    height: 92,
    marginTop: 14,
  },
  chartSlot: {
    flex: 1,
    justifyContent: "flex-end",
  },
  chartBar: {
    borderRadius: 6,
  },
  floatPill: {
    position: "absolute",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: authColors.field,
    borderWidth: 1,
    borderColor: authColors.border,
    right: 16,
    bottom: 34,
  },
  floatLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: authColors.text,
  },
  floatRound: {
    position: "absolute",
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: authColors.gold,
    right: 22,
    bottom: 36,
  },
});
