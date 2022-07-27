import React from 'react';
import { StyleSheet, Platform } from 'react-native';
import Animated, { interpolateNode, Extrapolate } from 'react-native-reanimated';
import { fontValue } from '../../config/Dimensions';
import { COLORS } from '../../config/Miscellaneous';
// @ts-ignore
import AddIconImage from '../../assets/images/add_24.png'

const MoonStickyStoryView = ({
  x,
  threshold,
  itemWidth,
  itemHeight,
  stickyItemWidth,
  separatorSize,
  borderRadius,
  isRTL,
  theme = 'light',
  userAvatar,
  tempAvatar,
}) => {
  const stickyItemX = itemWidth / 2 + (itemWidth / 2 - stickyItemWidth);
  const stickyItemY = itemHeight / 2 - stickyItemWidth / 2;
  const stickyItemWidthWithoutPadding = stickyItemWidth - separatorSize * 2;
  const separatorSizeToStickyWidthScale = Math.min(
    separatorSize / stickyItemWidth,
    0.2
  );

  //#region thumbnail
  const thumbnailWidth = itemWidth;
  const thumbnailHeight = itemWidth;

  const thumbnailTranslateX =
    Math.abs(thumbnailWidth / 2 - (stickyItemX + stickyItemWidth / 2)) *
    (isRTL ? -1 : 1);
  const thumbnailTranslateY = Math.abs(
    thumbnailHeight / 2 - (stickyItemY + stickyItemWidth / 2)
  );

  const thumbnailScale =
    stickyItemWidth / itemWidth - separatorSizeToStickyWidthScale;
  const animatedThumbnailScale = interpolateNode(x, {
    inputRange: [separatorSize, threshold],
    outputRange: [1, thumbnailScale],
    extrapolate: Extrapolate.CLAMP,
  });
  const animatedThumbnailTranslateX = interpolateNode(x, {
    inputRange: [separatorSize, threshold],
    outputRange: [0, thumbnailTranslateX],
    extrapolate: Extrapolate.CLAMP,
  });
  const animatedThumbnailTranslateY = interpolateNode(x, {
    inputRange: [separatorSize, threshold],
    outputRange: [0, thumbnailTranslateY],
    extrapolate: Extrapolate.CLAMP,
  });
  const animatedThumbnailBorderRadius = interpolateNode(x, {
    inputRange: [separatorSize, threshold],
    outputRange: [
      borderRadius,
      stickyItemWidth * (separatorSizeToStickyWidthScale + 1),
    ],
    extrapolate: Extrapolate.CLAMP,
  });

  const thumbnailStyle = [
    {
      backgroundColor: theme === 'light' ? 'black' : 'white',
      width: thumbnailWidth,
      height: thumbnailHeight,
      borderRadius: animatedThumbnailBorderRadius,
      transform: [
        { translateX: (thumbnailWidth / 2) * -1 },
        { translateY: (thumbnailHeight / 2) * -1 },
        { translateX: animatedThumbnailTranslateX },
        { translateY: animatedThumbnailTranslateY },
        { translateX: thumbnailWidth / 2 },
        { translateY: thumbnailHeight / 2 },
        { scale: animatedThumbnailScale },
      ],
    },
  ];
  //#endregion

  //#region add icon
  const addIconWidth = 30;
  const addIconHeight = 30;

  const addIconPosition = findPointOnCircle({
    radius: stickyItemWidthWithoutPadding / 2,
    degrees: isRTL ? 135 : 45,
  });
  const animatedAddIconTranslateX = interpolateNode(x, {
    inputRange: [separatorSize, threshold],
    outputRange: [0, addIconPosition.x],
    extrapolate: Extrapolate.CLAMP,
  });
  const animatedAddIconTranslateY = interpolateNode(x, {
    inputRange: [separatorSize, threshold],
    outputRange: [thumbnailHeight / 2, addIconPosition.y],
    extrapolate: Extrapolate.CLAMP,
  });
  const animatedAddIconScale = interpolateNode(x, {
    inputRange: [separatorSize, threshold],
    outputRange: [1, 0.33],
    extrapolate: Extrapolate.CLAMP,
  });
  const animatedAddIconBorderWidth = interpolateNode(x, {
    inputRange: [separatorSize, threshold],
    outputRange: [3, 2],
    extrapolate: Extrapolate.CLAMP,
  });
  const addIconStyle = [
    styles.addIcon,
    {
      width: addIconWidth,
      height: addIconHeight,
      borderRadius: addIconWidth,
      borderWidth: animatedAddIconBorderWidth,
      transform: [
        { translateX: (addIconWidth / 2) * -1 },
        { translateY: (addIconHeight / 2) * -1 },
        { translateX: thumbnailWidth / 2 },
        { translateY: thumbnailHeight / 2 },
        { translateX: animatedThumbnailTranslateX },
        { translateY: animatedThumbnailTranslateY },
        { translateX: animatedAddIconTranslateX },
        { translateY: animatedAddIconTranslateY },
        { scale: animatedAddIconScale },
      ],
    },
  ];
  //#endregion

  //#region text
  const animatedTextOpacity = interpolateNode(x, {
    inputRange: [separatorSize, threshold * 0.6],
    outputRange: [1, 0],
    extrapolate: Extrapolate.CLAMP,
  });
  const animatedTextTranslateY = interpolateNode(x, {
    inputRange: [separatorSize, threshold * 0.6],
    outputRange: [itemHeight / 2 + itemHeight / 4, itemHeight / 2],
    extrapolate: Extrapolate.CLAMP,
  });
  const textStyle = [
    styles.text,
    {
      color: theme === 'light' ? COLORS.black : COLORS.white,
      opacity: animatedTextOpacity,
      paddingHorizontal: separatorSize * 2,
      transform: [
        {
          translateY: animatedTextTranslateY,
        },
      ] as Animated.AnimatedTransform,
    },
  ];
  //#endregion

  return (
    <>
      <Animated.Image source={userAvatar ? { uri: userAvatar } : tempAvatar} style={thumbnailStyle} />
      <Animated.Text style={textStyle}>
        {`Create a story`}
      </Animated.Text>
      <Animated.View style={addIconStyle}>
        <Animated.Image source={AddIconImage} style={styles.icon} />
      </Animated.View>
    </>
  );
};

const findPointOnCircle = ({
  radius,
  degrees,
}: {
  radius: number;
  degrees: number;
}) => {
  var newX = radius * Math.cos(degrees * (Math.PI / 180));
  var newY = radius * Math.sin(degrees * (Math.PI / 180));
  return { x: newX, y: newY };
};

const styles = StyleSheet.create({
  addIcon: {
    position: 'absolute',
    borderColor: COLORS.white,
    backgroundColor: COLORS.accentLight,
    tintColor: COLORS.white,
  },
  text: {
    position: 'absolute',
    width: '100%',
    textAlign: 'center',
    lineHeightight: 14,
    fontSize: Platform.OS === 'ios' ? fontValue(12) : fontValue(14),
    fontWeight: '500',
  },
  icon: {
    height: '100%',
    weight: '100%',
    position: 'absolute',
    alignSelf: 'center',
    tintColor: COLORS.white,
    resizeMode: 'contain'
  }
});

export default MoonStickyStoryView;
