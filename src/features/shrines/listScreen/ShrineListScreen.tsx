import React from "react";
import {
  View,
  StyleSheet,
  Platform,
  StatusBar,
  Text,
  FlatList,
  Dimensions,
} from "react-native";
import { useLocalSearchParams } from "expo-router";

import ShrineCard from "./components/ShrineCard";
import { useShrineList } from "./api/useShrineList";
import { useUserLocation } from "../../../shared/location/useUserLocation";
import { g } from "../../../shared/styles/global";
import { spacing } from "../../../shared/styles/tokens";
import SearchBar from "../../../shared/components/SearchBar";

const TOP_PADDING =
  Platform.OS === "android" ? (StatusBar.currentHeight ?? 0) : 44;

const { width } = Dimensions.get("window");
const H_PADDING = Math.min(24, width * 0.05);

const LIST_BOTTOM_SPACER = 96;

export default function ShrineListScreen() {
  const { location: userLocation } = useUserLocation();

  const params = useLocalSearchParams<{ q?: string }>();
  const initialQ = typeof params.q === "string" ? params.q : "";

  const [query, setQuery] = React.useState(initialQ);
  React.useEffect(() => {
    setQuery(initialQ);
  }, [initialQ]);

  const { shrines, isLoading, error } = useShrineList(userLocation, query);

  const showInitialLoading = isLoading && shrines.length === 0 && !error;
  const showSearching = isLoading && shrines.length > 0 && !error;
  const showEmpty = !isLoading && !error && shrines.length === 0;

  return (
    <View style={g.fill}>
      {/* Search bar ALWAYS visible */}
      <View style={styles.searchWrapper}>
        <SearchBar
          value={query}
          onChangeText={setQuery}
          placeholder="Search shrines..."
          onClear={() => setQuery("")}
        />
      </View>

      {/* Body */}
      {error ? (
        <View style={[g.fill, g.center, styles.bodyContainer]}>
          <Text>{error}</Text>
        </View>
      ) : showInitialLoading ? (
        <View style={[g.fill, g.center, styles.bodyContainer]}>
          <Text>Loading shrines...</Text>
        </View>
      ) : showEmpty ? (
        <View style={[g.fill, styles.bodyContainer, {alignItems: "center", paddingTop: spacing.xl}]}>
          <Text>{query.trim() ? "No matches found." : "No shrines found."}</Text>
        </View>
      ) : (
        <FlatList
          data={shrines}
          keyExtractor={(item) => String(item.shrine_id)}
          renderItem={({ item }) => <ShrineCard shrine={item} />}
          contentContainerStyle={styles.listContent}
          scrollIndicatorInsets={{ top: TOP_PADDING, right: 0 }}
          ListFooterComponent={<View style={styles.footerSpacer} />}
          keyboardShouldPersistTaps="handled"
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  searchWrapper: {
    paddingTop: TOP_PADDING + spacing.md,
    paddingHorizontal: H_PADDING,
    paddingBottom: spacing.sm,
  },

  searchingText: {
    marginTop: spacing.xs,
    paddingLeft: 2,
    opacity: 0.7,
  },

  bodyContainer: {
    paddingHorizontal: H_PADDING,
  },

  listContent: {
    paddingTop: spacing.md,
    paddingHorizontal: H_PADDING,
    rowGap: 10,
  },

  footerSpacer: {
    height: LIST_BOTTOM_SPACER,
  },
});