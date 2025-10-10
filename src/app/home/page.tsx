import React from "react";
import {
  Heart,
  MessageCircle,
  Search,
  Clapperboard,
} from "lucide-react";
import Avatar from "../components/Avatar";
import Post from "../components/Post";

function Header() {
  return (
    <header className="w-full border-b border-gray-200 bg-white sticky top-0">
      <div className="mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="text-2xl font-bold">InstaClone</div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center border rounded-lg px-3 py-1 gap-2 text-sm text-gray-500">
            <Search size={16} />
            <input
              className="bg-transparent outline-none w-36 sm:w-64"
              placeholder="Search"
            />
          </div>

          <button className="p-2 rounded-md hover:bg-gray-100">
            <Heart size={18} />
          </button>
          <button className="p-2 rounded-md hover:bg-gray-100">
            <MessageCircle size={18} />
          </button>
        </div>
      </div>
    </header>
  );
}
function Story({ name }: any) {
  return (
    <div className="flex flex-col items-center w-20">
      <div className="w-14 h-14 rounded-full ring-2 ring-pink-500 overflow-hidden">
        <img
          src={`https://picsum.photos/seed/${name}/80`}
          alt={name}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="text-xs mt-1 truncate w-full text-center">{name}</div>
    </div>
  );
}

export default async function Home() {
  const stories = [
    "you",
    "alice",
    "bob",
    "charlie",
    "david",
    "eva",
    "frank",
    "gina",
  ];
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <Header />
      <main className="mx-auto px-3 mt-2 grid grid-cols-1 md:grid-cols-3 gap-6">
        <aside className="hidden md:block w-72 border-r border-gray-300">
          <nav className="sticky space-y-3">
            <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-white">
              <Clapperboard size={22} />
              <span>Home</span>
            </div>
            <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-white">
              <Clapperboard size={22} />
              <span>Explore</span>
            </div>
            <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-white">
              <span>Reels</span>
            </div>
            <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-white">
              <Clapperboard size={22} />
              <span>Profile</span>
            </div>
          </nav>
        </aside>

        {/* CENTER FEED */}
        <section className="md:col-span-1">
          <div className="bg-white rounded-md p-3 mb-4">
            <div className="flex gap-3 overflow-x-auto">
              {stories.map((s) => (
                <Story key={s} name={s} />
              ))}
            </div>
          </div>

          <div className="space-y-6">
              <Post/>
          </div>
        </section>

        {/* RIGHT SUGGESTIONS */}
        <aside className="hidden lg:block">
          <div className="sticky top-24 space-y-6">
            <Avatar />
            <div className="bg-white p-3 rounded-md">
              <div className="flex items-center justify-between mb-3">
                <div className="text-sm text-gray-500">Suggested for you</div>
                <button className="text-xs text-blue-500">See All</button>
              </div>
              <ul className="space-y-3">
                {["anna", "brian", "carl"].map((s) => (
                  <li key={s} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img
                        src={`https://picsum.photos/seed/${s}/40`}
                        className="w-9 h-9 rounded-full"
                        alt={s}
                      />
                      <div>
                        <div className="text-sm font-medium">{s}</div>
                        <div className="text-xs text-gray-500">Suggested</div>
                      </div>
                    </div>
                    <button className="text-sm text-blue-500">Follow</button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="text-xs text-gray-400">
              © Your App • About • Help
            </div>
          </div>
        </aside>
      </main>

      <footer className="mt-10 text-center text-xs text-gray-400 pb-8">
        Built with Tailwind + Framer Motion
      </footer>
    </div>
  );
}
