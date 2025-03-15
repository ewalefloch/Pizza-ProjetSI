import React, { useState } from "react";

const PanierClient = ({ panierItems, onRemove, totalPrice }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div
            className={`fixed top-1/4 right-4 transform ${
                isOpen ? "translate-x-0" : "translate-x-full"
            } transition-transform duration-300 z-50`}
        >
        {/* Bulle flottante */}
            <div
                className="bg-orange-500 text-white w-12 h-12 rounded-full flex justify-center items-center cursor-pointer shadow-lg fixed right-4 top-1/3 z-50"
                onClick={() => setIsOpen(!isOpen)}
                title="Afficher le panier"
            >
                🛒
            </div>

            {/* Conteneur du panier */}
            <div
                className={`bg-white shadow-lg w-72 p-4 overflow-y-auto rounded-l-lg ${
                    isOpen ? "block" : "hidden"
                }`}
            >
            <h2 className="text-xl font-bold text-gray-800 mb-4">Votre Panier</h2>

                {/* Liste des articles */}
                {panierItems.length > 0 ? (
                    panierItems.map((item) => (
                        <div
                            key={item.id}
                            className="flex items-center justify-between my-2 p-2 border-b"
                        >
                            <div className="flex items-center space-x-4">
                                <img
                                    src={item.photo}
                                    alt={item.nom}
                                    className="w-12 h-12 object-cover rounded"
                                />
                                <span className="text-gray-700 font-semibold">{item.nom}</span>
                            </div>
                            <button
                                onClick={() => onRemove(item.id)}
                                className="text-red-600 font-bold text-sm"
                            >
                                Retirer
                            </button>
                        </div>
                    ))
                ) : (
                    <p className="text-gray-500">Votre panier est vide.</p>
                )}

                {/* Prix total */}
                <div className="mt-4 border-t pt-4">
                    <h3 className="text-lg font-bold text-gray-800">
                        Total : <span className="text-green-600">€{totalPrice.toFixed(2)}</span>
                    </h3>
                </div>
            </div>
        </div>
    );
};

export default PanierClient;