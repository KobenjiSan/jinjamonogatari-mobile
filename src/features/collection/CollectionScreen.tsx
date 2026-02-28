import React, { useCallback, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  Platform,
  StatusBar,
  Dimensions,
  FlatList,
  RefreshControl,
} from "react-native";
import { useRouter } from "expo-router";
import { Pressable } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

import { g } from "../../shared/styles/global";
import { t } from "../../shared/styles/text";
import { colors, spacing } from "../../shared/styles/tokens";

import { useCollectionCards } from "./api/useCollectionCards";
import CollectionCard from "./components/CollectionCard";
import { font } from "../../shared/styles/typography";
import { useCollectionIdsStore } from "./api/collectionIds.store";
import { useUserLocation } from "../../shared/location/useUserLocation";

const TOP_PADDING =
  Platform.OS === "android" ? (StatusBar.currentHeight ?? 0) : 44;

const { width } = Dimensions.get("window");
const H_PADDING = Math.min(24, width * 0.05);

const LIST_BOTTOM_SPACER = 96;

export default function CollectionScreen() {
  const router = useRouter();

  const { location: userLocation } = useUserLocation();
  const { cards, isLoading, error, refresh: refreshCards } = useCollectionCards(userLocation);
  const { ids, refresh: refreshIds, status: idsStatus } = useCollectionIdsStore();

  const refreshing = isLoading || idsStatus === "loading";

  const visibleCards = useMemo(() => {
    return cards.filter((c) => ids.has(c.shrine_id));
  }, [cards, ids]);

  const isEmpty = !refreshing && !error && visibleCards.length === 0;

  const refreshAll = useCallback(async () => {
    await refreshIds();
    await refreshCards();
  }, [refreshIds, refreshCards]);

  function popBack() {
    if (router.canGoBack()) router.back();
    else router.replace("/(tabs)/profile");
  }

  function goToShrine(slug: string) {
    router.push({
      pathname: "/shrine/[slug]",
      params: { slug },
    });
  }

  const showEmptyState = isEmpty;
  const showLoadingState = refreshing && visibleCards.length === 0;
  const showErrorState = !!error && visibleCards.length === 0;

  return (
    <View style={[g.fill, styles.root]}>
      {/* Header (always visible) */}
      <View style={styles.header}>
        <Pressable onPress={popBack} hitSlop={10}>
          <View style={[g.iconBtnCircle, g.iconBtnOverlay]}>
            <Ionicons name="chevron-back" size={22} color="black" />
          </View>
        </Pressable>

        <Text style={[t.hero, styles.headerTitle]}>Collection</Text>
        <View style={styles.headerRightSpacer} />
      </View>

      {/* Body */}
      {showLoadingState ? (
        <View style={[g.fill, g.center, styles.emptyContainer]}>
          <Text style={t.body}>Loading saved shrines...</Text>
        </View>
      ) : showErrorState ? (
        <View style={[g.fill, g.center, styles.emptyContainer]}>
          <Text style={t.body}>{error}</Text>
          <Text style={[t.muted, styles.subText]}>Pull to retry.</Text>
        </View>
      ) : showEmptyState ? (
        <View style={[g.fill, g.center, styles.emptyContainer]}>
          <Text style={t.body}>No saved shrines yet.</Text>
          <Text style={[t.muted, styles.subText]}>
            Save a shrine to see it here.
          </Text>
        </View>
      ) : (
        <FlatList
          data={visibleCards}
          keyExtractor={(item) => String(item.shrine_id)}
          renderItem={({ item }) => (
            <CollectionCard shrine={item} onPress={() => goToShrine(item.slug)} />
          )}
          contentContainerStyle={styles.listContent}
          scrollIndicatorInsets={{ top: TOP_PADDING, right: 0 }}
          ListFooterComponent={<View style={styles.footerSpacer} />}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={refreshAll} />
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    backgroundColor: colors.gray100,
  },
  header: {
    paddingTop: TOP_PADDING + spacing.md,
    paddingHorizontal: H_PADDING,
    paddingBottom: spacing.sm,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  headerTitle: {
    fontFamily: font.title,
  },

  headerRightSpacer: {
    width: 40,
  },

  listContent: {
    paddingTop: spacing.sm,
    paddingHorizontal: H_PADDING,
    rowGap: 10,
  },

  footerSpacer: {
    height: LIST_BOTTOM_SPACER,
  },

  emptyContainer: {
    paddingHorizontal: H_PADDING,
  },

  subText: {
    marginTop: spacing.xs,
    textAlign: "center",
    color: colors.gray600,
  },
});