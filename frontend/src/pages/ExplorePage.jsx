import { useState } from "react";

import SearchBar from "../components/search/SearchBar";
import CityCard from "../components/search/CityCard";

import { cities } from "../data/cities";

const ExplorePage = () => {
  const [query, setQuery] = useState("");

  const filteredCities = cities.filter((city) =>
    city.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="p-10">
      <h1 className="text-5xl font-bold">
        Explore Cities
      </h1>

      <div className="mt-8">
        <SearchBar
          query={query}
          setQuery={setQuery}
        />
      </div>

      <div className="grid md:grid-cols-3 gap-6 mt-10">
        {filteredCities.map((city) => (
          <CityCard
            key={city.id}
            city={city}
          />
        ))}
      </div>
    </div>
  );
};

export default ExplorePage;