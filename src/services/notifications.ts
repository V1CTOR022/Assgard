import { Platform } from "react-native";
import { isRunningInExpoGo } from "expo";
import * as Notifications from "expo-notifications";

import { formatBRL } from "../utils/format";

const CHANNEL_ID = "vencimentos";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export async function ensureChannel(): Promise<void> {
  if (Platform.OS !== "android") return;

  await Notifications.setNotificationChannelAsync(CHANNEL_ID, {
    name: "Vencimentos",
    importance: Notifications.AndroidImportance.HIGH,
    sound: "default",
    vibrationPattern: [0, 250, 250, 250],
  });
}

export async function ensurePermission(): Promise<boolean> {
  const current = await Notifications.getPermissionsAsync();
  if (current.granted) return true;

  const asked = await Notifications.requestPermissionsAsync();
  return asked.granted;
}

export async function scheduleMonthlyReminder(
  title: string,
  amount: number,
  dueDay: number,
): Promise<string | null> {
  const allowed = await ensurePermission();
  if (!allowed) return null;

  await ensureChannel();

  return Notifications.scheduleNotificationAsync({
    content: {
      title: `${title} vence hoje`,
      body: `R$ ${formatBRL(amount)}, dia ${dueDay} de todo mês.`,
      sound: "default",
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.MONTHLY,
      day: dueDay,
      hour: 0,
      minute: 0,
      channelId: CHANNEL_ID,
    },
  });
}

export async function cancelReminder(id: string): Promise<void> {
  try {
    await Notifications.cancelScheduledNotificationAsync(id);
  } catch (error) {
    console.warn("[notifications] falha ao cancelar o alarme:", error);
  }
}

export type AlarmSupport = "ok" | "expo-go" | "denied";

export async function checkAlarmSupport(): Promise<AlarmSupport> {
  if (isRunningInExpoGo()) return "expo-go";

  const current = await Notifications.getPermissionsAsync();
  return current.granted ? "ok" : "denied";
}

export async function listScheduled() {
  return Notifications.getAllScheduledNotificationsAsync();
}
