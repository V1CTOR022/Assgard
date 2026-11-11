import { View, Text } from "react-native";
import { Feather } from "@expo/vector-icons";

import Bounce from "./Bounce";
import type { Transaction } from "../context/AccountsContext";
import { formatBRL } from "../utils/format";
import { appColors } from "../theme/colors";
import { sharedStyles } from "../theme/styles";

interface TransactionRowProps {
  transaction: Transaction;
  first: boolean;
}

export default function TransactionRow({ transaction, first }: TransactionRowProps) {
  const isIncome = transaction.amount >= 0;
  const color = isIncome ? appColors.success : appColors.error;

  return (
    <Bounce style={[sharedStyles.listRow, !first && sharedStyles.listRowDivider]}>
      <View style={sharedStyles.listRowBadge}>
        <Feather
          name={isIncome ? "arrow-down-left" : "arrow-up-right"}
          size={18}
          color={color}
        />
      </View>

      <View style={sharedStyles.listRowText}>
        <Text style={sharedStyles.listRowName}>{transaction.title}</Text>
        <Text style={sharedStyles.listRowMeta}>{transaction.date}</Text>
      </View>

      <Text style={[sharedStyles.listRowValue, { color }]}>
        {isIncome ? "+" : "-"} R$ {formatBRL(Math.abs(transaction.amount))}
      </Text>
    </Bounce>
  );
}
