import React, { useCallback, useEffect } from 'react';

import * as SplashScreen from 'expo-splash-screen';
import { SafeAreaView, StatusBar, StyleSheet, Text, View } from 'react-native';
import { useFonts, Ubuntu_700Bold } from '@expo-google-fonts/ubuntu';
import { Roboto_400Regular, Roboto_500Medium } from '@expo-google-fonts/roboto';

import Routes from './src/routes';

// Não é possivel retornar 2 componentes, por isso o uso do View
// ou usa-se o Fragment (não produz nenhum elemento HTML)
export default function App() {
	const [fontsLoaded] = useFonts({
		Ubuntu_700Bold,
		Roboto_400Regular,
		Roboto_500Medium,
	});

	useEffect(() => {
		async function prepare() {
		  try {
			await SplashScreen.preventAutoHideAsync();
		  } catch (e) {
			console.warn(e);
		  }
		}
		prepare();
	}, []);

	const onLayoutRootView = useCallback(async () => {
		if (fontsLoaded) {
		  await SplashScreen.hideAsync();
		}
	}, [fontsLoaded]);

	if (!fontsLoaded) {
		return null;
	}

	return (
		<SafeAreaView style={{ flex: 1 }} onLayout={onLayoutRootView}>
			<StatusBar barStyle="dark-content" translucent backgroundColor="transparent"/>
			<Routes />
		</SafeAreaView>
	);
}