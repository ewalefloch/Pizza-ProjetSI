'use client'

import React, { useState } from "react";
import API_ROUTES from "../../configAPIRoute";
import PROXY_ROUTES from "@/app/configProxyRoute";

const SeConnecter = () => {
    const [nom, setNom] = useState("");
    const [mdp, setMdp] = useState("");
    const [message, setMessage] = useState({ type: "", text: "" });

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!nom || !mdp) {
            setMessage({ type: "error", text: "Tous les champs sont obligatoires !" });
            return;
        }

        const loginData = {
            nom,
            mdp,
        };

        try {
            const response = await fetch(PROXY_ROUTES.LOGIN, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify(loginData),
            });

            if (!response.ok) {
                throw new Error("Les identifiants sont incorrects !");
            }

            const utilisateur = await response.json();

            setMessage({ type: "success", text: "Connexion réussie !" });

            setNom("");
            setMdp("");

            setTimeout(() => {
                window.location.reload(); // Recharge la page actuelle
            }, 1000);


            setTimeout(() => setMessage({ type: "", text: "" }), 3000);
        } catch (error) {
            setMessage({
                type: "error",
                text: "Erreur lors de la connexion. Veuillez vérifier vos identifiants.",
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
        type="password"
        placeholder="Mot de passe"
        value={mdp}
        onChange={(e) => setMdp(e.target.value)}
        className="w-full p-2 border border-gray-300"
      />
      <button type="submit" className="w-full bg-orange-600 text-white p-2">
        Se connecter
      </button>
        {message.text && (
            <p
                className={`p-2 rounded ${
                    message.type === "error" ? "bg-red-500 text-white" : "bg-green-500 text-white"
                }`}
            >
                {message.text}
            </p>
        )}

    </form>
  );
};

export default SeConnecter;
