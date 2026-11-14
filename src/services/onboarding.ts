import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "@assgard/onboarding-visto";

export async function hasSeenOnboarding(): Promise<boolean> {
  try {
    return (await AsyncStorage.getItem(STORAGE_KEY)) === "1";
  } catch (error) {
    console.warn("[onboarding] falha ao ler o estado salvo:", error);
    return false;
  }
}

export function markOnboardingSeen(): void {
  AsyncStorage.setItem(STORAGE_KEY, "1").catch((error) => {
    console.warn("[onboarding] falha ao salvar o estado:", error);
  });
}

export function resetOnboarding(): void {
  AsyncStorage.removeItem(STORAGE_KEY).catch(() => {});
}
