import React, { useContext } from "react";

import { View, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import AutoScrollView from "../components/AutoScrollView";
import SearchAutocompleteElement from "../components/searchAutocompleteElement";
import { contentContainerStyles } from "../styles/contentContainer";
import { useKeyboardHeight } from "../hooks/keyboard/keyboardHeight";

import lunr from "lunr";
import { TText } from "../app/_layout";
import { fontSize } from "src/styles/fontConfig";

function stripHtmlTags(html) {
  const noTags = html.replace(/<\/?[^>]+(>|$)/g, " ");
  const noTagsAndTrim = noTags.replace(/ +/g, " ").trim(); // convert multiple spaces to one space and trim start and ends
  return noTagsAndTrim;
}

// Function to add tagFreeContent field to each item in contentData
function addTagFreeContent(contentData) {
  return contentData.map((item) => ({
    ...item,
    tagFreeContent: stripHtmlTags(item.content),
  }));
}

const SearchAutocompleteContainer = ({
  contentData,
  searchbarText,
  setSearchbarInFocus,
}) => {
  const query = searchbarText;

  // Prepare data for Lunr.js
  const docs = addTagFreeContent(contentData);

  // console.log("docs:", docs.map((c) => {c.tagFreeContent}))
  console.log(docs);

  // Create Lunr index
  const idx = lunr(function () {
    this.ref("id"); // Document unique identifier
    this.field("title");
    this.field("description");
    this.field("tagFreeContent");
    this.field("secret");

    docs.forEach((doc) => {
      this.add(doc);
    });
  });

  // Sort search results by match score in descending order
  function sortSearchResults(results) {
    return results.sort((a, b) => b.score - a.score);
  }

  function getContentDataById(id, listOfContent) {
    return listOfContent.find((content) => content.id == id);
  }

  const results = idx.search(query);
  const sortedResults = sortSearchResults(results);

  // Log the results
  console.log("sortedResults:", sortedResults);
  sortedResults.forEach((s) => {
    console.log("metadata", s.matchData.metadata);
    c = getContentDataById(s.ref, contentData);
    console.log("c", c);
  });

  function getNestedKey(obj) {
    // Iterate over the top-level keys of the object
    for (let topLevelKey in obj) {
      // Iterate over the nested keys
      for (let nestedKey in obj[topLevelKey]) {
        return nestedKey;
      }
    }
    // Return null if no such key is found
    return null;
  }

  // console.log("getNestedKey", getNestedKey({"ashford": {"title": {}}}))

  const keyboardHeight = useKeyboardHeight();

  return (
    <KeyboardAvoidingView style={{ flex: 1, marginBottom: keyboardHeight }}>
      <ScrollView
        style={{ ...contentContainerStyles.container, flex: 1 }}
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <View
          style={{
            flexDirection: "column",
            gap: 10, // gap must be placed in <View> not <ScrollView>
          }}
        >
          {!searchbarText && (
            <View style={{ alignItems: "center" }}>
              <TText
                style={{
                  fontSize: fontSize.SMALL,
                  fontFamily: "InterRegular",
                }}
              >
                Please enter a search query
              </TText>
            </View>
          )}
          {searchbarText &&
            sortedResults.length > 0 &&
            sortedResults.map((s, index) => {
              c = getContentDataById(s.ref, contentData);
              const key = getNestedKey(s.matchData.metadata);
              const section = key === "tagFreeContent" ? "Content" : key;

              return (
                <SearchAutocompleteElement
                  key={index}
                  id={c.id}
                  content={c.content} // content necessary if using topics route
                  title={c.title} // title necessary if using topics route
                  secret={c.secret}
                  contentData={contentData}
                  section={section} // TODO: change to matching field
                  routerLink={"topicsReadOnly/[id]"}
                  setSearchbarInFocus={setSearchbarInFocus}
                />
              );
            })}
          {searchbarText && sortedResults.length === 0 && (
            <View style={{ alignItems: "center", gap: 8 }}>
              <TText
                style={{
                  fontSize: fontSize.SMALL,
                  fontFamily: "InterRegular",
                  textAlign: "center",
                }}
              >
                {`No matching results.`}
              </TText>
              <TText
                style={{
                  fontSize: fontSize.SMALL,
                  fontFamily: "InterRegular",
                  textAlign: "center",
                }}
              >
                {`Continue typing or try a different query.`}
              </TText>
            </View>
          )}
        </View>
        <View style={{ minHeight: 20 }}>{/* spacer */}</View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default SearchAutocompleteContainer;
