import React from 'react';
import { ViroARScene, ViroBox, ViroARSceneNavigator } from '@reactvision/react-viro';
const MyARScene = () => (
  <ViroARScene>
    <ViroBox position={[0, 0, -2]} scale={[0.3, 0.3, 0.3]} />
  </ViroARScene>
);
export default function App() {
  return <ViroARSceneNavigator initialScene={{ scene: MyARScene }} />;
}