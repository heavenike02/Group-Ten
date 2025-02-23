"use client";
import { useEffect, useState } from "react";

const CardsPage = () => {
  const [cards, setCards] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCards = async () => {
      try {
        const response = await fetch("/api/cards");
        if (!response.ok) {
          throw new Error("Go and apply for a card!");
        }
        const data = await response.json();
        setCards(data.cards);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCards();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 text-2xl mt-10">{error}</div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">
        Your Cards
      </h1>
      {cards.length === 0 ? (
        <p className="text-center text-gray-600 text-xl">No cards found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map((card) => (
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-semibold text-gray-800">
                    Card {card.id}
                  </h2>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      card.status === "active"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {card.status}
                  </span>
                </div>
                <div className="space-y-2">
                  <p className="text-gray-600">
                    <span className="font-medium">Currency:</span>{" "}
                    {card.currency.toUpperCase()}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-medium">Type:</span> {card.type}
                  </p>
                </div>
              </div>
              <div className="bg-gray-50 px-6 py-4">
                <button className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-300">
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CardsPage;
