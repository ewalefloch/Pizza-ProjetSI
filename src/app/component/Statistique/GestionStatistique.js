import API_ROUTES from "@/app/configAPIRoute";
import React, { useEffect, useState } from "react";
import RenderPieChart from "./RenderPieChart";

// Couleurs pour les graphiques
const COLORS = [
  "#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF", "#FF9F40",
  "#FFCD56", "#C9CBCF", "#E7E9ED", "#71B37C", "#D72638", "#3F88C5"
];

const GestionStatistique = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch(API_ROUTES.STATISTIQUE, { credentials: "include" });
        const data = await response.json();
        if (data.success) {
          setStats(data.data);
        } else {
          console.error("Erreur lors de la récupération des statistiques:", data.message);
        }
      } catch (error) {
        console.error("Erreur réseau:", error);
      }
    };

    fetchStats();
  }, []);

  if (!stats) {
    return <p className="text-center text-gray-500">Chargement des statistiques...</p>;
  }

  // Transformer les données en format utilisable pour les graphiques
  const formatData = (data) =>
    Object.entries(data).map(([name, value], index) => ({
      name,
      value,
      color: COLORS[index % COLORS.length],
    }));

  const pizzasData = formatData(stats.pizzas);
  const ingredientsData = formatData(stats.ingredients);
  const utilisateursData = formatData(stats.utilisateurs);

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-bold text-center mb-6">Statistiques</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <RenderPieChart title="Pizzas commandées" data={pizzasData} />
        <RenderPieChart title="Ingrédients utilisés" data={ingredientsData} />
        <RenderPieChart title="Commandes par utilisateur" data={utilisateursData} />
      </div>
    </div>
  );
};

export default GestionStatistique;
