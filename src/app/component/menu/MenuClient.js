'use client';
import React, { useEffect, useState } from "react";
import Button from "../global/Bouton";
import Connexion from "../connexion/Connexion";
import MenuPizza from "./MenuPizza"; // Importer MenuPizza
import PROXY_ROUTES from "@/app/configProxyRoute";

const getCookie = (cookieName) => {
  const cookies = document.cookie.split("; ");
  const cookie = cookies.find((c) => c.startsWith(`${cookieName}=`));
  return cookie ? cookie.split("=")[1] : null;
};

const MenuClient = () => {
  const [showModal, setShowModal] = useState(false); // Contrôle de la fenêtre de connexion
  const [showMenuPizza, setShowMenuPizza] = useState(false); // Contrôle pour afficher MenuPizza
  const [estConnecte, setEstConnecte] = useState(false); // Vérifie si l'utilisateur est connecté

  // Vérifie les cookies pour déterminer si l'utilisateur est connecté
  useEffect(() => {
    const verifierCookie = () => {
      const token = getCookie("AuthToken");
      setEstConnecte(!!token); // Si le token existe, estConnecte est vrai
    };

    verifierCookie();
  }, []);

  const handleDeconnexion = async () => {
    try {
      const response = await fetch(PROXY_ROUTES.LOGIN, {
        method: "DELETE",
        credentials: "include",
      });

      if (response.ok) {
        setEstConnecte(false);
        console.log("Déconnexion réussie !");
      } else {
        console.error("Erreur lors de la déconnexion !");
      }
    } catch (err) {
      console.error("Erreur lors de la déconnexion :", err);
    }
  };

  const handleShowModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
      <div>
        {/* Barre supérieure pour la connexion/déconnexion */}
        <div
            className="fixed top-0 left-0 w-full flex justify-between items-center p-6 z-50"
            style={{ backgroundColor: "rgba(255, 87, 34, 0.9)" }}
        >
          <h1 className="text-2xl text-white font-bold">Papa Louis</h1>

          {/* Boutons d'actions */}
          <div className="space-x-4">
            {/* Bouton pour afficher/masquer le MenuPizza */}
            <Button
                text={showMenuPizza ? "Fermer le menu" : "Menu"}
                color="border-1 border-white bg-orange-900 hover:bg-orange-800 hover:border-3 text-white"
                onClick={() => setShowMenuPizza(!showMenuPizza)} // Alterne l'état d'affichage
            />
            {estConnecte ? (
                <Button
                    text="Se déconnecter"
                    color="border-1 border-white bg-orange-900 hover:bg-orange-800 hover:border-3 text-white"
                    onClick={handleDeconnexion}
                />
            ) : (
                <Button
                    text="Se connecter"
                    color="border-1 border-white bg-orange-900 hover:bg-orange-800 hover:border-3 text-white"
                    onClick={handleShowModal}
                />
            )}
          </div>
          {showModal && <Connexion onClose={handleCloseModal} />}
        </div>

        {/* Affichage de MenuPizza si showMenuPizza est actif */}
        {showMenuPizza && (
            <div className="absolute top-40 left-0 right-0 bg-white z-40 overflow-y-auto p-4">
              <MenuPizza />
            </div>
        )}
      </div>
  );
};

export default MenuClient;