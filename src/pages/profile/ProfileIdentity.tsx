import { useState } from "react";
import { View, Text, StyleSheet, Image, TextInput } from "react-native";
import { Feather } from "@expo/vector-icons";

import Bounce from "../../components/Bounce";
import { useAccounts } from "../../context/AccountsContext";
import { deleteAvatar, pickAvatar } from "../../services/avatar";
import { useRates } from "../../hooks/useRates";
import { formatBRL } from "../../utils/format";
import { appColors } from "../../theme/colors";
import { sharedStyles } from "../../theme/styles";

const FALLBACK_NAME = "Usuário";

export default function ProfileIdentity({ netWorth }: { netWorth: number }) {
  const { userName, setUserName, avatarUri, setAvatarUri } = useAccounts();
  const { rates } = useRates();

  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(userName);

  const usd = rates.find((rate) => rate.code === "USD");

  async function changeAvatar() {
    const picked = await pickAvatar();
    if (!picked) return;

    if (avatarUri) deleteAvatar(avatarUri);
    setAvatarUri(picked);
  }

  function removeAvatar() {
    if (avatarUri) deleteAvatar(avatarUri);
    setAvatarUri(null);
  }

  function saveName() {
    setUserName(draft.trim() || FALLBACK_NAME);
    setEditing(false);
  }

  return (
    <>
      <Bounce
        style={styles.avatar}
        onPress={changeAvatar}
        accessibilityLabel={avatarUri ? "Trocar foto de perfil" : "Escolher foto de perfil"}
      >
        <View style={styles.avatarCircle}>
          {avatarUri ? (
            <Image source={{ uri: avatarUri }} style={styles.avatarPhoto} />
          ) : (
            <Feather name="user" size={30} color={appColors.text} />
          )}
        </View>

        <View style={styles.avatarBadge}>
          <Feather name="camera" size={12} color={appColors.actionText} />
        </View>
      </Bounce>

      {avatarUri ? (
        <Bounce onPress={removeAvatar} accessibilityLabel="Remover foto de perfil">
          <Text style={styles.removePhoto}>Remover foto</Text>
        </Bounce>
      ) : null}

      <View style={styles.nameRow}>
        {editing ? (
          <>
            <TextInput
              style={styles.nameInput}
              value={draft}
              onChangeText={setDraft}
              onSubmitEditing={saveName}
              returnKeyType="done"
              autoFocus
              maxLength={24}
            />
            <Bounce onPress={saveName} accessibilityLabel="Salvar nome">
              <Feather name="check" size={20} color={appColors.gold} />
            </Bounce>
          </>
        ) : (
          <>
            <Text style={sharedStyles.headerTitle}>{userName}</Text>
            <Bounce
              onPress={() => {
                setDraft(userName);
                setEditing(true);
              }}
              accessibilityLabel="Editar nome"
            >
              <Feather name="edit-2" size={17} color={appColors.dim} />
            </Bounce>
          </>
        )}
      </View>

      <Text style={styles.summaryLabel}>Patrimônio total</Text>
      <Text style={sharedStyles.headerAmount}>R$ {formatBRL(netWorth)}</Text>
      {usd ? (
        <Text style={styles.netWorthSub}>US$ {formatBRL(netWorth / usd.bid)} USD</Text>
      ) : null}
    </>
  );
}

const styles = StyleSheet.create({
  avatar: {
    width: 76,
    height: 76,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },
  avatarCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: appColors.chrome,
    borderWidth: 1,
    borderColor: appColors.stroke,
    overflow: "hidden",
  },
  avatarPhoto: {
    width: "100%",
    height: "100%",
  },
  avatarBadge: {
    position: "absolute",
    right: 0,
    bottom: 0,
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: appColors.gold,
    borderWidth: 2,
    borderColor: appColors.ink,
  },
  removePhoto: {
    fontSize: 13,
    color: appColors.dim,
    marginTop: -6,
    marginBottom: 12,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  nameInput: {
    fontSize: 28,
    fontWeight: "bold",
    color: appColors.text,
    padding: 0,
    borderBottomWidth: 2,
    borderBottomColor: appColors.gold,
    minWidth: 160,
  },
  summaryLabel: {
    fontSize: 13,
    color: appColors.dim,
    marginTop: 18,
  },
  netWorthSub: {
    fontSize: 14,
    color: appColors.dim,
    fontVariant: ["tabular-nums"],
    marginTop: 2,
  },
});
