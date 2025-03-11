'use client'

import React, { useState } from "react";

const CreerCompte = () => {
  const [nom, setNom] = useState("");
  const [mdp, setMdp] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    //TODO Ajoute ici la logique pour créer un compte
    console.log("Creating account with:", email, password);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        placeholder="Pseudo"
        value={nom}
        onChange={(e) => setNom(e.target.value)}
        className="w-full p-2 border border-gray-300"
      />
      <input
        type="password"
        placeholder="Mot de passe"
        value={mdp}
        onChange={(e) => setMdp(e.target.value)}
        className="w-full p-2 border border-gray-300"
      />
      <button type="submit" className="w-full bg-orange-600 text-white p-2">
        Créer un compte
      </button>
    </form>
  );
};

export default CreerCompte;
