import { useState } from "react";
import { motion } from "framer-motion";
import { DashboardLayout } from "../layouts/DashboardLayout";
import { Button } from "../components/Button";
import { useTaskStore } from "../context/taskStore";
import { Send, Zap, AlertCircle, CheckCircle2 } from "lucide-react";

const aiSuggestions = [
  {
    id: 1,
    title: "Study for Midterm Exams",
    description: "Prepare for upcoming midterm examinations",
    priority: "high",
    dueDate: new Date(2024, 11, 25),
  },
  {
    id: 2,
    title: "Complete Group Project",
    description: "Finalize and submit group project deliverables",
    priority: "high",
    dueDate: new Date(2024, 11, 23),
  },
  {
    id: 3,
    title: "Review Lecture Notes",
    description: "Go through notes from this week's lectures",
    priority: "medium",
    dueDate: new Date(2024, 11, 20),
  },
];

export const AIAssistantPage = () => {
  const { addTask } = useTaskStore();
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: "ai",
      content:
        '> NEURON AI ASSISTANT v1.0.0\n> Ready to process natural language task creation\n> Example: "Add task to study for exam next week"',
    },
  ]);
  const [input, setInput] = useState("");
  const [acceptedSuggestions, setAcceptedSuggestions] = useState(new Set());

  const handleSendMessage = () => {
    if (!input.trim()) return;

    setMessages((prev) => [
      ...prev,
      { id: Date.now(), type: "user", content: input },
    ]);

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          type: "ai",
          content:
            "> Processing request...\n> Generated task suggestions below",
          suggestions: aiSuggestions,
        },
      ]);
    }, 600);

    setInput("");
  };

  const handleAcceptSuggestion = (suggestion) => {
    addTask({
      title: suggestion.title,
      description: suggestion.description,
      dueDate: suggestion.dueDate,
      priority: suggestion.priority,
    });
    setAcceptedSuggestions((prev) => new Set([...prev, suggestion.id]));
  };

  return (
    <DashboardLayout>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="h-full flex flex-col"
      >
        <div className="mb-6">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold text-gray-100 mb-2 flex items-center gap-3"
          >
            <div className="p-3 bg-neon-green/10 border border-neon-green/30 rounded-lg">
              <Zap className="w-7 h-7 text-neon-green" />
            </div>
            <span className="text-neon-green font-mono">AI ASSISTANT</span>
          </motion.h1>
          <p className="text-gray-400 font-mono text-sm">
            NATURAL LANGUAGE TASK PROCESSOR
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-neon rounded-lg p-5 mb-6 flex items-start gap-3 border border-neon-cyan/20"
        >
          <AlertCircle className="w-5 h-5 text-neon-cyan flex-shrink-0 mt-0.5" />
          <div className="font-mono text-sm">
            <p className="font-bold text-neon-cyan mb-1.5">
              OPTIONAL FEATURE
            </p>
            <p className="text-gray-400">
              AI assistant demonstrates NLP task creation. Fully optional.
            </p>
          </div>
        </motion.div>

        <div className="flex-1 glass rounded-lg p-6 mb-6 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto scrollbar-hide space-y-4 mb-4 font-mono">
            {messages.map((message, index) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`flex ${
                  message.type === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg ${
                    message.type === "user"
                      ? "bg-neon-green text-cyber-darker font-semibold"
                      : "glass-neon border border-neon-green/20"
                  }`}
                >
                  <p className="text-sm whitespace-pre-line">{message.content}</p>

                  {message.suggestions && (
                    <div className="mt-4 space-y-2">
                      {message.suggestions.map((suggestion) => (
                        <motion.div
                          key={suggestion.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          whileHover={{ x: 4 }}
                          className="glass rounded-lg p-3 border border-cyber-border"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1">
                              <p className="font-semibold text-gray-100 text-sm">
                                {suggestion.title}
                              </p>
                              <p className="text-xs text-gray-400 mt-1.5">
                                {suggestion.description}
                              </p>
                              <div className="flex items-center gap-2 mt-2.5">
                                <span className="text-xs px-2.5 py-1 rounded-md bg-gray-500/20 text-gray-400 font-semibold">
                                  {suggestion.priority}
                                </span>
                                <span className="text-xs text-gray-500">
                                  {suggestion.dueDate.toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                            <Button
                              size="sm"
                              variant={
                                acceptedSuggestions.has(suggestion.id)
                                  ? "secondary"
                                  : "primary"
                              }
                              onClick={() => handleAcceptSuggestion(suggestion)}
                              disabled={acceptedSuggestions.has(suggestion.id)}
                              className="flex-shrink-0"
                            >
                              {acceptedSuggestions.has(suggestion.id) ? (
                                <CheckCircle2 className="w-4 h-4" />
                              ) : (
                                "Accept"
                              )}
                            </Button>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          <div className="flex gap-2 border-t border-cyber-border pt-4">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              placeholder="Describe your task..."
              className="flex-1 px-4 py-2.5 glass rounded-lg input-focus text-gray-100 placeholder-gray-500 border border-cyber-border font-mono text-sm"
            />
            <Button onClick={handleSendMessage} disabled={!input.trim()}>
              <Send className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass rounded-lg p-6"
        >
          <h3 className="text-lg font-bold text-gray-100 mb-5 font-mono">
            EXAMPLE PROMPTS
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              "Add task to study for algorithms exam next Friday",
              "Create reminder to submit project by December 20",
              "Schedule high priority task to review database concepts",
              "Add low priority task to update portfolio",
            ].map((prompt, index) => (
              <motion.button
                key={index}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setInput(prompt)}
                className="text-left p-4 glass rounded-lg hover:border-neon-green/30 transition-colors border border-cyber-border"
              >
                <p className="text-sm text-gray-300 font-mono">
                  {prompt}
                </p>
              </motion.button>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </DashboardLayout>
  );
};
