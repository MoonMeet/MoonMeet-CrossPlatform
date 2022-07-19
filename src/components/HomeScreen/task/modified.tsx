import React from 'react';
import {StyleSheet, Platform } from 'react-native'
import Animated, { interpolateNode } from 'react-native-reanimated';
import type { StickyItemContentProps } from '@gorhom/sticky-item';
import { COLORS } from '../../../config/Miscellaneous';

interface MoonStickyStoryItemProps {
  theme?: 'light' | 'dark';
}

const MoonStickyStoryItem = ({
  x,
  threshold,
  itemWidth,
  itemHeight,
  stickyItemWidth,
  separatorSize,
  borderRadius,
  isRTL,
  theme = 'light',
}: StickyItemContentProps & MoonStickyStoryItemProps) => {
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
    (1);
  const thumbnailTranslateY = Math.abs(
    thumbnailHeight / 2 - (stickyItemY + stickyItemWidth / 2)
  );

  const thumbnailScale =
    stickyItemWidth / itemWidth - separatorSizeToStickyWidthScale;
  const animatedThumbnailScale = interpolateNode(x, {
  inputRange: [separatorSize, threshold],
    outputRange: [1, thumbnailScale],
  });
  const animatedThumbnailTranslateX = interpolateNode(x, {
    inputRange: [separatorSize, threshold],
    outputRange: [0, thumbnailTranslateX],
  });
  const animatedThumbnailTranslateY = interpolateNode(x, {
    inputRange: [separatorSize, threshold],
    outputRange: [0, thumbnailTranslateY],
  });
  const animatedThumbnailBorderRadius = interpolateNode(x,{ 
    inputRange: [separatorSize, threshold],
    outputRange: [borderRadius , stickyItemWidth * (separatorSizeToStickyWidthScale + 1)],
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
    degrees: 45,
  });
  const animatedAddIconTranslateX = interpolateNode(x, {
    inputRange: [separatorSize, threshold],
    outputRange: [0, addIconPosition.x],
});
  const animatedAddIconTranslateY = interpolateNode(x, {
    inputRange: [separatorSize, threshold],
    outputRange: [thumbnailHeight / 2, addIconPosition.y],
});
  const animatedAddIconScale = interpolateNode(x, {
    inputRange: [separatorSize, threshold],
    outputRange: [1, 0.33],
  });
  const animatedAddIconBorderWidth = interpolateNode(x, {
    inputRange: [separatorSize, threshold],
    outputRange: [3, 2],
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
        { translateY: (addIconHeight / 2) *-1 },
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
  });
  const animatedTextTranslateY = interpolateNode(x, {
    inputRange: [separatorSize, threshold * 0.6],
    outputRange: [itemHeight / 2 + itemHeight / 4, itemHeight / 2],
});
  const textStyle = [
    styles.text,
    {
      color: theme === 'light' ? 'black' : 'white',
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
      <Animated.View style={thumbnailStyle}/>
      <Animated.Text style={textStyle}>
        {"Create a story"}
      </Animated.Text>
      <Animated.View style={addIconStyle} />
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
    borderColor: 'white',
    backgroundColor: COLORS.accentLight,
  },
  text: {
    position: 'absolute',
    width: '100%',
    textAlign: 'center',
    lineHeight: 14,
    fontSize: Platform.OS === 'ios' ? 12 : 14,
    fontWeight: '500',
  },
});

export default MoonStickyStoryItem;
