import { Link } from "react-router-dom";

const DashboardPage = () => {
  return (
    <div className="p-10">
      <h1 className="text-6xl font-bold">
        Traveloop
      </h1>

      <p className="text-zinc-400 mt-4 text-xl">
        Personalized Travel Planning
      </p>

      <div className="flex gap-4 mt-10">
        <Link
          to="/explore"
          className="bg-white text-black px-6 py-3 rounded-xl font-semibold"
        >
          Explore Cities
        </Link>

        <Link
          to="/budget"
          className="bg-blue-500 px-6 py-3 rounded-xl font-semibold"
        >
          Budget Planner
        </Link>
      </div>
    </div>
  );
};

export default DashboardPage;