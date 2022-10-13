import React from "react";

interface HeaderProps {
    title: string; // title?: string -> opcional
}

// FC = tipo generico capaz de receber parametros
// Utilizando as chaves: permite codigo js dentro do html
const Header:React.FC<HeaderProps> = (props) => {
  return (
    <header>
      <h1>{props.title}</h1>
    </header>
  );
}

/*
import React, { useState } from 'react';

import Header from './Header';

// JSX: Sintaxe de XML dentro do JavaScript

function App() {
	// conceito de imutabilidade do react: 
	// não é possivel fazer um simples counter++
	// é necessario criar um novo valor para o estado
	const [counter, setCounter] = useState(0); // retorna [valor do estado, função para atualizar o valor do estado]

	function handleButtonClick() {
		setCounter(counter + 1);
	}

	return (
		<div>
			<Header title={`Contador: ${counter}`}/> {// Componente Header Ecoleta }

			<h1>{counter}</h1>
			<button type='button' onClick={handleButtonClick}>Aumentar</button>
		</div>
	);
}
*/

export default Header;