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


export default Header;