import React from 'react';
import IngredientFilterCheckbox from './IngredientFilterCheckbox';

const SidebarIngredients = ({ ingredients, selectedIngredients, setSelectedIngredients}) => {
    return (
        <div className="w-64 bg-white shadow-lg p-4">
            <h2 className="text-xl font-bold text-orange-800 mb-4">Filtrer par ingrédient</h2>
            <div className="max-h-screen overflow-y-auto space-y-2">
                {ingredients.map((ingredient) => (
                    <IngredientFilterCheckbox 
                        key={`ingredient-${ingredient.id}`} 
                        ingredient={ingredient} 
                        selectedIngredients={selectedIngredients} 
                        setSelectedIngredients={setSelectedIngredients}
                    />
                ))}
            </div>
        </div>
    );
};

export default SidebarIngredients;
