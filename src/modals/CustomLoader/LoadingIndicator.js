import { StyleSheet } from "react-native";
import { ActivityIndicator, Text } from "react-native-paper";
import { COLORS, FONTS } from "../../config/Miscellaneous";
import { View } from "native-base";


const LoadingIndicator = (props) => {

  const setLoaderText = (text) => {
    return props.setLoaderText(text)
  }
  const closeLoader = (bool) => {
    props.changeLoaderVisibility(bool)
  }

  return(
    <View style={styles.container}>
      <ActivityIndicator animating={true} size={"large"} color={COLORS.accentLight}/>
      <Text style={loaderText}>{setLoaderText}</Text>
    </View>
  );
};
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: COLORS.white,
      opacity: 0.4
    },
    loaderText: {
      fontSize: 22,
      color: COLORS.black,
      fontFamily: FONTS.regular,
      opacity: 0.4,
    }
  });
export default LoadingIndicator;
