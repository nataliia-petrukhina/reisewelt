const FavoriteTrips = () => {
  return (
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
  );
};

export default FavoriteTrips;
