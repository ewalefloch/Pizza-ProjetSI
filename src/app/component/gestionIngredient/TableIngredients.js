import React from "react";

const TableauIngredients = ({ ingredients, supprimerIngredient }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full table-auto border-collapse border border-gray-400">
        <thead>
          <tr>
            <th className="border border-gray-300 px-4 py-2">Nom</th>
            <th className="border border-gray-300 px-4 py-2">Description</th>
            <th className="border border-gray-300 px-4 py-2">Prix</th>
            <th className="border border-gray-300 px-4 py-2">Image</th>
            <th className="border border-gray-300 px-4 py-2">Forme SVG</th>
            <th className="border border-gray-300 px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(ingredients) && ingredients.length > 0 ? (
            ingredients.map((ingredient) => (
              <tr key={ingredient.id} className="text-center">
                <td className="border border-gray-300 px-4 py-2">{ingredient.nom}</td>
                <td className="border border-gray-300 px-4 py-2">{ingredient.description}</td>
                <td className="border border-gray-300 px-4 py-2">{ingredient.prix} €</td>
                <td className="border border-gray-300 px-4 py-2">
                  <img
                      src={ingredient.image}
                      alt={`Image de ${ingredient.nom}`}
                      className="w-12 h-12 object-cover"
                  />
                </td>
                  <td className="border border-gray-300 px-4 py-2">
                  <div
                    dangerouslySetInnerHTML={{ __html: ingredient.formeSvg }}
                    className="w-12 h-12"
                  />
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  <button
                    onClick={() => supprimerIngredient(ingredient.id)}
                    className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
                  >
                    Supprimer
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr key="aucun-ingredient">
              <td colSpan="5" className="text-center px-4 py-2">Aucun ingrédient disponible</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TableauIngredients;
