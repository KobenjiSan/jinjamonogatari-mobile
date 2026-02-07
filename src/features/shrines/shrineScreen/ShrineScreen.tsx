import React, {
  useMemo,
  useRef,
  useState,
  useCallback,
  useEffect,
} from "react";
import { View, Text, StyleSheet } from "react-native";
import BottomSheet from "@gorhom/bottom-sheet";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useShrineBySlug } from "../useShrineBySlug";
import ShrineHeader from "./components/ShrineHeader";
import ShrineSheet, { Tab } from "./components/ShrineSheet";
import { g } from "../../../shared/styles/global";
import { colors } from "../../../shared/styles/tokens";

type Props = {
  slug: string;
};

export default function ShrineScreen({ slug }: Props) {
  const shrine = useShrineBySlug(slug);
  const insets = useSafeAreaInsets();

  const [containerH, setContainerH] = useState(0);
  const [heroH, setHeroH] = useState(0);
  const [introH, setIntroH] = useState(0);

  const onContainerLayout = useCallback((e: any) => {
    setContainerH(Math.round(e.nativeEvent.layout.height));
  }, []);

  const onHeroLayout = useCallback((e: any) => {
    setHeroH(Math.round(e.nativeEvent.layout.height));
  }, []);

  const onIntroLayout = useCallback((e: any) => {
    setIntroH(Math.round(e.nativeEvent.layout.height));
  }, []);

  const snapPoints = useMemo(() => {
    if (containerH === 0 || heroH === 0 || introH === 0) return ["45%", "99%"];

    const aboveH = insets.top + 8 + heroH + introH;
    let collapsed = Math.round(containerH - aboveH);

    collapsed = Math.max(120, Math.min(collapsed, Math.round(containerH * 0.85)));

    const expanded = Math.round(containerH * 0.99);
    return [collapsed, expanded];
  }, [containerH, heroH, introH, insets.top]);

  const sheetRef = useRef<BottomSheet>(null);

  useEffect(() => {
    if (containerH && heroH && introH) {
      sheetRef.current?.snapToIndex(0);
    }
  }, [containerH, heroH, introH]);

  const [activeTab, setActiveTab] = useState<Tab>("Info");

  if (!shrine) {
    return (
      <View style={[g.fill, g.center]}>
        <Text>Shrine not found: {slug}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container} onLayout={onContainerLayout}>
      <ShrineHeader
        shrine={shrine}
        insetsTop={insets.top}
        onHeroLayout={onHeroLayout}
        onIntroLayout={onIntroLayout}
      />

      <ShrineSheet
        shrine={shrine}
        sheetRef={sheetRef}
        snapPoints={snapPoints}
        activeTab={activeTab}
        onChangeTab={setActiveTab}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.black,
  },
});
