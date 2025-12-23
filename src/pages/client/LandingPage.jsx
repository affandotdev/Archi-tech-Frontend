import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import FollowService from "../../features/follow/api/follow.api";
import Navbar from "../../widgets/Navbar/Navbar";

export default function LandingPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [architect, setArchitects] = useState([]);
  const [engineer, setEngineers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProfessionals = async () => {
    try {
      const res = await axios.get("http://localhost:8001/api/landing/");
      setArchitects(res.data.architects);
      setEngineers(res.data.engineers);
    } catch (error) {
      console.error("Error fetching landing data", error);
      // alert("Unable to load professionals"); // Silenced for UX
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfessionals();
  }, []);

  if (loading)
    return (
      <div className="min-h-screen flex justify-center items-center text-xl font-semibold bg-slate-50 text-slate-600">
        Loading professionals...
      </div>
    );

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">

      {/* Navigation Bar */}
      {user ? (
        <Navbar user={user} title="ArchiTech Marketplace" />
      ) : (
        <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex-shrink-0 flex items-center gap-2 cursor-pointer" onClick={() => window.location.reload()}>
                <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
                  <span className="text-white font-bold text-lg">A</span>
                </div>
                <span className="font-bold text-xl tracking-tight text-slate-900">ArchiTech</span>
              </div>

              <div className="hidden md:flex items-center space-x-8">
                <a href="#talent" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">Find Talent</a>
                <a href="#" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">How it Works</a>
                <a href="#" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">Projects</a>
              </div>

              <div className="flex items-center gap-4">
                <Link
                  to="/login"
                  className="text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors"
                >
                  Log in
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors shadow-sm shadow-indigo-500/30"
                >
                  Sign up
                </Link>
              </div>
            </div>
          </div>
        </nav>
      )}

      {/* Hero Section - Only show if not logged in or if user explicitly wants to see landing? 
          Actually user wants landing accessible after login. So we keep it. */}
      <section className="relative overflow-hidden pt-20 pb-32 lg:pt-32">
        <div className="absolute top-0 left-0 w-full h-full bg-white bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-block py-1 px-3 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-xs font-semibold tracking-wide uppercase mb-6">
            The #1 Platform for Construction Professionals
          </span>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 mb-6">
            Build your vision with <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">
              World-Class Experts
            </span>
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-slate-600 mb-10">
            Connect with top-tier Architects and Engineers to bring your dream project to life. Verified professionals, seamless collaboration.
          </p>
          {!user && (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="px-8 py-4 text-base font-semibold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/40 transform hover:-translate-y-1"
              >
                Get Started Now
              </Link>
              <a
                href="#talent"
                className="px-8 py-4 text-base font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all hover:border-slate-300"
              >
                View Professionals
              </a>
            </div>
          )}
        </div>
      </section>

      {/* Main Content */}
      <div id="talent" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {/* Architects Section */}
        <Section title="Featured Architects" description="Visionaries who design the framework of your future." data={architect} user={user} />

        <div className="border-t border-slate-200 my-16"></div>

        {/* Engineers Section */}
        <Section title="Expert Engineers" description="Technical masters ensuring structural integrity and innovation." data={engineer} user={user} />
      </div>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p>&copy; {new Date().getFullYear()} ArchiTech. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

function Section({ title, description, data, user }) {
  return (
    <section className="scroll-mt-24">
      <div className="mb-10">
        <h2 className="text-3xl font-bold text-slate-900">{title}</h2>
        <p className="text-slate-500 mt-2 text-lg">{description}</p>
      </div>

      {data.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-slate-300">
          <p className="text-slate-400">No {title.toLowerCase()} currently available.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {data.map((person) => (
            <ProfessionalCard key={person.id} person={person} user={user} />
          ))}
        </div>
      )}
    </section>
  );
}

function ProfessionalCard({ person, user }) {
  const defaultAvatar = "https://cdn-icons-png.flaticon.com/512/149/149071.png";
  const navigate = useNavigate();
  const [requestStatus, setRequestStatus] = useState("connect"); // connect, pending, connected
  const [loading, setLoading] = useState(false);

  // Note: Determining initial status (Pending/Connected) would require fetching connection status for all users,
  // which implies an N+1 problem or a bulk fetch. For now, we default to "Connect" and handle the response content.

  const handleConnect = async () => {
    if (!user) {
      navigate("/login");
      return;
    }
    if (user.role !== 'client') {
      alert("Only Clients can send connection requests.");
      return;
    }

    setLoading(true);
    try {
      const response = await FollowService.sendConnectionRequest(person.id);
      if (response.status === 'pending' || response.status === 'approved') {
        setRequestStatus(response.status);
        alert(`Request ${response.status === 'pending' ? 'sent' : 'approved'}!`);
      } else if (response.detail === 'request already exists') {
        setRequestStatus(response.status || 'pending');
        alert(`Request is already ${response.status || 'pending'}.`);
      }
    } catch (error) {
      console.error("Connection failed", error);
      if (error.response?.data?.detail) {
        alert(error.response.data.detail);
      } else {
        alert("Failed to send request.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="group bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-xl hover:border-indigo-100 transition-all duration-300 cursor-pointer flex flex-col h-full">
      <div className="relative mb-4 flex-shrink-0">
        <div className="w-20 h-20 mx-auto rounded-full p-1 bg-gradient-to-tr from-indigo-500 to-violet-500">
          <img
            src={person.avatar_url || defaultAvatar}
            alt="avatar"
            className="w-full h-full rounded-full object-cover border-2 border-white bg-white"
          />
        </div>
        {/* Verification Badge/Active Badge */}
        <div className="absolute bottom-0 right-1/2 translate-x-8 translate-y-1">
          <span className="flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 border-2 border-white"></span>
          </span>
        </div>
      </div>

      <h3 className="text-lg font-bold text-center text-slate-900 group-hover:text-indigo-600 transition-colors">
        {person.full_name || "Unnamed User"}
      </h3>

      <p className="text-slate-500 text-center text-sm mb-4 flex items-center justify-center gap-1">
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
        {person.location || "Location N/A"}
      </p>

      <div className="bg-slate-50 rounded-xl p-3 mb-4 flex-grow">
        <p className="text-slate-600 text-center text-xs leading-relaxed line-clamp-3 italic">
          "{person.bio || "No bio available."}"
        </p>
      </div>

      {user && user.role === 'client' ? (
        <button
          className={`w-full py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${requestStatus === 'pending' ? 'bg-amber-100 text-amber-700 cursor-default' :
              requestStatus === 'approved' ? 'bg-emerald-100 text-emerald-700 cursor-default' :
                'bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm shadow-indigo-500/30'
            }`}
          onClick={handleConnect}
          disabled={loading || requestStatus !== 'connect'}
        >
          {loading ? 'Sending...' :
            requestStatus === 'pending' ? 'Request Sent' :
              requestStatus === 'approved' ? 'Connected' :
                'Connect'}
        </button>
      ) : (
        <button
          className="w-full py-2.5 rounded-lg text-sm font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-600 hover:text-white transition-all duration-200"
          onClick={() => !user ? navigate('/login') : alert("Please log in as a Client to connect.")}
        >
          {!user ? "Login to Connect" : "View Profile"}
        </button>
      )}

      {/* Portfolio Link (Optional) */}
      <div className="mt-2 text-center">
        <Link to={`/portfolio/list/${person.id}`} className="text-xs text-slate-400 hover:text-indigo-500 hover:underline">
          View Portfolio
        </Link>
      </div>

    </div>
  );
}
