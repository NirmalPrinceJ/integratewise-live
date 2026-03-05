import { useState } from "react";
import { motion } from "motion/react";
import { Mail, MessageSquare, User, Building2, Send, Loader2, CheckCircle2 } from "lucide-react";

const INQUIRY_TYPES = [
  { id: "demo", label: "Request a Demo" },
  { id: "enterprise", label: "Enterprise Pricing" },
  { id: "partnership", label: "Partnership" },
  { id: "support", label: "Technical Support" },
  { id: "other", label: "General Inquiry" },
];

export function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", company: "", type: "demo", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    if (!form.name || !form.email || !form.message) {
      setError("Please fill in all required fields");
      setSubmitting(false);
      return;
    }

    try {
      const API_BASE = import.meta.env.VITE_API_BASE || "https://gateway.integratewise.ai";
      const res = await fetch(`${API_BASE}/api/v1/public/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        setSubmitted(true);
        setForm({ name: "", email: "", company: "", type: "demo", message: "" });
      } else {
        setError(data.error || "Failed to send message");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0C1222] to-[#0a0a0a] flex items-center justify-center p-6">
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center max-w-md">
          <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-8 h-8 text-emerald-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-3">Message Sent!</h2>
          <p className="text-white/60 mb-8">We'll get back to you within 24 hours. Check your email for a confirmation.</p>
          <a href="/" className="text-emerald-400 font-medium hover:underline">Back to Home</a>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0C1222] to-[#0a0a0a] py-20 px-6">
      <div className="max-w-2xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-4xl font-bold text-white mb-3">Get in Touch</h1>
          <p className="text-white/60 mb-10">Have questions about IntegrateWise? We'd love to hear from you.</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-white/70 mb-1.5 block">Full Name *</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={e => setForm(f => ({...f, name: e.target.value}))}
                    placeholder="Nirmal Prince"
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder:text-white/30 outline-none focus:border-emerald-500/50 transition-all"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-white/70 mb-1.5 block">Work Email *</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={e => setForm(f => ({...f, email: e.target.value}))}
                    placeholder="you@company.com"
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder:text-white/30 outline-none focus:border-emerald-500/50 transition-all"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-white/70 mb-1.5 block">Company</label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input
                  type="text"
                  value={form.company}
                  onChange={e => setForm(f => ({...f, company: e.target.value}))}
                  placeholder="IntegrateWise"
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder:text-white/30 outline-none focus:border-emerald-500/50 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-white/70 mb-1.5 block">Inquiry Type</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {INQUIRY_TYPES.map(t => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setForm(f => ({...f, type: t.id}))}
                    className={`px-3 py-2 rounded-lg text-xs font-medium transition-all border ${
                      form.type === t.id
                        ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-400"
                        : "bg-white/5 border-white/10 text-white/50 hover:border-white/20"
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-white/70 mb-1.5 block">Message *</label>
              <div className="relative">
                <MessageSquare className="absolute left-3 top-3 w-4 h-4 text-white/30" />
                <textarea
                  required
                  value={form.message}
                  onChange={e => setForm(f => ({...f, message: e.target.value}))}
                  rows={5}
                  placeholder="Tell us about your needs..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder:text-white/30 outline-none focus:border-emerald-500/50 transition-all resize-none"
                />
              </div>
            </div>

            {error && <div className="bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-2 text-sm text-red-400">{error}</div>}

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-600/50 text-white font-semibold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20"
            >
              {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              {submitting ? "Sending..." : "Send Message"}
            </button>
          </form>

          <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
              <Mail className="w-5 h-5 text-emerald-400 mx-auto mb-2" />
              <div className="text-sm font-medium text-white">Email</div>
              <a href="mailto:hello@integratewise.ai" className="text-xs text-white/50 hover:text-white/70">hello@integratewise.ai</a>
            </div>
            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
              <MessageSquare className="w-5 h-5 text-emerald-400 mx-auto mb-2" />
              <div className="text-sm font-medium text-white">Live Chat</div>
              <div className="text-xs text-white/50">Available Mon-Fri 9-6 IST</div>
            </div>
            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
              <Building2 className="w-5 h-5 text-emerald-400 mx-auto mb-2" />
              <div className="text-sm font-medium text-white">Office</div>
              <div className="text-xs text-white/50">Bengaluru, India</div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
