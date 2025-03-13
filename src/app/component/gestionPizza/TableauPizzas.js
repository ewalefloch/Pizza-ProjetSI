"use client";
import React from "react";

const TableauPizzas = ({ pizzas, supprimerPizza }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full table-auto border-collapse border border-gray-400">
        <thead>
          <tr>
            <th className="border border-gray-300 px-4 py-2">Nom</th>
            <th className="border border-gray-300 px-4 py-2">Description</th>
            <th className="border border-gray-300 px-4 py-2">Prix</th>
            <th className="border border-gray-300 px-4 py-2">Ingrédients</th>
            <th className="border border-gray-300 px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(pizzas) && pizzas.length > 0 ? (
            pizzas.map((pizza) => (
              <tr key={pizza.id} className="text-center">
                <td className="border border-gray-300 px-4 py-2">{pizza.nom}</td>
                <td className="border border-gray-300 px-4 py-2">{pizza.description}</td>
                <td className="border border-gray-300 px-4 py-2">{pizza.prix} €</td>
                <td className="border border-gray-300 px-4 py-2">
                  {/* Vérifie que ingredients_principaux est un tableau, sinon initialise à [] */}
                  {Array.isArray(pizza.ingredients_principaux) && pizza.ingredients_principaux.length > 0 ? (
                    <>
                      {pizza.ingredients_principaux.slice(0, 3).map((ingredient, index) => (
                        <span key={index} className="mr-2">{ingredient.nom}</span>
                      ))}
                      {pizza.ingredients_principaux.length > 3 && <span>...</span>}
                    </>
                  ) : (
                    <span className="text-gray-500">Aucun ingrédient</span>
                  )}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  <button
                    onClick={() => supprimerPizza(pizza.id)}
                    className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
                  >
                    Supprimer
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <>
              <tr>
                <td colSpan="5" className="text-center px-4 py-2">Aucune pizza disponible</td>
              </tr>
            </>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TableauPizzas;
