import React, { useEffect, useState } from "react";
import axios from "axios";

export default function LandingPage() {
  const [architects, setArchitects] = useState([]);
  const [engineers, setEngineers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProfessionals = async () => {
    try {
      const res = await axios.get("http://localhost:8001/api/landing/");
      setArchitects(res.data.architects);
      setEngineers(res.data.engineers);
    } catch (error) {
      console.error("Error fetching landing data", error);
      alert("Unable to load professionals");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfessionals();
  }, []);

  if (loading)
    return (
      <div className="min-h-screen flex justify-center items-center text-xl font-semibold">
        Loading professionals...
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 pb-16">

      {/* Hero Section */}
      <section className="bg-blue-600 text-white text-center py-20">
        <h1 className="text-5xl font-extrabold mb-4">Find Your Dream Team</h1>
        <p className="text-lg opacity-90">
          Architects & Engineers ready to build your future
        </p>
      </section>

      {/* Architects Section */}
      <Section title="Architects" data={architects} />

      {/* Engineers Section */}
      <Section title="Engineers" data={engineers} />

    </div>
  );
}

function Section({ title, data }) {
  return (
    <section className="px-6 mt-14">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">{title}</h2>

      {data.length === 0 ? (
        <p className="text-gray-500">No {title.toLowerCase()} available.</p>
      ) : (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {data.map((person) => (
            <ProfessionalCard key={person.id} person={person} />
          ))}
        </div>
      )}
    </section>
  );
}

function ProfessionalCard({ person }) {
  const defaultAvatar = "https://cdn-icons-png.flaticon.com/512/149/149071.png";

  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition p-5">
      <img
        src={person.avatar_url || defaultAvatar}
        alt="avatar"
        className="w-24 h-24 rounded-full mx-auto object-cover"
      />

      <h3 className="text-xl font-bold text-center mt-3">
        {person.full_name || "Unnamed User"}
      </h3>

      <p className="text-gray-500 text-center text-sm">{person.location}</p>

      <p className="text-gray-600 text-center text-sm mt-2 line-clamp-2">
        {person.bio}
      </p>

      <button
        className="w-full bg-blue-700 hover:bg-blue-800 text-white py-2 rounded-lg mt-4"
        onClick={() => alert("Follow feature coming soon")}
      >
        View Profile
      </button>
    </div>
  );
}
