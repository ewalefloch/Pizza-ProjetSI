"use client";
import React, { useEffect, useState } from "react";
import MenuClient from "./component/menu/MenuClient";
import API_ROUTES from "./configAPIRoute";
import imagePizza from "../../public/image/pizza.jpg";
import PizzaCommandeModal from "./component/pizza/PizzaCommande";

export default function Home() {
  const [pizza, setPizza] = useState(null); // Pour la première pizza
  const [ingredients, setIngredients] = useState([]); // Liste des ingrédients
  const [isLoading, setIsLoading] = useState(true); // Chargement des données
  const [showModal, setShowModal] = useState(false); // Pour contrôler l'affichage de la modal

  // Charger la pizza et les ingrédients
  useEffect(() => {
    Promise.all([
      fetch(API_ROUTES.PIZZA, { credentials: "include" }).then((response) => response.json()),
      fetch(API_ROUTES.INGREDIENT, { credentials: "include" }).then((response) => response.json())
    ])
      .then(([pizzasData, ingredientsData]) => {
        setPizza(pizzasData.data[0]); // Prendre la première pizza
        setIngredients(ingredientsData.data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Erreur lors de la récupération des données", error);
        setIsLoading(false);
      });
  }, []);

  const handleShowModal = () => {
    setShowModal(true); // Afficher la modal
  };

  const handleCloseModal = () => {
    setShowModal(false); // Fermer la modal
  };

  if (isLoading) {
    return (
      <div className="relative min-h-screen bg-white">
        <MenuClient />
        <div className="flex items-center justify-center h-screen">
          <p>Chargement des données...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div
        className="relative min-h-screen bg-no-repeat bg-cover bg-center"
        style={{ backgroundImage: `url(${imagePizza.src})` }}
      >
        <MenuClient />
        <div className="flex items-center justify-center h-screen">
          <h1 className="text-4xl md:text-6xl font-bold text-white text-center">
            Bienvenue chez Papa Louis!
          </h1>
        </div>
      </div>

      {pizza && (
        <div className="flex justify-center mt-4">
          <button
            onClick={handleShowModal}
            className="bg-orange-600 text-white px-6 py-3 rounded"
          >
            Commander cette pizza
          </button>
        </div>
      )}

      {/* Affichage de la modal */}
      {showModal && pizza && ingredients.length > 0 && (
        <PizzaCommandeModal
          pizza={pizza}
          ingredients={ingredients}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}
