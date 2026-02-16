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
} from "react-native";
import { router } from "expo-router";
import { useAuth } from "../../core/auth/AuthProvider";
import { g } from "../../shared/styles/global";
import { t } from "../../shared/styles/text";
import { colors, spacing, radius } from "../../shared/styles/tokens";
import { font } from "../../shared/styles/typography";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function LoginScreen() {
  const { login } = useAuth();

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
    try {
      setError(null);
      await login(identifier.trim(), password);
      popToProfile();
    } catch (e: any) {
      setError(e.message || "Login failed");
    }
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={[g.fill, styles.root]}>
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
                <View style={[g.iconBtnCircle, g.iconBtnOverlay]}>
                  <Ionicons name="chevron-back" size={22} color="black" />
                </View>
              </Pressable>
            </View>

            {/* Main Content */}
            <View style={styles.content}>
              {/* Logo Placeholder */}
              <View style={styles.logoBox} />

              <Text style={[t.hero, styles.title]}>Login</Text>

              {/* Inputs */}
              <View style={styles.inputWrap}>
                <TextInput
                  placeholder="Email or Username"
                  placeholderTextColor={colors.gray500}
                  value={identifier}
                  onChangeText={setIdentifier}
                  autoCapitalize="none"
                  style={styles.input}
                  returnKeyType="next"
                />

                <View style={styles.passwordWrap}>
                  <TextInput
                    placeholder="Password"
                    placeholderTextColor={colors.gray500}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPw}
                    style={[styles.input, styles.inputWithIcon]}
                    returnKeyType="done"
                    onSubmitEditing={onLogin}
                  />

                  <Pressable
                    onPress={() => setShowPw((v) => !v)}
                    style={styles.eyeBtn}
                    hitSlop={10}
                  >
                    <Ionicons
                      name={showPw ? "eye-off-outline" : "eye-outline"}
                      size={22}
                      color={colors.gray600}
                    />
                  </Pressable>
                </View>

                {error && <Text style={styles.error}>{error}</Text>}

                <Pressable style={styles.signInBtn} onPress={onLogin}>
                  <Text style={styles.signInText}>Sign In</Text>
                </Pressable>
              </View>

              {/* Bottom Link */}
              <Text style={styles.bottomText}>
                New here?{" "}
                <Text
                  style={t.link}
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
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  root: {
    backgroundColor: colors.gray100,
  },

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

  logoBox: {
    width: 96,
    height: 96,
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.gray300,
    marginBottom: spacing.xl,
  },

  inputWrap: {
    width: "100%",
    gap: spacing.md,
  },

  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: colors.gray300,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.lg,
    fontFamily: font.body,
    backgroundColor: colors.white,
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
    color: "red",
    textAlign: "center",
  },

  signInBtn: {
    backgroundColor: colors.black,
    paddingVertical: spacing.lg,
    borderRadius: radius.lg,
    alignItems: "center",
    marginTop: spacing.sm,
  },

  signInText: {
    color: colors.white,
    fontFamily: font.strong,
    fontSize: 16,
  },

  bottomText: {
    marginTop: spacing.xl,
    textAlign: "center",
  },
});
