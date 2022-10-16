import React from 'react';

import AppLoading from 'expo-app-loading';
import { StatusBar, StyleSheet, Text, View } from 'react-native';
import { useFonts, Ubuntu_700Bold } from '@expo-google-fonts/ubuntu';
import { Roboto_400Regular, Roboto_500Medium } from '@expo-google-fonts/roboto';

import Home from './src/pages/Home';

// Não é possivel retornar 2 componentes, por isso o uso do View
// ou usa-se o Fragment (não produz nenhum elemento HTML)
export default function App() {
	const [fontsLoaded] = useFonts({
		Ubuntu_700Bold,
		Roboto_400Regular,
		Roboto_500Medium,
	});

	if (!fontsLoaded) {
		return <AppLoading />;
	}
	return (
		<>
			<StatusBar barStyle="dark-content" backgroundColor="transparent"/>
			<Home />
		</>
	);
}