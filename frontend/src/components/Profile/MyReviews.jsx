import AddReviewForm from "../AddReviewForm";

const MyReviews = ({ user, loadUser }) => {
  return (
    <section className="space-y-2">
      {/* Bewertungen hinzufügen */}
      <div className="space-y-2 mt-2">
        <h2 className="text-xl font-semibold">Bewertung hinzufügen</h2>
        {/* Formular für Backend*/}
        {/*
        {Array.isArray(user.bookings) &&
          user.bookings.map(
            (booking) =>
              booking.hotelId && (
                <AddReviewForm
                  key={booking._id}
                  hotelId={booking.hotelId._id}
                  onReviewAdded={loadUser} // Aktualisiere die Benutzerdaten nach dem Hinzufügen einer Bewertung
                />
              )
          ) }
              */}
        <AddReviewForm hotelId="dummy-hotel-id" onReviewAdded={() => {}} />
      </div>

      {/*Bewertugsliste*/}
      <h2 className="text-xl font-semibold mt-10">Ihre Bewertungen</h2>

      <div>
        {!user.reviews ? (
          <p>Loading...</p>
        ) : user.reviews.length === 0 ? (
          <p>Noch keine Bewertungen abgegeben.</p>
        ) : (
          <ul className="space-y-4">
            {user.reviews.map((review) => (
              <li
                key={review._id}
                className="border p-4 rounded-md shadow-2xl review-list"
              >
                <p>
                  <strong>Reise:</strong>
                  {review.hotelId?.title || " — "}
                </p>
                <p>
                  <strong>Bewertung:</strong> {"⭐".repeat(review.rating)}
                </p>
                <p>
                  <strong>Kommentar:</strong> {review.text}
                </p>
                <p>
                  <strong>Abgegeben am:</strong>{" "}
                  {new Date(review.createdAt).toLocaleDateString()}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
};

export default MyReviews;
