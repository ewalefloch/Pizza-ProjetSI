"use client";

import React, { useEffect, useState } from "react";
import MenuAdmin from "@/app/component/menu/MenuAdmin";
import GestionUtilisateurs from "@/app/component/gestionCompte/GestionUtilisateurs";

export default function GestionUtilisateursPage() {
    const [isLoading, setIsLoading] = useState(true);

    // Simuler un chargement au cas où une logique supplémentaire est nécessaire
    useEffect(() => {
        setIsLoading(false); // Exemple si un chargement réel est implémenté plus tard
    }, []);

    if (isLoading) {
        return (
            <div className="relative min-h-screen bg-white">
                <MenuAdmin />
                <div className="flex items-center justify-center h-screen">
                    <p>Chargement de la page...</p>
                </div>
            </div>
        );
    }

    return (
        <div>
            <div className="relative min-h-screen bg-white flex flex-col">
                {/* Menu */}
                <MenuAdmin />

                {/* Contenu principal */}
                <div className="flex items-center justify-center flex-grow">
                    <div className="max-w-6xl w-full">
                        {/* Gestion des utilisateurs */}
                        <GestionUtilisateurs />
                    </div>
                </div>
            </div>
        </div>
    );
}