'use client';

import React, { useEffect, useState, useMemo } from "react";
import API_ROUTES from "@/app/configAPIRoute";
import PizzaCard from "./PizzaCard";
import SidebarIngredients from "./SideBarIngredient";
import PizzaCommandeModal from "./PizzaCommande";
import ListeCommentairesPizza from "../commentaire/ListeCommentairesPizza";

const AffichagePizzas = () => {
    const [pizzas, setPizzas] = useState([]);
    const [filteredPizzas, setFilteredPizzas] = useState([]);
    const [ingredients, setIngredients] = useState([]);
    const [selectedIngredients, setSelectedIngredients] = useState([]);
    const [selectedPizza, setSelectedPizza] = useState(null);
    const [showModalPizzaCommande, setShowModalPizzaCommande] = useState(false);
    const [showModalCommentaire, setShowModalCommentaire] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const pizzasResponse = await fetch(API_ROUTES.PIZZA);
                const pizzasData = await pizzasResponse.json();
                const pizzasWithPhotos = pizzasData.data.map((pizza) => ({
                    ...pizza,
                    photo: `${API_ROUTES.PIZZA}/images/${pizza.id}`,
                }));
                setPizzas(pizzasWithPhotos);
                setFilteredPizzas(pizzasWithPhotos);
                
                const ingredientsResponse = await fetch(API_ROUTES.INGREDIENT);
                const ingredientsData = await ingredientsResponse.json();
                setIngredients(ingredientsData.data);
            } catch (error) {
                console.error("Erreur lors de la récupération des données :", error);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        const filterPizzas = () => {
            if (selectedIngredients.length === 0) {
                // If no ingredients selected, show all pizzas
                setFilteredPizzas(pizzas); 
            } else {
                // Check the format of ingredient IDs and compare correctly
                const filtered = pizzas.filter((pizza) => {
                    // Make sure we're comparing the same types (string vs number)
                    // Convert both to strings for safe comparison
                    return selectedIngredients.every(ingredientId => {
                        const ingredientIdStr = String(ingredientId);
                        // Check if the pizza's ingredients contain this ID
                        return pizza.ingredients_principaux.some(pizzaIngredient => {
                            // If ingredients_principaux is an array of objects with id property
                            if (typeof pizzaIngredient === 'object' && pizzaIngredient.id) {
                                return String(pizzaIngredient.id) === ingredientIdStr;
                            }
                            // If ingredients_principaux is an array of IDs
                            else {
                                return String(pizzaIngredient) === ingredientIdStr;
                            }
                        });
                    });
                });
                setFilteredPizzas(filtered);
            }
            console.log("selectedIngredients", selectedIngredients);
            // Using the current state after updating might not reflect the updated state immediately
            // due to React's state batching, so log filtered separately
            console.log("pizzas being filtered", pizzas);
        };

        filterPizzas();
    }, [selectedIngredients, pizzas]);

    const ouvrirModalPizzaCommande = (pizza) => {
        setSelectedPizza(pizza);
        setShowModalPizzaCommande(true);
    };

    const fermerModalCommande = () => {
        setShowModalPizzaCommande(false);
        setSelectedPizza(null);
    };

    const ouvrirModalCommentaire = (pizza) => {
        setSelectedPizza(pizza);
        setShowModalCommentaire(true);
    };

    const fermerModalCommentaire = () => {
        setShowModalCommentaire(false);
        setSelectedPizza(null);
    };

    return (
        <div className="flex min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 static ">
            <SidebarIngredients 
                ingredients={ingredients} 
                selectedIngredients={selectedIngredients} 
                setSelectedIngredients={setSelectedIngredients}
            />
            <div className="flex-1 p-6">
                <h1 className="text-3xl font-bold text-center text-orange-800 mb-8">Notre Menu de Pizzas</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredPizzas.length > 0 ? (
                        filteredPizzas.map((pizza) => (
                            <PizzaCard key={pizza.id} pizza={pizza} ouvrirModalPizzaCommande={ouvrirModalPizzaCommande} ouvrirModalCommentaire={ouvrirModalCommentaire}/>
                        ))
                    ) : (
                        <div className="col-span-full text-center py-8">
                            <p className="text-lg text-gray-600">Aucune pizza ne correspond à votre sélection d'ingrédients.</p>
                        </div>
                    )}
                </div>
            </div>

            {showModalPizzaCommande && selectedPizza && (
                <PizzaCommandeModal 
                    pizza={selectedPizza} 
                    ingredients={ingredients} 
                    onClose={fermerModalCommande} 
                />
            )}

            {showModalCommentaire && selectedPizza && (
                <ListeCommentairesPizza
                    pizza={selectedPizza}
                    onClose={fermerModalCommentaire}
                />    
            )}
        </div>
    );
};

export default AffichagePizzas;