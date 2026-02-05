import {
  View,
  StyleSheet,
  Platform,
  StatusBar,
  Text,
  FlatList,
  Dimensions,
} from "react-native";
import ShrineCard from "./components/ShrineCard";
import { useShrineList } from "./useShrineList";
import { useUserLocation } from "../../shared/useUserLocation";

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
      <View style={styles.emptyContainer}>
        <Text>No shrines found.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
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
  container: {
    flex: 1,
  },

  listContent: {
    paddingTop: TOP_PADDING + 8,
    paddingHorizontal: H_PADDING,
    rowGap: 10,
  },

  footerSpacer: {
    height: LIST_BOTTOM_SPACER,
  },

  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: H_PADDING,
  },
});
