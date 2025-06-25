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

      {/* Personliche Daten */}
      <section className="space-y-2">
        <h2 className="text-xl font-semibold">Personliche Daten</h2>
        <p>
          <strong>Name:</strong> {user.name}
        </p>
        <p>
          <strong>Email:</strong> {user.email}
        </p>
        <p>
          <strong>Registriert am:</strong>{" "}
          {new Date(user.createdAt).toLocaleDateString()}
        </p>
      </section>

      {/* Passwort ändern */}
      <section className="space-y-2">
        <h2 className="text-xl font-semibold">Passwort ändern</h2>
        <ChangePasswordForm />
      </section>

      {/* Merkzettel */}
      <section className="space-y-2">
        <h2 className="text-xl font-semibold">Merkzettel</h2>
        {!user?.favoriteTrips ? (
          <p>Loading...</p>
          ) : user.favoriteTrips.length === 0 ? (
          <p>Keine Reisen auf dem Merkzettel.</p>
        ) : (
          <ul className="space-y-2">
            {user.favoriteTrips.map((trip) => (
              <li key={trip._id} className="flex justify-between items-center">
                <span>
                  {trip.title} - {trip.location}
                </span>
                <button
                  onClick={() => removeFavorite(trip._id)}
                  className="text-red-500 hover:text-red-700"
                >
                  Entfernen
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Buchungen */}
      <section className="space-y-2">
        <h2 className="text-xl font-semibold">Buchungen</h2>
       {!user.bookings ? (
          <p>Loading...</p>
        ) : user.bookings.length === 0 ? (
          <p>Keine Buchungen </p>
        ) : (
          <ul className="space-y-2">
            {user.bookings.map((booking) => (
              <li key={booking._id} className="flex justify-between items-center">
                <p>
                  <strong>Reise:</strong>
                  {booking.tripId?.title || "Unbekannt"}
                </p>
                <p>
                  <strong>Status:</strong> {booking.status}
                </p>
                <p>
                  <strong>Gebucht am:</strong>
                  {new Date(booking.date).toLocaleDateString()}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Bewertungen hinzufügen */}
      <section className="space-y-2">
        <h2 className="text-xl font-semibold">Bewertung hinzufügen</h2>
        {Array.isArray(user.bookings) &&
          user.bookings.map(
            (booking) =>
              booking.tripId && (
                <AddReviewForm
                  key={booking._id}
                  tripId={booking.tripId._id}
                  onReviewAdded={loadUser} // Aktualisiere die Benutzerdaten nach dem Hinzufügen einer Bewertung
                />
              )
          )}
      </section>

      {/*Bewertungen anzeigen */}
      <section>
        <h2 className="text-xl font-semibold">Bewertungen</h2>
        {!user.reviews ? (
          <p>Loading...</p>
        ) : user.reviews.length === 0 ? (
          <p>Noch keine Bewertungen abgegeben.</p>
        ) : (
          <ul className="space-y-2">
            {user.reviews.map((review) => (
              <li key={review._id} className="border p-4">
                <p>
                  <strong>Reise:</strong>
                  {review.tripId?.title || "Unbekannt"}
                </p>
                <p>
                  <strong>Bewertung:</strong> {review.rating} ⭐
                </p>
                <p>
                  <strong>Kommentar:</strong> {review.comment}
                </p>
                <p>
                  <strong>Abgegeben am:</strong>
                  {new Date(review.createdAt).toLocaleDateString()}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
};

export default ProfilePage;
