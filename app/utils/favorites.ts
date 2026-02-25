import AsyncStorage from "@react-native-async-storage/async-storage";

const FAVORITES_KEY = "FAVORITES_V1";

export async function getFavorites(): Promise<any[]> {
  try {
    const raw = await AsyncStorage.getItem(FAVORITES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error("getFavorites error", e);
    return [];
  }
}

export async function saveFavorites(list: any[]) {
  try {
    await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(list));
    return list;
  } catch (e) {
    console.error("saveFavorites error", e);
    return list;
  }
}

export async function addFavorite(song: any) {
  try {
    const list = await getFavorites();
    if (!list.find((s: any) => String(s.id) === String(song.id))) {
      list.push(song);
      await saveFavorites(list);
    }
    return list;
  } catch (e) {
    console.error("addFavorite error", e);
    return [];
  }
}

export async function removeFavorite(id: any) {
  try {
    const list = await getFavorites();
    const next = list.filter((s: any) => String(s.id) !== String(id));
    await saveFavorites(next);
    return next;
  } catch (e) {
    console.error("removeFavorite error", e);
    return [];
  }
}

export async function isFavorite(id: any) {
  try {
    const list = await getFavorites();
    return list.some((s: any) => String(s.id) === String(id));
  } catch (e) {
    return false;
  }
}
