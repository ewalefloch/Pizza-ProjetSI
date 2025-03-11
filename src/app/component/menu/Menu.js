'use client';
import React, { useState } from "react";
import Button from "../global/Bouton";
import Connexion from "../connexion/Connexion";

const Menu = () => {
  const [showModal, setShowModal] = useState(false);

  const handleShowModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };
  return (
    <div
      className="absolute top-0 left-0 w-full flex justify-between items-center p-6"
      style={{ backgroundColor: "rgba(255, 87, 34, 0.9)" }}
    >
      <h1 className="text-2xl text-white font-bold">Papa Louis</h1>
      <div className="space-x-4">
        <Button
          text="Se connecter"
          color="border-1 border-white bg-orange-900 hover:bg-orange-800 hover:border-3 text-white"
          onClick={handleShowModal}
        />
      </div>
      {showModal && <Connexion onClose={handleCloseModal} />}
    </div>
  );
};

export default Menu;
