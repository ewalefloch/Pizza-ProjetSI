"use client";
import React, { useEffect, useState } from "react";
import API_ROUTES from "@/app/configAPIRoute";

const Commande = ({ commande }) => {
  const [pizzas, setPizzas] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPizzaDetails = async () => {
      setIsLoading(true);
      try {
        // Vérifier si la commande a des pizzas
        if (commande.pizzaCommandeIds && commande.pizzaCommandeIds.length > 0) {
          // Créer un tableau de promesses pour toutes les requêtes de pizza
          const pizzaPromises = commande.pizzaCommandeIds.map(async (pizzaId) => {
            const response = await fetch(`${API_ROUTES.PIZZA}/${pizzaId}`, {credentials: "include"});
            const result = await response.json();
            return result.success ? result.data : null;
          });

          // Attendre que toutes les promesses soient résolues
          const pizzaResults = await Promise.all(pizzaPromises);
          setPizzas(pizzaResults.filter(pizza => pizza !== null));
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des détails de pizza:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPizzaDetails();
  }, [commande.pizzaCommandeIds]);

  return (
    <div className="p-4 bg-gray-100 rounded shadow">      
      {isLoading ? (
        <p className="text-sm italic">Chargement des détails...</p>
      ) : pizzas && pizzas.length > 0 ? (
        <ul className="space-y-2">
          {pizzas.map((pizza) => (
            <li key={pizza.id} className="p-3 bg-white rounded border shadow-sm">
              <div className="flex items-center">
                <span className="text-xl mr-2">🍕</span>
                <div>
                  <p className="font-semibold">{pizza.nom}</p>
                  <p className="text-sm text-gray-700">{pizza.description}</p>
                  <div className="flex justify-between mt-1">
                    <p className="text-sm font-bold">
                      {pizza.prix ? `${pizza.prix}€` : "Prix non disponible"}
                    </p>
                  </div>
                  {pizza.ingredients && (
                    <p className="text-xs text-gray-600 mt-1">
                      <strong>Ingrédients:</strong> {pizza.ingredients.join(", ")}
                    </p>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm italic">Aucune pizza trouvée</p>
      )}
    </div>
  );
};

export default Commande;