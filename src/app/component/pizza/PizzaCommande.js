import React, { useState } from "react";
import { setCookie, getCookie } from "cookies-next";
import API_ROUTES from "@/app/configAPIRoute";
import ListeIngredients from "../ingredient/ListeIngredients";

const PizzaCommandeModal = ({ pizza, ingredients, onClose }) => {
  const [ingredientsSelectionnes, setIngredientsSelectionnes] = useState([]);
  const [prixTotal, setPrixTotal] = useState(pizza.prix);

  const handleSelectionChange = (selectedIds) => {
    setIngredientsSelectionnes(selectedIds);

    const prixOptionnels = selectedIds.reduce((total, id) => {
      const ingredient = ingredients.find((ing) => ing.id === id);
      return total + (ingredient ? ingredient.prix : 0);
    }, 0);

    setPrixTotal(pizza.prix + prixOptionnels);
  };

  const ajouterPizzaAuPanier = async () => {
    const userToken = getCookie("AuthToken");

    const pizzaCommande = {
      pizzaId: pizza.id,
      quantite: 1,
      ingredientsOptionnelsIds: ingredientsSelectionnes,
      panierId: 1,
    };

    if (userToken) {
      try {
        const response = await fetch(API_ROUTES.PIZZA_COMMANDE, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userToken}`, // Ajouter le token ici
          },
          body: JSON.stringify(pizzaCommande),
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            onClose();
          } else {
            alert("Erreur : " + data.message);
          }
        } else {
          const errorMessage = await response.text();
          console.error("Erreur de serveur : ", errorMessage);
        }
      } catch (error) {
        console.error("Erreur lors de l'ajout au panier :", error);
      }
    } else {
      let panierLocal = JSON.parse(getCookie("panier") || "[]");
      panierLocal.push(pizzaCommande);
      setCookie("panier", JSON.stringify(panierLocal));
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center"
      style={{ backgroundColor: "rgba(255, 87, 34, 0.9)" }}
    >
      <div className="bg-white p-6 rounded-lg shadow-lg w-96 max-h-[80vh] overflow-y-auto">
        <h3 className="text-xl font-bold mb-4">{pizza.nom}</h3>
        <p className="text-gray-600 mb-4">Prix de base : {pizza.prix} €</p>

        <h4 className="font-semibold">Ajoutez des ingrédients optionnels :</h4>
        <div className="max-h-60 overflow-y-auto">
          <ListeIngredients
            ingredients={ingredients}
            onSelectionChange={handleSelectionChange}
          />
        </div>

        <p className="mt-4 font-semibold">
          Prix total : {prixTotal.toFixed(2)} €
        </p>

        <div className="mt-6 flex justify-between">
          <button
            onClick={onClose}
            className="bg-gray-300 text-gray-800 px-4 py-2 rounded"
          >
            Annuler
          </button>
          <button
            onClick={ajouterPizzaAuPanier}
            className="bg-orange-600 text-white px-4 py-2 rounded"
          >
            Ajouter au panier
          </button>
        </div>
      </div>
    </div>
  );
};

export default PizzaCommandeModal;
