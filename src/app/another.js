import * as React from "react";
import { View, StyleSheet, Text, ScrollView } from "react-native";
import { useTheme } from "react-native-paper";
import { contentContainerStyles } from "/src/styles/contentContainer";

export default function Another() {
  return (
    <ScrollView
      keyboardDismissMode="on-drag"
      style={contentContainerStyles.container}
    >
      <Text>Hi</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
