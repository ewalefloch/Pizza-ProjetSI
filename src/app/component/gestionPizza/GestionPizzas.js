import React, { useState } from "react";
import TableauPizzas from "./TableauPizzas";
import CreerPizza from "./CreerPizza";

const GestionPizzas = ({
  pizzas,
  ingredients,
  supprimerPizza,
  ajouterPizza,
}) => {
  const [showCreerPizza, setShowCreerPizza] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);  // Page courante
  const pizzasPerPage = 5; // Nombre de pizzas par page

  const indexOfLastPizza = currentPage * pizzasPerPage;
  const indexOfFirstPizza = indexOfLastPizza - pizzasPerPage;
  const currentPizzas = pizzas.slice(indexOfFirstPizza, indexOfLastPizza);

  const totalPages = Math.ceil(pizzas.length / pizzasPerPage);

  const nextPage = () => setCurrentPage((prev) => (prev < totalPages ? prev + 1 : prev));
  const prevPage = () => setCurrentPage((prev) => (prev > 1 ? prev - 1 : prev));

  return (
    <div className="flex flex-col items-center">
      <div className="w-full flex justify-center items-center p-4">
        <h1 className="text-2xl font-bold">Gestion des pizzas</h1>
        <button
          className="ml-4 bg-orange-500 text-white px-4 py-2 rounded-md"
          onClick={() => setShowCreerPizza(true)}
        >
          Ajouter une pizza
        </button>
        {showCreerPizza && (
          <CreerPizza
            ingredients={ingredients}
            ajouterPizza={ajouterPizza}
            fermer={() => setShowCreerPizza(false)}
          />
        )}
      </div>

      <TableauPizzas pizzas={currentPizzas} supprimerPizza={supprimerPizza} />

      <div className="flex justify-between w-full px-4 py-2">
        <button
          onClick={prevPage}
          className="bg-gray-500 text-white px-4 py-2 rounded-md"
        >
          Précédent
        </button>
        <span>
          Page {currentPage} sur {totalPages}
        </span>
        <button
          onClick={nextPage}
          className="bg-gray-500 text-white px-4 py-2 rounded-md"
        >
          Suivant
        </button>
      </div>
    </div>
  );
};

export default GestionPizzas;
