import React, { useState } from "react";
import CreerIngredient from "./CreerIngredient";
import TableauIngredients from "./TableIngredients";

const GestionIngredients = ({ ingredients, ajouterIngredient, supprimerIngredient }) => {
  const [showCreerIngredient, setShowCreerIngredient] = useState(false);
  const [currentPage, setCurrentPage] = useState(1); // Page courante
  const ingredientsPerPage = 5; // Nombre d'ingrédients par page

  const indexOfLastIngredient = currentPage * ingredientsPerPage;
  const indexOfFirstIngredient = indexOfLastIngredient - ingredientsPerPage;
  const currentIngredients = ingredients.slice(indexOfFirstIngredient, indexOfLastIngredient);

  const totalPages = Math.ceil(ingredients.length / ingredientsPerPage);

  const nextPage = () => setCurrentPage((prev) => (prev < totalPages ? prev + 1 : prev));
  const prevPage = () => setCurrentPage((prev) => (prev > 1 ? prev - 1 : prev));

  return (
    <div className="flex flex-col items-center">
      <div className="w-full flex justify-center items-center p-4">
        <h1 className="text-2xl font-bold">Gestion des ingrédients</h1>
        <button
          className="ml-4 bg-orange-500 text-white px-4 py-2 rounded-md"
          onClick={() => setShowCreerIngredient(true)}
        >
          Ajouter un ingrédient
        </button>
        {showCreerIngredient && (
          <CreerIngredient ajouterIngredient={ajouterIngredient} fermer={() => setShowCreerIngredient(false)} />
        )}
      </div>

      <TableauIngredients ingredients={currentIngredients} supprimerIngredient={supprimerIngredient} />

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

export default GestionIngredients;
