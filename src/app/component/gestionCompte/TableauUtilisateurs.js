"use client";
import React from "react";

const TableauUtilisateurs = ({ utilisateurs, supprimerUtilisateur, modifierUtilisateur }) => {
    return (
        <div className="overflow-x-auto">
            <table className="min-w-full table-auto border border-gray-300">
                <thead>
                <tr>
                    <th className="border px-4 py-2">Nom</th>
                    <th className="border px-4 py-2">Adresse Postale</th>
                    <th className="border px-4 py-2">Adresse Email</th>
                    <th className="border px-4 py-2">Admin</th>
                    <th className="border px-4 py-2">Actions</th>
                </tr>
                </thead>
                <tbody>
                {Array.isArray(utilisateurs) && utilisateurs.length > 0 ? (
                    utilisateurs.map((utilisateur, index) => (
                        <tr key={utilisateur.id || `utilisateur-${index}`}>
                            <td className="border px-4 py-2">{utilisateur.nom}</td>
                            <td className="border px-4 py-2">
                                {utilisateur.adressePostale ? utilisateur.adressePostale : "Non renseigné"}</td>
                            <td className="border px-4 py-2">{utilisateur.adresseEmail}</td>
                            <td className="border px-4 py-2">
                                {!utilisateur.estClient ? "Oui" : "Non"}
                            </td>
                            <td className="border px-4 py-2">
                                <button
                                    className="bg-blue-500 text-white px-2 py-1 rounded mr-2"
                                    onClick={() => modifierUtilisateur(utilisateur)}
                                >
                                    Modifier
                                </button>
                                <button
                                    className="bg-red-500 text-white px-2 py-1 rounded"
                                    onClick={() => supprimerUtilisateur(utilisateur.id)}
                                >
                                    Supprimer
                                </button>
                            </td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan="5" className="text-center py-2">
                            Aucun utilisateur trouvé.
                        </td>
                    </tr>
                )}
                </tbody>
            </table>
        </div>
    );
};

export default TableauUtilisateurs;