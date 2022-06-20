import React, {useEffect, useState} from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  Keyboard,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import {DbHeight, DbWidth} from '../../config/helpers/withAndHeight';
import AntIcon from 'react-native-vector-icons/AntDesign';
import {Colors} from '../../config/constants/colors';
import {useNavigation} from '@react-navigation/native';
import {normalize} from '../../config/helpers/font-size';
import MaterilCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import {firebase} from '@react-native-firebase';

type messageObject = {
  id: any;
  id_sender: any;
  id_receiver: any;
  message: string;
};

const Messages: React.FC<any> = ({route}) => {
  const navigation = useNavigation<any>();
  const {userName} = route?.params;
  const {image} = route?.params;
  const [currentDate, setCurrentDate] = useState('');
  const [msg, setMsg] = useState('');
  useEffect(() => {
    const hours = new Date().getHours();
    const min = new Date().getMinutes();
    setCurrentDate(hours + ':' + min);
  }, []);

  const [currentData, setCurrentData] = useState<messageObject[]>([]);



  // Send message
  const sendMessage = async (
    key = `${firebase?.auth()?.currentUser?.uid}-${userName}`,
    text: string,
  ) => {
    const message = {
      id_sender: firebase?.auth()?.currentUser?.uid,
      id_receiver: userName,
      message: text,
      timeStamp: Math.floor(Date.now()),
    };
    await firebase.database().ref('Messages').child(key).push(message);
    await firebase
      .database()
      .ref('Conversations')
      .child(key)

      .child('lastMsg')
      .set(message.message);
    await firebase
      .database()
      .ref('Conversations')
      .child(key)

      .child('lastTime')
      .set(message.timeStamp);
  };

  useEffect(() => {
    firebase
      .database()
      .ref('Messages')
      .child(${firebase?.auth()?.currentUser?.uid}-${userName})
      .on('child_added', snapshot => {
        console.log(snapshot.val());
        const message = {
          ...snapshot.val(),
        };
        setCurrentData(prevState => [message, ...prevState]);
      });
  }, [userName]);

  return (
    <Pressable onPress={Keyboard.dismiss} style={style.container}>
      <View style={style.headerChat}>
        <Pressable onPress={() => navigation.goBack()}>
          <AntIcon name={'arrowleft'} size={30} color={Colors.default} />
        </Pressable>
        <Image source={{uri: image}} style={style.image} />
        <Text style={style.useMessage}>{userName}</Text>
      </View>
      <View style={{flex: 1, justifyContent: 'flex-end', marginTop: 5}}>
        <FlatList
          inverted
          scrollEnabled={true}
          data={currentData}
          extraData={currentData}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({item}) => {
            return (
              <View
                style={{
                  width: (Dimensions.get('window').width / 100) * 95,
                  alignSelf: 'center',
                  paddingHorizontal: 10,
                }}>
                <View style={{flexDirection: 'row', alignItems: 'flex-end'}}>
                  <Image
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 40,
                      display:
                        item?.id_sender === firebase.auth().currentUser?.uid
                          ? 'none'
                          : 'flex',
                      marginRight: 8,
                    }}
                    source={{uri: image}}
                  />
                  <View
                    style={{
                      alignItems:
                        item?.id_sender === firebase.auth().currentUser?.uid
                          ? 'flex-end'
                          : 'flex-start',
                      width: '100%',
                    }}>
                    <View
                      style={{
                        borderBottomEndRadius:
                          item?.id_sender === firebase.auth().currentUser?.uid
                            ? 0
                            : 20,
                        borderBottomStartRadius:
                          item?.id_sender === firebase.auth().currentUser?.uid
                            ? 20
                            : 0,
                        borderTopEndRadius: 20,
                        borderTopStartRadius: 20,
                        overflow: 'hidden',
                      }}>
                      <View
                        style={{
                          padding: 5,
                          backgroundColor:
                            item?.id_sender === firebase.auth().currentUser?.uid
                              ? Colors.primary
                              : Colors.inputColor,
                          maxWidth:
                            (Dimensions.get('window').width / 100) * 55.55,
                        }}>
                        <Text
                          style={{
                            color:
                              item?.id_sender !==
                              firebase.auth().currentUser?.uid
                                ? '#000'
                                : '#fff',
                            padding: 5,
                            fontFamily: 'Montserrat-Regular',
                          }}>
                          {item.message}
                        </Text>
                      </View>
                    </View>
                    <Text style={{fontSize: 10}}>{currentDate}</Text>
                  </View>
                </View>
              </View>
            );
          }}
        />
        <View
          style={{
            flexDirection: 'row',
            borderRadius: 20,
            backgroundColor: '#000000' + '0D',
            justifyContent: 'space-around',
            alignItems: 'center',
            width: (Dimensions.get('window').width / 100) * 93.37,
            alignSelf: 'center',
            marginBottom: 10,
          }}>
          <TextInput
            multiline={true}
            numberOfLines={5}
            style={{
              height: (Dimensions.get('window').height / 100) * 6.55,
              width: (Dimensions.get('window').width / 100) * 67.37,
              maxWidth: (Dimensions.get('window').width / 100) * 67.37,
              fontSize: 14,
              alignSelf: 'flex-start',
            }}
            value={msg}
            onChangeText={value => {
              setMsg(value);
            }}
            placeholder={'write a message'}
            placeholderTextColor={'#000'}
          />
          <Pressable
            hitSlop={15}
            style={{
              backgroundColor: Colors.primary,
              borderRadius: 20,
              padding: 10,
              alignItems: 'center',
            }}
            onPress={async () => {
              if (msg.trim().length > 0) {
                try {
                  await sendMessage(undefined, msg);
                } catch (e) {
                  console.log(e);
                }
                setMsg('');
              }
            }}>
            <MaterilCommunityIcon
              name={'send-outline'}
              size={normalize(14)}
              color={Colors.default}
            />
          </Pressable>
        </View>
      </View>
    </Pressable>
  );
};
const style = StyleSheet.create({
  container: {
    height: '100%',
    backgroundColor: Colors.default,
    justifyContent: 'space-between',
    flex: 1,
  },
  image: {
    width: DbHeight(6.11),
    height: DbHeight(6.11),
    borderRadius: DbHeight(3.06),
    marginRight: DbWidth(5.07),
    marginLeft: DbWidth(3.55),
  },
  headerChat: {
    height: DbHeight(12.5),
    flexDirection: 'row',
    padding: 20,
    alignItems: 'center',
    width: '100%',
    borderBottomLeftRadius: 21,
    borderBottomRightRadius: 21,
    backgroundColor: Colors.primary,
  },
  useMessage: {
    fontSize: normalize(17),
    color: Colors.default,
    fontFamily: 'Montserrat-Bold',
  },
});

export default Messages;