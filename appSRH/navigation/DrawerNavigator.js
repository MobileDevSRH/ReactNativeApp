import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';

import Home from '../screens/Home';
import CameraUpload from '../screens/CameraUpload';
import Maps from '../screens/Maps';
import TTS from '../screens/TTS';

const Drawer = createDrawerNavigator();

function CustomDrawerContent({ navigation }) {
  const [open, setOpen] = useState(false);

  return (
    <View style={{ flex: 1, padding: 20 }}>

      <TouchableOpacity onPress={() => navigation.navigate('Home')}>
        <Text style={{ fontSize: 18, paddingVertical: 10 }}>Home</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('CameraUpload')}>
        <Text style={{ fontSize: 18, paddingVertical: 10 }}>Camera</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Maps')}>
        <Text style={{ fontSize: 18, paddingVertical: 10 }}>Map</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('TTS')}>
        <Text style={{ fontSize: 18, paddingVertical: 10 }}>TTS</Text>
      </TouchableOpacity>
    </View>
  );
}

export default function DrawerNavigator() {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{ headerShown: true }}
    >
      <Drawer.Screen name="Home" component={Home} />
      <Drawer.Screen name="CameraUpload" component={CameraUpload} />
      <Drawer.Screen name="Maps" component={Maps} />
      <Drawer.Screen name="TTS" component={TTS} />
    </Drawer.Navigator>
  );
}
