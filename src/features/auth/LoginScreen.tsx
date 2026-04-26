import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Keyboard,
  TouchableWithoutFeedback,
  Image,
} from "react-native";
import { router } from "expo-router";
import { useAuth } from "../../core/auth/AuthProvider";
import { g } from "../../shared/styles/global";
import { t } from "../../shared/styles/text";
import { spacing, radius } from "../../shared/styles/tokens";
import { font } from "../../shared/styles/typography";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useTheme } from "../../shared/theme/useTheme";

export default function LoginScreen() {
  const theme = useTheme();
  const logo = require("../../../assets/images/LogoTest.png");
  const { login, loading } = useAuth();

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function popToProfile() {
    if (router.canGoBack()) router.back();
    else router.replace("/(tabs)/profile");
  }

  function onBack() {
    popToProfile();
  }

  async function onLogin() {
    if (loading) return;

    try {
      setError(null);
      await login(identifier.trim(), password);
      popToProfile();
    } catch (e: any) {
      setError(e.message || "Login failed");
    }
  }

  return (
    // <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={[g.fill, styles.root, { backgroundColor: theme.colors.bgApp }]}>
        <KeyboardAvoidingView
          style={g.fill}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          keyboardVerticalOffset={Platform.OS === "ios" ? 12 : 0}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            bounces={false}
          >
            {/* Top Area */}
            <View style={styles.topArea}>
              <Pressable onPress={onBack} hitSlop={10}>
                <View
                  style={[
                    g.iconBtnCircle,
                    g.iconBtnOverlay,
                    { backgroundColor: theme.colors.overlayLight },
                  ]}
                >
                  <Ionicons
                    name="chevron-back"
                    size={22}
                    color={theme.colors.textPrimary}
                  />
                </View>
              </Pressable>
            </View>

            {/* Main Content */}
            <View style={styles.content}>
              {/* Logo */}
              <Image
                source={logo}
                style={[
                  styles.logo,
                  { backgroundColor: theme.colors.bgCard, borderColor: theme.colors.border },
                ]}
                resizeMode="contain"
              />

              <Text
                style={[
                  t.hero,
                  styles.title,
                  { color: theme.colors.textPrimary },
                ]}
              >
                Login
              </Text>

              {/* Inputs */}
              <View style={styles.inputWrap}>
                <TextInput
                  placeholder="Email or Username"
                  placeholderTextColor={theme.colors.textMuted}
                  value={identifier}
                  onChangeText={setIdentifier}
                  autoCapitalize="none"
                  style={[
                    styles.input,
                    {
                      borderColor: theme.colors.border,
                      backgroundColor: theme.colors.inputEditableBg,
                      color: theme.colors.textPrimary,
                    },
                  ]}
                  returnKeyType="next"
                  editable={!loading}
                />

                <View style={styles.passwordWrap}>
                  <TextInput
                    placeholder="Password"
                    placeholderTextColor={theme.colors.textMuted}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPw}
                    style={[
                      styles.input,
                      styles.inputWithIcon,
                      {
                        borderColor: theme.colors.border,
                        backgroundColor: theme.colors.inputEditableBg,
                        color: theme.colors.textPrimary,
                      },
                    ]}
                    returnKeyType="done"
                    onSubmitEditing={onLogin}
                    editable={!loading}
                  />

                  <Pressable
                    disabled={loading}
                    onPress={() => setShowPw((v) => !v)}
                    style={styles.eyeBtn}
                    hitSlop={10}
                  >
                    <Ionicons
                      name={showPw ? "eye-off-outline" : "eye-outline"}
                      size={22}
                      color={theme.colors.textSecondary}
                    />
                  </Pressable>
                </View>

                {error && (
                  <Text style={[styles.error, { color: theme.colors.issue }]}>
                    {error}
                  </Text>
                )}

                <Pressable
                  style={[
                    styles.signInBtn,
                    { backgroundColor: theme.colors.buttonPrimaryBg },
                    loading && styles.btnDisabled,
                  ]}
                  onPress={onLogin}
                  disabled={loading}
                >
                  <Text
                    style={[
                      styles.signInText,
                      { color: theme.colors.buttonPrimaryText },
                    ]}
                  >
                    {loading ? "Signing In..." : "Sign In"}
                  </Text>
                </Pressable>
              </View>

              {/* Bottom Link */}
              <Text style={[styles.bottomText, { color: theme.colors.textSecondary }]}>
                New here?{" "}
                <Text
                  style={[t.link, { color: theme.colors.link }]}
                  onPress={() => {
                    router.replace("/register");
                  }}
                >
                  Sign Up
                </Text>
              </Text>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    // </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  root: {},

  scrollContent: {
    flexGrow: 1,
  },

  topArea: {
    paddingTop: spacing.xl * 2,
    paddingHorizontal: spacing.xl,
  },

  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.xl * 2,
    paddingBottom: spacing.xl,
  },

  title: {
    fontFamily: font.title,
    marginBottom: spacing.lg,
    alignSelf: "baseline",
  },

  logo: {
    width: 96,
    height: 96,
    borderRadius: radius.lg,
    borderWidth: 1,
    marginBottom: spacing.xl,
  },

  inputWrap: {
    width: "100%",
    gap: spacing.md,
  },

  input: {
    width: "100%",
    borderWidth: 1,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.lg,
    fontFamily: font.body,
  },

  inputWithIcon: {
    paddingRight: 56,
  },

  passwordWrap: {
    width: "100%",
    position: "relative",
  },

  eyeBtn: {
    position: "absolute",
    right: 12,
    top: 0,
    bottom: 0,
    justifyContent: "center",
  },

  error: {
    textAlign: "center",
  },

  signInBtn: {
    paddingVertical: spacing.lg,
    borderRadius: radius.lg,
    alignItems: "center",
    marginTop: spacing.sm,
  },

  signInText: {
    fontFamily: font.strong,
    fontSize: 16,
  },

  bottomText: {
    marginTop: spacing.xl,
    textAlign: "center",
  },

  btnDisabled: {
    opacity: 0.6,
  },
});