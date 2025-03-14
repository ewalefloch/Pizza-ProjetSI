'use client';
import React, {useEffect, useState} from "react";
import Button from "../global/Bouton";
import Connexion from "../connexion/Connexion";
import API_ROUTES from "@/app/configAPIRoute";
import PROXY_ROUTES from "@/app/configProxyRoute";


const getCookie = (cookieName) => {
  const cookies = document.cookie.split("; ");
  const cookie = cookies.find((c) => c.startsWith(`${cookieName}=`));
  return cookie ? cookie.split("=")[1] : null;
};

const MenuClient = () => {
  const [showModal, setShowModal] = useState(false);
  const [estConnecte, setEstConnecte] = useState(false);

  useEffect(() => {
    const verifierCookie = () => {
      const token = getCookie("AuthToken"); // Cherche le cookie AuthToken
      setEstConnecte(!!token); // Si token existe, définie estConnecte à true
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
    <div
      className="absolute top-0 left-0 w-full flex justify-between items-center p-6"
      style={{ backgroundColor: "rgba(255, 87, 34, 0.9)" }}
    >
      <h1 className="text-2xl text-white font-bold">Papa Louis</h1>
      <div className="space-x-4">
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
                onClick={() => setShowModal(true)}
            />
        )}

      </div>
      {showModal && <Connexion onClose={handleCloseModal} />}
    </div>
  );
};

export default MenuClient;
