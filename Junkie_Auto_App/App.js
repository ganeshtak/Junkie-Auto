import React from 'react';
import { View, Text, SafeAreaView, StatusBar, Platform } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { RootNavigation } from './src/Route';
import { colors } from './src/Style/baseStyle';
import { AppSpinner } from './src/Utility/AppSpinner';
import { RenderSnakeBar } from './src/Utility/ShowMessage';
import { NetworkCheck } from './src/Utility/NetworkCheck';


const AppStatusBar = () => {
  return (
    <SafeAreaView style={{
      backgroundColor: colors.primary
    }}>
      <StatusBar
        backgroundColor={colors.primary}
        barStyle={Platform.OS == "android" ? 'light-content' : "light-content"}
      />
    </SafeAreaView>
  )
}


export default function App() {

  return (
    <>

      <AppStatusBar />
      <RootNavigation />

      <AppSpinner />
      <RenderSnakeBar />
      <NetworkCheck />
    </>
  )
}