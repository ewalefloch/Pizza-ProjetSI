"use client";

import { useState } from "react";
import API_ROUTES from "@/app/configAPIRoute";
import { getCookie } from "cookies-next";
import { jwtDecode } from "jwt-decode";

const AjoutCommentaire = ({ pizzaId, onCommentAdded, onCancel, userId }) => {
  const [note, setNote] = useState(5);
  const [commentaire, setCommentaire] = useState("");
  const [photo, setPhoto] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [hoverRating, setHoverRating] = useState(0);

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
  
    if (pizzaId === undefined || pizzaId === null) {
      setError("Impossible d'ajouter un commentaire pour une pizza inconnue");
      return;
    }
  
    if (commentaire.trim() === "") {
      setError("Veuillez entrer un commentaire");
      return;
    }
  
    if (note < 1 || note > 5) {
      setError("La note doit être entre 1 et 5");
      return;
    }
  
    if (photo && photo.length > 65000) {
      setError("La photo est trop volumineuse. Veuillez choisir une image plus petite.");
      return;
    }
  
    setIsSubmitting(true);
    setError("");
  
    try {
      const formData = new FormData();
  
      // Création de l'objet commentaire à encoder en JSON
      const commentaireObj = {
        text: commentaire,
        note: note,
        idPizza: pizzaId,
        idUser: userId,
        date: Date.now()
      };
  
      // Ajout du commentaire encodé en JSON dans FormData
      formData.append("commentaire", JSON.stringify(commentaireObj));
  
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
  
      const response = await fetch(`${API_ROUTES.COMMENTAIRE}`, {
        method: "POST",
        credentials: "include",
        body: formData
      });
  
      const data = await response.json();
  
      if (data.success) {
        onCommentAdded(data.data);
      } else {
        setError(data.message || "Une erreur est survenue");
      }
    } catch (error) {
      console.error("Erreur lors de l'ajout du commentaire:", error);
      setError("Une erreur est survenue lors de l'envoi du commentaire");
    } finally {
      setIsSubmitting(false);
    }
  }; 
  

  return (
    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 mb-4">
      <h3 className="text-lg font-medium mb-3">Donner votre avis</h3>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Note
          </label>
          <div
            className="flex space-x-1"
            onMouseLeave={() => setHoverRating(0)}
          >
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                className="focus:outline-none"
                onClick={() => setNote(star)}
                onMouseEnter={() => setHoverRating(star)}
              >
                <svg
                  className={`w-8 h-8 ${
                    (hoverRating || note) >= star
                      ? "text-yellow-400"
                      : "text-gray-300"
                  } cursor-pointer transition-colors`}
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </button>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <label
            htmlFor="commentaire"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Commentaire
          </label>
          <textarea
            id="commentaire"
            rows="3"
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring focus:ring-orange-500 focus:ring-opacity-20"
            placeholder="Partagez votre expérience avec cette pizza..."
            value={commentaire}
            onChange={(e) => setCommentaire(e.target.value)}
            required
          ></textarea>
        </div>

        <div className="mb-4">
          <label
            htmlFor="photo"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Ajouter une photo (optionnel)
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

        {error && <div className="mb-4 text-red-500 text-sm">{error}</div>}

        <div className="flex justify-end space-x-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition"
            disabled={isSubmitting}
          >
            Annuler
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition flex items-center"
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
                Envoi en cours...
              </>
            ) : (
              "Envoyer mon avis"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AjoutCommentaire;