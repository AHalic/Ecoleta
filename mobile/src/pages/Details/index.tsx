import React, { useEffect, useState } from "react";
import api from "../../services/api";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Feather as Icon, FontAwesome } from "@expo/vector-icons";
import { View, StyleSheet, TouchableOpacity, Image, Text, SafeAreaView } from "react-native";
import { RectButton } from "react-native-gesture-handler";


interface Params {
    point_id: number;
}

interface Data {
    point: {
        image: string;
        name: string;
        email: string;
        celular: string;
        city: string;
        uf: string;
    }
    items: {
        title: string;
    }[];
}

const Detail = () => {
    const navigation = useNavigation();
    const route = useRoute();

    const routeParams = route.params as Params;

    const [point, setPoint] = useState<Data>({} as Data);

    useEffect(() => {
        // acessa a rota /points/:id para pegar os dados especificos deste ponto
        api.get(`points/${routeParams.point_id}`).then((response) => {
            setPoint(response.data);
        });
    }, []);

    function handleNavigateBack() {
        navigation.goBack();
    }

    // para tela de carregamento
    if (!point.point) {
        return null;
    }

    return (
        <SafeAreaView style={{flex:1}}>
            <View style={styles.container}>
                {/* botão para voltar a pagina points */}
                <TouchableOpacity onPress={handleNavigateBack}>
                    <Icon name="arrow-left" size={20} color="#34cb79" />
                </TouchableOpacity>

                <Image style={styles.pointImage} source={{uri:point.point.image}}></Image>
                <Text style={styles.pointName}>{point.point.name}</Text>
                <Text style={styles.pointItems}>
                    {point.items.map(item => item.title).join(", ")}
                </Text>

                <View style={styles.address}>
                    <Text style={styles.addressTitle}>Endereço</Text>
                    <Text style={styles.addressContent}>{point.point.city}, {point.point.uf}</Text>
                </View>

                <View style={styles.footerContainer}>
                    <View style={styles.footer}>
                        <RectButton style={styles.button} onPress={() => {}}>
                            <FontAwesome name="whatsapp" color="#FFF" size={20} />
                            <Text style={styles.buttonText}>Whatsapp</Text>
                        </RectButton>

                        <RectButton style={styles.button} onPress={() => {}}>
                            <Icon name="mail" color="#FFF" size={20} />
                            <Text style={styles.buttonText}>E-mail</Text>
                        </RectButton>
                    </View>
                </View>

            </View>
        </SafeAreaView>
    )
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 32,
        paddingTop: 20,
    },
  
    pointImage: {
        width: '100%',
        height: 120,
        resizeMode: 'cover',
        borderRadius: 10,
        marginTop: 32,
    },
  
    pointName: {
        color: '#322153',
        fontSize: 28,
        fontFamily: 'Ubuntu_700Bold',
        marginTop: 24,
    },
  
    pointItems: {
        fontFamily: 'Roboto_400Regular',
        fontSize: 16,
        lineHeight: 24,
        marginTop: 8,
        color: '#6C6C80'
    },
  
    address: {
        marginTop: 32,
    },
    
    addressTitle: {
        color: '#322153',
        fontFamily: 'Roboto_500Medium',
        fontSize: 16,
    },
  
    addressContent: {
        fontFamily: 'Roboto_400Regular',
        lineHeight: 24,
        marginTop: 8,
        color: '#6C6C80'
    },
  
    footer: {
        borderTopWidth: StyleSheet.hairlineWidth,
        borderColor: '#999',
        paddingVertical: 20,
        paddingHorizontal: 32,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },

    footerContainer: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    
    button: {
        width: '48%',
        backgroundColor: '#34CB79',
        borderRadius: 10,
        height: 50,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
  
    buttonText: {
        marginLeft: 8,
        color: '#FFF',
        fontSize: 16,
        fontFamily: 'Roboto_500Medium',
    },
});

export default Detail;
