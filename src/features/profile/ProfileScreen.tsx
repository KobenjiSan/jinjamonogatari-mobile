import React, { useRef, useState } from "react";
import {
  View,
  Text,
  Pressable,
  Animated,
  StyleSheet,
  Platform,
  StatusBar,
  Dimensions,
  ScrollView,
} from "react-native";
import { router } from "expo-router";
import { useAuth } from "../../core/auth/AuthProvider";
import { updateMyProfileApi } from "../../features/auth/authApi";
import { g } from "../../shared/styles/global";
import { t } from "../../shared/styles/text";
import { spacing, radius } from "../../shared/styles/tokens";
import { font } from "../../shared/styles/typography";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Feather from "@expo/vector-icons/Feather";

import EditProfileModal from "../profile/components/EditProfileModal";
import ThemeSelectModal from "../profile/components/ThemeSelectModal";
import {
  useTheme,
  useThemeMode,
  setTheme,
  type ThemeMode,
} from "../../shared/theme/useTheme";

const TOP_PADDING =
  Platform.OS === "android" ? (StatusBar.currentHeight ?? 0) : 44;

const { width } = Dimensions.get("window");
const H_PADDING = Math.min(24, width * 0.05);

const LIST_BOTTOM_SPACER = 96;

export default function ProfileScreen() {
  const theme = useTheme();
  const activeTheme = useThemeMode();
  const { user, loading, authReady, logout, refreshMe } = useAuth();

  const [editOpen, setEditOpen] = useState(false);
  const [editSaving, setEditSaving] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);

  const [themeOpen, setThemeOpen] = useState(false);

  const ctaScale = useRef(new Animated.Value(1)).current;

  const makePressHandlers = (val: Animated.Value, downTo = 0.96) => ({
    onPressIn: () =>
      Animated.spring(val, { toValue: downTo, useNativeDriver: true }).start(),
    onPressOut: () =>
      Animated.spring(val, { toValue: 1, useNativeDriver: true }).start(),
  });

  const ctaHandlers = makePressHandlers(ctaScale, 0.96);

  if (!authReady) {
    return (
      <View style={[g.fill, g.center, { backgroundColor: theme.colors.bgApp }]}>
        <Text
          style={[
            t.body,
            { fontFamily: font.body, color: theme.colors.textPrimary },
          ]}
        >
          Loading...
        </Text>
      </View>
    );
  }

  if (!user) {
    return (
      <View style={[g.fill, g.center, { backgroundColor: theme.colors.bgApp }]}>
        <Text
          style={[
            t.body,
            t.center,
            {
              fontFamily: font.strong,
              marginBottom: spacing.sm,
              paddingHorizontal: H_PADDING,
              color: theme.colors.textPrimary,
            },
          ]}
        >
          Login to access your account.
        </Text>

        <Pressable
          onPress={() => router.push("/login")}
          {...ctaHandlers}
          hitSlop={10}
          style={{ alignSelf: "center", marginTop: spacing.sm }}
        >
          <Animated.View style={{ transform: [{ scale: ctaScale }] }}>
            <View
              style={[
                g.btnOutline,
                {
                  paddingVertical: spacing.sm,
                  paddingHorizontal: spacing.xl,
                  opacity: 0.75,
                  borderColor: theme.colors.border,
                },
              ]}
            >
              <Text
                style={[
                  t.primary,
                  {
                    fontFamily: font.strong,
                    lineHeight: 20,
                    color: theme.colors.textPrimary,
                  },
                ]}
              >
                Get Started
              </Text>
            </View>
          </Animated.View>
        </Pressable>
      </View>
    );
  }

  const handle = `@${user.username}`;
  const fullName =
    [user.firstName, user.lastName].filter(Boolean).join(" ") || "—";
  const phone = user.phone || "";

  async function onLogout() {
    if (loading) return;
    await logout();
  }

  function openEdit() {
    setEditError(null);
    setEditOpen(true);
  }

  function closeEdit() {
    setEditOpen(false);
  }

  async function onSaveProfile(payload: {
    firstName: string;
    lastName: string;
    phone: string;
  }) {
    if (editSaving) return;

    setEditSaving(true);
    setEditError(null);

    try {
      await updateMyProfileApi({
        firstName: payload.firstName,
        lastName: payload.lastName,
        phone: payload.phone,
      });

      await refreshMe();
      closeEdit();
    } catch (e: any) {
      const msg = e?.message || "Could not update profile.";
      setEditError(msg);
    } finally {
      setEditSaving(false);
    }
  }

  return (
    <View style={[g.fill, { backgroundColor: theme.colors.bgApp }]}>
      <ScrollView
        contentContainerStyle={styles.content}
        bounces={false}
        showsVerticalScrollIndicator={false}
      >
        <Text
          style={[
            t.hero,
            styles.pageTitle,
            { color: theme.colors.textPrimary },
          ]}
        >
          My Profile
        </Text>

        <View
          style={[
            g.card,
            styles.card,
            { backgroundColor: theme.colors.bgCard },
          ]}
        >
          <View style={styles.userRow}>
            <View
              style={[styles.avatar, { backgroundColor: theme.colors.border }]}
            />

            <View style={{ flex: 1 }}>
              <Text
                style={[
                  t.title,
                  styles.handle,
                  { color: theme.colors.textPrimary },
                ]}
              >
                {handle}
              </Text>
              <Text
                style={[
                  t.body,
                  styles.name,
                  { color: theme.colors.textSecondary },
                ]}
              >
                {fullName}
              </Text>
            </View>
          </View>
        </View>

        <View
          style={[g.cardNoPadding, { backgroundColor: theme.colors.bgCard }]}
        >
          <Text
            style={[
              t.title,
              styles.sectionTitle,
              { color: theme.colors.textPrimary },
            ]}
          >
            Contact
          </Text>

          <View style={styles.contactRow}>
            <Text
              style={[
                t.small,
                styles.label,
                { color: theme.colors.textPrimary },
              ]}
            >
              Email
            </Text>
            <Text
              style={[
                t.body,
                styles.value,
                { color: theme.colors.textSecondary },
              ]}
            >
              {user.email}
            </Text>
          </View>

          <View
            style={[styles.divider, { backgroundColor: theme.colors.border }]}
          />

          <View style={styles.contactRow}>
            <Text
              style={[
                t.small,
                styles.label,
                { color: theme.colors.textPrimary },
              ]}
            >
              Phone
            </Text>
            <Text
              style={[
                t.body,
                styles.value,
                { paddingBottom: 4, color: theme.colors.textSecondary },
              ]}
            >
              {phone || "—"}
            </Text>
          </View>
        </View>

        <Pressable
          onPress={() => router.push("/collection")}
          {...ctaHandlers}
          hitSlop={10}
          style={{ alignSelf: "stretch" }}
        >
          <Animated.View
            style={[
              styles.collectionBtn,
              {
                transform: [{ scale: ctaScale }],
                backgroundColor: theme.colors.buttonPrimaryBg,
              },
            ]}
          >
            <View style={styles.collectionInner}>
              <Feather
                name="bookmark"
                size={18}
                color={theme.colors.buttonPrimaryText}
              />
              <Text
                style={[
                  t.body,
                  styles.collectionText,
                  { color: theme.colors.buttonPrimaryText },
                ]}
              >
                Shrine Collection
              </Text>
            </View>
          </Animated.View>
        </Pressable>

        <View
          style={[g.cardNoPadding, { backgroundColor: theme.colors.bgCard }]}
        >
          <Text
            style={[
              t.title,
              styles.sectionTitle,
              { color: theme.colors.textPrimary },
            ]}
          >
            Settings
          </Text>

          {/* Edit Profile */}
          <Pressable
            style={[styles.settingsRow, loading && styles.rowDisabled]}
            onPress={openEdit}
            disabled={loading}
          >
            <View style={styles.settingsLeft}>
              <Feather
                name="user"
                size={18}
                color={theme.colors.textSecondary}
              />
              <Text
                style={[
                  t.body,
                  styles.settingsText,
                  { color: theme.colors.textPrimary },
                ]}
              >
                Edit profile
              </Text>
            </View>

            <Ionicons
              name="chevron-forward"
              size={18}
              color={theme.colors.textSecondary}
            />
          </Pressable>

          <View
            style={[styles.divider, { backgroundColor: theme.colors.border }]}
          />

          {/* Theme */}
          <Pressable
            style={styles.settingsRow}
            onPress={() => setThemeOpen(true)}
          >
            <View style={styles.settingsLeft}>
              <Feather
                name="moon"
                size={18}
                color={theme.colors.textSecondary}
              />
              <Text
                style={[
                  t.body,
                  styles.settingsText,
                  { color: theme.colors.textPrimary },
                ]}
              >
                Theme
              </Text>
            </View>

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: spacing.sm,
              }}
            >
              <Text
                style={[
                  t.small,
                  {
                    fontFamily: font.body,
                    paddingTop: 2,
                    color: theme.colors.textMuted,
                  },
                ]}
              >
                {activeTheme}
              </Text>
              <Ionicons
                name="chevron-forward"
                size={18}
                color={theme.colors.textSecondary}
              />
            </View>
          </Pressable>

          <View
            style={[styles.divider, { backgroundColor: theme.colors.border }]}
          />

          {/* Logout */}
          <Pressable
            style={[styles.settingsRow, loading && styles.rowDisabled]}
            onPress={onLogout}
            disabled={loading}
          >
            <View style={styles.settingsLeft}>
              <MaterialIcons
                name="logout"
                size={18}
                color={theme.colors.textSecondary}
              />
              <Text
                style={[
                  t.body,
                  styles.settingsText,
                  { color: theme.colors.textPrimary },
                ]}
              >
                {loading ? "Logging out..." : "Logout"}
              </Text>
            </View>

            <Ionicons
              name="chevron-forward"
              size={18}
              color={theme.colors.textSecondary}
            />
          </Pressable>
        </View>

        <View style={{ height: LIST_BOTTOM_SPACER }} />
      </ScrollView>

      <EditProfileModal
        visible={editOpen}
        onClose={closeEdit}
        username={user.username}
        email={user.email}
        initialFirstName={user.firstName ?? ""}
        initialLastName={user.lastName ?? ""}
        initialPhone={user.phone ?? ""}
        onSave={onSaveProfile}
        saving={editSaving}
        error={editError}
      />

      {/* Theme modal */}
      <ThemeSelectModal
        visible={themeOpen}
        onClose={() => setThemeOpen(false)}
        activeTheme={activeTheme}
        onSelectTheme={(mode: ThemeMode) => setTheme(mode)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingTop: TOP_PADDING + spacing.sm,
    paddingHorizontal: H_PADDING,
    paddingBottom: spacing.xl,
    rowGap: spacing.lg,
  },
  pageTitle: {
    fontFamily: font.title,
    textAlign: "center",
    marginBottom: spacing.sm,
  },
  card: { paddingVertical: spacing.md },
  userRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  avatar: {
    width: 76,
    height: 76,
    borderRadius: 999,
  },
  handle: { fontFamily: font.strong },
  name: {
    fontFamily: font.body,
    marginTop: 2,
  },
  sectionTitle: {
    fontFamily: font.title,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
  },
  contactRow: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  label: {
    fontFamily: font.strong,
    marginBottom: 2,
  },
  value: {
    fontFamily: font.body,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    marginHorizontal: spacing.lg,
  },
  collectionBtn: {
    borderRadius: radius.lg,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.lg,
    alignItems: "center",
    justifyContent: "center",
  },
  collectionInner: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  collectionText: {
    fontFamily: font.strong,
  },
  settingsRow: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  settingsLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  settingsText: {
    fontFamily: font.body,
  },
  rowDisabled: {
    opacity: 0.6,
  },
});
