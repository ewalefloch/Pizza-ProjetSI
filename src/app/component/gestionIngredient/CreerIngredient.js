"use client";
import React, { useState } from "react";
import API_ROUTES from "@/app/configAPIRoute";
const CreerIngredient = ({ ajouterIngredient, fermer }) => {
  const [nom, setNom] = useState("");
  const [description, setDescription] = useState("");
  const [prix, setPrix] = useState("");
  const [formeSvg, setFormeSvg] = useState("");
  const [message, setMessage] = useState({ type: "", text: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!nom || !prix || !description || !formeSvg) {
      setMessage({
        type: "error",
        text: "Tous les champs sont obligatoires !",
      });
      return;
    }

    const ingredientData = {
      nom,
      description,
      prix: parseFloat(prix),
      formeSvg,
    };

    try {
      const response = await fetch(API_ROUTES.INGREDIENT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(ingredientData),
      });

      if (!response.ok) {
        throw new Error("Erreur lors de l'ajout de la pizza !");
      }

      const nouvelIngredient = await response.json();
      ajouterIngredient(nouvelIngredient.data);
      setNom("");
      setDescription("");
      setPrix("");
      setFormeSvg("");
      setMessage({ type: "success", text: "Ingrédient ajouté avec succès !" });
      setTimeout(() => setMessage({ type: "", text: "" }), 3000);
      fermer();
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
        <h3 className="text-xl font-bold mb-4">Ajouter un Ingrédient</h3>

        <div className="space-y-4">
          <div>
            <label htmlFor="nom" className="block font-medium">
              Nom de l'ingrédient
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
            <label htmlFor="formeSvg" className="block font-medium">
              Forme SVG
            </label>
            <textarea
              id="formeSvg"
              value={formeSvg}
              onChange={(e) => setFormeSvg(e.target.value)}
              className="border p-2 w-full rounded"
              placeholder="<svg>...</svg>"
            ></textarea>
          </div>
        </div>

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

        <div className="mt-6">
          <button
            type="submit"
            onClick={handleSubmit}
            className="bg-orange-600 text-white p-3 rounded w-full"
          >
            Ajouter l'ingrédient
          </button>
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

export default CreerIngredient;
