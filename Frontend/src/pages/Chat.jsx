import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import UserList from "../components/UserList";

const socket = io("http://localhost:5000", {
  withCredentials: true,
  auth: { token: null },
  autoConnect: false,
});

export default function Chat() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [receiverId, setReceiverId] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState({});

  const normalize = (m) => ({
    sender: m.sender || m.from,
    receiver: m.receiver || m.to,
    content: m.content || m.message || m.text,
    createdAt: m.createdAt || m.timestamp || m.time || new Date().toISOString(),
  });

  useEffect(() => {
    fetch("http://localhost:5000/api/auth/me", { credentials: "include" })
      .then((res) => {
        if (!res.ok) throw new Error("Unauthorized");
        return res.json();
      })
      .then((data) => {
        setUser(data);
        if (data.token) socket.auth.token = data.token;

        socket.on("connect_error", (err) => 
          console.error("socket connect_error:", err.message)
        );
        socket.on("connect", () => 
          console.log("socket connected", socket.id)
        );

        socket.connect();
      })
      .catch(() => navigate("/"));
  }, []);

  useEffect(() => {
    fetch("http://localhost:5000/api/users", { credentials: "include" })
      .then((res) => res.json())
      .then(setUsers)
      .catch((err) => console.error("Error fetching users:", err));
  }, []);

  useEffect(() => {
    if (!receiverId) return;

    fetch(`http://localhost:5000/api/messages/${receiverId}`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        const normalized = data.map(normalize);
        setMessages((prev) => ({ ...prev, [receiverId]: normalized }));
      })
      .catch((err) => console.error("history fetch error:", err));
  }, [receiverId]);

  useEffect(() => {
    const handler = (data) => {
      const incoming = normalize({
        from: data.from,
        to: user?._id,
        content: data.content,
        timestamp: data.timestamp,
      });

      const otherUserId = data.from;

      setMessages((prev) => {
        const arr = prev[otherUserId] ? [...prev[otherUserId], incoming] : [incoming];
        return { ...prev, [otherUserId]: arr };
      });
    };

    socket.on("receiveMessage", handler);
    return () => socket.off("receiveMessage", handler);
  }, [user?._id]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim() || !receiverId || !user?._id) return;

    const newMsg = {
      sender: user._id,
      receiver: receiverId,
      content: message,
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => {
      const arr = prev[receiverId] ? [...prev[receiverId], newMsg] : [newMsg];
      return { ...prev, [receiverId]: arr };
    });

    setMessage("");

    socket.emit("sendMessage", { to: receiverId, content: message });

    try {
      await fetch("http://localhost:5000/api/messages", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ receiverId, content: message }),
      });
    } catch (e) {
      console.error("persist error:", e);
    }
  };

  const getUsername = (id) => users.find((u) => u._id === id)?.username || id;

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex h-screen">
      <UserList
        users={users.filter((u) => u._id !== user?._id)}
        onSelectUser={(id) => setReceiverId(id)}
        selectedUserId={receiverId}
      />

      <div className="flex flex-col bg-gray-100 flex-1">
        <div className="bg-blue-600 text-white p-4 font-bold">
          Welcome, {user?.username}
        </div>

        {!receiverId ? (
          <div className="flex-1 grid place-items-center text-gray-500">
            Select a user to start chatting
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {(messages[receiverId] || []).map((msg, index) => (
                <div
                  key={index}
                  className={`p-2 rounded max-w-sm ${
                    msg.sender === user?._id
                      ? "bg-blue-500 text-white self-end ml-auto"
                      : "bg-gray-200 text-black"
                  }`}
                >
                  <div className="text-xs opacity-70 mb-1">
                    {msg.sender === user?._id ? "You" : getUsername(msg.sender)}
                  </div>
                  {msg.content}
                </div>
              ))}
            </div>

            <form onSubmit={sendMessage} className="p-2 flex gap-2 bg-white shadow">
              <input
                type="text"
                placeholder={`Message ${getUsername(receiverId)}...`}
                className="flex-1 border p-2 rounded"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              <button type="submit" className="bg-blue-600 text-white px-4 rounded">
                Send
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}