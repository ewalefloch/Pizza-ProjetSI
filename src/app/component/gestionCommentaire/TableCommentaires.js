"use client";
import API_ROUTES from "@/app/configAPIRoute";
import React, { useState, useEffect } from "react";


const TableCommentaires = ({ commentaires, supprimerCommentaire }) => {
  const [userNames, setUserNames] = useState({});

  useEffect(() => {
    const loadUserNames = async () => {
      const userNamesMap = { ...userNames };
      
      for (const commentaire of commentaires) {
        if (!userNamesMap[commentaire.idUser]) {
          try {
            const response = await fetch(`${API_ROUTES.USERS}/${commentaire.idUser}`, {
              credentials: "include",
            });
            
            if (response.ok) {
              const data = await response.json();
              userNamesMap[commentaire.idUser] = data.nom;
            } else {
              userNamesMap[commentaire.idUser] = "Utilisateur inconnu";
            }
          } catch (error) {
            console.error("Erreur lors de la récupération de l'utilisateur:", error);
            userNamesMap[commentaire.idUser] = "Erreur";
          }
        }
      }
      
      setUserNames(userNamesMap);
    };
    
    loadUserNames();
  }, [commentaires]);

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full table-auto border-collapse border border-gray-400">
        <thead>
          <tr>
            <th className="border border-gray-300 px-4 py-2">Auteur</th>
            <th className="border border-gray-300 px-4 py-2">Commentaire</th>
            <th className="border border-gray-300 px-4 py-2">Note</th>
            <th className="border border-gray-300 px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {commentaires.length > 0 ? (
            commentaires.map((commentaire) => (
              <tr key={commentaire.id} className="text-center">
                <td className="border border-gray-300 px-4 py-2">
                  {userNames[commentaire.idUser] || "Chargement..."}
                </td>
                <td className="border border-gray-300 px-4 py-2">{commentaire.text}</td>
                <td className="border border-gray-300 px-4 py-2">{commentaire.note}</td>
                <td className="border border-gray-300 px-4 py-2">
                  <button
                    onClick={() => supprimerCommentaire(commentaire.id)}
                    className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
                  >
                    Supprimer
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="text-center px-4 py-2">Aucun commentaire disponible</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TableCommentaires;