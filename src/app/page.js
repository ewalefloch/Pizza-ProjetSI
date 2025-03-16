"use client";
import React, { useEffect, useState } from "react";
import MenuClient from "./component/menu/MenuClient";
import API_ROUTES from "./configAPIRoute";
import imagePizza from "../../public/image/pizza.jpg";
import PanierClient from "./component/client/PanierClient";
import AffichagePizzas from "./component/pizza/AffichagePizza";
import { getCookie } from "cookies-next";
import { jwtDecode } from "jwt-decode";

export default function Home() {
  const [pizzas, setPizzas] = useState([]);
  const [ingredients, setIngredients] = useState([]);
  const [activeSection, setActiveSection] = useState("menu");
  const [estConnecte, setEstConnecte] = useState(false);
  const [userId, setUserId] = useState(null);

  console.log("Section active:", activeSection); // Débogage

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Vérifier si l'utilisateur est connecté
        const token = getCookie("AuthToken");
        const isConnected = !!token;
        setEstConnecte(isConnected);

        // Récupérer les pizzas
        const pizzasResponse = await fetch(API_ROUTES.PIZZA);
        if (!pizzasResponse.ok) {
          throw new Error("Erreur lors de la récupération des pizzas");
        }
        const pizzasData = await pizzasResponse.json();
        const pizzasWithPhotos = pizzasData.data.map((pizza) => ({
          ...pizza,
          photo: `${API_ROUTES.PIZZA}/images/${pizza.id}`,
        }));
        setPizzas(pizzasWithPhotos);

        // Récupérer les ingrédients
        const ingredientsResponse = await fetch(API_ROUTES.INGREDIENT);
        if (!ingredientsResponse.ok) {
          throw new Error("Erreur lors de la récupération des ingrédients");
        }
        const ingredientsData = await ingredientsResponse.json();
        setIngredients(ingredientsData.data);

        // Récupérer l'ID utilisateur si connecté
        if (isConnected && token) {
          try {
            const decodedToken = jwtDecode(token);
            const userId = decodedToken.userId;
            console.log("ID de l'utilisateur depuis le token:", userId);
            setUserId(userId);
          } catch (error) {
            console.error("Erreur de décodage du token:", error);
          }
        }
      }
      catch (error) {
        console.error("Erreur lors de la récupération des données:", error);
      }
    };

    fetchData();
  }, [estConnecte]);

  // Fonction de débogage pour afficher ce qui est rendu
  const renderDebug = () => {
    return (
      <div className="fixed bottom-0 right-0 bg-white p-2 text-black z-50 text-xs">
        <div>
          Section active: {activeSection}
          <br />
          Connecté: {estConnecte ? "Oui" : "Non"}
          <br />
          UserId: {userId || "Non défini"}
        </div>
      </div>
    );
  };

  // Fonction explicite pour mettre à jour l'état de connexion
  const updateConnectionState = (isConnected) => {
    console.log("Mise à jour de l'état de connexion:", isConnected);
    setEstConnecte(isConnected);
  };

  return (
    <div className="relative min-h-screen">
      {/* Section du fond */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${imagePizza.src})` }}
      />

      {/* Menu Client avec les fonctions explicites */}
      <div className="relative z-10">
        <MenuClient
          setActiveSection={setActiveSection}
          setEstConnecte={updateConnectionState}
        />
      </div>

      {/* Contenu principal basé sur la section active */}
      <div className="relative pt-16">
        {" "}
        {/* Ajouter padding-top pour éviter le chevauchement avec le menu fixe */}
        {/* Titre principal */}
        {activeSection === "menu" && (
          <div className="flex items-center justify-center h-screen">
            <h1 className="text-4xl md:text-6xl font-bold text-white text-center">
              Bienvenue chez Papa Louis!
            </h1>
          </div>
        )}
        {/* Liste des pizzas */}
        {activeSection === "pizzas" && (
          <div className="pt-4">
            <AffichagePizzas pizzas={pizzas} ingredients={ingredients} />
          </div>
        )}
        {/* Panier */}
        {activeSection === "panier" && (
          <div className="pt-4 px-4">
            <PanierClient
              estConnecte={estConnecte}
              userId={userId}
              ingredients={ingredients}
              setActiveSection={setActiveSection}
            />
          </div>
        )}
      </div>

      {renderDebug()}
    </div>
  );
}
