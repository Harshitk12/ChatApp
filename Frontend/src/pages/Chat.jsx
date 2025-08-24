import { useEffect, useState, useRef } from "react";
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

  const endRef = useRef(null); // for scrolling

  const fetchedMessage = (m) => ({
    sender: m.sender,
    receiver: m.receiver,
    content: m.content,
    createdAt: m.createdAt,
  });

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" }); //for scrolling
  }, [messages]);

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
        const normalized = data.map(fetchedMessage);
        setMessages((prev) => ({ ...prev, [receiverId]: normalized }));
      })
      .catch((err) => console.error("history fetch error:", err));
  }, [receiverId]);

  useEffect(() => {
    const handler = (data) => {
      const incoming = {
        sender: data.from,
        receiver: user?._id,
        content: data.content,
        createdAt: data.timestamp,
      };

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

  const receiver = users.find((u) => u._id === receiverId);


  return (
    <div className="flex h-screen bg-gradient-to-r from-indigo-50 via-white to-purple-50">
      <UserList
        users={users.filter((u) => u._id !== user?._id)}
        onSelectUser={(id) => setReceiverId(id)}
        selectedUserId={receiverId}
      />

      <div className="flex flex-col flex-1">

        {/* Empty state */}
        {!receiverId ? (
          <div className="flex-1 grid place-items-center text-gray-500 text-lg">
            👋 Select a user to start chatting
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="flex items-center gap-3 
     bg-gradient-to-r from-sky-500/50 via-cyan-500/50 to-teal-500/50
     backdrop-blur-lg text-white p-2 px-4 font-semibold shadow-md 
     sticky top-0 z-10">

              <div className="w-12 h-12 rounded-full 
       bg-gradient-to-r from-indigo-500 to-purple-500 
       text-white flex items-center justify-center font-semibold shadow">
                {receiver.name.charAt(0).toUpperCase()}
              </div>

              {receiver.name}
            </div>
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
              {(messages[receiverId] || []).map((msg, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-2xl max-w-xs sm:max-w-md shadow-md ${msg.sender === user?._id
                    ? "bg-gradient-to-r from-sky-400 to-cyan-400 text-white ml-auto"
                    : "bg-white text-gray-800 border border-gray-200"
                    }`}
                >
                  <div className="text-xs opacity-70 mb-1">
                    {msg.sender === user?._id ? "You" : getUsername(msg.sender)}
                  </div>
                  <p className="break-words">{msg.content}</p>
                </div>
              ))}
              <div ref={endRef} />
            </div>

            {/* Input */}
            <form
              onSubmit={sendMessage}
              className="p-3 flex gap-3 shadow-lg"
            >
              <input
                type="text"
                placeholder={`Message ${getUsername(receiverId)}...`}
                className="flex-1 bg-sky-50 border border-gray-300 p-3 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              <button
                type="submit"
                className="bg-gradient-to-r from-sky-500 via-cyan-500 to-teal-500 text-white px-6 py-2 rounded-full font-medium shadow hover:opacity-90 transition"
              >
                Send
              </button>
            </form>
          </>
        )}
      </div>
    </div>


  );
}