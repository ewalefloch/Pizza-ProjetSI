"use client";
import React, { useEffect, useState } from "react";
import MenuClient from "./component/menu/MenuClient";
import API_ROUTES from "./configAPIRoute";
import imagePizza from "../../public/image/pizza.jpg";
import PanierClient from "./component/client/PanierClient";
import AffichagePizzas from "./component/pizza/AffichagePizza";
import { getCookie,deleteCookie } from "cookies-next";
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

  const fusionPanier = async (userId) => {
    try {
      const panierCookie = getPanierFromCookie();
      
      if (!panierCookie || panierCookie.length === 0) {
        console.log("Aucun panier dans les cookies à fusionner");
        return { success: true, message: "Aucun panier à fusionner" };
      }
      
      const panierDto = {
        pizzaCommandeIds: [],
      };
      
      for (const item of panierCookie) {
        const pizzaCommandeResponse = await fetch(`${API_ROUTES.PIZZA_COMMANDE}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getCookie("AuthToken")}`
          },
          body: JSON.stringify({
            pizzaId: item.pizzaId,
            quantite: item.quantite,
            ingredientsOptionnelsIds: item.ingredientsOptionnelsIds || []
          })
        });
        
        const pizzaCommandeData = await pizzaCommandeResponse.json();
        
        if (pizzaCommandeData.success && pizzaCommandeData.data) {
          panierDto.pizzaCommandeIds.push(pizzaCommandeData.data.id);
        } else {
          console.error("Erreur lors de la création de la pizzaCommande:", pizzaCommandeData.message);
          return { success: false, message: "Erreur lors de la fusion du panier" };
        }
      }
      
      // Appel à l'API pour fusionner les paniers
      const response = await fetch(`${API_ROUTES.PANIER}/fusion/${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getCookie("AuthToken")}`
        },
        body: JSON.stringify(panierDto)
      });
      
      const data = await response.json();
      
      if (data.success) {
        clearPanierCookie();
        return { success: true, message: "Panier fusionné avec succès", data: data.data };
      } else {
        return { success: false, message: data.message || "Erreur lors de la fusion du panier" };
      }
    } catch (error) {
      console.error("Erreur lors de la fusion du panier:", error);
      return { success: false, message: "Une erreur est survenue lors de la fusion du panier" };
    }
  };
  
  const getPanierFromCookie = () => {
    const panierCookie = getCookie("panier");
    
    if (panierCookie) {
      try {
        return JSON.parse(panierCookie);
      } catch (error) {
        console.error("Erreur lors du parsing du panier cookie:", error);
        return [];
      }
    }
    return [];
  };
  
  const clearPanierCookie = () => {
    deleteCookie("panier");
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
          fusionPanier={fusionPanier}
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
