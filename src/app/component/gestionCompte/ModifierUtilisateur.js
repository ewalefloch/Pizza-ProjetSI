"use client";

import React, { useState } from "react";
import API_ROUTES from "../../configAPIRoute";

const ModifierUtilisateur = ({ utilisateurInitial, onFermer, onMettreAJourUtilisateur }) => {
    // États pour les champs du formulaire (préremplis avec les données existantes)
    const [nom, setNom] = useState(utilisateurInitial.nom || "");
    const [adressePostale, setAdressePostale] = useState(utilisateurInitial.adressePostale || "");
    const [adresseEmail, setAdresseEmail] = useState(utilisateurInitial.adresseEmail || "");
    const [mdp, setMdp] = useState(""); // Champ mot de passe vide par défaut

    // Soumission du formulaire
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Créer un objet avec les données à envoyer
        const utilisateurModifie = {
            nom,
            adressePostale,
            adresseEmail,
            mdp: mdp ? mdp : undefined // Envoyer uniquement si un mot de passe est fourni
        };

        try {
            // API POST pour mettre à jour l'utilisateur
            const response = await fetch(`${API_ROUTES.USERS}/${utilisateurInitial.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify(utilisateurModifie),
            });

            if (!response.ok) {
                throw new Error("Erreur lors de la mise à jour de l'utilisateur.");
            }

            const utilisateurMisAJour = await response.json();

            // Mettre à jour l'état global (dans le parent)
            onMettreAJourUtilisateur(utilisateurMisAJour);

            // Fermer le formulaire
            onFermer();
        } catch (error) {
            console.error("Erreur lors de la mise à jour :", error);
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="space-y-4 bg-white p-6 rounded-lg shadow-lg w-96"
        >
            <h2 className="text-lg font-bold mb-4">Modifier l'utilisateur</h2>

            <input
                placeholder="Nom complet"
                value={nom}
                onChange={(e) => setNom(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
                required
            />
            <input
                placeholder="Adresse postale"
                value={adressePostale}
                onChange={(e) => setAdressePostale(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
                required
            />
            <input
                placeholder="Adresse email"
                type="email"
                value={adresseEmail}
                onChange={(e) => setAdresseEmail(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
                required
            />
            <input
                type="password"
                placeholder="Nouveau mot de passe (optionnel)"
                value={mdp}
                onChange={(e) => setMdp(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
            />

            <div className="flex justify-between">
                <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded-md"
                >
                    Sauvegarder
                </button>
                <button
                    type="button"
                    onClick={onFermer}
                    className="bg-gray-500 text-white px-4 py-2 rounded-md"
                >
                    Annuler
                </button>
            </div>
        </form>
    );
};

export default ModifierUtilisateur;