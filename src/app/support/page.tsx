"use client";
import { useState } from "react";
import {
  MessageCircle,
  Phone,
  Mail,
  Clock,
  Shield,
  Truck,
  RefreshCw,
  HelpCircle,
  Search,
  ChevronDown,
  ChevronRight,
  CheckCircle,
  AlertCircle,
  User,
  Send,
  MapPin,
  Calendar,
} from "lucide-react";
import Link from "next/link";

export default function SupportPage() {
  const [selectedFaq, setSelectedFaq] = useState<number | null>(null);
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    category: "general",
  });
  const [searchTerm, setSearchTerm] = useState("");

  const faqs = [
    {
      id: 1,
      question: "What's your shipping policy?",
      answer:
        "We offer free shipping on orders over $500. Standard shipping takes 2-3 business days, while express shipping delivers within 24-48 hours for an additional fee.",
    },
    {
      id: 2,
      question: "What's your return policy?",
      answer:
        "We offer a 30-day return policy for all iPhone purchases. Items must be in original condition with all accessories and packaging. Return shipping is free for defective items.",
    },
    {
      id: 3,
      question: "Do you offer warranty on iPhones?",
      answer:
        "Yes, all our iPhones come with a 1-year manufacturer warranty. We also offer extended warranty plans for additional coverage and peace of mind.",
    },
    {
      id: 4,
      question: "Are your iPhones genuine and unlocked?",
      answer:
        "Absolutely! All our iPhones are 100% genuine, brand new, and factory unlocked. They work with all carriers worldwide and come with full manufacturer warranty.",
    },
    {
      id: 5,
      question: "How can I track my order?",
      answer:
        "Once your order ships, you'll receive a tracking number via email. You can also log into your account to view real-time tracking information and delivery updates.",
    },
    {
      id: 6,
      question: "Do you offer financing options?",
      answer:
        "Yes, we partner with leading financial institutions to offer flexible payment plans. You can choose from 6, 12, or 24-month installment options with competitive rates.",
    },
    {
      id: 7,
      question: "What payment methods do you accept?",
      answer:
        "We accept all major credit cards (Visa, MasterCard, American Express), PayPal, Apple Pay, Google Pay, and bank transfers for large orders.",
    },
    {
      id: 8,
      question: "Can I trade in my old iPhone?",
      answer:
        "Yes! We offer competitive trade-in values for your old devices. Simply get a quote online, ship your device to us (free shipping), and receive credit towards your new purchase.",
    },
  ];

  const filteredFaqs = faqs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    console.log("Contact form submitted:", contactForm);
    // Reset form
    setContactForm({
      name: "",
      email: "",
      subject: "",
      message: "",
      category: "general",
    });
    alert("Thank you for your message! We'll get back to you within 24 hours.");
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-b from-gray-900 to-black">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h1 className="text-5xl md:text-6xl font-black mb-6">
            <span className="bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent">
              How can we help?
            </span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-8">
            Get instant support for your iPhone purchase, shipping questions,
            and technical issues
          </p>

          {/* Quick Search */}
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search for help..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-900 border border-gray-700 rounded-2xl pl-12 pr-4 py-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
            />
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* Contact Options */}
        <section className="mb-20">
          <h2 className="text-3xl font-bold text-center mb-12">
            <span className="bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
              Get in Touch
            </span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Live Chat */}
            <div className="bg-gradient-to-b from-blue-900/20 to-blue-900/5 border border-blue-500/30 rounded-2xl p-8 text-center hover:border-blue-500/50 transition-all duration-300 group">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <MessageCircle className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Live Chat</h3>
              <p className="text-gray-400 mb-6">
                Get instant help from our support team
              </p>
              <div className="flex items-center justify-center gap-2 text-green-400 text-sm mb-4">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span>Online now</span>
              </div>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors w-full">
                Start Chat
              </button>
            </div>

            {/* Phone Support */}
            <div className="bg-gradient-to-b from-purple-900/20 to-purple-900/5 border border-purple-500/30 rounded-2xl p-8 text-center hover:border-purple-500/50 transition-all duration-300 group">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Phone className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">
                Phone Support
              </h3>
              <p className="text-gray-400 mb-4">
                Speak directly with our experts
              </p>
              <div className="text-2xl font-bold text-white mb-2">
                +1 (555) 123-4567
              </div>
              <div className="flex items-center justify-center gap-2 text-sm text-gray-400 mb-4">
                <Clock className="h-4 w-4" />
                <span>Mon-Fri 9AM-8PM EST</span>
              </div>
              <button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors w-full">
                Call Now
              </button>
            </div>

            {/* Email Support */}
            <div className="bg-gradient-to-b from-pink-900/20 to-pink-900/5 border border-pink-500/30 rounded-2xl p-8 text-center hover:border-pink-500/50 transition-all duration-300 group">
              <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Mail className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">
                Email Support
              </h3>
              <p className="text-gray-400 mb-4">Send us a detailed message</p>
              <div className="text-lg font-semibold text-white mb-2">
                support@eljostore.com
              </div>
              <div className="flex items-center justify-center gap-2 text-sm text-gray-400 mb-4">
                <Clock className="h-4 w-4" />
                <span>Response within 24h</span>
              </div>
              <button className="bg-pink-600 hover:bg-pink-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors w-full">
                Send Email
              </button>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              <span className="bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                Frequently Asked Questions
              </span>
            </h2>
            <p className="text-gray-400">
              Find answers to common questions about our iPhones and services
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            {filteredFaqs.length === 0 ? (
              <div className="text-center py-8">
                <HelpCircle className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400">
                  No FAQs found matching your search.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredFaqs.map((faq) => (
                  <div
                    key={faq.id}
                    className="bg-gray-900 border border-gray-700 rounded-2xl overflow-hidden hover:border-gray-600 transition-colors">
                    <button
                      onClick={() =>
                        setSelectedFaq(selectedFaq === faq.id ? null : faq.id)
                      }
                      className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-800 transition-colors">
                      <span className="font-semibold text-white pr-4">
                        {faq.question}
                      </span>
                      <ChevronDown
                        className={`h-5 w-5 text-gray-400 transition-transform duration-200 ${
                          selectedFaq === faq.id ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    {selectedFaq === faq.id && (
                      <div className="px-6 pb-4">
                        <div className="text-gray-300 leading-relaxed">
                          {faq.answer}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Quick Help Cards */}
        <section className="mb-20">
          <h2 className="text-3xl font-bold text-center mb-12">
            <span className="bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
              Quick Help
            </span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Truck,
                title: "Track Order",
                description: "Check your order status and delivery updates",
                color: "from-blue-500 to-blue-600",
              },
              {
                icon: RefreshCw,
                title: "Returns",
                description: "Start a return or exchange process",
                color: "from-green-500 to-green-600",
              },
              {
                icon: Shield,
                title: "Warranty",
                description: "Register your iPhone or check warranty status",
                color: "from-purple-500 to-purple-600",
              },
              {
                icon: User,
                title: "Account",
                description: "Manage your account settings and preferences",
                color: "from-pink-500 to-pink-600",
              },
            ].map((item, index) => (
              <div
                key={index}
                className="bg-gray-900 border border-gray-700 rounded-2xl p-6 hover:border-gray-600 transition-all duration-300 group cursor-pointer">
                <div
                  className={`w-12 h-12 bg-gradient-to-r ${item.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <item.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-bold text-white mb-2">{item.title}</h3>
                <p className="text-gray-400 text-sm mb-4">{item.description}</p>
                <div className="flex items-center text-blue-400 text-sm font-medium group-hover:text-blue-300 transition-colors">
                  <span>Learn more</span>
                  <ChevronRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Contact Form */}
        <section className="mb-20">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">
                <span className="bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                  Send us a Message
                </span>
              </h2>
              <p className="text-gray-400">
                Can't find what you're looking for? Send us a detailed message
                and we'll get back to you.
              </p>
            </div>

            <div className="bg-gray-900 border border-gray-700 rounded-2xl p-8">
              <form onSubmit={handleContactSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-white mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={contactForm.name}
                      onChange={(e) =>
                        setContactForm({ ...contactForm, name: e.target.value })
                      }
                      className="w-full bg-black border border-gray-600 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-white mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={contactForm.email}
                      onChange={(e) =>
                        setContactForm({
                          ...contactForm,
                          email: e.target.value,
                        })
                      }
                      className="w-full bg-black border border-gray-600 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-white mb-2">
                      Category *
                    </label>
                    <select
                      required
                      value={contactForm.category}
                      onChange={(e) =>
                        setContactForm({
                          ...contactForm,
                          category: e.target.value,
                        })
                      }
                      className="w-full bg-black border border-gray-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                      <option value="general">General Inquiry</option>
                      <option value="order">Order Support</option>
                      <option value="technical">Technical Support</option>
                      <option value="billing">Billing</option>
                      <option value="warranty">Warranty</option>
                      <option value="return">Returns & Exchanges</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-white mb-2">
                      Subject *
                    </label>
                    <input
                      type="text"
                      required
                      value={contactForm.subject}
                      onChange={(e) =>
                        setContactForm({
                          ...contactForm,
                          subject: e.target.value,
                        })
                      }
                      className="w-full bg-black border border-gray-600 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Brief description of your issue"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-white mb-2">
                    Message *
                  </label>
                  <textarea
                    required
                    rows={6}
                    value={contactForm.message}
                    onChange={(e) =>
                      setContactForm({
                        ...contactForm,
                        message: e.target.value,
                      })
                    }
                    className="w-full bg-black border border-gray-600 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    placeholder="Please provide as much detail as possible about your question or issue..."
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-4 rounded-xl font-bold text-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-300 flex items-center justify-center gap-2">
                  <Send className="h-5 w-5" />
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </section>

        {/* Status & Hours */}
        <section>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Support Status */}
            <div className="bg-gray-900 border border-gray-700 rounded-2xl p-8">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                <CheckCircle className="h-6 w-6 text-green-400" />
                Support Status
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">All Systems</span>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span className="text-green-400 font-semibold">
                      Operational
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Live Chat</span>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-green-400 font-semibold">Online</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Phone Support</span>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span className="text-green-400 font-semibold">
                      Available
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Business Hours */}
            <div className="bg-gray-900 border border-gray-700 rounded-2xl p-8">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                <Clock className="h-6 w-6 text-blue-400" />
                Business Hours
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Monday - Friday</span>
                  <span className="text-white font-semibold">
                    9:00 AM - 8:00 PM EST
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Saturday</span>
                  <span className="text-white font-semibold">
                    10:00 AM - 6:00 PM EST
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Sunday</span>
                  <span className="text-white font-semibold">
                    12:00 PM - 5:00 PM EST
                  </span>
                </div>
                <div className="border-t border-gray-700 pt-3 mt-4">
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-400">
                      All times shown in Eastern Standard Time
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
