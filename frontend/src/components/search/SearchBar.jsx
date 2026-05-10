import { useState } from "react";
import { cities } from "../../data/cities";

const SearchBar = () => {
  const [query, setQuery] = useState("");

  const filteredCities = cities.filter((city) =>
    city.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="max-w-xl mx-auto mt-10">
      <input
        type="text"
        placeholder="Search city..."
        className="w-full p-4 border rounded-xl"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      <div className="mt-4 space-y-3">
        {filteredCities.map((city) => (
          <div
            key={city.id}
            className="p-4 border rounded-xl"
          >
            <h2 className="text-xl font-bold">
              {city.name}
            </h2>

            <p>{city.country}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchBar;