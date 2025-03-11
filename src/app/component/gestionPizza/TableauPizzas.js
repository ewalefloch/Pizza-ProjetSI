"use client";
import React, { useState } from "react";

const TableauPizzas = ({ pizzas, supprimerPizza }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full table-auto">
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
          {/* Vérifier si pizzas est un tableau et s'il n'est pas vide */}
          {Array.isArray(pizzas) && pizzas.length > 0 ? (
            pizzas.map((pizza) => (
              <tr key={pizza.id} className="text-center">
                <td className="border border-gray-300 px-4 py-2">{pizza.nom}</td>
                <td className="border border-gray-300 px-4 py-2">{pizza.description}</td>
                <td className="border border-gray-300 px-4 py-2">{pizza.prix} €</td>
                <td className="border border-gray-300 px-4 py-2">
                  {/* Affiche seulement les 3 premiers ingrédients */}
                  {pizza.ingredients_principaux.slice(0, 3).map((ingredient, index) => (
                    <span key={index} className="mr-2">{ingredient.nom}</span>
                  ))}
                  {pizza.ingredients_principaux.length > 3 && <span>...</span>}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  <button
                    onClick={() => supprimerPizza(pizza.id)}
                    className="bg-red-600 text-white px-4 py-2 rounded"
                  >
                    Supprimer
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="text-center px-4 py-2">Aucune pizza disponible</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TableauPizzas;
