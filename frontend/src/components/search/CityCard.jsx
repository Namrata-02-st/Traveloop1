const CityCard = ({ city }) => {
  return (
    <div className="bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-800">
      <img
        src={city.image}
        alt={city.name}
        className="h-56 w-full object-cover"
      />

      <div className="p-5">
        <h2 className="text-2xl font-bold">
          {city.name}
        </h2>

        <p className="text-zinc-400 mt-1">
          {city.country}
        </p>

        <div className="flex justify-between mt-4">
          <span>
            ₹ {city.budget}
          </span>

          <span>
            ⭐ {city.rating}
          </span>
        </div>
      </div>
    </div>
  );
};

export default CityCard;