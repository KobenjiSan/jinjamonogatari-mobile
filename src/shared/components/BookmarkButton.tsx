import React, { useMemo } from "react";
import { Animated, Pressable, StyleProp, ViewStyle } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { usePressScale } from "../gestures/usePressScale";
import { useBookmarkState } from "../hooks/useBookmarkState";
import { useCollectionIdsStore } from "../../features/collection/api/collectionIds.store";
import { useAuth } from "../../core/auth/AuthProvider";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type Props = {
  shrineId: number;
  downTo?: number;
  size?: number;
  color?: string;
  savedColor?: string;
  containerStyle?: StyleProp<ViewStyle>;
  hitSlop?: number | { top: number; bottom: number; left: number; right: number };
  onError?: (err: unknown) => void;
  disabled?: boolean;
  // If ids haven't loaded yet, show outline (or solid) instead of flashing wrong state
  showUnknownAsOutline?: boolean;
  // disable presses until ids are loaded (prevents weirdness on cold start)
  disableUntilLoaded?: boolean;
};

export default function BookmarkButton({
  shrineId,
  downTo = 0.9,
  size = 24,
  color = "black",
  savedColor,
  containerStyle,
  hitSlop = 8,
  onError,
  disabled = false,
  showUnknownAsOutline = true,
  disableUntilLoaded = true,
}: Props) {
  const { scale, handlers } = usePressScale(downTo);
  const { user } = useAuth();

  // Global ids store status so we can treat "not loaded yet" as unknown
  const { status: idsStatus } = useCollectionIdsStore();
  const idsLoaded = idsStatus === "idle"; // we only set idle after a successful refresh

  const { isSaved, status, disabled: hookDisabled, toggle } =
    useBookmarkState(shrineId);

  const isSaving = status === "saving";

  // If ids aren't loaded yet, we render "unknown" state (prevents showing wrong icon)
  const effectiveIsSaved = useMemo(() => {
    if (!idsLoaded) return null;
    return isSaved;
  }, [idsLoaded, isSaved]);

  const saved = effectiveIsSaved === true;

  const iconName =
    effectiveIsSaved === null
      ? (showUnknownAsOutline ? "bookmark-o" : "bookmark")
      : (saved ? "bookmark" : "bookmark-o");

  const iconColor = saved ? (savedColor ?? color) : color;

  const isDisabled = !user
    disabled ||
    hookDisabled ||
    isSaving ||
    (disableUntilLoaded && !idsLoaded);

  return (
    <AnimatedPressable
      {...handlers}
      hitSlop={hitSlop as any}
      disabled={isDisabled}
      onPress={async () => {
        try {
          await toggle();
        } catch (err) {
          if (onError) onError(err);
          else console.warn(err);
        }
      }}
      style={[
        {
          transform: [{ scale }],
          opacity: isSaving || (!idsLoaded && disableUntilLoaded) ? 0.5 : 1,
        },
        containerStyle as any,
      ]}
    >
      <FontAwesome name={iconName as any} size={size} color={iconColor} />
    </AnimatedPressable>
  );
}