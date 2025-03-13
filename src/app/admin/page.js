"use client";
import React, { useEffect, useState } from "react";
import MenuAdmin from "../component/menu/MenuAdmin";
import API_ROUTES from "../configAPIRoute";
import GestionPizzas from "../component/gestionPizza/GestionPizzas";
import GestionIngredients from "../component/gestionIngredient/GestionIngredient";
import GestionCommentaires from "../component/gestionCommentaire/GestionCommentaire";

export default function Home() {
  const [pizzas, setPizzas] = useState([]);
  const [ingredients, setIngredients] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeSection, setActiveSection] = useState("pizzas"); 

  // Charger les pizzas et ingrédients
  useEffect(() => {
    Promise.all([
      fetch(API_ROUTES.PIZZA).then((response) => response.json()),
      fetch(API_ROUTES.INGREDIENT).then((response) => response.json())
    ])
      .then(([pizzasData, ingredientsData]) => {
        setPizzas(pizzasData.data);
        setIngredients(ingredientsData.data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Erreur lors de la récupération des données", error);
        setIsLoading(false);
      });
  }, []);

  const ajouterPizza = (nouvellePizza) => {
    if (!nouvellePizza) {
      console.error("La nouvelle pizza est invalide !");
      return;
    }

    setPizzas((prevPizzas) => Array.isArray(prevPizzas) ? [...prevPizzas, nouvellePizza] : [nouvellePizza]);
  };

  const supprimerPizza = async (id) => {
    try {
      await fetch(`${API_ROUTES.PIZZA}/${id}`, { method: "DELETE" });
      setPizzas((prev) => prev.filter((pizza) => pizza.id !== id));
    } catch (error) {
      console.error("Erreur suppression pizza", error);
    }
  };

  const ajouterIngredient = (nouvelIngredient) => {
    if (!nouvelIngredient) {
      console.error("Le nouvel ingrédient est invalide !");
      return;
    }

    setIngredients((prevIngredients) => Array.isArray(prevIngredients) ? [...prevIngredients, nouvelIngredient] : [nouvelIngredient]);
  };

  const supprimerIngredient = async (id) => {
    try {
      await fetch(`${API_ROUTES.INGREDIENT}/${id}`, { method: "DELETE" });
      setIngredients((prev) => prev.filter((ingredient) => ingredient.id !== id));
    } catch (error) {
      console.error("Erreur suppression ingrédient", error);
    }
  };

  if (isLoading) {
    return (
      <div className="relative min-h-screen bg-white">
        <MenuAdmin setActiveSection={setActiveSection} />
        <div className="flex items-center justify-center h-screen">
          <p>Chargement des données...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-white">
      <MenuAdmin setActiveSection={setActiveSection} />
      <div className="flex items-center justify-center h-screen">
        {activeSection === "pizzas" && (
          <GestionPizzas
            pizzas={pizzas}
            ingredients={ingredients}
            supprimerPizza={supprimerPizza}
            ajouterPizza={ajouterPizza}
          />
        )}
        {activeSection === "ingredients" && (
          <GestionIngredients
            ingredients={ingredients}
            supprimerIngredient={supprimerIngredient}
            ajouterIngredient={ajouterIngredient}
          />
        )}
        {activeSection === "commentaires" && (
          <GestionCommentaires pizzas={pizzas} />
        )}

      </div>
    </div>
  );
}
