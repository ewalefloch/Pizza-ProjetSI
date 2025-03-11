"use client";
import React, { useState } from "react";
import TableauPizzas from "./TableauPizzas";
import CreerPizza from "./CreerPizza";

const GestionPizzas = ({
  pizzas,
  ingredients,
  supprimerPizza,
  ajouterPizza,
}) => {
  const [showCreerPizza, setshowCreerPizza] = useState(false);

  return (
    <div className="flex flex-col items-center">
      <div className="w-full flex justify-center items-center p-4">
        <h1 className="text-2xl font-bold">Gestion des pizzas</h1>
        <button
          className="ml-4 bg-orange-500 text-white px-4 py-2 rounded-md"
          onClick={() => setshowCreerPizza(true)}
          >Ajouter une pizza</button>
          {showCreerPizza && (
            <CreerPizza
              ingredients={ingredients}
              ajouterPizza={ajouterPizza}
              fermer={() => setshowCreerPizza(false)}
            />
          )}
      </div>

      <TableauPizzas pizzas={pizzas} supprimerPizza={supprimerPizza} />
    </div>
  );
};

export default GestionPizzas;
