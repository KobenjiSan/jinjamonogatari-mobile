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

import { g } from "../../../shared/styles/global";
import { t } from "../../../shared/styles/text";
import { colors, spacing, radius } from "../../../shared/styles/tokens";
import { font } from "../../../shared/styles/typography";

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
      <Pressable style={styles.backdrop} onPress={close} />

      <View style={styles.centerWrap}>
        <View style={[styles.sheet, { maxHeight: winH * 0.78 }]}>
          {/* Header */}
          <View style={styles.headerRow}>
            <Text style={[t.title, styles.headerTitle]}>Edit Profile</Text>

            <Pressable
              style={[styles.closeButton, saving && styles.disabled]}
              onPress={close}
              hitSlop={12}
              disabled={saving}
            >
              <Text style={[t.body, t.primary, styles.closeText]}>✕</Text>
            </Pressable>
          </View>

          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : undefined}
            keyboardVerticalOffset={Platform.OS === "ios" ? 24 : 0}
          >
            <ScrollView
              contentContainerStyle={styles.content}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator
            >
              {/* Section: Identifiers */}
              <Text style={[t.title, styles.sectionTitle]}>Identity</Text>

              <LabeledReadOnlyField label="Username" value={`@${username}`} />

              <LabeledInput
                label="First name"
                value={firstName}
                onChangeText={setFirstName}
                editable={!saving}
                autoCapitalize="words"
                returnKeyType="next"
              />

              <LabeledInput
                label="Last name"
                value={lastName}
                onChangeText={setLastName}
                editable={!saving}
                autoCapitalize="words"
                returnKeyType="next"
              />

              {/* Section: Contact */}
              <Text style={[t.title, styles.sectionTitle]}>Contact</Text>

              <LabeledReadOnlyField label="Email" value={email} />

              <LabeledInput
                label="Phone"
                value={phone}
                onChangeText={setPhone}
                editable={!saving}
                keyboardType={Platform.OS === "ios" ? "numbers-and-punctuation" : "phone-pad"}
                returnKeyType="done"
              />

              {!!error && <Text style={styles.errorText}>{error}</Text>}

              <Pressable
                style={[
                  styles.saveBtn,
                  (!isDirty || saving) && styles.btnDisabled,
                ]}
                onPress={handleSave}
                disabled={!isDirty || saving}
              >
                <Text style={styles.saveText}>
                  {saving ? "Saving..." : "Save"}
                </Text>
              </Pressable>

              <View style={{ height: spacing.sm }} />
            </ScrollView>
          </KeyboardAvoidingView>
        </View>
      </View>
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
}) {
  const {
    label,
    value,
    onChangeText,
    editable = true,
    autoCapitalize = "none",
    keyboardType,
    returnKeyType,
  } = props;

  return (
    <View style={styles.fieldBlock}>
      <Text style={[t.small, styles.label]}>{label}</Text>
      <TextInput
        placeholder={label}
        placeholderTextColor={colors.gray500}
        value={value}
        onChangeText={onChangeText}
        editable={editable}
        autoCapitalize={autoCapitalize}
        keyboardType={keyboardType}
        returnKeyType={returnKeyType}
        style={[styles.input, !editable && styles.inputDisabled]}
      />
    </View>
  );
}

function LabeledReadOnlyField(props: { label: string; value: string }) {
  const { label, value } = props;

  return (
    <View style={styles.fieldBlock}>
      <Text style={[t.small, styles.label]}>{label}</Text>
      <View style={[styles.input, styles.readOnlyBox]}>
        <Text style={styles.readOnlyText} numberOfLines={1}>
          {value}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.55)",
  },

  centerWrap: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: spacing.lg,
  },

  sheet: {
    width: "100%",
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    overflow: "hidden",
    paddingBottom: spacing.md,

    shadowColor: colors.black,
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
    color: colors.textPrimary,
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
    backgroundColor: colors.overlayLight,
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
    color: colors.textPrimary,
    marginTop: spacing.xs,
  },

  fieldBlock: {
    gap: spacing.xs,
  },

  label: {
    fontFamily: font.strong,
    color: colors.textPrimary,
  },

  // Matches your Register input styling closely
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

  inputDisabled: {
    opacity: 0.7,
  },

  readOnlyBox: {
    backgroundColor: colors.gray100,
    justifyContent: "center",
  },

  readOnlyText: {
    fontFamily: font.body,
    color: colors.textSecondary,
  },

  errorText: {
    color: "red",
    textAlign: "center",
  },

  saveBtn: {
    backgroundColor: colors.black,
    paddingVertical: spacing.lg,
    borderRadius: radius.lg,
    alignItems: "center",
    marginTop: spacing.sm,
  },

  btnDisabled: {
    opacity: 0.6,
  },

  saveText: {
    color: colors.white,
    fontFamily: font.strong,
    fontSize: 16,
  },
});