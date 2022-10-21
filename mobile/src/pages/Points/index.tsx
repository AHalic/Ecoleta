import React, { useEffect, useState } from "react";
import Constants from "expo-constants";
import { Feather as Icon } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Alert } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { SvgUri } from "react-native-svg";
import * as Location from "expo-location";

import api from "../../services/api";


interface Item {
    id: number;
    title: string;
    image_url: string;
}

interface Point {
    id: number;
    name: string;
    image: string;
    latitude: number;
    longitude: number;
    items: {
        title: string;
    }[];
}


const Points = () => {
    const navigation = useNavigation();

    const [points, setPoints] = useState<Point[]>([]);
    const [location, setLocation] = useState<[number, number]>([0,0]);
    const [items, setItems] = useState<Item[]>([]);
    const [selectedItems, setSelectedItems] = useState<number[]>([]);

    useEffect(() => {
        api.get("items").then((response) => {
            setItems(response.data);
        });
    }, []); // sem o [] o useEffect será executado infinitamente

    useEffect(() => {
        (async () => {
          
          let { status } = await Location.requestForegroundPermissionsAsync();
          if (status !== 'granted') {
            Alert.alert('Permission to access location was denied');
            return;
          }
    
          let location = await Location.getCurrentPositionAsync({});
          const { latitude, longitude } = location.coords;
          setLocation([latitude, longitude]);
        })();
    }, []);

    useEffect(() => {
        api.get("points", {}).then((response) => {
            setPoints(response.data);
        });
    }, []);

    function handleNavigateBack() {
        navigation.goBack();
    }

    function handleNavigateToDetail(id:number) {
        // as never used to avoid the error: Argument of type 'never' is not assignable to parameter of type 'never'
        navigation.navigate('Detail' as never, { point_id: id } as never);
    }

    function handleSelectItem(id: number) {
        // para modificar um estado não podemos so fazer um push/pop (todo o estado é substituido)
        // copiar o array adicionando ou removendo o item selecionado

        const alreadySelected = selectedItems.findIndex(item => item === id);

        if (alreadySelected >= 0) {
            const filteredItems = selectedItems.filter(item => item !== id);
            setSelectedItems(filteredItems);
        } else {
            setSelectedItems([ ...selectedItems, id ]);
        }
    }
        

    return (
        <>
            <View style={styles.container} >
                {/* botão para voltar a pagina home */}
                <TouchableOpacity onPress={handleNavigateBack}>
                    <Icon name="arrow-left" size={20} color="#34cb79" />
                </TouchableOpacity>

                <Text style={styles.title}>Bem vindo.</Text>
                <Text style={styles.description}>Encontre no mapa um ponto de coleta.</Text>

                <View style={styles.mapContainer}>
                    {/* Verifies if location has already loaded to then load the map component */}
                    {   location[0] !== 0 && (
                        <MapView 
                            style={styles.map} 
                            initialRegion={{
                                latitude: location[0],
                                longitude: location[1],
                                latitudeDelta: 0.04,
                                longitudeDelta: 0.04,
                            }}>


                            {points.map(point => (
                                <Marker 
                                    key={String(point.id)}
                                    coordinate={{
                                        latitude: point.latitude,
                                        longitude: point.longitude,
                                    }}
                                    onPress={() => handleNavigateToDetail(point.id)}
                                    style={styles.mapMarker}
                                >
                                    {/* modifica o pin do marcador para uma imagem */}
                                    <View style={styles.mapMarkerContainer}>
                                        <Image style={styles.mapMarkerImage} source={{uri:point.image}}></Image>
                                        <Text style={styles.mapMarkerTitle}>{point.name}</Text>
                                    </View>
                                </Marker>
                            ))}
                        </MapView>
                    )}
                </View>
            </View>

            {/* mostra os itens disponiveis para coleta, com scroll horizontal */}
            <View style={styles.itemsContainer}>
                <ScrollView 
                    horizontal 
                    showsHorizontalScrollIndicator={false} 
                    contentContainerStyle={{paddingHorizontal: 20}}>
                    {items.map(item => (
                        <TouchableOpacity 
                            key={String(item.id)} 
                            style={[styles.item, 
                                // adiciona o estilo de selecionado ao item caso ele esteja selecionado (no vetor)
                                selectedItems.includes(item.id) ? styles.selectedItem : {}]}
                            onPress={() => handleSelectItem(item.id)}
                            activeOpacity={0.5}>

                            <SvgUri width={42} height={42} uri={item.image_url} />
                            <Text style={styles.itemTitle}> {item.title} </Text>
                        </TouchableOpacity>
                    ))}
                    {/* <TouchableOpacity style={styles.item} onPress={() => {}}>
                        <SvgUri width={42} height={42} uri="http://192.168.15.35:3333/uploads/lampadas.svg" />
                        <Text style={styles.itemTitle}>Lâmpadas</Text>
                    </TouchableOpacity> */}

                </ScrollView>
            </View>
        </>
    )
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 32,
        paddingTop: 20 + Constants.statusBarHeight,
    },
  
    title: {
        fontSize: 20,
        fontFamily: 'Ubuntu_700Bold',
        marginTop: 24,
    },
  
    description: {
        color: '#6C6C80',
        fontSize: 16,
        marginTop: 4,
        fontFamily: 'Roboto_400Regular',
    },
  
    mapContainer: {
        flex: 1,
        width: '100%',
        borderRadius: 10,
        overflow: 'hidden',
        marginTop: 16,
    },
  
    map: {
        width: '100%',
        height: '100%',
    },
  
    mapMarker: {
        width: 90,
        height: 80, 
    },
  
    mapMarkerContainer: {
        width: 90,
        height: 70,
        backgroundColor: '#34CB79',
        flexDirection: 'column',
        borderRadius: 8,
        overflow: 'hidden',
        alignItems: 'center'
    },
  
    mapMarkerImage: {
        width: 90,
        height: 45,
        resizeMode: 'cover',
    },
  
    mapMarkerTitle: {
        flex: 1,
        fontFamily: 'Roboto_400Regular',
        color: '#FFF',
        fontSize: 13,
        lineHeight: 23,
    },
  
    itemsContainer: {
        flexDirection: 'row',
        marginTop: 16,
        marginBottom: 32,
    },
  
    item: {
        backgroundColor: '#fff',
        borderWidth: 2,
        borderColor: '#eee',
        height: 120,
        width: 120,
        borderRadius: 8,
        paddingHorizontal: 16,
        paddingTop: 20,
        paddingBottom: 16,
        marginRight: 8,
        alignItems: 'center',
        justifyContent: 'space-between',
    
        textAlign: 'center',
    },
  
    selectedItem: {
        borderColor: '#34CB79',
        borderWidth: 2,
    },
  
    itemTitle: {
        fontFamily: 'Roboto_400Regular',
        textAlign: 'center',
        fontSize: 13,
    },
});

export default Points;
