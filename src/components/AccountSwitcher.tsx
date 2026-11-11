import { View, StyleSheet, type StyleProp, type ViewStyle } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import Bounce from "./Bounce";
import { useAccounts } from "../context/AccountsContext";
import { appColors } from "../theme/colors";

interface AccountSwitcherProps {
  style?: StyleProp<ViewStyle>;
  onChange?: (index: number) => void;
}

export default function AccountSwitcher({ style, onChange }: AccountSwitcherProps) {
  const { accounts, selectedIndex, selectAccount } = useAccounts();

  return (
    <View style={[styles.row, style]}>
      {accounts.map((option, index) => {
        const selected = index === selectedIndex;

        return (
          <Bounce
            key={option.id}
            style={[styles.button, selected && styles.buttonSelected]}
            onPress={() => {
              selectAccount(index);
              onChange?.(index);
            }}
            accessibilityLabel={option.name}
          >
            <MaterialCommunityIcons
              name={option.icon}
              size={20}
              color={selected ? appColors.actionText : appColors.dim}
            />
          </Bounce>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    gap: 10,
  },
  button: {
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: appColors.chrome,
    borderWidth: 1,
    borderColor: appColors.stroke,
  },
  buttonSelected: {
    backgroundColor: appColors.gold,
    borderColor: appColors.gold,
  },
});
