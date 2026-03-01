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

export default function RegisterScreen() {
  const theme = useTheme();
  const logo = require("../../../assets/images/LogoTest.png");
  const { register, loading } = useAuth();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function onBack() {
    router.back();
  }

  async function onRegister() {
    if (loading) return;

    try {
      setError(null);
      await register(username.trim(), email.trim(), password);
      onBack();
    } catch (e: any) {
      setError(e.message || "Registration failed");
    }
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
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
                  {
                    backgroundColor: theme.colors.bgCard,
                    borderColor: theme.colors.border,
                  },
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
                Register
              </Text>

              {/* Inputs */}
              <View style={styles.inputWrap}>
                <TextInput
                  placeholder="Username"
                  placeholderTextColor={theme.colors.textMuted}
                  value={username}
                  onChangeText={setUsername}
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

                <TextInput
                  placeholder="Email"
                  placeholderTextColor={theme.colors.textMuted}
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  keyboardType="email-address"
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
                    onSubmitEditing={onRegister}
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
                    styles.primaryBtn,
                    { backgroundColor: theme.colors.buttonPrimaryBg },
                    loading && styles.btnDisabled,
                  ]}
                  onPress={onRegister}
                  disabled={loading}
                >
                  <Text
                    style={[
                      styles.primaryText,
                      { color: theme.colors.buttonPrimaryText },
                    ]}
                  >
                    {loading ? "Creating..." : "Create Account"}
                  </Text>
                </Pressable>
              </View>

              {/* Bottom Link */}
              <Text
                style={[
                  styles.bottomText,
                  { color: theme.colors.textSecondary },
                ]}
              >
                Already have an account?{" "}
                <Text
                  style={[t.link, { color: theme.colors.link }]}
                  onPress={() => router.replace("/login")}
                >
                  Log In
                </Text>
              </Text>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </TouchableWithoutFeedback>
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

  primaryBtn: {
    paddingVertical: spacing.lg,
    borderRadius: radius.lg,
    alignItems: "center",
    marginTop: spacing.sm,
  },

  primaryText: {
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