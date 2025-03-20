import React, { useState, useEffect } from "react";
import TableCommentaires from "./TableCommentaires";
import API_ROUTES from "@/app/configAPIRoute";

const GestionCommentaires = ({ pizzas }) => {
  const [commentaires, setCommentaires] = useState([]);
  const [pizzaId, setPizzaId] = useState(null); // ID de la pizza sélectionnée
  const [loading, setLoading] = useState(false); // Indicateur de chargement
  const [error, setError] = useState(null); // Message d'erreur

  const supprimerCommentaire = async (id) => {
    try {
      await fetch(`${API_ROUTES.COMMENTAIRE}/${id}`, { method: "DELETE" , credentials: "include"});
      setCommentaires((prev) => prev.filter((commentaire) => commentaire.id !== id));
    } catch (error) {
      console.error("Erreur suppression commentaire", error);
      setError("Impossible de supprimer le commentaire.");
    }
  };

  // Charger les commentaires pour la pizza sélectionnée
  const chargerCommentaires = async (pizzaId) => {
    if (pizzaId) {
      setLoading(true);
      setError(null); // Réinitialiser l'erreur avant de commencer le chargement
      try {
        const response = await fetch(`${API_ROUTES.COMMENTAIRE}/pizza/${pizzaId}`);
        if (response.ok) {
          const data = await response.json();
          setCommentaires(data.data);
        } else {
          setError("Aucun commentaire trouvé pour cette pizza.");
        }
      } catch (error) {
        console.error("Erreur chargement commentaires", error);
        setError("Erreur lors du chargement des commentaires.");
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    chargerCommentaires(pizzaId);
  }, [pizzaId]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-semibold mb-6">Gestion des Commentaires</h1>

      {/* Sélectionner une pizza */}
      <div className="mb-4">
        <label htmlFor="pizza" className="block text-lg mb-2">Choisir une pizza</label>
        <select
          id="pizza"
          value={pizzaId || ""}
          onChange={(e) => setPizzaId(e.target.value)}
          className="p-2 border border-gray-300 rounded w-full text-lg"
        >
          <option value="">Sélectionner une pizza</option>
          {pizzas.map((pizza) => (
            <option key={pizza.id} value={pizza.id}>
              {pizza.nom}
            </option>
          ))}
        </select>
      </div>

      {/* Message d'erreur ou de chargement */}
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {loading && <p className="text-blue-500 mb-4">Chargement des commentaires...</p>}

      {/* Afficher les commentaires de la pizza sélectionnée */}
      {pizzaId && commentaires.length > 0 ? (
        <TableCommentaires
          commentaires={commentaires}
          supprimerCommentaire={supprimerCommentaire}
        />
      ) : (
        <p className="text-gray-500 mt-4">Aucun commentaire disponible pour cette pizza.</p>
      )}
    </div>
  );
};

export default GestionCommentaires;
