import { useEffect, useState } from "react";
import { getItem } from "@/lib/storage";

// Defines the shape of a Club object to ensure type safety in TypeScript.
interface Club {
  _id: string;
  clubName: string;
  clubLogo?: string;
}

// These are static, placeholder stats. They are not dynamic and need to be replaced.
const defaultStats = {
  played: 0,
  won: 0,
  drawn: 0,
  lost: 0,
  points: 0,
};

const LeagueTable = () => {
  // useState hook to store the list of clubs.
  // 'clubs' is the state variable, and 'setClubs' is the function to update it.
  const [clubs, setClubs] = useState<Club[]>([]);

  // useState hook to store the ID of the currently logged-in club.
  // 'currentClubId' is the state variable, and 'setCurrentClubId' updates it.
  const [currentClubId, setCurrentClubId] = useState<string | null>(null);

  // useEffect hook to perform side effects, in this case, fetching data.
  // The empty dependency array '[]' ensures this runs only once when the component loads.
  useEffect(() => {
    // Fetches all clubs from the backend API.
    // This is the correct way to get data, but the endpoint should provide stats.
    fetch("/api/clubs")
      .then((res) => res.json())
      .then((data) => setClubs(data))
      .catch(() => setClubs([])); // Handles potential errors by setting an empty array.

    // Tries to get the current club's data from the browser's local storage.
    try {
      // Parses the JSON string from storage to get the club's ID.
      const clubData = JSON.parse(getItem("clubData") as string || "null");
      setCurrentClubId(clubData?.id || null); // Sets the state with the ID.
    } catch {
      // If parsing fails, it sets the ID to null.
      setCurrentClubId(null);
    }
  }, []); // The empty dependency array means this effect runs only on mount.

  // The component's JSX (UI) is returned here.
  return (
    <div className="bg-card rounded-xl shadow p-4 mb-8">
      <h2 className="text-xl font-bold mb-4">League Table</h2>
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-muted">
            <th className="py-2 px-2">#</th>
            <th className="py-2 px-2">Club</th>
            <th className="py-2 px-2">Played</th>
            <th className="py-2 px-2">Won</th>
            <th className="py-2 px-2">Drawn</th>
            <th className="py-2 px-2">Lost</th>
            <th className="py-2 px-2">Points</th>
          </tr>
        </thead>
        <tbody>
          {/* Maps over the 'clubs' array to create a table row for each club. */}
          {clubs.map((club, idx) => (
            <tr
              key={club._id} // Provides a unique key for each list item, which React requires.
              // Dynamically applies a highlight class if the club's ID matches the current user's club ID.
              className={
                club._id === currentClubId
                  ? "bg-blue-100 dark:bg-blue-900 font-bold"
                  : ""
              }
            >
              <td className="py-2 px-2">{idx + 1}</td>
              <td className="py-2 px-2 flex items-center gap-2">
                {/* Conditionally renders the club logo if it exists. */}
                {club.clubLogo && (
                  <img
                    src={club.clubLogo}
                    alt={club.clubName}
                    className="w-6 h-6 rounded-full object-cover"
                  />
                )}
                {club.clubName}
              </td>
              {/* These table cells are currently populated with static defaultStats. */}
              {/* To make the table dynamic, these should be replaced with data from the API. */}
              <td className="py-2 px-2">{defaultStats.played}</td>
              <td className="py-2 px-2">{defaultStats.won}</td>
              <td className="py-2 px-2">{defaultStats.drawn}</td>
              <td className="py-2 px-2">{defaultStats.lost}</td>
              <td className="py-2 px-2">{defaultStats.points}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LeagueTable;