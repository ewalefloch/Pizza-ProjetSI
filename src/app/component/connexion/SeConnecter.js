import React, { useState } from "react";
import { getCookie } from "cookies-next";  // Utilise cookies-next pour accéder aux cookies
import API_ROUTES from "../../configAPIRoute";
import PROXY_ROUTE from "../../configProxyRoute";
import { jwtDecode } from 'jwt-decode';

const SeConnecter = ({fusionPanier}) => {
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
            const response = await fetch(PROXY_ROUTE.LOGIN, {
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
            console.log("Utilisateur connecté:", utilisateur);

            const token = getCookie('AuthToken');
            console.log("Token:", token);
            if (token) {
                const decodedToken = jwtDecode(token);  
                const userId = decodedToken.userId; 
                console.log("ID de l'utilisateur depuis le token:", userId);
                await fusionPanier(userId);
                await gestionPanier(userId);
            }

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

    // Fonction pour gérer la création ou la récupération du panier
    const gestionPanier = async (userId) => {
        try {
            const panierResponse = await fetch(`${API_ROUTES.PANIER}/user/${userId}`, {
                credentials: "include",
            });
    
            if (!panierResponse.ok) {
                throw new Error('Erreur lors de la récupération du panier');
            }
    
            const panierData = await panierResponse.json();
    
            if (panierData.success && panierData.data) {
                console.log("Panier récupéré", panierData.data);
            } else {
                console.error("Erreur avec les données du panier:", panierData.message);
            }
        } catch (error) {
            console.error("Erreur lors de la gestion du panier:", error);
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
                    className={`p-2 rounded ${message.type === "error" ? "bg-red-500 text-white" : "bg-green-500 text-white"}`}
                >
                    {message.text}
                </p>
            )}
        </form>
    );
};

export default SeConnecter;
