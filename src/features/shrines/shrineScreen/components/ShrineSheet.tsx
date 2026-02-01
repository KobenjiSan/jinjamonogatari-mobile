import React from "react";
import { View, StyleSheet } from "react-native";
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import ShrineTabBar from "./ShrineTabBar";

import ShrineInfoTab from "../tabs/ShrineInfoTab";
import ShrineKamiTab from "../tabs/ShrineKamiTab";
import ShrineHistoryTab from "../tabs/ShrineHistoryTab";
import ShrineFolkloreTab from "../tabs/ShrineFolkloreTab";
import ShrineGalleryTab from "../tabs/ShrineGalleryTab";

import type { ShrinePreviewModel } from "../../mappers";

const TABS = ["Info", "Kami", "History", "Folklore", "Gallery"] as const;
export type Tab = (typeof TABS)[number];

type Props = {
  shrine: ShrinePreviewModel;
  sheetRef: React.RefObject<BottomSheet | null>;
  snapPoints: (string | number)[];
  activeTab: Tab;
  onChangeTab: (t: Tab) => void;
};

export default function ShrineSheet({
  shrine,
  sheetRef,
  snapPoints,
  activeTab,
  onChangeTab,
}: Props) {
  return (
    <BottomSheet
      ref={sheetRef}
      index={0}
      snapPoints={snapPoints}
      enablePanDownToClose={false}
      backgroundStyle={styles.sheetBackground}
      handleIndicatorStyle={styles.handleIndicator}
    >
      <BottomSheetScrollView contentContainerStyle={styles.sheetContent}>
        <ShrineTabBar
          tabs={TABS}
          activeTab={activeTab}
          onChange={onChangeTab}
        />

        {activeTab === "Info" && <ShrineInfoTab shrine={shrine} />}
        {activeTab === "Kami" && <ShrineKamiTab shrine={shrine} />}
        {activeTab === "History" && <ShrineHistoryTab shrine={shrine} />}
        {activeTab === "Folklore" && <ShrineFolkloreTab shrine={shrine} />}
        {activeTab === "Gallery" && <ShrineGalleryTab shrine={shrine} />}

        {/* temp spacing while building */}
        <View style={{ height: 800 }} />
      </BottomSheetScrollView>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  sheetBackground: {
    backgroundColor: "#f0f0f0",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  handleIndicator: { backgroundColor: "#bbb" },
  sheetContent: {
    padding: 16,
    paddingBottom: 32,
  },
});
