"use client";
import React, { useState } from "react";
import SeConnecter from "./SeConnecter";
import CreerCompte from "./CreerCompte";

const Connexion = ({ onClose, setEstConnecte }) => {
  const [isLogin, setIsLogin] = useState(true);

  // Fonction à passer à SeConnecter pour gérer la connexion réussie
  const handleLoginSuccess = () => {
    // Mettre à jour l'état de connexion dans le composant parent
    setEstConnecte(true);
    // Fermer le modal
    onClose();
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50"
      style={{ backgroundColor: "rgba(255, 87, 34, 0.9)" }}
    >
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold mb-4">
          {isLogin ? "Se connecter" : "Créer un compte"}
        </h2>
        
        {isLogin ? (
          <SeConnecter onSuccess={handleLoginSuccess} />
        ) : (
          <CreerCompte onSuccess={() => setIsLogin(true)} />
        )}
        
        <button
          onClick={() => setIsLogin(!isLogin)}
          className="text-blue-500 mt-4 w-full text-center"
        >
          {isLogin
            ? "Pas de compte ? Créer un compte"
            : "Déjà un compte ? Se connecter"}
        </button>
        
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="bg-orange-600 text-white p-2 mt-4 rounded-lg"
          >
            Retour
          </button>
        </div>
      </div>
    </div>
  );
};

export default Connexion;