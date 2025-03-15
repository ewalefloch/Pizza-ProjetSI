'use client';

import React, { useEffect, useState } from "react";
import ListePizzasClient from "../client/ListePizzasClient";
import ListeIngredients from "../ingredient/ListeIngredients";
import PanierClient from "../client/PanierClient";
import API_ROUTES from "@/app/configAPIRoute";

const MenuPizza = () => {
    const [pizzas, setPizzas] = useState([]); // Liste des pizzas
    const [filteredPizzas, setFilteredPizzas] = useState([]); // Pizzas filtrées
    const [ingredients, setIngredients] = useState([]); // Liste des ingrédients
    const [panier, setPanier] = useState([]); // Contenu du panier

    // Récupérer les pizzas et les ingrédients à l'initialisation
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Récupérer les pizzas de l'API
                const pizzasResponse = await fetch(API_ROUTES.PIZZA);
                const pizzasData = await pizzasResponse.json();

                const pizzasWithPhotos = pizzasData.data.map((pizza) => ({
                    ...pizza,
                    photo: `${API_ROUTES.PIZZA}/images/${pizza.id}`, // URL pour les photos de pizza
                }));

                setPizzas(pizzasWithPhotos);
                setFilteredPizzas(pizzasWithPhotos); // Initialement, aucune filtration effectuée

                // Récupérer les ingrédients depuis l'API
                const ingredientsResponse = await fetch(API_ROUTES.INGREDIENT);
                const ingredientsData = await ingredientsResponse.json();
                setIngredients(ingredientsData.data);
            } catch (error) {
                console.error("Erreur lors de la récupération des données :", error);
            }
        };

        fetchData();
    }, []);

    // Filtrer les pizzas en fonction des ingrédients sélectionnés
    const filtrerPizzas = (ingredientIds) => {
        if (ingredientIds.length === 0) {
            setFilteredPizzas(pizzas); // Afficher toutes les pizzas si aucun ingrédient sélectionné
            return;
        }

        const pizzasFiltrees = pizzas.filter((pizza) =>
            pizza.ingredients_principaux?.some((ingredient) =>
                ingredientIds.includes(ingredient.id)
            )
        );
        setFilteredPizzas(pizzasFiltrees);
    };

    // Ajouter une pizza au panier
    const ajouterAuPanier = (pizza) => {
        setPanier((prevPanier) => [...prevPanier, pizza]);
    };

    // Supprimer une pizza du panier
    const supprimerDuPanier = (pizzaId) => {
        setPanier((prevPanier) => prevPanier.filter((item) => item.id !== pizzaId));
    };

    // Calcul du prix total
    const totalPrice = panier.reduce((total, item) => total + item.prix, 0);

    return (
        <div className="menu-pizza fixed-background">
            {/* Liste des pizzas avec gestion du filtrage et des ingrédients */}
            <div className="pizzas-section mb-6 max-h-[500px]  overflow-y-auto">
                <ListePizzasClient
                    pizzas={filteredPizzas}
                    ajouterAuPanier={ajouterAuPanier}
                    ingredients={ingredients} // Passer les ingrédients nécessaires au filtrage
                    filtrerPizzas={filtrerPizzas} // Méthode pour filtrer les pizzas
                />
            </div>

            {/* Panier */}
            <div className="panier-section">
                <PanierClient
                    panierItems={panier}
                    onRemove={supprimerDuPanier}
                    totalPrice={totalPrice}
                />
            </div>
        </div>
    );
};

export default MenuPizza;