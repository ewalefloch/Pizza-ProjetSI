"use client";
import React, { useState } from "react";
import API_ROUTES from "../../configAPIRoute";
import ListeIngredients from "../ingredient/ListeIngredients";

const CreerPizza = ({ ingredients, ajouterPizza, fermer }) => {
  const [nom, setNom] = useState("");
  const [prix, setPrix] = useState("");
  const [description, setDescription] = useState("");
  const [photo, setPhoto] = useState("");
  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const maxWidth = 600;
          let width = img.width;
          let height = img.height;
          
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
          
          canvas.width = width;
          canvas.height = height;
          
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          
          const dataUrl = canvas.toDataURL('image/jpeg', 0.6);
          setPhoto(dataUrl);
        };
        img.src = reader.result;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!nom || !prix || !description || selectedIngredients.length === 0) {
      setMessage({
        type: "error",
        text: "Tous les champs sont obligatoires !",
      });
      return;
    }

    if (photo && photo.length > 65000) {
      setMessage({
        type: "error",
        text: "La photo est trop volumineuse. Veuillez choisir une image plus petite."
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      const formData = new FormData();
      
      const ingredientsData = selectedIngredients.map((id) => ({ id }));
      
      // Création de l'objet pizza à encoder en JSON
      const pizzaData = {
        id: null,
        nom,
        description,
        prix: parseFloat(prix),
        ingredients_principaux: ingredientsData,
      };
      
      // Ajout des données pizza encodées en JSON dans FormData
      formData.append("pizza", JSON.stringify(pizzaData));
      
      // Gestion de la photo si elle est fournie
      if (photo) {
        const byteString = atob(photo.split(",")[1]);
        const arrayBuffer = new ArrayBuffer(byteString.length);
        const uintArray = new Uint8Array(arrayBuffer);
        for (let i = 0; i < byteString.length; i++) {
          uintArray[i] = byteString.charCodeAt(i);
        }
        const blob = new Blob([arrayBuffer], { type: "image/jpeg" });
        formData.append("image", blob, "photo.jpg");
      }

      const response = await fetch(API_ROUTES.PIZZA, {
        method: "POST",
        credentials: "include",
        body: formData
      });

      if (!response.ok) {
        throw new Error("Erreur lors de l'ajout de la pizza !");
      }

      const nouvellePizza = await response.json();
      ajouterPizza(nouvellePizza.data);

      setNom("");
      setPrix("");
      setDescription("");
      setPhoto("");
      setSelectedIngredients([]);
      setMessage({ type: "success", text: "Pizza ajoutée avec succès !" });

      setTimeout(() => setMessage({ type: "", text: "" }), 3000); // Effacer après 3s
    } catch (error) {
      setMessage({ type: "error", text: "Une erreur est survenue !" });
      console.error("Erreur:", error);
    } finally {
      setIsSubmitting(false);
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
                id="photo"
                accept="image/*"
                className="block w-full text-sm text-gray-500 file:mr-3 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-orange-50 file:text-orange-600 hover:file:bg-orange-100"
                onChange={handlePhotoChange}
              />
              {photo && (
                <div className="mt-2">
                  <img
                    src={photo}
                    alt="Aperçu"
                    className="h-20 rounded-md object-cover"
                  />
                </div>
              )}
            </div>
          </div>

          {/* LISTE DES INGRÉDIENTS */}
          <div>
            <h3 className="text-lg font-bold mb-2">
              Sélectionner les ingrédients Principal
            </h3>
            <div className="rounded h-48 overflow-y-auto">
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
            className="bg-orange-600 text-white p-3 rounded w-full flex justify-center items-center"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Ajout en cours...
              </>
            ) : (
              "Ajouter la pizza"
            )}
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
          disabled={isSubmitting}
        >
          Retour
        </button>
      </div>
    </div>
  );
};

export default CreerPizza;