"use client";
import React, { useState } from "react";
import API_ROUTES from "../../configAPIRoute";
import ListeIngredients from "../ingredient/ListeIngredients";

const CreerPizza = ({ ingredients, ajouterPizza, fermer }) => {
  const [nom, setNom] = useState("");
  const [prix, setPrix] = useState("");
  const [description, setDescription] = useState("");
  const [photo, setPhoto] = useState(null);
  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const [message, setMessage] = useState({ type: "", text: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!nom || !prix || !description || selectedIngredients.length === 0) {
      setMessage({
        type: "error",
        text: "Tous les champs sont obligatoires !",
      });
      return;
    }
  
    const formData = new FormData();
    const pizzaData = {
      id: null,
      nom,
      description,
      prix: parseFloat(prix),
      ingredients_principaux: selectedIngredients.map((id) => ({ id })),
    };
  
    formData.append("pizza", new Blob([JSON.stringify(pizzaData)], { type: "application/json" }));
    
    if (photo) {
      formData.append("image", photo);
    }
  
    try {
      const response = await fetch(API_ROUTES.PIZZA, {
        method: "POST",
        body: formData, // Envoi en multipart/form-data
      });
  
      if (!response.ok) {
        throw new Error("Erreur lors de l'ajout de la pizza !");
      }
  
      const nouvellePizza = await response.json();
      ajouterPizza(nouvellePizza.data);
  
      setNom("");
      setPrix("");
      setDescription("");
      setSelectedIngredients([]);
      setPhoto(null);
      setMessage({ type: "success", text: "Pizza ajoutée avec succès !" });
  
      setTimeout(() => setMessage({ type: "", text: "" }), 3000);
    } catch (error) {
      setMessage({ type: "error", text: "Une erreur est survenue !" });
      console.error("Erreur:", error);
    }
  };
  

  return (
    <div
      className="fixed inset-0 flex items-center justify-center shadow-lg p-6 rounded-lg"
      style={{ backgroundColor: "rgba(255, 87, 34, 0.9)" }}
    >
    <div className="bg-white p-6 rounded-lg shadow-lg w-auto">
      <h3 className="text-xl font-bold mb-4">Ajouter une Pizza</h3>

      <div className="grid grid-cols-2 gap-6">
        {/* FORMULAIRE PIZZA */}
        <div className="space-y-4 border-r-4 border-orange-600 pr-8">
          <div>
            <label htmlFor="nom" className="block font-medium">
              Nom de la pizza
            </label>
            <input
              type="text"
              id="nom"
              value={nom}
              onChange={(e) => setNom(e.target.value)}
              className="border p-2 w-full rounded"
            />
          </div>

          <div>
            <label htmlFor="prix" className="block font-medium">
              Prix (€)
            </label>
            <input
              type="number"
              id="prix"
              value={prix}
              onChange={(e) => setPrix(e.target.value)}
              className="border p-2 w-full rounded"
            />
          </div>

          <div>
            <label htmlFor="description" className="block font-medium">
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="border p-2 w-full rounded"
            ></textarea>
          </div>

          <div>
            <label htmlFor="photo" className="block font-medium">
              Photo
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setPhoto(e.target.files[0])}
              className="w-full"
            />
          </div>
        </div>

        {/* LISTE DES INGRÉDIENTS */}
        <div>
          <h3 className="text-lg font-bold mb-2">
            Sélectionner les ingrédients Principal
          </h3>
          <div className=" rounded h-48 overflow-y-auto">
            <ListeIngredients
              ingredients={ingredients}
              onSelectionChange={setSelectedIngredients}
            />
          </div>
        </div>
      </div>

      {/* BOUTON AJOUTER + MESSAGE */}
      <div className="mt-6">
        <button
          type="submit"
          onClick={handleSubmit}
          className="bg-orange-600 text-white p-3 rounded w-full"
        >
          Ajouter la pizza
        </button>

        {message.text && (
          <p
            className={`mt-3 p-2 rounded text-center ${
              message.type === "error"
                ? "bg-red-100 text-red-600"
                : "bg-green-100 text-green-600"
            }`}
          >
            {message.text}
          </p>
        )}
      </div>
      <button
        onClick={fermer}
        className="mt-4 bg-gray-300 text-gray-800 p-2 rounded w-full"
      >
        Retour
      </button>
      </div>
    </div>
  );
};

export default CreerPizza;
