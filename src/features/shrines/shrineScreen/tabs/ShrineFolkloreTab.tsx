import React, { useMemo, useState, useEffect } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import type { ShrineDetailModel } from "../../mappers";
import FolkloreFlipCard from "../components/FolkloreStoryCard";
import Feather from "@expo/vector-icons/Feather";
import { font } from "../../../../shared/styles/typography";
import { g } from "../../../../shared/styles/global";
import { t } from "../../../../shared/styles/text";
import { spacing, radius } from "../../../../shared/styles/tokens";

type Props = {
  shrine: ShrineDetailModel;
};

export default function ShrineFolkloreTab({ shrine }: Props) {
  const fallbackImage = require("../../../../../assets/images/placeholder-vertical.jpg");
  const folklore = useMemo(() => shrine.folklore ?? [], [shrine.folklore]);

  const [index, setIndex] = useState(0);

  const hasFolklore = folklore.length > 0;
  const hasMultiple = folklore.length > 1;

  useEffect(() => {
    if (!hasFolklore) {
      setIndex(0);
      return;
    }
    setIndex((prev) => Math.min(prev, folklore.length - 1));
  }, [hasFolklore, folklore.length]);

  const current = hasFolklore ? folklore[index] : null;

  const goPrev = () => {
    if (!hasFolklore) return;
    setIndex((prev) => (prev - 1 + folklore.length) % folklore.length);
  };

  const goNext = () => {
    if (!hasFolklore) return;
    setIndex((prev) => (prev + 1) % folklore.length);
  };

  return (
    <View style={styles.container}>
      {!hasFolklore ? (
        <>
          <View style={g.card}>
            <Text style={[t.body, t.center, t.muted]}>
              No folklore has been added for this shrine yet.
            </Text>
          </View>

          <View style={{ height: 600 }} />
        </>
      ) : (
        <View style={{ gap: spacing.sm }}>
          {/* Controls */}
          {hasMultiple && (
            <View style={g.rowBetween}>
              <Pressable onPress={goPrev} style={styles.navBtn} hitSlop={8}>
                <Feather name="circle" size={20} color="#0000008f" />
                <Text
                  style={[t.small, { fontFamily: font.body, opacity: 0.85 }]}
                >
                  Prev
                </Text>
              </Pressable>

              <Text style={[t.small, t.muted]}>
                {index + 1} / {folklore.length}
              </Text>

              <Pressable onPress={goNext} style={styles.navBtn} hitSlop={8}>
                <Feather name="circle" size={20} color="#0000008f" />
                <Text
                  style={[t.small, { fontFamily: font.body, opacity: 0.85 }]}
                >
                  Next
                </Text>
              </Pressable>
            </View>
          )}

          {current && (
            <FolkloreFlipCard
              title={current.title}
              imageUrl={current.imageUrl}
              imageCitation={current.imageCitation}
              story={current.story}
              citations={current.citations}
              fallbackImage={fallbackImage}
            />
          )}

          <View style={{ height: 150 }} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.lg,
    paddingTop: spacing.md,
  },

  navBtn: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.sm,
    borderRadius: radius.md,
    alignItems: "center",
  },
});
