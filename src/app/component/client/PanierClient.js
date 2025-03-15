import React, { useEffect, useState } from "react";
import API_ROUTES from "../../configAPIRoute";

const PanierClient = ({ estConnecte, userId, ingredients }) => {
  const [panierItems, setPanierItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);

  // Fonction pour récupérer le panier depuis les cookies
  const getPanierFromCookies = () => {
    const panierCookie = document.cookie
      .split('; ')
      .find(row => row.startsWith('panier='));
    
    if (panierCookie) {
      try {
        const panierData = JSON.parse(decodeURIComponent(panierCookie.split('=')[1]));
        return panierData;
      } catch (error) {
        console.error("Erreur lors de la lecture du cookie panier:", error);
        return [];
      }
    }
    return [];
  };

  // Mettre à jour le prix total
  const calculerTotal = (items) => {
    return items.reduce((total, item) => total + item.prix, 0);
  };

  useEffect(() => {
    const fetchPanier = async () => {
      if (estConnecte && userId) {
        try {
          const panierResponse = await fetch(`${API_ROUTES.PANIER}/user/${userId}`, {
            credentials: "include",
          });
          const panierData = await panierResponse.json();
          setPanierItems(panierData.items || []);
          setTotalPrice(calculerTotal(panierData.items || []));
        } catch (error) {
          console.error("Erreur lors de la récupération du panier :", error);
        }
      } else {
        // Récupérer le panier depuis les cookies si non connecté
        const cookiePanier = getPanierFromCookies();
        setPanierItems(cookiePanier);
        setTotalPrice(calculerTotal(cookiePanier));
      }
    };
    fetchPanier();
  }, [estConnecte, userId]);

  const supprimerDuPanier = async (itemId) => {
    if (estConnecte && userId) {
      try {
        await fetch(`${API_ROUTES.PANIER}/item/${itemId}`, {
          method: 'DELETE',
          credentials: 'include',
        });
        // Mettre à jour l'état local après suppression
        const newItems = panierItems.filter(item => item.id !== itemId);
        setPanierItems(newItems);
        setTotalPrice(calculerTotal(newItems));
      } catch (error) {
        console.error("Erreur lors de la suppression de l'article:", error);
      }
    } else {
      // Supprimer du cookie si non connecté
      const newItems = panierItems.filter(item => item.id !== itemId);
      setPanierItems(newItems);
      setTotalPrice(calculerTotal(newItems));
      
      // Mettre à jour le cookie
      const cookieExpiry = new Date();
      cookieExpiry.setDate(cookieExpiry.getDate() + 7); // Cookie valide pour 7 jours
      document.cookie = `panier=${encodeURIComponent(JSON.stringify(newItems))}; expires=${cookieExpiry.toUTCString()}; path=/`;
    }
  };

  return (
    <div className="py-6 px-4">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Votre Panier</h2>
      {/* Liste des articles */}
      {panierItems.length > 0 ? (
        <div className="space-y-3">
          {panierItems.map((item) => (
            <div key={item.id} className="flex items-center justify-between p-3 bg-white rounded shadow-sm">
              <div className="flex items-center space-x-4">
                <img src={item.photo} alt={item.nom} className="w-12 h-12 object-cover rounded" />
                <div>
                  <span className="text-gray-700 font-semibold block">{item.nom}</span>
                  <span className="text-green-600">€{item.prix.toFixed(2)}</span>
                </div>
              </div>
              <button 
                onClick={() => supprimerDuPanier(item.id)} 
                className="text-red-500 hover:text-red-700"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 bg-white p-4 rounded shadow-sm">Votre panier est vide.</p>
      )}
      
      {/* Prix total */}
      {panierItems.length > 0 && (
        <div className="mt-4 bg-white p-4 rounded shadow-sm">
          <h3 className="text-lg font-bold text-gray-800 flex justify-between">
            <span>Total:</span> 
            <span className="text-green-600">€{totalPrice.toFixed(2)}</span>
          </h3>
        </div>
      )}
      
      {/* Bouton de commande */}
      {panierItems.length > 0 && (
        <div className="mt-4">
          {estConnecte ? (
            <button className="w-full bg-orange-600 text-white py-3 px-4 rounded hover:bg-orange-500 transition">
              Commander
            </button>
          ) : (
            <div className="text-center bg-white p-4 rounded shadow-sm">
              <p className="text-red-500 mb-2">Connectez-vous pour commander</p>
              <a href="/login" className="text-blue-600 hover:underline">Se connecter</a>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PanierClient;