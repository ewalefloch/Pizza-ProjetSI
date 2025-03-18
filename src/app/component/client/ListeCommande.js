"use client";
import API_ROUTES from "@/app/configAPIRoute";
import React, { useEffect, useState } from "react";
import Commande from "./Commande";

const ListeCommande = ({ userId, onClose }) => {
  const [commandes, setCommandes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCommandes = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${API_ROUTES.COMMANDE}/user/${userId}`);
        const result = await response.json();
        
        if (result.success) {
          setCommandes(result.data);
        } else {
          setError("Erreur lors du chargement des commandes");
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des commandes :", error);
        setError("Une erreur est survenue lors de la connexion au serveur");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCommandes();
  }, [userId]);

  // Regrouper les commandes par numéroCommande
  const commandesGroupées = commandes.reduce((acc, commande) => {
    if (!acc[commande.numeroCommande]) {
      acc[commande.numeroCommande] = [];
    }
    acc[commande.numeroCommande].push(commande);
    return acc;
  }, {});

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50"
      style={{ backgroundColor: "rgba(255, 87, 34, 0.9)" }}
    >
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl max-h-screen overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4">Mes Commandes</h2>

        {isLoading ? (
          <div className="flex justify-center">
            <p>Chargement des commandes...</p>
          </div>
        ) : error ? (
          <div className="p-4 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        ) : Object.keys(commandesGroupées).length > 0 ? (
          <ul className="space-y-4">
            {Object.entries(commandesGroupées).map(([numeroCommande, commandes]) => (
              <li key={numeroCommande} className="p-4 border rounded shadow-sm">
                <h3 className="font-bold text-lg text-orange-600">Commande N° {numeroCommande}</h3>
                <p className="text-sm text-gray-600">Date: {new Date(commandes[0].date).toLocaleDateString()}</p>
                <div className="mt-2 space-y-2">
                    <h4 className="font-bold mt-3 mb-2">Pizzas commandées :</h4>
                  {commandes.map((commande) => (
                    <Commande key={commande.id} commande={commande} />
                  ))}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>Aucune commande trouvée.</p>
        )}

        <div className="flex justify-end mt-4">
          <button
            onClick={onClose}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition-colors"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};

export default ListeCommande;