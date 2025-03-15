"use client";
import React, { useEffect, useState } from "react";
import MenuClient from "./component/menu/MenuClient";
import API_ROUTES from "./configAPIRoute";
import imagePizza from "../../public/image/pizza.jpg";
import MenuPizza from "@/app/component/menu/MenuPizza";

export default function Home() {
    return (
        <div className="relative min-h-screen">
            {/* Section du fond */}
            <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${imagePizza.src})` }}
            />

            {/* Menu Client (avec MenuPizza lié) */}
            <div className="relative z-10">
                <MenuClient />
            </div>

            {/* Conteneur pour "Bienvenue chez Papa Louis!" */}
            <div className="flex items-center justify-center h-screen">
                <h1 className="text-4xl md:text-6xl font-bold text-white text-center">
                    Bienvenue chez Papa Louis!
                </h1>
            </div>
        </div>
    );
}

