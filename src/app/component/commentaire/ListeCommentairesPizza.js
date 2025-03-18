import { useEffect, useState } from "react";
import Commentaire from "./Commentaire";
import AjoutCommentaire from "./AjoutCommentaire";
import API_ROUTES from "@/app/configAPIRoute";
import { getCookie } from "cookies-next";
import { jwtDecode } from "jwt-decode";

const ListeCommentairesPizza = ({ pizza, onClose }) => {
  const [commentaires, setCommentaires] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [hasOrdered, setHasOrdered] = useState(false);
  const [userId, setUserId] = useState(null);
  const [hasCommented, setHasCommented] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Vérifie si l'utilisateur est connecté et récupère son ID
  useEffect(() => {
    const checkUserStatus = async () => {
      const token = getCookie("AuthToken");
      if (token) {
        try {
          const decodedToken = jwtDecode(token);
          setUserId(decodedToken.userId);
          setIsLoggedIn(true);
        } catch (error) {
          console.error("Erreur lors du décodage du token:", error);
        }
      }
    };

    checkUserStatus();
  }, []);

  // Vérifie si l'utilisateur a commandé cette pizza
  useEffect(() => {
    if (!userId) return;

    const checkUserOrder = async () => {
      try {
        const response = await fetch(`${API_ROUTES.COMMANDE}/user/${userId}`, {
          credentials: "include",
        });

        if (response.ok) {
          const dataJson = await response.json();
          if (dataJson.success) {
            const ordered = dataJson.data.some(
              (cmd) => cmd.pizzaCommandeIds?.includes(pizza.id)
            );
            setHasOrdered(ordered);
          }
        }
      } catch (error) {
        console.error("Erreur lors de la vérification de la commande:", error);
      }
    };

    checkUserOrder();
  }, [userId, pizza.id]);

  // Récupère les commentaires liés à la pizza
  useEffect(() => {
    const fetchCommentaires = async () => {
      try {
        const response = await fetch(
          `${API_ROUTES.COMMENTAIRE}/pizza/${pizza.id}`,
          { credentials: "include", method: "GET" }
        );
        const data = await response.json();

        if (data.success) {
          setCommentaires(data.data);
          if (userId) {
            const alreadyCommented = data.data.some(
              (comment) => comment.idUser === userId
            );
            setHasCommented(alreadyCommented);
            if (alreadyCommented) {
              setErrorMessage("Vous avez déjà laissé un avis pour cette pizza.");
            }
          }
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des commentaires:", error);
      }
    };

    if (pizza.id) {
      fetchCommentaires();
    }
  }, [pizza.id, userId]);

  const handleNewComment = (newComment) => {
    setCommentaires([newComment, ...commentaires]);
    setShowAddForm(false);
    setHasCommented(true);
  };


  const resetError = () => {
    setErrorMessage("");
  };

  const averageRating =
    commentaires.length > 0
      ? (
          commentaires.reduce((sum, comment) => sum + comment.note, 0) /
          commentaires.length
        ).toFixed(1)
      : 0;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div
        className="absolute inset-0 bg-orange-500"
        style={{ backgroundColor: "rgba(255, 87, 34, 0.7)" }}
        onClick={onClose}
      ></div>

      <div className="bg-white p-6 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto relative">
        {/* Bouton de fermeture */}
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          onClick={onClose}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        <h1 className="text-2xl font-bold text-orange-600 mb-2">
          Avis sur {pizza.nom}
        </h1>

        <div className="flex items-center mb-4">
          {[1, 2, 3, 4, 5].map((star) => (
            <svg
              key={star}
              className={`w-5 h-5 ${
                star <= Math.round(averageRating)
                  ? "text-yellow-400"
                  : "text-gray-300"
              }`}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
          <span className="text-lg font-medium">{averageRating}</span>
          <span className="text-gray-500 ml-2">
            ({commentaires.length} avis)
          </span>
        </div>

        {/* Messages d'erreur */}
        {errorMessage && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm">{errorMessage}</p>
              </div>
            </div>
          </div>
        )}

        {/* Messages et bouton d'ajout de commentaire */}
        {!isLoggedIn ? (
          <p className="text-red-500 font-medium">
            Vous devez être connecté pour laisser un avis.
          </p>
        ) : !hasOrdered ? (
          <p className="text-red-500 font-medium">
            Vous devez avoir commandé cette pizza pour laisser un avis.
          </p>
        ) : hasCommented ? (
          <p className="text-red-500 font-medium">
            Vous avez déjà laissé un avis pour cette pizza.
          </p>
        ) : !showAddForm ? (
          <button
            onClick={() => {
              setShowAddForm(true);
              resetError();
            }}
            className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition flex items-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mr-2"
            >
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            Ajouter un avis
          </button>
        ) : (
          <AjoutCommentaire
            pizzaId={pizza.id}
            onCommentAdded={handleNewComment}
            onCancel={() => setShowAddForm(false)}
            userId={userId}
          />
        )}

        {/* Liste des commentaires */}
        <div className="border-t border-gray-200 pt-4">
          <h2 className="text-xl font-semibold mb-4">Commentaires des clients</h2>

          {commentaires.length === 0 ? (
            <div className="text-gray-500 italic py-4 text-center">
              Aucun commentaire pour cette pizza. Soyez le premier à donner votre avis !
            </div>
          ) : (
            <div className="space-y-4">
              {commentaires.map((commentaire) => (
                <div key={commentaire.id} className="py-2">
                  <Commentaire data={commentaire} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ListeCommentairesPizza;