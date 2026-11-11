import { View, Text, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";

import Bounce from "../../components/Bounce";
import { type Pending } from "../../context/PendingContext";
import { formatBRL } from "../../utils/format";
import { monthName, nextMonthName } from "../../utils/date";
import { appColors } from "../../theme/colors";
import { sharedStyles } from "../../theme/styles";
import { describeDue, isLate } from "./helpers";

interface OpenProps {
  item: Pending;
  divider: boolean;
  onPay: () => void;
  onRemove: () => void;
}

export function PendingRow({ item, divider, onPay, onRemove }: OpenProps) {
  return (
    <View style={[sharedStyles.listRow, divider && sharedStyles.listRowDivider]}>
      <View style={sharedStyles.listRowBadge}>
        <Feather name="file-text" size={18} color={appColors.surfaceText} />
      </View>

      <View style={sharedStyles.listRowText}>
        <View style={styles.nameRow}>
          <Text style={sharedStyles.listRowName}>{item.title}</Text>
          {item.monthly ? (
            <View style={styles.tag}>
              <Text style={styles.tagLabel}>Mensal</Text>
            </View>
          ) : null}
          {item.notificationId ? (
            <Feather name="bell" size={13} color={appColors.sub} />
          ) : null}
        </View>
        <Text style={[sharedStyles.listRowMeta, isLate(item) && styles.metaLate]}>
          {describeDue(item)}
        </Text>
      </View>

      <View style={styles.actions}>
        <Text style={sharedStyles.listRowValue}>R$ {formatBRL(item.amount)}</Text>

        <View style={styles.buttons}>
          <Bounce
            style={styles.payButton}
            onPress={onPay}
            accessibilityLabel={`Pagar ${item.title}`}
          >
            <Text style={styles.payLabel}>Pagar</Text>
          </Bounce>

          <RemoveButton title={item.title} onPress={onRemove} />
        </View>
      </View>
    </View>
  );
}

interface PaidProps {
  item: Pending;
  divider: boolean;
  accountName: string;
  onRemove: () => void;
}

export function PaidPendingRow({ item, divider, accountName, onRemove }: PaidProps) {
  return (
    <View style={[sharedStyles.listRow, divider && sharedStyles.listRowDivider]}>
      <View style={[sharedStyles.listRowBadge, styles.badgePaid]}>
        <Feather name="check" size={18} color={appColors.success} />
      </View>

      <View style={sharedStyles.listRowText}>
        <Text style={[sharedStyles.listRowName, styles.namePaid]}>{item.title}</Text>
        <Text style={sharedStyles.listRowMeta}>
          {item.monthly
            ? `Paga em ${monthName()}, volta em ${nextMonthName()}`
            : `Paga com ${accountName}`}
        </Text>
      </View>

      <View style={styles.actions}>
        <Text style={[sharedStyles.listRowValue, styles.valuePaid]}>
          R$ {formatBRL(item.amount)}
        </Text>
        <RemoveButton title={item.title} onPress={onRemove} />
      </View>
    </View>
  );
}

function RemoveButton({ title, onPress }: { title: string; onPress: () => void }) {
  return (
    <Bounce
      style={styles.removeButton}
      onPress={onPress}
      accessibilityLabel={`Remover ${title}`}
    >
      <Feather name="trash-2" size={15} color={appColors.sub} />
    </Bounce>
  );
}

const styles = StyleSheet.create({
  badgePaid: {
    backgroundColor: "rgba(52, 199, 89, 0.15)",
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  namePaid: {
    color: appColors.sub,
    textDecorationLine: "line-through",
  },
  tag: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    backgroundColor: appColors.hairline,
  },
  tagLabel: {
    fontSize: 11,
    fontWeight: "bold",
    color: appColors.sub,
  },
  metaLate: {
    color: appColors.error,
    fontWeight: "600",
  },
  actions: {
    alignItems: "flex-end",
    gap: 6,
  },
  valuePaid: {
    color: appColors.sub,
  },
  buttons: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  payButton: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 16,
    backgroundColor: appColors.gold,
  },
  payLabel: {
    fontSize: 13,
    fontWeight: "bold",
    color: appColors.actionText,
  },
  removeButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: appColors.chromeLight,
    borderWidth: 1,
    borderColor: appColors.strokeLight,
  },
});
