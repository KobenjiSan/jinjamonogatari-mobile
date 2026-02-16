import * as SecureStore from "expo-secure-store";

const KEY = "auth_token";

export async function saveToken(token: string): Promise<void> {
  await SecureStore.setItemAsync(KEY, token);
}

export async function getToken(): Promise<string | null> {
  return await SecureStore.getItemAsync(KEY);
}

export async function clearToken(): Promise<void> {
  await SecureStore.deleteItemAsync(KEY);
}
