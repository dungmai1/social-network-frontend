"use client"
import useUser from "@/hooks/useUser";

export default function Avatar() {
  const { user, handleLogout } = useUser();

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
      <div className="flex items-center gap-3">
        <div className="w-14 h-14 rounded-full overflow-hidden border border-gray-200">
          <img
            className="w-full h-full object-cover"
            src={user?.avatar}
            alt={user?.username || "User"}
          />
        </div>
        <div className="flex-1">
          <div className="font-semibold text-gray-900 text-sm">{user?.username}</div>
          <div className="text-xs text-gray-500">{user?.displayname}</div>
        </div>
        <button onClick={handleLogout} className="text-xs text-blue-600 hover:text-blue-800 font-medium">
          Log out
        </button>
      </div>
    </div>
  );
}
