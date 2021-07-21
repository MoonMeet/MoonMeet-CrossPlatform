import ImagePicker from 'react-native-image-crop-picker';

const picker = {
  width: 300,
  height: 400,
  cropping: true,
};

export const openImagePicker = () => {
  return new Promise((resolve, reject) => {
    ImagePicker.openPicker(picker)
      .then(image => {
        console.log(image);
        resolve(image);
      })
      .catch(err => {
        reject(err);
      });
  });
};

export const openCamera = () => {
  return new Promise((resolve, reject) => {
    ImagePicker.openCamera(picker)
      .then(image => {
        console.log(image);
        resolve(image);
      })
      .catch(err => {
        reject(err);
      });
  });
};
