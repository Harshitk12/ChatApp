export default function UserList({ users, onSelectUser, selectedUserId }) {
  return (
    <div className="bg-white w-64 border-r overflow-y-auto">
      <h2 className="text-lg font-bold mb-4 text-center text-gray-700">Users</h2>
      <ul className="divide-y divide-gray-200">
        {users.map((user) => (
          <li
            key={user._id}
            onClick={() => onSelectUser(user._id)}
            className={`flex items-center gap-4 p-3 cursor-pointer hover:bg-gray-100 transition ${
              selectedUserId === user._id ? "bg-blue-100" : ""
            }`}
          >
            <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold">
              {user.username.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="font-medium text-gray-800">{user.username}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
