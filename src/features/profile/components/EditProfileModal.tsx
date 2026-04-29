import React, { useEffect, useMemo, useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  KeyboardAvoidingView,
  Platform,
  useWindowDimensions,
} from "react-native";

import { t } from "../../../shared/styles/text";
import { spacing, radius } from "../../../shared/styles/tokens";
import { font } from "../../../shared/styles/typography";
import { useTheme } from "../../../shared/theme/useTheme";

type EditProfileValues = {
  firstName: string;
  lastName: string;
  phone: string;
};

type Props = {
  visible: boolean;
  onClose: () => void;

  username: string;
  email: string;

  initialFirstName?: string | null;
  initialLastName?: string | null;
  initialPhone?: string | null;

  onSave?: (payload: EditProfileValues) => void;

  saving?: boolean;
  error?: string | null;
};

export default function EditProfileModal({
  visible,
  onClose,
  username,
  email,
  initialFirstName,
  initialLastName,
  initialPhone,
  onSave,
  saving = false,
  error = null,
}: Props) {
  const theme = useTheme();
  const { height: winH } = useWindowDimensions();

  const [firstName, setFirstName] = useState(initialFirstName ?? "");
  const [lastName, setLastName] = useState(initialLastName ?? "");
  const [phone, setPhone] = useState(initialPhone ?? "");

  // When modal opens (or user changes), re-seed the form.
  useEffect(() => {
    if (!visible) return;

    setFirstName(initialFirstName ?? "");
    setLastName(initialLastName ?? "");
    setPhone(initialPhone ?? "");
  }, [visible, initialFirstName, initialLastName, initialPhone]);

  const trimmed = useMemo(() => {
    return {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      phone: phone.trim(),
    };
  }, [firstName, lastName, phone]);

  const initialTrimmed = useMemo(() => {
    return {
      firstName: (initialFirstName ?? "").trim(),
      lastName: (initialLastName ?? "").trim(),
      phone: (initialPhone ?? "").trim(),
    };
  }, [initialFirstName, initialLastName, initialPhone]);

  const isDirty =
    trimmed.firstName !== initialTrimmed.firstName ||
    trimmed.lastName !== initialTrimmed.lastName ||
    trimmed.phone !== initialTrimmed.phone;

  function close() {
    if (saving) return;
    onClose();
  }

  function handleSave() {
    if (saving) return;
    if (!isDirty) return;

    onSave?.({
      firstName: trimmed.firstName,
      lastName: trimmed.lastName,
      phone: trimmed.phone,
    });
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={close}
    >
      <Pressable
        style={[
          styles.modalRoot,
          { backgroundColor: theme.colors.overlayDark },
        ]}
        onPress={close}
      >
        <Pressable
          style={[
            styles.sheet,
            {
              maxHeight: winH * 0.78,
              backgroundColor: theme.colors.bgCard,
              shadowColor: theme.colors.overlayDark,
            },
          ]}
          onPress={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <View style={styles.headerRow}>
            <Text
              style={[
                t.title,
                styles.headerTitle,
                { color: theme.colors.textPrimary },
              ]}
            >
              Edit Profile
            </Text>

            <Pressable
              style={[
                styles.closeButton,
                { backgroundColor: theme.colors.overlayLight },
                saving && styles.disabled,
              ]}
              onPress={close}
              hitSlop={12}
              disabled={saving}
            >
              <Text
                style={[
                  t.body,
                  styles.closeText,
                  { color: theme.colors.textPrimary },
                ]}
              >
                ✕
              </Text>
            </Pressable>
          </View>

          <KeyboardAvoidingView
            style={styles.keyboardWrap}
            behavior={Platform.OS === "ios" ? "padding" : undefined}
            keyboardVerticalOffset={Platform.OS === "ios" ? 24 : 0}
          >
            <ScrollView
              style={styles.scroll}
              contentContainerStyle={styles.content}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator
            >
              {/* Section: Identifiers */}
              <Text
                style={[
                  t.title,
                  styles.sectionTitle,
                  { color: theme.colors.textPrimary },
                ]}
              >
                Identity
              </Text>

              <LabeledReadOnlyField
                label="Username"
                value={`@${username}`}
                theme={theme}
              />

              <LabeledInput
                label="First name"
                value={firstName}
                onChangeText={setFirstName}
                editable={!saving}
                autoCapitalize="words"
                returnKeyType="next"
                theme={theme}
              />

              <LabeledInput
                label="Last name"
                value={lastName}
                onChangeText={setLastName}
                editable={!saving}
                autoCapitalize="words"
                returnKeyType="next"
                theme={theme}
              />

              {/* Section: Contact */}
              <Text
                style={[
                  t.title,
                  styles.sectionTitle,
                  { color: theme.colors.textPrimary },
                ]}
              >
                Contact
              </Text>

              <LabeledReadOnlyField label="Email" value={email} theme={theme} />

              <LabeledInput
                label="Phone"
                value={phone}
                onChangeText={setPhone}
                editable={!saving}
                keyboardType={
                  Platform.OS === "ios"
                    ? "numbers-and-punctuation"
                    : "phone-pad"
                }
                returnKeyType="done"
                theme={theme}
              />

              {!!error && (
                <Text style={[styles.errorText, { color: theme.colors.issue }]}>
                  {error}
                </Text>
              )}

              <Pressable
                style={[
                  styles.saveBtn,
                  { backgroundColor: theme.colors.buttonPrimaryBg },
                  (!isDirty || saving) && styles.btnDisabled,
                ]}
                onPress={handleSave}
                disabled={!isDirty || saving}
              >
                <Text
                  style={[
                    styles.saveText,
                    { color: theme.colors.buttonPrimaryText },
                  ]}
                >
                  {saving ? "Saving..." : "Save"}
                </Text>
              </Pressable>

              <View style={{ height: spacing.sm }} />
            </ScrollView>
          </KeyboardAvoidingView>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

function LabeledInput(props: {
  label: string;
  value: string;
  onChangeText: (v: string) => void;
  editable?: boolean;
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  keyboardType?: any;
  returnKeyType?: any;
  theme: any;
}) {
  const {
    label,
    value,
    onChangeText,
    editable = true,
    autoCapitalize = "none",
    keyboardType,
    returnKeyType,
    theme,
  } = props;

  return (
    <View style={styles.fieldBlock}>
      <Text
        style={[t.small, styles.label, { color: theme.colors.textPrimary }]}
      >
        {label}
      </Text>
      <TextInput
        placeholder={label}
        placeholderTextColor={theme.colors.textMuted}
        value={value}
        onChangeText={onChangeText}
        editable={editable}
        autoCapitalize={autoCapitalize}
        keyboardType={keyboardType}
        returnKeyType={returnKeyType}
        style={[
          styles.input,
          {
            borderColor: theme.colors.border,
            backgroundColor: theme.colors.inputEditableBg,
            color: theme.colors.textPrimary,
          },
          !editable && styles.inputDisabled,
        ]}
      />
    </View>
  );
}

function LabeledReadOnlyField(props: {
  label: string;
  value: string;
  theme: any;
}) {
  const { label, value, theme } = props;

  return (
    <View style={styles.fieldBlock}>
      <Text
        style={[t.small, styles.label, { color: theme.colors.textPrimary }]}
      >
        {label}
      </Text>
      <View
        style={[
          styles.input,
          styles.readOnlyBox,
          {
            borderColor: theme.colors.border,
            backgroundColor: theme.colors.inputReadOnlyBg,
          },
        ]}
      >
        <Text
          style={[styles.readOnlyText, { color: theme.colors.textSecondary }]}
          numberOfLines={1}
        >
          {value}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  modalRoot: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: spacing.lg,
  },

  sheet: {
    width: "100%",
    borderRadius: radius.lg,
    overflow: "hidden",
    paddingBottom: spacing.md,

    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },

  headerRow: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.sm,
    alignItems: "center",
    justifyContent: "center",
  },

  headerTitle: {
    fontFamily: font.title,
  },

  keyboardWrap: {
  flexShrink: 1,
},

scroll: {
  flexShrink: 1,
},

  closeButton: {
    position: "absolute",
    top: spacing.sm,
    right: spacing.sm,
    zIndex: 10,
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },

  closeText: {
    fontSize: 14,
    lineHeight: 16,
  },

  disabled: {
    opacity: 0.6,
  },

  content: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
    gap: spacing.md,
  },

  sectionTitle: {
    fontFamily: font.title,
    marginTop: spacing.xs,
  },

  fieldBlock: {
    gap: spacing.xs,
  },

  label: {
    fontFamily: font.strong,
  },

  input: {
    width: "100%",
    borderWidth: 1,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.lg,
    fontFamily: font.body,
  },

  inputDisabled: {
    opacity: 0.7,
  },

  readOnlyBox: {
    justifyContent: "center",
  },

  readOnlyText: {
    fontFamily: font.body,
  },

  errorText: {
    textAlign: "center",
  },

  saveBtn: {
    paddingVertical: spacing.lg,
    borderRadius: radius.lg,
    alignItems: "center",
    marginTop: spacing.sm,
  },

  btnDisabled: {
    opacity: 0.6,
  },

  saveText: {
    fontFamily: font.strong,
    fontSize: 16,
  },
});
