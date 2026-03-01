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
import { colors, spacing, radius } from "../../shared/styles/tokens";
import { font } from "../../shared/styles/typography";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Feather from "@expo/vector-icons/Feather";

import EditProfileModal from "../profile/components/EditProfileModal";

const TOP_PADDING =
  Platform.OS === "android" ? (StatusBar.currentHeight ?? 0) : 44;

const { width } = Dimensions.get("window");
const H_PADDING = Math.min(24, width * 0.05);

const LIST_BOTTOM_SPACER = 96;

export default function ProfileScreen() {
  const { user, loading, authReady, logout, refreshMe } = useAuth();

  const [editOpen, setEditOpen] = useState(false);
  const [editSaving, setEditSaving] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);

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
      <View style={[g.fill, g.center, { backgroundColor: colors.gray100 }]}>
        <Text style={[t.body, { fontFamily: font.body }]}>Loading...</Text>
      </View>
    );
  }

  if (!user) {
    return (
      <View style={[g.fill, g.center, { backgroundColor: colors.gray100 }]}>
        <Text
          style={[
            t.body,
            t.center,
            {
              fontFamily: font.strong,
              marginBottom: spacing.sm,
              paddingHorizontal: H_PADDING,
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
                },
              ]}
            >
              <Text style={[t.primary, { fontFamily: font.strong, lineHeight: 20, }]}>
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
      closeEdit(); // close ONLY on success
    } catch (e: any) {
      // This is the message built by apiFetch (detail/title/text fallback)
      const msg = e?.message || "Could not update profile.";
      setEditError(msg);
    } finally {
      setEditSaving(false);
    }
  }

  return (
    <View style={[g.fill, { backgroundColor: colors.gray100 }]}>
      <ScrollView
        contentContainerStyle={styles.content}
        bounces={false}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[t.hero, styles.pageTitle]}>My Profile</Text>

        <View style={[g.card, styles.card]}>
          <View style={styles.userRow}>
            <View style={styles.avatar} />

            <View style={{ flex: 1 }}>
              <Text style={[t.title, styles.handle]}>{handle}</Text>
              <Text style={[t.body, styles.name]}>{fullName}</Text>
            </View>
          </View>
        </View>

        <View style={g.cardNoPadding}>
          <Text style={[t.title, styles.sectionTitle]}>Contact</Text>

          <View style={styles.contactRow}>
            <Text style={[t.small, styles.label]}>Email</Text>
            <Text style={[t.body, styles.value]}>{user.email}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.contactRow}>
            <Text style={[t.small, styles.label]}>Phone</Text>
            <Text style={[t.body, styles.value, {paddingBottom: 4}]}>{phone || "—"}</Text>
          </View>
        </View>

        <Pressable
          onPress={() => router.push("/collection")}
          {...ctaHandlers}
          hitSlop={10}
          style={{ alignSelf: "stretch" }}
        >
          <Animated.View
            style={[styles.collectionBtn, { transform: [{ scale: ctaScale }] }]}
          >
            <View style={styles.collectionInner}>
              <Feather name="bookmark" size={18} color={colors.white} />
              <Text style={[t.body, styles.collectionText]}>
                Shrine Collection
              </Text>
            </View>
          </Animated.View>
        </Pressable>

        <View style={g.cardNoPadding}>
          <Text style={[t.title, styles.sectionTitle]}>Settings</Text>

          {/* Edit Profile */}
          <Pressable
            style={[styles.settingsRow, loading && styles.rowDisabled]}
            onPress={openEdit}
            disabled={loading}
          >
            <View style={styles.settingsLeft}>
              <Feather name="user" size={18} color={colors.gray500} />
              <Text style={[t.body, styles.settingsText]}>Edit profile</Text>
            </View>

            <Ionicons name="chevron-forward" size={18} color={colors.gray500} />
          </Pressable>

          <View style={styles.divider} />

          {/* Logout */}
          <Pressable
            style={[styles.settingsRow, loading && styles.rowDisabled]}
            onPress={onLogout}
            disabled={loading}
          >
            <View style={styles.settingsLeft}>
              <MaterialIcons name="logout" size={18} color={colors.gray500} />
              <Text style={[t.body, styles.settingsText]}>
                {loading ? "Logging out..." : "Logout"}
              </Text>
            </View>

            <Ionicons name="chevron-forward" size={18} color={colors.gray500} />
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
    color: colors.textPrimary,
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
    backgroundColor: colors.gray300,
  },
  handle: { fontFamily: font.strong, color: colors.textPrimary },
  name: {
    fontFamily: font.body,
    color: colors.textSecondary,
    marginTop: 2,
  },
  sectionTitle: {
    fontFamily: font.title,
    color: colors.textPrimary,
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
    color: colors.textPrimary,
    marginBottom: 2,
  },
  value: {
    fontFamily: font.body,
    color: colors.textSecondary,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.gray300,
    marginHorizontal: spacing.lg,
  },
  collectionBtn: {
    backgroundColor: colors.textPrimary,
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
    color: colors.white,
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
    color: colors.textPrimary,
  },
  rowDisabled: {
    opacity: 0.6,
  },
});
