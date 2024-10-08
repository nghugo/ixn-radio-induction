import React, { useState, useEffect, useCallback } from "react";
import { View, StyleSheet, TouchableOpacity, Image } from "react-native";
import DraggableFlatList, {
  ScaleDecorator,
} from "react-native-draggable-flatlist";
import { Icon, useTheme, Button } from "react-native-paper";

import { getAllContentSorted } from "../../db/queries";
import { useSQLiteContext } from "expo-sqlite";
import { useNavigation, useFocusEffect } from "@react-navigation/native";

import { TText } from "../_layout";
import { fontSize } from "src/styles/fontConfig";

import CancelEditModal from "../../components/CancelEditModal";
import ConfirmDeleteModal from "../../components/ConfirmDeleteModal";
import ReviewModal from "../../components/ReviewModal";

import { overwriteContentToEdit } from "../../db/queries";

import {
  getContentById,
  getPrevContentById,
  getNextContentById,
  getMaxNumPlusOne,
} from "../../utils/editContent";

export default function RearrangableTopics() {
  // const { searchbarInFocus, setSearchbarInFocus } =
  // useContext(SearchbarContext);

  const navigation = useNavigation();
  const [contentData, setContentData] = useState([]);
  const db = useSQLiteContext();
  const theme = useTheme();
  const [cancelEditModalVisible, setCancelEditModalVisible] =
    React.useState(false);
  const [confirmDeleteModalVisible, setConfirmDeleteModalVisible] =
    React.useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState(null);
  const [reviewModalVisible, setReviewModalVisible] = React.useState(false);

  // Fetch content data function
  const fetchContentDataLocally = async () => {
    const sortedContent = await getAllContentSorted(db, "ContentToEdit");
    const sortedContentWithKey = sortedContent.map((obj, index) => ({
      ...obj,
      key: obj.id.toString(), // Ensure key is a string
    }));
    setContentData(sortedContentWithKey);
  };

  // Fetch data when screen comes into focus (to refresh the layout after edits in topicsWrite/[id])
  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        await fetchContentDataLocally();
      };

      fetchData();
    }, [])
  );

  console.log("*** start");
  contentData.forEach((item, i) => {
    console.log(
      `i, prevId, id, nextId ${i}, ${item.prevId}, ${item.id}, ${item.nextId}  (${item.title})`
    );
  });
  console.log("*** end");

  const renderItem = ({ item, drag, isActive }) => {
    return (
      <ScaleDecorator>
        <View
          style={{
            minWidth: 100,
            marginTop: 5,
            marginBottom: 5,
            paddingLeft: 19,
            paddingRight: 19,
            flexDirection: "row",
            gap: 10,
          }}
        >
          <TouchableOpacity
            onLongPress={() => {
              console.log("long press");
              drag();
            }}
            onPress={() => {
              console.log("short press");
              navigation.navigate(`admin/topicsWrite/[id]`, {
                id: item.id,
                content: item.content,
                title: item.title,
                description: item.description,
                secret: item.secret,
                contentData: contentData,
              });
              // pass parameters to pages https://reactnavigation.org/docs/params/#what-should-be-in-params
            }}
            disabled={isActive}
            style={[
              styles.rowItem,
              {
                borderRadius: 20,
                borderColor: isActive ? theme.colors.primary : "grey",
                borderWidth: isActive ? 3 : 1,
                backgroundColor: "white",
              },
            ]}
          >
            <View style={{ width: "100%" }}>
              <TopicBlock
                imageSource={require("assets/images/nhs-logo-square.png")}
                title={item.title}
                route={`/topics/${item.key}`} // route not really dynamic since passing content as prop already
                description={item.description}
                content={item.content}
              />
            </View>
          </TouchableOpacity>
          <View
            style={{ justifyContent: "space-around", alignItems: "center" }}
          >
            <TouchableOpacity
              onPress={() => {
                setConfirmDeleteModalVisible(true);
                setDeleteTargetId(item["id"]);
                console.log("item.id has been set as", item["id"]);
              }}
            >
              <Icon source="delete" color={theme.colors.primary} size={32} />
            </TouchableOpacity>
          </View>
        </View>
      </ScaleDecorator>
    );
  };

  const handleDeleteById = (data, id) => {
    console.log(`want to delete id ${id}`);
    // Create a new copy of the data array to avoid mutating the original array
    const newData = data.map((item) => ({ ...item }));

    const curr = getContentById(newData, id);
    const prev = getPrevContentById(newData, id);
    const next = getNextContentById(newData, id);
    if (prev !== null) {
      prev.nextId = curr.nextId;
    }
    if (next !== null) {
      next.prevId = curr.prevId;
    }

    // Remove the record with the matching id
    const index = newData.findIndex((record) => record.id === id);
    if (index !== -1) {
      newData.splice(index, 1);
    }

    setContentData(newData);
    overwriteContentToEdit(db, newData); // persist in ContentToEdit, IMPORTANT
  };

  const handleDragEnd = ({ data }) => {
    // console.log("*** start");
    const newData = data.map((item, index) => ({
      ...item,
      prevId: index === 0 ? null : data[index - 1].id,
      nextId: index === data.length - 1 ? null : data[index + 1].id,
    }));

    // Update the state with the new data
    setContentData(newData);
    overwriteContentToEdit(db, newData); // persist in ContentToEdit
  };

  function appendToData(data, id, title, description, content) {
    // Create a new copy of the data array to avoid mutating the original array
    const newData = data.map((item) => ({ ...item }));
    console.log(newData);

    // Create the new element with the given properties
    const newElement = {
      id: id,
      title: title,
      description: description,
      content: content,
      prevId: null,
      nextId: null,
      timestamp: new Date().toISOString(),
      key: id.toString(), // Ensure key is unique by using id
    };

    // Find the current last element in the list
    const lastElement = newData[newData.length - 1];

    // Update the last element's nextId to point to the new element
    lastElement.nextId = id;
    newElement.prevId = lastElement.id;

    // Append the new element to the list
    newData.push(newElement);

    setContentData(newData);
    overwriteContentToEdit(db, newData); // persist in ContentToEdit, IMPORTANT
  }

  // Custom DraggableFlatList for each list
  const RearrangableList = () => (
    <DraggableFlatList
      data={contentData}
      keyExtractor={(item) => `key-${item.key}`}
      renderItem={renderItem}
      onDragEnd={handleDragEnd}
      style={{
        backgroundColor: null,
        paddingBottom: 200,
      }}
    />
  );

  return (
    <>
      <View
        style={{
          flexDirection: "row",
          gap: 10,
          marginBottom: 10,
          marginLeft: 16,
          marginRight: 16,
        }}
      >
        <TText
          style={{
            fontSize: fontSize.LARGE,
            fontFamily: "InterMedium",
          }}
        >
          Admin Content Editor
        </TText>
      </View>
      <View style={styles.container}>
        <RearrangableList />
      </View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "flex-end",
          paddingRight: 16,
          paddingLeft: 16,
          marginTop: 10,
        }}
      >
        <TouchableOpacity
          onPress={() => {
            console.log("add");
            const maxNumPlusOne = getMaxNumPlusOne(
              contentData.map((d) => d.id)
            );
            const title = "Untitled";
            const description = "";
            const content = "";
            appendToData(
              contentData,
              maxNumPlusOne,
              title,
              description,
              content
            );
            navigation.navigate(`admin/topicsWrite/[id]`, {
              id: maxNumPlusOne,
              title: title,
              description: description,
              content: content,
              contentData: contentData,
            });
          }}
        >
          <View
            style={{ borderRadius: 10, backgroundColor: theme.colors.primary }}
          >
            <Icon source="plus" color="white" size={36} />
          </View>
        </TouchableOpacity>
      </View>
      <View
        style={{
          flexDirection: "row",
          gap: 10,
          marginBottom: 10,
          marginTop: 10,
          marginLeft: 16,
          marginRight: 16,
        }}
      >
        <View style={{ flex: 1 }}>
          <TouchableOpacity
            onPress={() => {
              setCancelEditModalVisible(true);
            }}
          >
            <Button mode="outlined">Cancel Edit</Button>
          </TouchableOpacity>
        </View>
        <View style={{ flex: 1 }}>
          <TouchableOpacity
            onPress={() => {
              setReviewModalVisible(true);
            }}
          >
            <Button mode="contained">Review</Button>
          </TouchableOpacity>
        </View>
      </View>
      <CancelEditModal
        visible={cancelEditModalVisible}
        closeModal={() => {
          setCancelEditModalVisible(false);
        }}
      />
      <ConfirmDeleteModal
        visible={confirmDeleteModalVisible}
        closeModal={() => {
          setConfirmDeleteModalVisible(false);
        }}
        deleteTargetId={deleteTargetId}
        data={contentData}
        handleDeleteById={handleDeleteById}
      />
      <ReviewModal
        visible={reviewModalVisible}
        closeModal={() => {
          setReviewModalVisible(false);
        }}
        data={contentData}
        handleDeleteById={handleDeleteById}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    flexDirection: "column",
  },
  rowItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
  },
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

function TopicBlock({ title, description, imageSource, content }) {
  return (
    <View
      style={{
        flexDirection: "row",
        gap: 10,
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
    // </TouchableOpacity>
  );
}
