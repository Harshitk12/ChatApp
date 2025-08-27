export default function UserList({ users, onSelectUser, selectedUserId, style }) {
  return (
    <div
      style={style} // width comes from parent
      className="bg-white shadow-lg overflow-y-auto bg-gradient-to-r from-indigo-50 to-purple-50 relative"
    >
      {/* Search Bar */}
      <div className="p-3 bg-gradient-to-r from-indigo-50 to-purple-50 sticky top-0 z-1">
        <input
          type="text"
          placeholder="Search users..."
          className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
      </div>

      {/* Users List */}
      <ul className="space-y-1 px-2">
        {users.map((user) => (
          <li
            key={user._id}
            onClick={() => onSelectUser(user._id)}
            className={`flex items-center gap-4 p-3 cursor-pointer rounded-lg transition ${
              selectedUserId === user._id
                ? "bg-gradient-to-r from-indigo-100 to-purple-100 shadow-md"
                : "hover:bg-gray-100"
            }`}
          >
            {/* Avatar */}
            <div className="relative">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white flex items-center justify-center font-semibold shadow">
                {user.username.charAt(0).toUpperCase()}
              </div>
            </div>

            {/* Username */}
            <div>
              <p className="font-medium text-gray-800">{user.username}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
