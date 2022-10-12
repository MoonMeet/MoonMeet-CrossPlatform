/*
 * This is the source code of Moon Meet CrossPlatform.
 * It is licensed under GNU GPL v. 3.
 * You should have received a copy of the license in this archive (see LICENSE).
 *
 * Copyright Rayen sbai, 2021-2022.
 */

import ImagePicker from 'react-native-image-crop-picker';

const AvatarPicker = {
  width: 1024,
  height: 1024,
  cropping: true,
  mediaType: 'photo',
};

export const openImagePicker = () => {
  return new Promise((resolve, reject) => {
    ImagePicker.openPicker(AvatarPicker)
      .then(image => {
        resolve(image);
      })
      .catch(err => {
        reject(err);
      });
  });
};

export const openCamera = () => {
  return new Promise((resolve, reject) => {
    ImagePicker.openCamera(AvatarPicker)
      .then(image => {
        resolve(image);
      })
      .catch(err => {
        reject(err);
      });
  });
};
