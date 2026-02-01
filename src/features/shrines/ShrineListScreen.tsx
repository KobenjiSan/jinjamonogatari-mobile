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

export default function ShrineListScreen() {
  const { shrines, isEmpty } = useShrineList();
  const { location: userLocation } = useUserLocation();

  if (isEmpty) {
    return (
      <View style={styles.container}>
        <View style={styles.content}>
          <Text>No shrines found.</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <FlatList
          data={shrines}
          keyExtractor={(item) => String(item.shrine_id)}
          renderItem={({ item }) => (
            <ShrineCard shrine={item} userLocation={userLocation} />
          )}
          ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingTop: TOP_PADDING + 8,
    paddingHorizontal: H_PADDING,
  },
});
