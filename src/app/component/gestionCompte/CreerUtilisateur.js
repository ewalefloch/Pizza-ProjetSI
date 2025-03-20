"use client";

import React, { useState } from "react";
import API_ROUTES from "../../configAPIRoute";

const CreerUtilisateur = ({ onFermer, onAjouterUtilisateur }) => {
    const [nom, setNom] = useState("");
    const [adresseEmail, setAdresseEmail] = useState("");
    const [adressePostale, setAdressePostale] = useState("");
    const [mdp, setMdp] = useState("");
    const [estClient, setEstClient] = useState(true); // Par défaut, considéré comme client
    const [message, setMessage] = useState({ type: "", text: "" });

    // Validation et soumission du formulaire
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!nom || !adresseEmail || !adressePostale || !mdp) {
            setMessage({ type: "error", text: "Tous les champs sont obligatoires !" });
            return;
        }

        const nouvelUtilisateur = {
            nom,
            adresseEmail,
            adressePostale,
            mdp,
            estClient,
        };

        try {
            // API POST pour ajouter un utilisateur
            const response = await fetch(API_ROUTES.REGISTER, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify(nouvelUtilisateur),
            });

            if (!response.ok) {
                throw new Error("Erreur lors de l'ajout de l'utilisateur.");
            }

            const utilisateurCree = await response.json();

            // Ajout de l'utilisateur dans la liste (via la fonction de callback parent)
            onAjouterUtilisateur(utilisateurCree);

            // Succès
            setMessage({
                type: "success",
                text: "Utilisateur ajouté avec succès !",
            });

            // Réinitialiser le formulaire
            setNom("");
            setAdresseEmail("");
            setAdressePostale("");
            setMdp("");
            setEstClient(true);

            // Réinitialiser le message après 3 secondes
            setTimeout(() => setMessage({ type: "", text: "" }), 3000);

            // Fermer le formulaire après quelques instants
            setTimeout(onFermer, 1000);
        } catch (error) {
            console.error("Erreur :", error);
            setMessage({
                type: "error",
                text: "Une erreur est survenue. Veuillez réessayer.",
            });
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="space-y-4 bg-white p-6 rounded-lg shadow-lg w-96"
        >
            <h2 className="text-lg font-bold mb-4">Ajouter un utilisateur</h2>

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
                pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]"
                onChange={(e) => setAdresseEmail(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
                required
            />
            <input
                type="password"
                placeholder="Mot de passe"
                value={mdp}
                onChange={(e) => setMdp(e.target.value)}
                className="w-full p-2 border border-gray-300"
            />
            <div className="flex items-center">
                <input
                    type="checkbox"
                    checked={estClient}
                    onChange={(e) => setEstClient(e.target.checked)}
                    className="mr-2"
                />
                <label>Est un client</label>
            </div>

            {/* Gestion des messages d'erreur ou de succès */}
            {message.text && (
                <p
                    className={`p-2 rounded text-center ${
                        message.type === "error" ? "bg-red-500 text-white" : "bg-green-500 text-white"
                    }`}
                >
                    {message.text}
                </p>
            )}

            <button
                type="submit"
                className="w-full bg-orange-600 text-white p-2 rounded"
            >
                Ajouter
            </button>
            <button
                type="button"
                onClick={onFermer}
                className="w-full bg-gray-400 text-white p-2 rounded mt-2"
            >
                Annuler
            </button>
        </form>
    );
};

export default CreerUtilisateur;