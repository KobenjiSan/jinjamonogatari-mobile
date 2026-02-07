import {
  View,
  StyleSheet,
  Platform,
  StatusBar,
  Text,
  FlatList,
  Dimensions,
} from "react-native";
import ShrineCard from "./ShrineCard";
import { useShrineList } from "../useShrineList";
import { useUserLocation } from "../../../shared/useUserLocation";
import { g } from "../../../shared/styles/global";
import { spacing } from "../../../shared/styles/tokens";

const TOP_PADDING =
  Platform.OS === "android" ? (StatusBar.currentHeight ?? 0) : 44;

const { width } = Dimensions.get("window");
const H_PADDING = Math.min(24, width * 0.05);

// Controls how far past the last item the user can scroll
const LIST_BOTTOM_SPACER = 96;

export default function ShrineListScreen() {
  const { shrines, isEmpty } = useShrineList();
  const { location: userLocation } = useUserLocation();

  if (isEmpty) {
    return (
      <View style={[g.fill, g.center, styles.emptyContainer]}>
        <Text>No shrines found.</Text>
      </View>
    );
  }

  return (
    <View style={g.fill}>
      <FlatList
        data={shrines}
        keyExtractor={(item) => String(item.shrine_id)}
        renderItem={({ item }) => (
          <ShrineCard shrine={item} userLocation={userLocation} />
        )}
        contentContainerStyle={styles.listContent}
        scrollIndicatorInsets={{
          top: TOP_PADDING,
          right: 0,
        }}
        ListFooterComponent={<View style={styles.footerSpacer} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  listContent: {
    paddingTop: TOP_PADDING + spacing.sm,
    paddingHorizontal: H_PADDING,
    rowGap: 10,
  },

  footerSpacer: {
    height: LIST_BOTTOM_SPACER,
  },

  emptyContainer: {
    paddingHorizontal: H_PADDING,
  },
});
