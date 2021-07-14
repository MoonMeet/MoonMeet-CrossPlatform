import React, { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import { ActivityIndicator, Text } from "react-native-paper";
import { COLORS, FONTS } from "../../config/Miscellaneous";
import { rgbaColor } from "react-native-reanimated/src/reanimated2/Colors";


const LoadingIndicator = (props) => {

  useEffect(() => {
    initializeLoaderText();
  });

  const [LoaderText, getLoaderText] = React.useState("");

  /**
   * get loader text from LoginScreen
   */
  const initializeLoaderText = () => {
    getLoaderText(props.setLoaderText);
  };

  return (
    <View style={styles.container}>
      <ActivityIndicator animating={true} size={"large"} color={COLORS.accentLight} />
      <Text style={styles.loaderText}>{LoaderText}</Text>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 20,
    backgroundColor: rgbaColor(220,220,220, 0.3)
  },
  loaderText: {
    fontSize: 22,
    padding: '2%',
    color: COLORS.black,
    fontFamily: FONTS.regular,
    opacity: 0.6
  },
});
export default LoadingIndicator;
