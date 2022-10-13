import React, { useEffect, useState } from "react";
import "./style.css";
import { Link } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import logo from "../../assets/logo.svg";
import { MapContainer, TileLayer, Marker, useMapEvents, Popup } from "react-leaflet";
import { LatLng, LeafletMouseEvent } from "leaflet";
import api from "../../services/api";
import axios from "axios";

interface Item {
    id: number;
    title: string;
    image_url: string;
}

interface UF {
    nome: string;
    sigla: string;
}

interface City {
    nome: string;
}

const CreatePoint = () => {
    // Estado: armazenar informações dentro do componente
    // Sempre que precisar de uma info de um componente, é preciso criar um estado

    // Sempre que cria um estado para array ou objeto: manualmente iformar o tipo da variavel
    const [items, setItems] = useState<Item[]>([]); 
    const [ufs, setUfs] = useState<UF[]>([]);
    const [cities, setCities] = useState<City[]>([]);
    
    const [selectedUf, setSelectedUf] = useState("0");
    const [selectedCity, setSelectedCity] = useState("0");

    const [position, setPosition] = useState<LatLng>(new LatLng(-23.561999, -46.655927));


    // useEffect: executa uma função assim que o componente é exibido em tela
    // SÓ É EXECUTADO UMA UNICA VEZ
    
    // pega os items do banco de dados para apresentar no formulario
    useEffect(() => {
        api.get('items').then(response => {
            setItems(response.data);
        });
    }, []);

    // pega as ufs do IBGE para apresentar no formulario
    useEffect(() => {
        axios.get('https://servicodados.ibge.gov.br/api/v1/localidades/estados').then(response => {
            setUfs(response.data.map((uf: UF) => {return {nome: uf.nome, sigla: uf.sigla}}));
        });
    }, []);

    // pega as cidades do IBGE para apresentar no formulario de acordo com a uf selecionada
    useEffect(() => {
        if (selectedUf === '0') {
            return;
        } 

        axios.get(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`).then(response => {
            setCities(response.data.map((city: City) => {return {nome: city.nome}}));
        });

    }, [selectedUf]);

    // pega a localização do usuario
    useEffect(() => {
        navigator.geolocation.getCurrentPosition(position => {
            const { latitude, longitude } = position.coords;
            setPosition(new LatLng(latitude, longitude));
        });

    }, []);


    // modifica o valor do estado toda vez que o usuario seleciona uma UF
    function handleSelectUf(event: React.ChangeEvent<HTMLSelectElement>) {
        const uf = event.target.value;
        setSelectedUf(uf);
    }

    function handleSelectCity(event: React.ChangeEvent<HTMLSelectElement>) {
        const city = event.target.value;
        setSelectedCity(city);
    }

    function LocationMarker() {
        const map = useMapEvents({
            click(e:LeafletMouseEvent) {
                setPosition(e.latlng)
            }
        })
      
        return position === null ? null : (
            map.flyTo(position, 15),
            <Marker position={position}>
                <Popup>You are here</Popup>
            </Marker>
        )
    }


    return (
        <div id="page-create-point">
            <header>
                <img src={logo} alt="Ecoleta"/>
                <Link to="/">
                    <FiArrowLeft />
                    Voltar para home
                </Link>
            </header>

            <form>
                <h1>Cadastro do <br /> ponto de coleta</h1>

                {/* Fields de cadastro do nome da entidade, email e celular */}
                <fieldset>
                    <legend>
                        <h2>Dados</h2>
                    </legend>

                    {/* class é uma palavra reservada do js, por isso usa classname */}
                    <div className="field">
                        {/* assim como o for */}
                        <label htmlFor="name">Nome da entidade</label>
                        <input 
                            placeholder="Digite o nome da entidade"
                            type="text" 
                            name="name" 
                            id="name"
                        />
                    </div>

                    <div className="field-group">

                        <div className="field">
                            {/* assim como o for */}
                            <label htmlFor="email">Email</label>
                            <input 
                                placeholder="Digite o seu email"
                                type="email" 
                                name="email" 
                                id="email"
                            />
                        </div>
                        <div className="field">
                        {/* assim como o for */}
                        <label htmlFor="celular">Celular</label>
                        <input 
                            placeholder="Digite o seu telefone celular"
                            type="text" 
                            name="celular" 
                            id="celular"
                        />
                        </div>

                    </div>
                </fieldset>

                {/* Fields de cadastro do endereço */}
                <fieldset>
                    <legend>
                        <h2>Endereço</h2>
                        <span>Selecione o endereço no mapa</span>
                    </legend>
                    
                    {/* center: recebe [latitude, longitude] */}
                    <MapContainer center={position} zoom={5} style={{ width: '100%', height: 280 }}>
                        <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>

                        <LocationMarker />
                    </MapContainer>

                    <div className="field-group">

                        <div className="field">
                            <label htmlFor="uf">Estado (UF)</label>
                            <select name="uf" id="uf" onChange={handleSelectUf}>
                                <option value="0">Selecione uma UF</option>
                                {ufs.map(uf => (
                                    <option key={uf.sigla} value={uf.sigla}>{uf.sigla}</option>
                                ))}
                            </select>
                        </div>

                        <div className="field">
                            <label htmlFor="city">Cidade</label>
                            <select name="city" id="city" value={selectedCity} onChange={handleSelectCity}>
                                <option value="0">Selecione uma cidade</option>
                                {cities.map(city => (
                                    <option key={city.nome} value={city.nome}>{city.nome}</option>
                                ))}
                            </select>
                        </div>

                    </div>
                </fieldset>

                {/* Fields de cadastro dos itens */}
                <fieldset>
                    <legend>
                        <h2>Itens de coleta</h2>
                    </legend>
                    <ul className="items-grid">
                        {items.map(item => (
                            <li key={item.id}>
                                <img src={item.image_url} alt={item.title}/>
                                <span>{item.title}</span>
                            </li>
                        ))}
                    </ul>
                </fieldset>

                <button type="submit">
                    Cadastrar ponto de coleta
                </button>
            </form>
        </div>
    );
}

export default CreatePoint;

// API mapa:
// https://leafletjs.com/
// https://react-leaflet.js.org/