import React, { useState, useEffect } from "react"; // Assurez-vous de bien inclure `useEffect`
import TableauUtilisateurs from "./TableauUtilisateurs"; // Liste des utilisateurs
import CreerUtilisateur from "./CreerUtilisateur"; // Formulaire pour créer un utilisateur
import ModifierUtilisateur from "./ModifierUtilisateur"; // Formulaire pour modifier un utilisateur
import API_ROUTES from "../../configAPIRoute"; // Routes API

const GestionUtilisateurs = () => {
    const [utilisateurs, setUtilisateurs] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showCreerUtilisateur, setShowCreerUtilisateur] = useState(false);
    const [showModifierUtilisateur, setShowModifierUtilisateur] = useState(false);
    const [utilisateurAmodifier, setUtilisateurAmodifier] = useState(null);

    // Charger les utilisateurs depuis l'API
    useEffect(() => {
        const fetchUtilisateurs = async () => {
            try {
                const response = await fetch(API_ROUTES.USERS, {
                    method: "GET",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                });

                if (!response.ok) {
                    throw new Error(`Erreur HTTP ${response.status}: ${response.statusText}`);
                }

                const data = await response.json();
                setUtilisateurs(data);
                setIsLoading(false);
            } catch (error) {
                console.error("Erreur lors de la récupération des utilisateurs :", error);
                setIsLoading(false);
            }
        };

        fetchUtilisateurs();
    }, []);

    // Ajouter un nouvel utilisateur
    const ajouterUtilisateur = (nouvelUtilisateur) => {
        setUtilisateurs((prevUtilisateurs) => [...prevUtilisateurs, nouvelUtilisateur]);
    };

    // Mettre à jour un utilisateur
    const mettreAJourUtilisateur = (utilisateurMiseAJour) => {
        setUtilisateurs((prev) =>
            prev.map((utilisateur) =>
                utilisateur.id === utilisateurMiseAJour.id ? utilisateurMiseAJour : utilisateur
            )
        );
    };

    // Gérer l'ouverture du formulaire de modification
    const modifierUtilisateur = (utilisateur) => {
        setUtilisateurAmodifier(utilisateur);
        setShowModifierUtilisateur(true);
    };

    // Supprimer un utilisateur
    const supprimerUtilisateur = async (id) => {
        try {
            await fetch(`${API_ROUTES.USERS}/${id}`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
            });

            setUtilisateurs((prev) => prev.filter((utilisateur) => utilisateur.id !== id));
        } catch (error) {
            console.error("Erreur lors de la suppression de l'utilisateur :", error);
        }
    };

    if (isLoading) {
        return <p>Chargement des utilisateurs...</p>;
    }

    return (
        <div className="flex flex-col items-center">
            <h1 className="text-2xl font-bold pt-4 mb-4">Gestion des comptes utilisateurs</h1>
            <button
                className="bg-orange-500 text-white px-4 py-2 rounded-md mb-4"
                onClick={() => setShowCreerUtilisateur(true)}
            >
                Ajouter un utilisateur
            </button>
            {showCreerUtilisateur && (
                <CreerUtilisateur
                    onFermer={() => setShowCreerUtilisateur(false)}
                    onAjouterUtilisateur={ajouterUtilisateur}
                />
            )}
            {showModifierUtilisateur && utilisateurAmodifier && (
                <ModifierUtilisateur
                    utilisateurInitial={utilisateurAmodifier}
                    onFermer={() => setShowModifierUtilisateur(false)}
                    onMettreAJourUtilisateur={mettreAJourUtilisateur}
                />
            )}
            <TableauUtilisateurs
                utilisateurs={utilisateurs}
                supprimerUtilisateur={supprimerUtilisateur}
                modifierUtilisateur={modifierUtilisateur}
            />
        </div>
    );
};

export default GestionUtilisateurs;