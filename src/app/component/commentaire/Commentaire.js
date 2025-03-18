"use client";

import { useState, useEffect } from "react";
import API_ROUTES from "@/app/configAPIRoute";

const Commentaire = ({ data }) => {
  const [userName, setUserName] = useState("Utilisateur");
  const [isLoading, setIsLoading] = useState(true);
  const [imageUrl, setImageUrl] = useState(null);

  useEffect(() => {
    const getUserName = async () => {
      if (data.idUser) {
        try {
          const response = await fetch(`${API_ROUTES.USERS}/${data.idUser}`, {
            credentials: "include",
          });
          const result = await response.json();
          if (result) {
            setUserName(result.nom);
          }
        } catch (error) {
          console.error(
            "Erreur lors de la récupération du nom d'utilisateur:",
            error
          );
        } finally {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    };

    getUserName();
  }, [data.idUser]);

  useEffect(() => {
    const fetchImage = async () => {
      if (data.id) {
        try {
          const response = await fetch(
            `${API_ROUTES.COMMENTAIRE}/images/${data.id}`,
            {
              credentials: "include",
            }
          );
          if (response.ok) {
            const blob = await response.blob();
            setImageUrl(URL.createObjectURL(blob));
          }
        } catch (error) {
          console.error("Erreur lors de la récupération de l'image :", error);
        }
      }
    };

    fetchImage();
  }, [data.id]);

  return (
    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center mr-3">
            <span className="text-orange-600 font-semibold text-lg">
              {userName ? userName.charAt(0).toUpperCase() : "?"}
            </span>
          </div>
          <div>
            <h3 className="font-medium text-gray-800">
              {isLoading ? "Chargement..." : userName}
            </h3>
            <p className="text-xs text-gray-500">
              {new Date(Number(data.date)).toLocaleDateString("fr-FR", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              })}
            </p>{" "}
          </div>
        </div>

        <div className="flex">
          {[1, 2, 3, 4, 5].map((star) => (
            <svg
              key={star}
              className={`w-4 h-4 ${
                star <= data.note ? "text-yellow-400" : "text-gray-300"
              }`}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
        </div>
      </div>

      <div className="text-gray-700 mt-2">{data.text}</div>

      {imageUrl && (
        <div className="mt-3">
          <img
            src={imageUrl}
            alt="Photo du commentaire"
            className="rounded-md max-h-40 object-cover"
          />
        </div>
      )}
    </div>
  );
};

export default Commentaire;
