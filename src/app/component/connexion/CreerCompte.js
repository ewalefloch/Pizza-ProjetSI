'use client'

import React, { useState } from "react";
import API_ROUTES from "@/app/configAPIRoute";

const CreerCompte = () => {
  const [nom, setNom] = useState("");
    const [adresseEmail, setAdresseEmail] = useState("");
    const [adressePostal, setAdressePostal] = useState("");
  const [mdp, setMdp] = useState("");
    const [message, setMessage] = useState({ type: "", text: "" });



    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!nom || !mdp || !adresseEmail) {
            setMessage({ type: "error", text: "Tous les champs sont obligatoires !" });
            return;
        }

        const signupData = {
            nom,
            mdp,
            adresseEmail,
            adressePostal,
            estClient: true
        };

        try {
            const response = await fetch(API_ROUTES.REGISTER, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(signupData),
            });

            if (!response.ok) {
                throw new Error("Une erreur s'est produite lors de la création de votre compte.");
            }

            setMessage({ type: "success", text: "Compte créé avec succès !" });

            // Réinitialisation des champs après le succès
            setNom("");
            setAdresseEmail("");
            setAdressePostal("");
            setMdp("");

            setTimeout(() => setMessage({ type: "", text: "" }), 3000); // Réinitialise le message après 3 secondes
        } catch (error) {
            setMessage({
                type: "error",
                text: "Erreur lors de la création de compte. Veuillez réessayer.",
            });
            console.error("Erreur:", error);
        }
    };


    return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        placeholder="Pseudo"
        value={nom}
        onChange={(e) => setNom(e.target.value)}
        className="w-full p-2 border border-gray-300"
      />
        <input
            placeholder="Adresse postal"
            value={adressePostal}
            onChange={(e) => setAdressePostal(e.target.value)}
            className="w-full p-2 border border-gray-300"
        />
        <input
            placeholder="Adresse e-mail"
            value={adresseEmail}
            onChange={(e) => setAdresseEmail(e.target.value)}
            className="w-full p-2 border border-gray-300"
        />
      <input
        type="password"
        placeholder="Mot de passe"
        value={mdp}
        onChange={(e) => setMdp(e.target.value)}
        className="w-full p-2 border border-gray-300"
      />
        {message.text && (
            <p
                className={`p-2 rounded ${
                    message.type === "error" ? "bg-red-500 text-white" : "bg-green-500 text-white"
                }`}
            >
                {message.text}
            </p>
        )}

        <button type="submit" className="w-full bg-orange-600 text-white p-2">
        Créer un compte
      </button>
    </form>
  );
};

export default CreerCompte;
