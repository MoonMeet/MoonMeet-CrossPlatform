import {ComponentPreview, Previews} from '@react-buddy/ide-toolbox';
import {PaletteTree} from './palette';
import App from 'App.tsx';
import SplashScreen from 'screens/SplashScreen.tsx';

const ComponentPreviews = () => {
  return (
    <Previews palette={<PaletteTree />}>
      <ComponentPreview path="/App">
        <App />
      </ComponentPreview>
      <ComponentPreview path="/SplashScreen">
        <SplashScreen />
      </ComponentPreview>
    </Previews>
  );
};

export default ComponentPreviews;
