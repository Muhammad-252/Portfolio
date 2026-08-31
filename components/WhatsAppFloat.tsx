import { MessageCircle } from "lucide-react";

export default function WhatsAppFloat() {
  return (
    <a
      className="whatsapp-float"
      href="https://wa.me/923015517804"
      target="_blank"
      rel="noreferrer"
      aria-label="Chat with Muhammad Arslan on WhatsApp"
    >
      <MessageCircle size={24} fill="currentColor" />
    </a>
  );
}
