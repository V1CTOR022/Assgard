import { StyleSheet } from "react-native";

import { appColors } from "./colors";

export const sharedStyles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: appColors.surface,
  },
  screenContent: {
    paddingHorizontal: 22,
    paddingTop: 24,
    paddingBottom: 120,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: appColors.text,
  },
  headerSubtitle: {
    fontSize: 15,
    color: appColors.dim,
    marginTop: 2,
  },
  headerAmount: {
    fontSize: 26,
    fontWeight: "bold",
    color: appColors.text,
    fontVariant: ["tabular-nums"],
    marginTop: 2,
  },
  iconButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: appColors.chrome,
    borderWidth: 1,
    borderColor: appColors.stroke,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: appColors.surfaceText,
  },
  listRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    paddingVertical: 15,
  },
  listRowDivider: {
    borderTopWidth: 1,
    borderTopColor: appColors.hairline,
  },
  listRowBadge: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: appColors.hairline,
  },
  listRowText: {
    flex: 1,
  },
  listRowName: {
    fontSize: 16,
    fontWeight: "bold",
    color: appColors.surfaceText,
  },
  listRowMeta: {
    fontSize: 13,
    color: appColors.sub,
    marginTop: 2,
  },
  listRowValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: appColors.surfaceText,
    fontVariant: ["tabular-nums"],
  },
  formInput: {
    height: 50,
    paddingHorizontal: 16,
    borderRadius: 16,
    fontSize: 16,
    color: appColors.surfaceText,
    backgroundColor: appColors.chromeLight,
    borderWidth: 1,
    borderColor: appColors.strokeLight,
  },
  formInputError: {
    borderColor: appColors.error,
  },
  formErrorText: {
    color: appColors.error,
    fontSize: 13,
    marginTop: 8,
  },
  emptyState: {
    fontSize: 14,
    lineHeight: 21,
    color: appColors.sub,
    textAlign: "center",
    paddingVertical: 36,
  },
});
