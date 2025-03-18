import React, { useEffect, useState } from "react";
import { getCookie, setCookie } from "cookies-next";
import API_ROUTES from "../../configAPIRoute";

const PanierClient = ({ estConnecte, userId, ingredients, setActiveSection }) => {
  const [panierItems, setPanierItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [availablePizzas, setAvailablePizzas] = useState([]);

  const getPanierFromCookies = () => {
    const panierCookie = getCookie("panier");
    return panierCookie ? JSON.parse(panierCookie) : [];
  };

  const fetchPizzas = async () => {
    try {
      const response = await fetch(`${API_ROUTES.PIZZA}`, {
        credentials: "include",
      });
      
      // Vérifier si la réponse est au format JSON
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        console.error("La réponse n'est pas au format JSON");
        return [];
      }
      
      const data = await response.json();
      if (data.success) {
        return data.data;
      }
      return [];
    } catch (error) {
      console.error("Erreur lors de la récupération des pizzas :", error);
      return [];
    }
  };

  const fetchPanier = async () => {
    setIsLoading(true);
    try {
      if (!estConnecte || !userId) {
        const cookiePanier = getPanierFromCookies();
        
        let pizzasFromDB = [];
        try {
          pizzasFromDB = await fetchPizzas();
          setAvailablePizzas(pizzasFromDB);
        } catch (error) {
          console.error("Impossible de récupérer les pizzas:", error);
        }
        
        const cookiePanierTransformed = cookiePanier.map(item => {
          const matchingPizza = pizzasFromDB.find(p => p.id === item.pizzaId);
          
          return {
            id: `cookie-${item.pizzaId}-${Date.now()}`,
            pizzaId: item.pizzaId,
            quantite: item.quantite || 1,
            ingredientsOptionnelsIds: item.ingredientsOptionnelsIds || [],
            pizza: matchingPizza || { nom: "Pizza inconnue", prix: 0, ingredients: [] }
          };
        });
        
        setPanierItems(cookiePanierTransformed);
        setTotalPrice(calculerTotal(cookiePanierTransformed));
        setIsLoading(false);
        return;
      }
      
      // Si l'utilisateur est connecté, procéder normalement
      try {
        const panierResponse = await fetch(
          `${API_ROUTES.PANIER}/user/${userId}`,
          {
            credentials: "include",
          }
        );
        
        // Vérifier si la réponse est au format JSON
        const contentType = panierResponse.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          console.error("La réponse du panier n'est pas au format JSON");
          setPanierItems([]);
          setTotalPrice(0);
          setIsLoading(false);
          return;
        }
        
        const panierData = await panierResponse.json();

        if (panierData.success) {
          const pizzasDetaillees = await Promise.all(
            panierData.data.pizzaCommandeIds.map(async (pizzaCommandeId) => {
              try {
                const response = await fetch(
                  `${API_ROUTES.PIZZA_COMMANDE}/${pizzaCommandeId}`,
                  { credentials: "include" }
                );
                
                if (!response.ok) {
                  return null;
                }
                
                const pizzaCommandeData = await response.json();
                if (!pizzaCommandeData.success) return null;

                // Récupérer les infos complètes de la pizza
                const pizzaResponse = await fetch(
                  `${API_ROUTES.PIZZA}/${pizzaCommandeData.data.pizzaId}`,
                  { credentials: "include" }
                );
                
                if (!pizzaResponse.ok) {
                  return null;
                }
                
                const pizzaData = await pizzaResponse.json();
                if (!pizzaData.success) return null;

                return {
                  ...pizzaCommandeData.data,
                  pizza: pizzaData.data,
                };
              } catch (error) {
                console.error("Erreur lors de la récupération de la pizza:", error);
                return null;
              }
            })
          );

          const validPizzas = pizzasDetaillees.filter(
            (pizza) => pizza !== null
          );
          setPanierItems(validPizzas);
          setTotalPrice(calculerTotal(validPizzas));
        }
      } catch (error) {
        console.error("Erreur lors de la récupération du panier connecté:", error);
        setPanierItems([]);
        setTotalPrice(0);
      }
    } catch (error) {
      console.error("Erreur générale lors de la récupération du panier:", error);
      setPanierItems([]);
      setTotalPrice(0);
    } finally {
      setIsLoading(false);
    }
  };

  const calculerTotal = (items) => {
    return items.reduce((total, item) => {
      const prixPizza = item.pizza?.prix || 0;
      const prixIngredients =
        item.ingredientsOptionnelsIds?.reduce((sum, id) => {
          const ingredient = getIngredientById(id);
          return sum + (ingredient ? ingredient.prix : 0);
        }, 0) || 0;
      return total + (prixPizza + prixIngredients) * item.quantite;
    }, 0);
  };
  
  // Fonction pour récupérer un ingrédient par son ID
  const getIngredientById = (id) => {
    // D'abord chercher dans les ingrédients globaux
    if (ingredients && ingredients.length > 0) {
      const foundIngredient = ingredients.find(ing => ing.id === id);
      if (foundIngredient) return foundIngredient;
    }
    
    // Sinon chercher dans les ingrédients des pizzas
    for (const item of panierItems) {
      if (item.pizza?.ingredients) {
        const foundIngredient = item.pizza.ingredients.find(ing => ing.id === id);
        if (foundIngredient) return foundIngredient;
      }
    }
    
    return null;
  };

  useEffect(() => {
    fetchPanier();
  }, [estConnecte, userId]);

  const handleValiderPanier = async () => {
    if (panierItems.length === 0) return;
  
    try {
      const response = await fetch(`${API_ROUTES.PANIER}/valider/${userId}`, {
        method: "POST",
        credentials: "include",
      });
  
      const data = await response.json();
      
      if (response.ok && data.success) {
        alert("Votre panier a été validé avec succès !");
        await fetchPanier();
      } else {
        alert("Erreur lors de la validation du panier. Veuillez réessayer.");
      }
    } catch (error) {
      console.error("Erreur lors de la validation du panier :", error);
      alert("Une erreur s'est produite. Vérifiez votre connexion et réessayez.");
    }
  };
  
  const updateQuantite = async (itemId, newQuantity) => {
    if (newQuantity < 1) {
      newQuantity = 1;
    }
    
    try {
      const newItems = panierItems.map((item) => {
        if (item.id === itemId) {
          return { ...item, quantite: newQuantity };
        }
        return item;
      });
      
      setPanierItems(newItems);
      setTotalPrice(calculerTotal(newItems));
  
      if (estConnecte) {
        const itemToUpdate = panierItems.find(item => item.id === itemId);
        
        if (itemToUpdate) {
          const pizzaCommandeDto = {
            id: itemToUpdate.id,
            pizzaId: itemToUpdate.pizzaId, 
            panierId: itemToUpdate.panierId, 
            quantite: newQuantity,  
            ingredientsOptionnelsIds: itemToUpdate.ingredientsOptionnelsIds 
          };
  
          await fetch(`${API_ROUTES.PIZZA_COMMANDE}/${itemId}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(pizzaCommandeDto),
            credentials: "include",
          });
        }
      } else {
        const cookiePanier = getPanierFromCookies();
        const pizzaId = parseInt(itemId.split('-')[1]);
        const itemToUpdate = cookiePanier.find(item => item.pizzaId === pizzaId);
        
        if (itemToUpdate) {
          itemToUpdate.quantite = newQuantity;
          setCookie("panier", JSON.stringify(cookiePanier));
        }
      }
  
    } catch (error) {
      console.error("Erreur lors de la mise à jour de la quantité :", error);
      fetchPanier(); 
    }
  };
  

  const supprimerDuPanier = async (itemId) => {
    try {
      if (estConnecte && !itemId.startsWith('cookie-')) {
        await fetch(`${API_ROUTES.PIZZA_COMMANDE}/${itemId}`, {
          method: "DELETE",
          credentials: "include",
        });
      } else {
        const cookiePanier = getPanierFromCookies();
        
        if (itemId.startsWith('cookie-')) {
          const pizzaId = parseInt(itemId.split('-')[1]);
          const newItems = cookiePanier.filter(item => item.pizzaId !== pizzaId);
          setCookie("panier", JSON.stringify(newItems));
        }
      }
      
      setPanierItems((prev) => prev.filter((item) => item.id !== itemId));
      setTotalPrice((prev) => {
        const removedItem = panierItems.find((item) => item.id === itemId);
        if (!removedItem) return prev;
        
        const itemPrice = removedItem?.pizza?.prix || 0;
        const itemIngredientsPrice =
          removedItem?.ingredientsOptionnelsIds?.reduce((sum, id) => {
            const ingredient = getIngredientById(id);
            return sum + (ingredient ? ingredient.prix : 0);
          }, 0) || 0;
        return prev - (itemPrice + itemIngredientsPrice) * removedItem.quantite;
      });
    } catch (error) {
      console.error("Erreur lors de la suppression de la pizza :", error);
    }
  };

  const getIngredientNames = (item) => {
    if (!item.ingredientsOptionnelsIds || item.ingredientsOptionnelsIds.length === 0) return "";

    return item.ingredientsOptionnelsIds
      .map((id) => {
        // Essayer de trouver l'ingrédient dans les ingrédients globaux d'abord
        let ingredient = null;
        
        if (ingredients && ingredients.length > 0) {
          ingredient = ingredients.find(ing => ing.id === id);
        }
        
        // Si pas trouvé, essayer dans les ingrédients de la pizza
        if (!ingredient && item.pizza?.ingredients) {
          ingredient = item.pizza.ingredients.find(ing => ing.id === id);
        }
        
        return ingredient ? ingredient.nom : null;
      })
      .filter((name) => name !== null)
      .join(", ");
  };

  if (isLoading) {
    return (
      <div className="py-6 px-4">
        <div className="h-12 bg-gray-200 rounded animate-pulse mb-4"></div>
        <div className="h-20 bg-gray-200 rounded animate-pulse mb-4"></div>
        <div className="h-20 bg-gray-200 rounded animate-pulse mb-4"></div>
        <div className="h-12 bg-gray-200 rounded animate-pulse"></div>
      </div>
    );
  }

  return (
    <div className="py-6 px-4 bg-gradient-to-br from-orange-50 to-amber-50 rounded-lg shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-orange-800">Votre Panier</h2>
        <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full font-medium">
          {panierItems.length}{" "}
          {panierItems.length === 1 ? "article" : "articles"}
        </span>
      </div>

      {panierItems.length > 0 ? (
        <div className="space-y-4">
          {panierItems.map((item, index) => (
            <div
              key={item.id || index}
              className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm border-l-4 border-orange-500 hover:shadow-md transition-shadow"
            >
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-lg font-semibold text-gray-800">
                    {item.pizza?.nom || "Pizza inconnue"}
                  </span>
                  <span className="font-bold text-orange-600">
                    {item.pizza?.prix ? (item.pizza.prix * item.quantite).toFixed(2) : "0.00"}€
                  </span>
                </div>
                <div className="flex items-center mt-2">
                  <span className="text-sm text-gray-600 mr-2">Quantité:</span>
                  <div className="flex items-center">
                    <button
                      className="w-8 h-8 flex items-center justify-center bg-orange-500 text-white rounded-l hover:bg-orange-600 transition"
                      onClick={() => updateQuantite(item.id, Math.max(1, item.quantite - 1))}
                    >
                      -
                    </button>
                    <input
                      type="number"
                      className="w-16 h-8 px-2 py-1 border text-center focus:outline-none"
                      value={item.quantite}
                      onChange={(e) => {
                        const newQuantity = parseInt(e.target.value) || 1;
                        updateQuantite(item.id, newQuantity);
                      }}
                      min="1"
                    />
                    <button
                      className="w-8 h-8 flex items-center justify-center bg-orange-500 text-white rounded-r hover:bg-orange-600 transition"
                      onClick={() => updateQuantite(item.id, item.quantite + 1)}
                    >
                      +
                    </button>
                  </div>
                </div>
                {item.ingredientsOptionnelsIds?.length > 0 && (
                  <div className="mt-1">
                    <p className="text-sm font-medium text-gray-600">
                      Ingrédients supplémentaires:
                    </p>
                    <p className="text-sm text-gray-500 italic">
                      {getIngredientNames(item) ||
                        "Ingrédients non disponibles"}
                    </p>
                  </div>
                )}
              </div>

              <button
                onClick={() => supprimerDuPanier(item.id)}
                className="ml-4 p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full transition-colors"
                aria-label="Supprimer du panier"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </button>
            </div>
          ))}

          <div className="mt-6 bg-white p-4 rounded-lg shadow border-t-2 border-orange-200">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-600">Sous-total</span>
              <span className="font-medium">{totalPrice.toFixed(2)}€</span>
            </div>
            <div className="flex justify-between items-center mb-4">
              <span className="text-gray-600">Frais de livraison</span>
              <span className="font-medium">Gratuit</span>
            </div>
            <div className="border-t border-gray-200 my-2"></div>
            <div className="flex justify-between items-center pt-2">
              <span className="text-lg font-bold text-gray-800">Total</span>
              <span className="text-xl font-bold text-orange-600">
                {totalPrice.toFixed(2)}€
              </span>
            </div>
          </div>

          <div className="mt-6">
            {estConnecte ? (
              <button className="w-full bg-orange-600 text-white py-3 px-4 rounded-lg font-bold text-lg hover:bg-orange-500 transition transform hover:-translate-y-1 shadow-md hover:shadow-lg"
                onClick={handleValiderPanier}>
                Valider ma commande
              </button>
            ) : (
              <div className="bg-white p-6 rounded-lg shadow text-center border-l-4 border-blue-500">
                <p className="text-gray-700 mb-3">
                  Pour finaliser votre commande
                </p>
                <p className="font-bold text-gray-900 mb-4">
                  Connectez-vous à votre compte
                </p>
                </div>
            )}
          </div>
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <div className="mb-4 text-orange-300">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16 mx-auto"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
          </div>
          <p className="text-lg font-medium text-gray-600 mb-2">
            Votre panier est vide
          </p>
          <p className="text-gray-500 mb-6">
            Découvrez nos délicieuses pizzas pour commencer votre commande
          </p>
          <button
            className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-500 transition transform hover:-translate-y-1 shadow-md"
            onClick={() => setActiveSection("pizzas")}
          >
            Voir le Menu
          </button>
        </div>
      )}
    </div>
  );
};

export default PanierClient;