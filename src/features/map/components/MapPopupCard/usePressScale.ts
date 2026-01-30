import { useMemo, useRef } from "react";
import { Animated } from "react-native";

export function usePressScale(downTo = 0.95) {
  const scale = useRef(new Animated.Value(1)).current;

  const handlers = useMemo(
    () => ({
      onPressIn: () =>
        Animated.spring(scale, { toValue: downTo, useNativeDriver: true }).start(),
      onPressOut: () =>
        Animated.spring(scale, { toValue: 1, useNativeDriver: true }).start(),
    }),
    [scale, downTo]
  );

  return { scale, handlers };
}
