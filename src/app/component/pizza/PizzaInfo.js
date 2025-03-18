import React from "react";

const PizzaInfo = ({ pizza }) => {
  return (
    <>
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-xl font-bold text-gray-800">{pizza.nom}</h3>
        <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full font-bold">
          {pizza.prix.toFixed(2)} €
        </span>
      </div>
      <p className="text-gray-600 mb-4">{pizza.description}</p>
      <div className="flex flex-wrap gap-1 mb-4">
        {pizza.ingredients_principaux?.map((ingredient, indexIngredient) => (
            <span
              key={`pizza-${pizza.id}-ingredient-${ingredient.id}-${indexIngredient}`}
              className="bg-orange-50 text-orange-600 text-xs px-2 py-1 rounded-full"
            >
              {ingredient.nom}
            </span>
        ))}
      </div>
    </>
  );
};

export default PizzaInfo;
