'use client';

import React, { useEffect, useState } from "react";
import API_ROUTES from "@/app/configAPIRoute";
import PizzaCard from "./PizzaCard";
import SidebarIngredients from "./SideBarIngredient";
import PizzaCommandeModal from "./PizzaCommande";

const AffichagePizzas = () => {
    const [pizzas, setPizzas] = useState([]);
    const [filteredPizzas, setFilteredPizzas] = useState([]);
    const [ingredients, setIngredients] = useState([]);
    const [selectedIngredients, setSelectedIngredients] = useState([]);
    const [selectedPizza, setSelectedPizza] = useState(null);
    const [showModal, setShowModal] = useState(false);

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

    const ouvrirModal = (pizza) => {
        setSelectedPizza(pizza);
        setShowModal(true);
    };

    const fermerModal = () => {
        setShowModal(false);
        setSelectedPizza(null);
    };

    return (
        <div className="flex min-h-screen bg-gradient-to-br from-amber-50 to-orange-100">
            <SidebarIngredients 
                ingredients={ingredients} 
                selectedIngredients={selectedIngredients} 
                filtrerPizzas={() => {}} 
            />
            <div className="flex-1 p-6">
                <h1 className="text-3xl font-bold text-center text-orange-800 mb-8">Notre Menu de Pizzas</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredPizzas.length > 0 ? (
                        filteredPizzas.map((pizza) => (
                            <PizzaCard key={pizza.id} pizza={pizza} ouvrirModal={ouvrirModal} />
                        ))
                    ) : (
                        <div className="col-span-full text-center py-8">
                            <p className="text-lg text-gray-600">Aucune pizza ne correspond à votre sélection d'ingrédients.</p>
                        </div>
                    )}
                </div>
            </div>

            {showModal && selectedPizza && (
                <PizzaCommandeModal 
                    pizza={selectedPizza} 
                    ingredients={ingredients} 
                    onClose={fermerModal} 
                />
            )}
        </div>
    );
};

export default AffichagePizzas;
