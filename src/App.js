import { useState } from "react";

function App() {
  const [messages, setMessages] = useState([]);
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);

  const askAI = async () => {
    if (!question.trim()) return;

    // Add user message
    const newMessages = [...messages, { role: "user", content: question }];
    setMessages(newMessages);
    setQuestion("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/ask-ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });
      const data = await res.json();

      // Add AI reply
      setMessages([...newMessages, { role: "assistant", content: data.answer }]);
    } catch (error) {
      setMessages([...newMessages, { role: "assistant", content: "❌ Error connecting to AI server" }]);
    }
    setLoading(false);
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>🤖 Smart Assistant</h1>

      <div style={styles.chatBox}>
        {messages.map((msg, i) => (
          <div
            key={i}
            style={{
              ...styles.message,
              ...(msg.role === "user" ? styles.userMessage : styles.aiMessage),
            }}
          >
            {msg.content}
          </div>
        ))}
        {loading && <div style={styles.aiMessage}>⏳ Thinking...</div>}
      </div>

      <div style={styles.inputBox}>
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && askAI()}
          placeholder="Type your question..."
          style={styles.input}
        />
        <button onClick={askAI} style={styles.button}>
          Send
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "600px",
    margin: "40px auto",
    fontFamily: "Arial, sans-serif",
    display: "flex",
    flexDirection: "column",
    height: "90vh",
  },
  header: {
    textAlign: "center",
    marginBottom: "10px",
  },
  chatBox: {
    flex: 1,
    border: "1px solid #ddd",
    borderRadius: "10px",
    padding: "10px",
    overflowY: "auto",
    background: "#f9f9f9",
  },
  message: {
    padding: "10px 15px",
    borderRadius: "15px",
    marginBottom: "10px",
    maxWidth: "70%",
    wordWrap: "break-word",
  },
  userMessage: {
    background: "#0078FF",
    color: "white",
    alignSelf: "flex-end",
    marginLeft: "auto",
  },
  aiMessage: {
    background: "#E4E6EB",
    color: "black",
    alignSelf: "flex-start",
    marginRight: "auto",
  },
  inputBox: {
    display: "flex",
    marginTop: "10px",
  },
  input: {
    flex: 1,
    padding: "10px",
    borderRadius: "20px",
    border: "1px solid #ddd",
    marginRight: "10px",
  },
  button: {
    background: "#0078FF",
    color: "white",
    border: "none",
    borderRadius: "20px",
    padding: "10px 20px",
    cursor: "pointer",
  },
};

export default App;
