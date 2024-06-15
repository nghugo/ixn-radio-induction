import { Modal } from "react-native-paper";
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

export default function SideMenu({ sidemenuVisible, setSidesidemenuVisible, backgroundColor, textColor }) {

  const styles = StyleSheet.create({
    menuItem: {
      padding: 10,
      borderBottomWidth: 1,
      borderBottomColor: "grey",
    },
    menuItemText: {
      color: textColor,
    },
  });

  return (
    <Modal
      style={{ height: "100%", maxWidth: "80%" }}
      visible={sidemenuVisible}
      onDismiss={() => {
        setSidesidemenuVisible(false);
      }}
      // This contentContainerStyle is a parameter of Modal from react-native-paper
      contentContainerStyle={{
        backgroundColor: backgroundColor,
        padding: 20,
      }}
    >
      <ScrollView style={{ height: "100%", maxWidth: "100%" }}>
        <View style={{ marginBottom: 20 }}>
          <Text style={{ color: textColor }}>
            Example Modal. Click outside this area to dismiss.
          </Text>
        </View>
        <View
          style={{
            gap: 10,
          }}
        >
          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuItemText}>Menu Item 1111</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuItemText}>Menu Item 222</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuItemText}>Menu Item 333</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </Modal>
  );
}


