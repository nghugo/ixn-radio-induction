import * as React from "react";
import { ScrollView, Text, View, Image, StyleSheet, TouchableOpacity } from "react-native";
import { Button } from "react-native-paper";
import { Link } from "expo-router";
import { contentContainerStyles } from "/src/styles/contentContainer";

import { TText } from "./_layout";
import { fontSize } from "src/styles/fontConfig";
import { useRouter } from "expo-router";

export default function Home() {
  const router = useRouter();

  return (
    <>
      <ScrollView
        keyboardDismissMode="on-drag"
        style={contentContainerStyles.container}
      >
        {/* Scroll view needed to dismiss search bar */}

        <TText style={styles.pageTitle}>Home</TText>

        <View style={{ gap: 10 }}>
          <NavBlock
            imageSource={require("assets/images/nhs-logo-square.png")}
            title="Ashford and St Peter's"
            description={"Parking, Induction, Study Leave, PCAS and Logins"}
            route="/hospitals/1"
          />

          <NavBlock
            imageSource={require("assets/images/nhs-logo-square.png")}
            title="Ashford and St Peter's"
            description={
              "Parking, Induction, Study Leave, PCAS and Logins, some more very long text, verbose description, more stuff, etc etc"
            }
            route="/hospitals/2"
          />
        </View>

        <TouchableOpacity onPress={() => router.push("/dummy")}>
          <Button mode="elevated" style={{ marginTop: 15 }}>
            <TText>go to dummy</TText>
          </Button>
        </TouchableOpacity>
          
        <TouchableOpacity onPress={() => {
          const route = "/hospitals/1"
          console.log("(b)route is: " + route + typeof route)
          router.push(route)
          }}>
          <Button mode="elevated" style={{ marginTop: 15 }}>
            <TText>go to hosptial 1</TText>
          </Button>
        </TouchableOpacity>


      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  pageTitle: {
    fontSize: fontSize.LARGE,
    fontFamily: "InterSemiBold",
    paddingBottom: 16,
  },
  nhsSquare: {
    height: 60,
    aspectRatio: 1,
    borderWidth: 1,
    borderRadius: 15,
  },
});

function NavBlock({ title, description, imageSource, route }) {
  const router = useRouter();

  return (
    <TouchableOpacity
      onPress={() => {
        console.log("(o)route is: " + route + typeof route)
        router.push(route);
      }}
    >
      <View
        style={{
          flexDirection: "row",
          gap: 10,
          borderWidth: 1,
          borderColor: "grey",
          borderRadius: 20,
          padding: 10,
        }}
      >
        <View
          style={{
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <Image
            resizeMethod="contain"
            source={imageSource}
            style={styles.nhsSquare}
          />
        </View>

        <View style={{ flex: 1 }}>
          <TText
            style={{
              fontSize: fontSize.MEDIUM,
              fontFamily: "InterMedium",
            }}
          >
            {title}
          </TText>
          <TText
            style={{
              fontSize: fontSize.SMALL,
              fontFamily: "InterRegular",
            }}
            // numberOfLines="2"  // uncomment to abridge text
            // ellipsizeMode="tail"  // uncomment to abridge text
          >
            {description}
          </TText>
        </View>
      </View>
    </TouchableOpacity>
  );
}
