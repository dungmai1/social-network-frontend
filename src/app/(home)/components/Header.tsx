import { Heart, MessageCircle, Search } from "lucide-react";
import Link from "next/link";

export default function Header() {
    return (
        <header className="w-full border-b border-gray-200 bg-white sticky top-0 z-20">
            <div className="mx-auto px-6 py-3 flex items-center justify-between max-w-6xl">
                <div className="flex items-center gap-4">
                    <Link href="/">
                        <div className="text-2xl font-bold text-gray-900 select-none">
                            Instagram
                        </div>
                    </Link>
                </div>
                <div className="flex items-center gap-5">
                    <div className="hidden sm:flex items-center border border-gray-300 rounded-lg px-3 py-2 gap-2 text-sm bg-gray-50">
                        <Search size={18} className="text-gray-500" />
                        <input
                            className="bg-transparent outline-none w-36 sm:w-64 text-gray-700 placeholder-gray-500 text-sm"
                            placeholder="Search"
                        />
                    </div>
                    <button className="p-2 rounded-lg hover:bg-gray-100 transition">
                        <Heart size={20} className="text-gray-700" />
                    </button>
                    <button className="p-2 rounded-lg hover:bg-gray-100 transition">
                        <MessageCircle size={20} className="text-gray-700" />
                    </button>
                </div>
            </div>
        </header>
    );
}