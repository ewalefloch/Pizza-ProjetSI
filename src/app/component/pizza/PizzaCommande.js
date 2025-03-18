import React, { useState } from "react";
import { setCookie, getCookie } from "cookies-next";
import API_ROUTES from "@/app/configAPIRoute";
import ListeIngredients from "../ingredient/ListeIngredients";
import { jwtDecode } from "jwt-decode";

const PizzaCommandeModal = ({ pizza, ingredients, onClose }) => {
  const [ingredientsSelectionnes, setIngredientsSelectionnes] = useState([]);
  const [prixTotal, setPrixTotal] = useState(pizza.prix);
  const [quantite, setQuantite] = useState(1);

  const handleSelectionChange = (selectedIds) => {
    setIngredientsSelectionnes(selectedIds);

    const prixOptionnels = selectedIds.reduce((total, id) => {
      const ingredient = ingredients.find((ing) => ing.id === id);
      return total + (ingredient ? ingredient.prix : 0);
    }, 0);

    setPrixTotal(pizza.prix + prixOptionnels);
  };

  const incrementQuantite = () => {
    setQuantite(prev => prev + 1);
  };

  const decrementQuantite = () => {
    setQuantite(prev => (prev > 1 ? prev - 1 : 1));
  };

  const handleQuantiteChange = (e) => {
    const value = parseInt(e.target.value, 10);
    setQuantite(isNaN(value) || value < 1 ? 1 : value);
  };

  const fetchPanier = async () => {
    const userToken = getCookie("AuthToken");
    if (!userToken) return null;

    const decodedToken = jwtDecode(userToken);
    const userId = decodedToken.userId;

    try {
      const panierResponse = await fetch(
        `${API_ROUTES.PANIER}/user/${userId}`,
        {
          credentials: "include",
        }
      );
      const panierData = await panierResponse.json();

      if (panierData.success && panierData.data) {
        return panierData.data.id;
      } else {
        console.error("Panier non trouvé:", panierData.message);
        return null;
      }
    } catch (error) {
      console.error("Erreur lors de la récupération du panier:", error);
      return null;
    }
  };

  const ajouterPizzaAuPanier = async () => {
    const userToken = getCookie("AuthToken");

    if (userToken) {
      try {
        const panierId = await fetchPanier();
        const pizzaCommande = {
          pizzaId: pizza.id,
          quantite: quantite,
          ingredientsOptionnelsIds: ingredientsSelectionnes,
          panierId: panierId,
        };

        const response = await fetch(API_ROUTES.PIZZA_COMMANDE, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userToken}`,
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
      const pizzaCommande = {
        pizzaId: pizza.id,
        quantite: quantite,
        ingredientsOptionnelsIds: ingredientsSelectionnes,
        panierId: 0,
      };
      let panierLocal = JSON.parse(getCookie("panier") || "[]");
      panierLocal.push(pizzaCommande);
      setCookie("panier", JSON.stringify(panierLocal));
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div
        className="absolute inset-0 bg-orange-500 bg-opacity-50"
        style={{ backgroundColor: "rgba(255, 87, 34, 0.9)" }}
        onClick={onClose}
      ></div>
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-4xl w-full relative z-10 max-h-screen overflow-auto">
        <h2 className="text-2xl font-bold mb-4 text-center">{pizza.nom}</h2>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Partie gauche : Pizza en SVG */}
          <div className="w-full md:w-1/2">
            <div className="sticky top-0">
              <div className="mb-4 relative h-80 md:h-96">
                <svg width="100%" height="100%" viewBox="0 0 200 200">
                  <circle
                    cx="100"
                    cy="100"
                    r="80"
                    fill="#F5DEB3"
                    stroke="#D2B48C"
                    strokeWidth="2"
                  />

                  <circle
                    cx="100"
                    cy="100"
                    r="75"
                    fill="#DC143C"
                    fillOpacity="0.7"
                  />

                  <circle
                    cx="100"
                    cy="100"
                    r="73"
                    fill="#FFF8DC"
                    fillOpacity="0.8"
                  />

                  {ingredientsSelectionnes.map((id) => {
                    const ingredient = ingredients.find((ing) => ing.id === id);
                    if (!ingredient) return null;

                    return Array.from({ length: 8 }, (_, i) => {
                      const posX = 30 + Math.random() * 140;
                      const posY = 30 + Math.random() * 140;
                      const rotation = Math.random() * 360;

                      //TODO modifier pour que ca soit dynamique avec la bdd
                      let color = "#000000";
                      if (ingredient.nom.toLowerCase().includes("tomate"))
                        color = "#FF6347";
                      else if (
                        ingredient.nom.toLowerCase().includes("champignon")
                      )
                        color = "#8B4513";
                      else if (
                        ingredient.nom.toLowerCase().includes("fromage") ||
                        ingredient.nom.toLowerCase().includes("mozzarella")
                      )
                        color = "#FFFACD";
                      else if (ingredient.nom.toLowerCase().includes("olive"))
                        color = "#000000";
                      else if (ingredient.nom.toLowerCase().includes("jambon"))
                        color = "#FFC0CB";
                      else if (ingredient.nom.toLowerCase().includes("chorizo"))
                        color = "#D84315";
                      else if (ingredient.nom.toLowerCase().includes("poivron"))
                        color = "#4CAF50";
                      else if (ingredient.nom.toLowerCase().includes("oignon"))
                        color = "#AB47BC";

                      return (
                        <g
                          key={`ing-${id}-${i}`}
                          transform={`translate(${posX}, ${posY}) rotate(${rotation})`}
                        >
                          {ingredient.nom.toLowerCase().includes("olive") ? (
                            <circle cx="0" cy="0" r="5" fill={color} />
                          ) : ingredient.nom
                              .toLowerCase()
                              .includes("champignon") ? (
                            <ellipse cx="0" cy="0" rx="7" ry="5" fill={color} />
                          ) : (
                            <rect
                              x="-5"
                              y="-5"
                              width="10"
                              height="10"
                              fill={color}
                            />
                          )}
                        </g>
                      );
                    });
                  })}
                </svg>
              </div>
              <p className="text-gray-700">Prix de base : {pizza.prix} €</p>
              <p className="text-lg font-bold mt-4">
                Prix total : {(prixTotal * quantite).toFixed(2)} €
              </p>

              <div className="mt-2 text-xs text-gray-500">
                {ingredientsSelectionnes.length > 0 ? (
                  <p>
                    Ingrédients ajoutés:{" "}
                    {ingredientsSelectionnes
                      .map((id) => {
                        const ing = ingredients.find((i) => i.id === id);
                        return ing ? ing.nom : id;
                      })
                      .join(", ")}
                  </p>
                ) : (
                  <p>Aucun ingrédient supplémentaire sélectionné</p>
                )}
              </div>
            </div>
          </div>

          {/* Partie droite : Liste d'ingrédients scrollable */}
          <div className="w-full md:w-1/2">
            <div className="border rounded-lg p-4 h-72 md:h-96 overflow-y-auto">
              <h3 className="font-bold mb-2">Ingrédients optionnels</h3>
              <ListeIngredients
                ingredients={ingredients}
                onSelectionChange={handleSelectionChange}
              />
            </div>
          </div>
        </div>

        <div className="flex justify-between mt-6">
          <button
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition"
            onClick={onClose}
          >
            Annuler
          </button>
          
          {/* Contrôle de quantité amélioré */}
          <div className="flex items-center">
            <button
              className="w-8 h-8 flex items-center justify-center bg-orange-500 text-white rounded-l hover:bg-orange-600 transition"
              onClick={decrementQuantite}
            >
              -
            </button>
            <input
              type="number"
              className="w-12 h-8 px-2 py-1 border text-center focus:outline-none"
              value={quantite}
              onChange={handleQuantiteChange}
              min="1"
            />
            <button
              className="w-8 h-8 flex items-center justify-center bg-orange-500 text-white rounded-r hover:bg-orange-600 transition"
              onClick={incrementQuantite}
            >
              +
            </button>
          </div>
          
          <button
            className="px-4 py-2 bg-orange-600 text-white rounded hover:bg-green-700 transition"
            onClick={ajouterPizzaAuPanier}
          >
            Ajouter au panier
          </button>
        </div>
      </div>
    </div>
  );
};

export default PizzaCommandeModal;