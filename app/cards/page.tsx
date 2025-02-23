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
          throw new Error("Failed to fetch cards");
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
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1>Your Cards</h1>
      {cards.length === 0 ? (
        <p>No cards found.</p>
      ) : (
        <ul>
          {cards.map((card) => (
            <li key={card.id}>
              <h2>Card ID: {card.id}</h2>
              <p>Status: {card.status}</p>
              <p>Currency: {card.currency}</p>
              <p>Type: {card.type}</p>
              {/* Add more card details as needed */}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CardsPage;
