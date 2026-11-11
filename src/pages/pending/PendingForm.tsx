import { useEffect, useState } from "react";
import { View, Text, StyleSheet, TextInput } from "react-native";
import { Feather } from "@expo/vector-icons";

import Bounce from "../../components/Bounce";
import MoneyInput, { digitsToValue } from "../../components/MoneyInput";
import PillSelector, { type PillOption } from "../../components/PillSelector";
import { checkAlarmSupport, type AlarmSupport } from "../../services/notifications";
import { appColors } from "../../theme/colors";
import { sharedStyles } from "../../theme/styles";

const RECURRENCE: PillOption<"once" | "monthly">[] = [
  {
    id: "once",
    label: "Uma vez",
    renderIcon: (color) => <Feather name="calendar" size={15} color={color} />,
  },
  {
    id: "monthly",
    label: "Todo mês",
    renderIcon: (color) => <Feather name="repeat" size={15} color={color} />,
  },
];

type Field = "title" | "amount" | "dueDay";

interface Props {
  externalError: string | null;
  onDirty: () => void;
  onSubmit: (title: string, amount: number, monthly: boolean, dueDay?: number) => void;
}

export default function PendingForm({ externalError, onDirty, onSubmit }: Props) {
  const [title, setTitle] = useState("");
  const [digits, setDigits] = useState("");
  const [monthly, setMonthly] = useState(false);
  const [dueDay, setDueDay] = useState("");
  const [error, setError] = useState<{ field: Field; message: string } | null>(null);
  const [alarmSupport, setAlarmSupport] = useState<AlarmSupport>("ok");

  useEffect(() => {
    let active = true;
    checkAlarmSupport().then((status) => {
      if (active) setAlarmSupport(status);
    });
    return () => {
      active = false;
    };
  }, []);

  function touch() {
    if (error) setError(null);
    if (externalError) onDirty();
  }

  function handleAdd() {
    if (!title.trim()) {
      setError({ field: "title", message: "Dê um nome à pendência" });
      return;
    }

    const amount = digitsToValue(digits);
    if (amount <= 0) {
      setError({ field: "amount", message: "Digite um valor" });
      return;
    }

    const day = dueDay.trim() ? Number(dueDay) : undefined;
    if (day !== undefined && (!Number.isInteger(day) || day < 1 || day > 31)) {
      setError({ field: "dueDay", message: "Dia de vencimento inválido. Use de 1 a 31" });
      return;
    }

    onSubmit(title.trim(), amount, monthly, day);
    setTitle("");
    setDigits("");
    setDueDay("");
    setError(null);
  }

  const message = error?.message ?? externalError;

  return (
    <View>
      <Text style={[sharedStyles.sectionTitle, styles.sectionSpacing]}>Registrar conta</Text>

      <TextInput
        style={[sharedStyles.formInput, error?.field === "title" && sharedStyles.formInputError]}
        placeholder="Nome da conta (ex: Luz, Aluguel)"
        placeholderTextColor={appColors.sub}
        value={title}
        onChangeText={(text) => {
          setTitle(text);
          touch();
        }}
      />

      <MoneyInput
        digits={digits}
        onChangeDigits={(next) => {
          setDigits(next);
          touch();
        }}
        hasError={error?.field === "amount"}
        style={styles.money}
      />

      <PillSelector
        options={RECURRENCE}
        value={monthly ? "monthly" : "once"}
        onChange={(next) => setMonthly(next === "monthly")}
        style={styles.recurrenceRow}
      />

      <View style={styles.dueRow}>
        <Text style={styles.dueLabel}>{monthly ? "Vence todo dia" : "Vence no dia"}</Text>
        <TextInput
          style={[styles.dueInput, error?.field === "dueDay" && sharedStyles.formInputError]}
          placeholder="--"
          placeholderTextColor={appColors.sub}
          keyboardType="number-pad"
          maxLength={2}
          value={dueDay}
          onChangeText={(text) => {
            setDueDay(text.replace(/\D/g, ""));
            touch();
          }}
        />
        <Text style={styles.dueHint}>opcional</Text>
      </View>

      {monthly && alarmSupport !== "ok" ? (
        <View style={styles.notice}>
          <Feather name="bell-off" size={15} color={appColors.sub} />
          <Text style={styles.noticeText}>
            {alarmSupport === "expo-go"
              ? "O alarme não toca no Expo Go, só num build do app. A pendência é registrada normalmente."
              : "Notificações desativadas: a pendência é registrada, mas o alarme não vai tocar."}
          </Text>
        </View>
      ) : null}

      {message ? (
        <Text style={sharedStyles.formErrorText} accessibilityLiveRegion="polite">
          {message}
        </Text>
      ) : null}

      <Bounce style={styles.addButton} onPress={handleAdd}>
        <Feather name="plus" size={18} color={appColors.actionText} />
        <Text style={styles.addLabel}>Adicionar pendência</Text>
      </Bounce>
    </View>
  );
}

const styles = StyleSheet.create({
  sectionSpacing: {
    marginBottom: 10,
  },
  money: {
    marginTop: 12,
  },
  recurrenceRow: {
    marginTop: 12,
  },
  dueRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginTop: 14,
  },
  dueLabel: {
    fontSize: 14,
    color: appColors.sub,
  },
  dueInput: {
    width: 58,
    height: 42,
    borderRadius: 14,
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
    color: appColors.surfaceText,
    backgroundColor: appColors.chromeLight,
    borderWidth: 1,
    borderColor: appColors.strokeLight,
    padding: 0,
  },
  dueHint: {
    fontSize: 12,
    color: appColors.sub,
  },
  notice: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    marginTop: 14,
    padding: 12,
    borderRadius: 14,
    backgroundColor: appColors.chromeLight,
    borderWidth: 1,
    borderColor: appColors.strokeLight,
  },
  noticeText: {
    flex: 1,
    fontSize: 12,
    lineHeight: 17,
    color: appColors.sub,
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    height: 52,
    borderRadius: 26,
    marginTop: 16,
    backgroundColor: appColors.gold,
  },
  addLabel: {
    fontSize: 15,
    fontWeight: "bold",
    color: appColors.actionText,
  },
});
