"use client";
import React, { useState, useEffect } from "react";

const ListeIngredients = ({ ingredients, onSelectionChange }) => {
  const [selectedIngredients, setSelectedIngredients] = useState([]);

  useEffect(() => {
    onSelectionChange(selectedIngredients);
  }, [selectedIngredients, onSelectionChange]);

  const handleCheckboxChange = (e) => {
    const id = parseInt(e.target.value);
    setSelectedIngredients((prev) =>
      e.target.checked ? [...prev, id] : prev.filter((ingId) => ingId !== id)
    );
  };

  return (
    <div className="w-1/2 p-4 min-w-max">
      <div className="space-y-2">
        {Array.isArray(ingredients) && ingredients.length > 0 ? (
          ingredients.map((ingredient) => (
            <div key={ingredient.id} className="flex items-center">
              <input
                type="checkbox"
                id={`ingredient-${ingredient.id}`}
                value={ingredient.id}
                onChange={handleCheckboxChange}
              />
              <label htmlFor={`ingredient-${ingredient.id}`} className="ml-2">
                {ingredient.nom}
              </label>
            </div>
          ))
        ) : (
          <p>Aucun ingrédient disponible</p>
        )}
      </div>
    </div>
  );
};

export default ListeIngredients;
