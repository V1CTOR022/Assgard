import { useRef, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  useWindowDimensions,
  type NativeSyntheticEvent,
  type NativeScrollEvent,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Feather } from "@expo/vector-icons";

import Bounce from "../../components/Bounce";
import { markOnboardingSeen } from "../../services/onboarding";
import { authColors } from "../../theme/colors";
import OnboardingArt, { type ArtVariant } from "./OnboardingArt";

interface Slide {
  art: ArtVariant;
  title: string;
  description: string;
}

const SLIDES: Slide[] = [
  {
    art: "contas",
    title: "Suas contas,\num saldo só",
    description:
      "Conta principal, poupança e investimentos no mesmo lugar, com o saldo sempre à vista.",
  },
  {
    art: "pendencias",
    title: "Contas\nem dia",
    description:
      "Cadastre o que vence todo mês e receba um alarme no dia, antes que a conta atrase.",
  },
  {
    art: "grafico",
    title: "Veja para onde\no dinheiro vai",
    description:
      "Entradas e saídas por dia, num gráfico simples, para entender seus hábitos.",
  },
];

export default function Onboarding({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const scrollRef = useRef<ScrollView>(null);
  const indexRef = useRef(0);
  const [index, setIndex] = useState(0);

  const isLast = index === SLIDES.length - 1;

  function finish() {
    markOnboardingSeen();
    navigation.replace("Login");
  }

  function goTo(next: number) {
    indexRef.current = next;
    setIndex(next);
    scrollRef.current?.scrollTo({ x: width * next, animated: true });
  }

  function advance() {
    const next = indexRef.current + 1;

    if (next >= SLIDES.length) {
      finish();
      return;
    }

    goTo(next);
  }

  function handleScroll(event: NativeSyntheticEvent<NativeScrollEvent>) {
    const next = Math.round(event.nativeEvent.contentOffset.x / width);

    if (next !== indexRef.current) {
      indexRef.current = next;
      setIndex(next);
    }
  }

  return (
    <View style={[styles.screen, { paddingTop: insets.top + 8 }]}>
      <StatusBar style="dark" />

      <View style={styles.topBar}>
        <View style={styles.brand}>
          <Image source={require("../../assets/logo.png")} style={styles.logo} />
          <Text style={styles.wordmark}>Assgard</Text>
        </View>

        <Bounce onPress={finish} accessibilityLabel="Pular apresentação">
          <Text style={styles.skip}>Pular</Text>
        </Bounce>
      </View>

      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScroll}
        style={styles.pager}
      >
        {SLIDES.map((slide) => (
          <View key={slide.art} style={[styles.slide, { width }]}>
            <OnboardingArt variant={slide.art} />

            <Text style={styles.title}>{slide.title}</Text>
            <Text style={styles.description}>{slide.description}</Text>
          </View>
        ))}
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + 24 }]}>
        <View style={styles.dots}>
          {SLIDES.map((slide, position) => (
            <View
              key={slide.art}
              style={[styles.dot, position === index && styles.dotActive]}
            />
          ))}
        </View>

        <Bounce
          style={styles.action}
          onPress={advance}
          accessibilityLabel={isLast ? "Começar" : "Próximo"}
        >
          <Text style={styles.actionLabel}>{isLast ? "Começar" : "Próximo"}</Text>
          <Feather name="arrow-right" size={18} color={authColors.actionText} />
        </Bounce>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: authColors.background,
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 28,
    height: 48,
  },
  brand: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  logo: {
    width: 26,
    height: 26,
    resizeMode: "contain",
  },
  wordmark: {
    fontSize: 18,
    fontWeight: "bold",
    color: authColors.text,
  },
  skip: {
    fontSize: 15,
    color: authColors.subtext,
  },
  pager: {
    flex: 1,
  },
  slide: {
    paddingHorizontal: 28,
    justifyContent: "center",
  },
  title: {
    fontSize: 34,
    lineHeight: 40,
    fontWeight: "bold",
    color: authColors.text,
    marginTop: 44,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: authColors.subtext,
    marginTop: 14,
  },
  footer: {
    paddingHorizontal: 28,
    gap: 24,
  },
  dots: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 7,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: authColors.border,
  },
  dotActive: {
    width: 22,
    backgroundColor: authColors.gold,
  },
  action: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    height: 58,
    borderRadius: 29,
    backgroundColor: authColors.actionBg,
  },
  actionLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: authColors.actionText,
  },
});
