import * as React from "react";
import { SafeAreaView, StatusBar, StyleSheet, Text, View } from "react-native";
import { COLORS, FONTS } from "../config/miscellaneous";
import { TextInput } from "react-native-paper";
import TextInputMask from "react-native-text-input-mask";

const LoginScreen = () => {
  const [text, setText] = React.useState("");
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        backgroundColor="#FFFFFF"
        barStyle={"dark-content"} />
      <View style={styles.top_bar}>
        <Text style={styles.top_text}>
          Your Phone
        </Text>
      </View>
      <View style={styles.divider}>
      </View>
      <View style={styles.dummy}>
      </View>
      <View style={{
        padding: 10,
        flexDirection: 'row',
      }}>
        <TextInput style={{
          width: 140,
          padding: 4,
        }}
          mode="outlined"
          label="Country Code"
          value={text}
          placeholder={'eg, +1'}
          multiline={false}
          render={props =>
          <TextInputMask
            {...props}
            mask="+ [0000]"
          />
        }
          theme={{ colors: {
            text: COLORS.accent,
            primary: COLORS.accent,
            backgroundColor: COLORS.rippleColor,
            placeholder: COLORS.darkGrey,
            underlineColor: '#566193',
            selectionColor: '#DADADA',
            outlineColor: '#566193',
          } }}
          onChangeText={text => setText(text)}
        />
        <TextInput style={{
          width: 240,
          padding: 4,
        }}
                   mode="outlined"
                   label="Phone Number"
                   value={text}
                   placeholder={'eg, +1 (566) 874 364'}
                   multiline={false}
                   render={props =>
                     <TextInputMask
                       {...props}
                       mask="[000] [000] [000]"
                     />
                   }
                   theme={{ colors: {
                     text: COLORS.accent,
                     primary: COLORS.accent,
                     backgroundColor: COLORS.rippleColor,
                     placeholder: COLORS.darkGrey,
                     underlineColor: '#566193',
                     selectionColor: '#DADADA',
                     outlineColor: '#566193',
                   } }}
                   onChangeText={text => setText(text)}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary,
  },
  top_bar: {
    flexDirection: "row",
    padding: 10,
  },
  divider: {
    width: -1,
    height: 1,
    backgroundColor: COLORS.controlHighlight,
  },
  top_text: {
    position: "relative",
    right: 0,
    fontSize: 20,
    color: COLORS.accent,
    fontFamily: FONTS.regular,
  },
  dummy: {
    height: 35,
    width: -1,
  },
  dial_code_edittext: {
  }
});

export default LoginScreen;
