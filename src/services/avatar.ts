import * as ImagePicker from "expo-image-picker";
import { Directory, File, Paths } from "expo-file-system";

const FOLDER = "perfil";

function folder(): Directory {
  const dir = new Directory(Paths.document, FOLDER);
  if (!dir.exists) dir.create({ intermediates: true });
  return dir;
}

export async function pickAvatar(): Promise<string | null> {
  const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (!permission.granted) return null;

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ["images"],
    allowsEditing: true,
    aspect: [1, 1],
    quality: 0.8,
  });

  if (result.canceled || !result.assets?.length) return null;

  const origem = new File(result.assets[0].uri);
  const destino = new File(folder(), `avatar-${Date.now()}.jpg`);

  origem.copy(destino);
  return destino.uri;
}

export function deleteAvatar(uri: string): void {
  try {
    const file = new File(uri);
    if (file.exists) file.delete();
  } catch (error) {
    console.warn("[avatar] falha ao apagar a foto:", error);
  }
}
