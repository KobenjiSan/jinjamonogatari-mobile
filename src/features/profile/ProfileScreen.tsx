import React, { useRef } from "react";
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
import { g } from "../../shared/styles/global";
import { t } from "../../shared/styles/text";
import { colors, spacing, radius } from "../../shared/styles/tokens";
import { font } from "../../shared/styles/typography";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Feather from "@expo/vector-icons/Feather";

const TOP_PADDING =
  Platform.OS === "android" ? (StatusBar.currentHeight ?? 0) : 44;

const { width } = Dimensions.get("window");
const H_PADDING = Math.min(24, width * 0.05);

const LIST_BOTTOM_SPACER = 96;

export default function ProfileScreen() {
  const { user, loading, logout } = useAuth();

  const ctaScale = useRef(new Animated.Value(1)).current;

  const makePressHandlers = (val: Animated.Value, downTo = 0.96) => ({
    onPressIn: () =>
      Animated.spring(val, { toValue: downTo, useNativeDriver: true }).start(),
    onPressOut: () =>
      Animated.spring(val, { toValue: 1, useNativeDriver: true }).start(),
  });

  const ctaHandlers = makePressHandlers(ctaScale, 0.96);

  if (loading) {
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
    [user.firstName, user.lastName].filter(Boolean).join(" ") || "Sam Keller";
  const phone = user.phone || "";

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
            <Text style={[t.body, styles.value]}>{phone || "—"}</Text>
          </View>
        </View>

        <Pressable style={styles.collectionBtn} onPress={() => {}}>
          <View style={styles.collectionInner}>
            <Feather name="bookmark" size={18} color={colors.white} />
            <Text style={[t.body, styles.collectionText]}>
              Shrine Collection
            </Text>
          </View>
        </Pressable>

        <View style={g.cardNoPadding}>
          <Text style={[t.title, styles.sectionTitle]}>Settings</Text>

          <Pressable style={styles.settingsRow} onPress={logout}>
            <View style={styles.settingsLeft}>
              <MaterialIcons
                name="logout"
                size={18}
                color={colors.gray500}
              />
              <Text style={[t.body, styles.settingsText]}>Logout</Text>
            </View>

            <Ionicons
              name="chevron-forward"
              size={18}
              color={colors.gray500}
            />
          </Pressable>
        </View>

        <View style={{ height: LIST_BOTTOM_SPACER }} />
      </ScrollView>
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
});
