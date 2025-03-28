import React from 'react';

const IngredientFilterCheckbox = ({ ingredient, selectedIngredients,setSelectedIngredients }) => {
    const handleChange = () => {
        setSelectedIngredients((prevState) => {
            if (prevState.includes(ingredient.id)) {
                return prevState.filter((id) => id !== ingredient.id);
            }
            return [...prevState, ingredient.id];
        });
    };

    return (
        <div className="flex items-center">
            <label className="flex items-center space-x-2 cursor-pointer p-2 hover:bg-orange-50 rounded w-full">
                <input
                    type="checkbox"
                    className="w-4 h-4 accent-orange-500"
                    checked={selectedIngredients.includes(ingredient.id)}
                    onChange={handleChange}
                />
                <span className="text-gray-700">{ingredient.nom}</span>
            </label>
        </div>
    );
};

export default IngredientFilterCheckbox;
