"use client";
import React, { useEffect, useState } from "react";
import Button from "../global/Bouton";
import Connexion from "../connexion/Connexion";
import PROXY_ROUTES from "@/app/configProxyRoute";
import { getCookie } from "cookies-next";

const MenuClient = ({ setActiveSection, setEstConnecte }) => {
  const [showModal, setShowModal] = useState(false);
  const [estConnecteLocal, setEstConnecteLocal] = useState(false);

  useEffect(() => {
    const token = getCookie("AuthToken");
    setEstConnecteLocal(!!token);
    
    // Vérifier si setEstConnecte est une fonction avant de l'appeler
    if (typeof setEstConnecte === 'function') {
      setEstConnecte(!!token); // Mettre à jour l'état parent
    }
  }, [setEstConnecte]);

  const handleDeconnexion = async () => {
    try {
      const response = await fetch(PROXY_ROUTES.LOGIN, {
        method: "DELETE",
        credentials: "include",
      });

      if (response.ok) {
        setEstConnecteLocal(false);
        // Vérifier si setEstConnecte est une fonction avant de l'appeler
        if (typeof setEstConnecte === 'function') {
          setEstConnecte(false); // Mettre à jour l'état parent
        }
        console.log("Déconnexion réussie !");
        // Rediriger vers la page d'accueil après déconnexion
        setActiveSection("menu");
      } else {
        console.error("Erreur lors de la déconnexion !");
      }
    } catch (err) {
      console.error("Erreur lors de la déconnexion :", err);
    }
  };

  // Fonction pour gérer le changement de section
  const handleSectionChange = (section) => {
    console.log("Changement de section vers:", section);
    setActiveSection(section);
  };

  return (
    <div className="fixed top-0 left-0 w-full flex items-center p-6 bg-orange-600 z-20">
      <h1 
        className="text-2xl text-white font-bold cursor-pointer" 
        onClick={() => handleSectionChange("menu")}
      >
        Papa Louis
      </h1>
      <nav className="flex-grow">
        <ul className="flex space-x-6 ml-6">
          <li>
            <button 
              className="text-white hover:text-orange-300" 
              onClick={() => handleSectionChange("pizzas")}
            >
              Nos pizzas
            </button>
          </li>
          <li>
            <button 
              className="text-white hover:text-orange-300" 
              onClick={() => handleSectionChange("panier")}
            >
              Panier
            </button>
          </li>
          <li>
            <button 
              className="text-white hover:text-orange-300" 
              onClick={() => handleSectionChange("profil")}
            >
              Profil
            </button>
          </li>
        </ul>
      </nav>
      <div className="ml-auto">
        {estConnecteLocal ? (
          <Button
            text="Se déconnecter"
            color="border-1 border-white bg-orange-900 hover:bg-orange-800 hover:border-3 text-white"
            onClick={handleDeconnexion}
          />
        ) : (
          <Button
            text="Se connecter"
            color="border-1 border-white bg-orange-900 hover:bg-orange-800 hover:border-3 text-white"
            onClick={() => setShowModal(true)}
          />
        )}
      </div>
      {showModal && (
        <Connexion 
          onClose={() => setShowModal(false)} 
          setEstConnecte={typeof setEstConnecte === 'function' ? setEstConnecte : null}
        />
      )}
    </div>
  );
};

export default MenuClient;