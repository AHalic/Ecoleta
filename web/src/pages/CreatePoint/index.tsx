import React, { useEffect, useState } from "react";
import "./style.css";
import { Link } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import logo from "../../assets/logo.svg";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
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

const CreatePoint = () => {
    // Estado: armazenar informações dentro do componente
    // Sempre que precisar de uma info de um componente, é preciso criar um estado

    // Sempre que cria um estado para array ou objeto: manualmente iformar o tipo da variavel
    const [items, setItems] = useState<Item[]>([]); 
    const [ufs, setUfs] = useState<UF[]>([]);

    // useEffect: executa uma função assim que o componente é exibido em tela
    // SÓ É EXECUTADO UMA UNICA VEZ
    useEffect(() => {
        api.get('items').then(response => {
            setItems(response.data);
        });
    }, []);

    useEffect(() => {
        axios.get('https://servicodados.ibge.gov.br/api/v1/localidades/estados').then(response => {
            setUfs(response.data.map((uf: UF) => {return {nome: uf.nome, sigla: uf.sigla}}));
        });
    }, []);


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

                <fieldset>
                    <legend>
                        <h2>Dados</h2>
                    </legend>

                    {/* class é uma palavra reservada do js, por isso usa classname */}
                    <div className="field">
                        {/* assim como o for */}
                        <label htmlFor="name">Nome da entidade</label>
                        <input 
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
                                type="email" 
                                name="email" 
                                id="email"
                            />
                        </div>
                        <div className="field">
                        {/* assim como o for */}
                        <label htmlFor="celular">Celular</label>
                        <input 
                            type="text" 
                            name="celular" 
                            id="celular"
                        />
                        </div>

                    </div>
                </fieldset>

                <fieldset>
                    <legend>
                        <h2>Endereço</h2>
                        <span>Selecione o endereço no mapa</span>
                    </legend>
                    
                    {/* center: recebe [latitude, longitude] */}
                    <MapContainer center={[-23.561999, -46.655927]} zoom={12} style={{ width: '100%', height: 280 }}>
                        <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>

                        <Marker position={[-23.561999, -46.655927]} />
                    </MapContainer>

                    <div className="field-group">

                        <div className="field">
                            <label htmlFor="uf">Estado (UF)</label>
                            <select name="uf" id="uf">
                                <option value="0">Selecione uma UF</option>
                            </select>
                        </div>

                        <div className="field">
                            <label htmlFor="city">Cidade</label>
                            <select name="city" id="city">
                                <option value="0">Selecione uma cidade</option>
                            </select>
                        </div>

                    </div>
                </fieldset>

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