import ImagePicker from 'react-native-image-crop-picker';

const AvatarPicker = {
  width: 550,
  height: 650,
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
