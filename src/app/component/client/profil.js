import React, { useState, useEffect } from "react";
import { getCookie } from "cookies-next";
import jwtDecode from "jwt-decode";
import API_ROUTES from "../../configAPIRoute";

const Profil = ({ userId, estClient }) => {
    const [userInfo, setUserInfo] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        nom: "",
        adresseEmail: "",
        adressePostale: "",
        mdp: ""
    });

    // Fonction pour récupérer les informations de l'utilisateur
    const fetchUserInfo = async (userId) => {
        // Si userId est vide, considérer l'utilisateur comme non connecté
        if (!userId) {
            setIsLoading(false);
            return;
        }

        try {
            const response = await fetch(`${API_ROUTES.USERS}/${userId}`, {
                method: "GET",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                throw new Error("Erreur lors de la récupération des données utilisateur.");
            }

            const data = await response.json();
            if (data) {
                setUserInfo(data);
                setFormData({
                    nom: data.nom || "",
                    adresseEmail: data.adresseEmail || "",
                    adressePostale: data.adressePostale || "",
                    mdp: null
                });
            } else {
                throw new Error(data.message || "Les informations de l'utilisateur n'ont pas pu être chargées.");
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSaveProfile = async () => {
        try {
            setIsLoading(true);
            const response = await fetch(`${API_ROUTES.USERS}/${userId}`, {
                method: "PUT",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error("Erreur lors de la mise à jour du profil");
            }

            const updatedData = await response.json();
            setUserInfo(updatedData);
            setIsEditing(false);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchUserInfo(userId);
    }, [userId]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="bg-red-50 border border-red-300 p-4 rounded-lg text-red-600">
                    <p className="font-medium">Erreur</p>
                    <p>{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto py-8 px-4">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                {/* En-tête du profil avec dégradé marron vers blanc */}
                <div className="bg-gradient-to-r from-amber-800 to-amber-900 px-6 py-8 text-amber-900">
                    <div className="flex flex-col md:flex-row items-center">
                        <div className="flex-shrink-0 mb-4 md:mb-0">
                            <div className="h-24 w-24 bg-white rounded-full flex items-center justify-center overflow-hidden border-4 border-white">
                                {userInfo?.photo ? (
                                    <img src={userInfo.photo} alt="Photo de profil" className="h-full w-full object-cover" />
                                ) : (
                                    <div className="h-full w-full bg-amber-50 flex items-center justify-center text-amber-800 text-2xl font-bold">
                                        {userInfo?.nom?.charAt(0).toUpperCase() || "?"}
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="md:ml-6 text-center md:text-left">
                            <h1 className="text-2xl font-bold text-white ">{userInfo?.nom || (userId ? "Utilisateur" : "Invité")}</h1>
                            <p className="text-amber-200">{userId ? (estClient != null ? (estClient ? "Membre" : "Administrateur") : "Invité") : "Non connecté"}</p>
                        </div>
                    </div>
                </div>

                {/* Contenu du profil */}
                <div className="p-6">
                    {!userId ? (
                        // Affichage pour utilisateur non connecté
                        <div className="bg-amber-50 p-8 rounded-md text-center">
                            <div className="text-amber-700 text-6xl mb-4">
                                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                                </svg>
                            </div>
                            <h2 className="text-xl font-medium text-amber-900 mb-2">Vous n'êtes pas connecté</h2>
                            <p className="text-amber-700 mb-6">Veuillez vous connecter pour accéder à votre profil et gérer vos informations personnelles.</p>
                            <button className="bg-amber-700 hover:bg-amber-800 text-white px-4 py-2 rounded-md inline-flex items-center">
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"></path>
                                </svg>
                                Se connecter
                            </button>
                        </div>
                    ) : isEditing ? (
                        // Formulaire d'édition pour utilisateur connecté
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
                                <input
                                    type="text"
                                    name="nom"
                                    value={formData.nom}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border border-amber-300 rounded-md focus:ring-amber-500 focus:border-amber-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                <input
                                    type="email"
                                    name="adresseEmail"
                                    value={formData.adresseEmail}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border border-amber-300 rounded-md focus:ring-amber-500 focus:border-amber-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Adresse postale</label>
                                <textarea
                                    name="adressePostale"
                                    value={formData.adressePostale}
                                    onChange={handleInputChange}
                                    rows="1"
                                    className="w-full px-4 py-2 border border-amber-300 rounded-md focus:ring-amber-500 focus:border-amber-500"
                                ></textarea>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Mot de passe</label>
                                <input
                                    type="password"
                                    name="mdp"
                                    value={formData.mdp ? formData.mdp : ""}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border border-amber-300 rounded-md focus:ring-amber-500 focus:border-amber-500"
                                    placeholder="Laissez vide pour conserver le mot de passe actuel"
                                />
                            </div>

                            <div className="flex space-x-2 pt-4">
                                <button
                                    onClick={handleSaveProfile}
                                    className="bg-amber-700 hover:bg-amber-800 text-white px-4 py-2 rounded-md"
                                >
                                    Enregistrer
                                </button>
                                <button
                                    onClick={() => setIsEditing(false)}
                                    className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-md"
                                >
                                    Annuler
                                </button>
                            </div>
                        </div>
                    ) : (
                        // Affichage normal pour utilisateur connecté
                        <div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="bg-amber-50 p-4 rounded-md">
                                    <h2 className="text-lg font-medium text-amber-900 mb-3">Informations personnelles</h2>
                                    <div className="space-y-2">
                                        <div className="flex flex-col">
                                            <span className="text-sm text-amber-700">Nom</span>
                                            <span className="font-medium">{userInfo?.nom || "Non spécifié"}</span>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-sm text-amber-700">Email</span>
                                            <span className="font-medium">{userInfo?.adresseEmail || "Non spécifié"}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-amber-50 p-4 rounded-md">
                                    <h2 className="text-lg font-medium text-amber-900 mb-3">Adresse</h2>
                                    <div className="space-y-2">
                                        <div className="flex flex-col">
                                            <span className="text-sm text-amber-700">Adresse postale</span>
                                            <span className="font-medium">{userInfo?.adressePostale || "Non spécifiée"}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6 flex">
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="bg-amber-700 hover:bg-amber-800 text-white px-4 py-2 rounded-md flex items-center"
                                >
                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                                    </svg>
                                    Modifier le profil
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Profil;