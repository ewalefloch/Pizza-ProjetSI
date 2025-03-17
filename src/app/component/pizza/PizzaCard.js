"use client";
import React from "react";
import PizzaImage from "./PizzaImage";
import PizzaInfo from "./PizzaInfo";

const PizzaCard = ({ pizza, ouvrirModal }) => {
    return (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden transform transition duration-300 hover:scale-105">
            <PizzaImage photo={pizza.photo} nom={pizza.nom} />
            <div className="p-4">
                <PizzaInfo pizza={pizza} />
                <button
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded transition duration-300"
                    onClick={() => ouvrirModal(pizza)}
                >
                    Ajouter au panier
                </button>
            </div>
        </div>
    );
};

export default PizzaCard;
