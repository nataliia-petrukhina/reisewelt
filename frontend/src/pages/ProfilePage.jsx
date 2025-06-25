import { useEffect, useState } from "react";
import axios from "axios";
import ChangePasswordForm from "../components/ChangePasswordForm";
import AddReviewForm from "../components/AddReviewForm";

const ProfilePage = () => {
  const [user, setUser] = useState(null);

  //Laden der Benutzerdaten beim Laden der Komponente
  const loadUser = async () => {
    try {
      const res = await axios.get("/api/user/profile", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setUser(res.data);
    } catch (error) {
      console.error("Error loading user data:", error);
    }
  };

  // Abfrage der Benutzerdaten beim Laden der Seite
  useEffect(() => {
    loadUser();
  }, []);

  // Eine Reise aus den Merkzettel entfernen
  const removeFavorite = async (tripId) => {
    try {
      await axios.delete(`/api/user/favoriteTrips/${tripId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      loadUser(); // Aktualisiere die Benutzerdaten nach dem Entfernen
    } catch (error) {
      console.error("Error removing favorite trip:", error);
    }
  };

  if (!user) return <div>Loading...</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-10">
      <h1 className="text-2xl font-bold">Benutzerkonto</h1>

      {/* Personliche Daten - PersonalDaten.jsx */}
      

      {/* Passwort ändern */}
      <section className="space-y-2">
        <h2 className="text-xl font-semibold">Passwort ändern</h2>
        <ChangePasswordForm />
      </section>

      {/* Merkzettel - FavoriteTrips.jsx */}
      

      {/* Buchungen - MyBookings.jsx */}
      

      {/* Bewertungen anzeigen & Bewertungen hinzufügen */}
      
      
    </div>
  );
};

export default ProfilePage;
