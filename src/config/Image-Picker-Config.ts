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
} as any;

export type PhotoType = {
  path: string;
  width: number;
  height: number;
  mime: string;
  size: number;
  data: string | null;
  exif: any | null;
  filename: string | null;
  modificationDate: string | null;
  creationDate: string | null;
  latitude: number | null;
  longitude: number | null;
};

/**
 * Opens an image picker to select an image.
 *
 * @returns {Promise} A promise that resolves with the selected image or rejects with an error.
 */
export const openImagePicker = (): Promise<any> => {
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

/**
 * Opens the device's camera and returns a Promise that resolves with the captured image.
 *
 * @returns {Promise} Promise that resolves with the captured image, or rejects with an error.
 */
export const openCamera = (): Promise<any> => {
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
