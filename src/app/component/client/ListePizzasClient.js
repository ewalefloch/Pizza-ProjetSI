import React, { useState } from "react";

const ListePizzasClient = ({ pizzas, ajouterAuPanier, ingredients, filtrerPizzas }) => {
    const [selectedIngredients, setSelectedIngredients] = useState([]);

    const handleCheckboxChange = (e) => {
        const id = parseInt(e.target.value);
        const updatedSelection = e.target.checked
            ? [...selectedIngredients, id]
            : selectedIngredients.filter((ingId) => ingId !== id);

        setSelectedIngredients(updatedSelection);
        filtrerPizzas(updatedSelection); // Filtrer les pizzas après la mise à jour
    };

    return (
        <div className="flex flex-col items-center space-y-6 max-w-7xl mx-auto">
            {/* Liste des ingrédients pour le filtrage */}
            <div className="w-full mb-4">
                <h3 className="text-lg font-bold mb-2">Filtrer par ingrédients :</h3>
                <div className="flex flex-wrap gap-2">
                    {Array.isArray(ingredients) && ingredients.length > 0 ? (
                        ingredients.map((ingredient) => (
                            <div key={ingredient.id} className="flex items-center">
                                <input
                                    type="checkbox"
                                    id={`ingredient-${ingredient.id}`}
                                    value={ingredient.id}
                                    onChange={handleCheckboxChange}
                                />
                                <label htmlFor={`ingredient-${ingredient.id}`} className="ml-2 text-sm">
                                    {ingredient.nom}
                                </label>
                            </div>
                        ))
                    ) : (
                        <p>Aucun ingrédient disponible</p>
                    )}
                </div>
            </div>

            {/* Liste des pizzas */}
            {pizzas.length > 0 ? (
                pizzas.map((pizza) => (
                    <div
                        key={pizza.id}
                        className="flex items-center w-full max-w-4xl bg-white shadow-md rounded-lg overflow-hidden"
                    >
                        {/* Image de la pizza */}
                        <div className="w-1/3">
                            <img
                                src={pizza.photo || "/images/default-pizza.jpg"}
                                alt={pizza.nom}
                                className="w-full h-48 object-cover"
                            />
                        </div>

                        {/* Informations pizza */}
                        <div className="w-2/3 p-4">
                            <h2 className="text-2xl font-bold text-gray-800">{pizza.nom}</h2>
                            <p className="mt-2 text-gray-600">{pizza.description}</p>

                            {/* Liste des ingrédients */}
                            <p className="mt-4 italic text-gray-500">
                                {pizza.ingredients_principaux &&
                                pizza.ingredients_principaux.length > 0
                                    ? pizza.ingredients_principaux.map((ing) => ing.nom).join(", ")
                                    : "Aucun ingrédient renseigné"}
                            </p>

                            {/* Bouton Ajouter */}
                            <button
                                onClick={() => ajouterAuPanier(pizza)} // Utilisation correcte du prop
                                className="mt-4 bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600"
                            >
                                Ajouter au panier
                            </button>
                        </div>
                    </div>
                ))
            ) : (
                <p className="text-gray-500">Aucune pizza disponible pour le moment.</p>
            )}
        </div>
    );
};

export default ListePizzasClient;