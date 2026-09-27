import React, { useState } from 'react';
import { Mail, MessageCircle, MapPin, Instagram, Facebook, Send, CheckCircle2, Edit3, Check } from 'lucide-react';
import { BrandLogo } from './BrandLogo';

interface ContactSectionProps {
  isFullPage?: boolean;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ isFullPage = false }) => {
  // Editable WhatsApp & Location placeholders as requested by the user
  const [whatsappNumber, setWhatsappNumber] = useState<string>('[ADD KID.X WHATSAPP NUMBER]');
  const [businessLocation, setBusinessLocation] = useState<string>('[ADD KID.X BUSINESS LOCATION], India');
  const [isEditingWhatsapp, setIsEditingWhatsapp] = useState(false);
  const [isEditingLocation, setIsEditingLocation] = useState(false);

  // Contact Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const sanitizedWhatsappDigits = whatsappNumber.replace(/[^0-9]/g, '');
  const whatsappHref =
    sanitizedWhatsappDigits.length >= 10
      ? `https://wa.me/${sanitizedWhatsappDigits}?text=${encodeURIComponent('Hi KID.X team! I have a question about your kids store.')}`
      : '#whatsapp-setup';

  return (
    <section
      id="contact-section"
      className={`${isFullPage ? 'py-8' : 'py-14 border-t border-slate-200/80'}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Column: Official Brand & Contact Details */}
          <div className="lg:col-span-5 space-y-6">
            <div className="space-y-3">
              <BrandLogo size="md" />
              <h2 className="text-2xl sm:text-3xl font-display font-bold text-slate-900">
                Contact KID.X India
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                Everything little ones love, all in one place. Reach out to our parent support desk for sizing advice, order help, or bulk birthday gifting queries across India.
              </p>
            </div>

            {/* Contact Cards List */}
            <div className="space-y-3.5">
              {/* Instagram (Clickable) */}
              <div className="p-4 rounded-2xl bg-white border border-slate-200/80 flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-pink-50 text-pink-600 flex items-center justify-center shrink-0">
                  <Instagram className="w-5 h-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-semibold text-slate-500">Official Instagram</div>
                  <a
                    href="https://instagram.com/kid.x_official"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-bold text-slate-900 hover:text-[#FF595E] transition-colors inline-flex items-center gap-1"
                  >
                    @kid.x_official
                  </a>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Facebook Page: <span className="font-semibold text-slate-700">KID.X</span>
                  </p>
                </div>
              </div>

              {/* Temporary Demo Email (Clickable & Clearly Labeled) */}
              <div className="p-4 rounded-2xl bg-white border border-slate-200/80 flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-slate-500">Email Support</span>
                    <span className="text-[11px] font-medium text-amber-700">
                      · Temporary / Demo Email
                    </span>
                  </div>
                  <a
                    href="mailto:kidx.demo@example.com"
                    className="text-sm font-bold text-slate-900 hover:text-[#1982C4] transition-colors break-all"
                  >
                    kidx.demo@example.com
                  </a>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Click to compose an email (Temporary Demo Inbox)
                  </p>
                </div>
              </div>

              {/* WhatsApp (Ready for Later Number & Editable) */}
              <div className="p-4 rounded-2xl bg-white border border-slate-200/80 flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <div className="min-w-0 flex-1 space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-semibold text-slate-500">WhatsApp Support</span>
                    <button
                      type="button"
                      onClick={() => setIsEditingWhatsapp((prev) => !prev)}
                      className="text-xs font-semibold text-[#1982C4] hover:underline inline-flex items-center gap-1 cursor-pointer"
                    >
                      {isEditingWhatsapp ? (
                        <>
                          <Check className="w-3.5 h-3.5" /> Done
                        </>
                      ) : (
                        <>
                          <Edit3 className="w-3.5 h-3.5" /> Edit Number
                        </>
                      )}
                    </button>
                  </div>

                  {isEditingWhatsapp ? (
                    <input
                      type="text"
                      value={whatsappNumber}
                      onChange={(e) => setWhatsappNumber(e.target.value)}
                      placeholder="[ADD WHATSAPP NUMBER]"
                      className="w-full px-3 py-1.5 text-xs font-mono rounded-lg border border-slate-300 focus:outline-none focus:border-emerald-600"
                    />
                  ) : (
                    <div className="text-sm font-bold text-slate-900 font-mono">
                      {whatsappNumber}
                    </div>
                  )}

                  <div className="pt-0.5">
                    <a
                      href={whatsappHref}
                      onClick={(e) => {
                        if (sanitizedWhatsappDigits.length < 10) {
                          e.preventDefault();
                          setIsEditingWhatsapp(true);
                        }
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition-colors"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>Chat on WhatsApp</span>
                    </a>
                  </div>
                </div>
              </div>

              {/* Location (Editable Section) */}
              <div className="p-4 rounded-2xl bg-white border border-slate-200/80 flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div className="min-w-0 flex-1 space-y-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-semibold text-slate-500">Business Location</span>
                    <button
                      type="button"
                      onClick={() => setIsEditingLocation((prev) => !prev)}
                      className="text-xs font-semibold text-[#1982C4] hover:underline inline-flex items-center gap-1 cursor-pointer"
                    >
                      {isEditingLocation ? (
                        <>
                          <Check className="w-3.5 h-3.5" /> Save Location
                        </>
                      ) : (
                        <>
                          <Edit3 className="w-3.5 h-3.5" /> Edit Location
                        </>
                      )}
                    </button>
                  </div>

                  {isEditingLocation ? (
                    <input
                      type="text"
                      value={businessLocation}
                      onChange={(e) => setBusinessLocation(e.target.value)}
                      placeholder="[ADD LOCATION]"
                      className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:border-amber-600"
                    />
                  ) : (
                    <div className="text-sm font-bold text-slate-900">
                      {businessLocation}
                    </div>
                  )}
                  <p className="text-xs text-slate-500">
                    Delivery Across India · Free Shipping on Orders Above ₹999
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Contact Us Form */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs">
            <div className="max-w-xl space-y-6">
              <div>
                <h3 className="text-xl font-display font-bold text-slate-900">
                  Send a Message to KID.X
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Fill out your details below and our support team will respond shortly.
                </p>
              </div>

              {submitted ? (
                <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-3">
                  <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                  <h4 className="text-base font-display font-bold text-slate-900">
                    Message Received, {name}!
                  </h4>
                  <p className="text-xs text-slate-600 max-w-md mx-auto">
                    Thank you for contacting KID.X. We have logged your inquiry for{' '}
                    <strong>{email}</strong> ({phone}).
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setSubmitted(false);
                      setName('');
                      setEmail('');
                      setPhone('');
                      setMessage('');
                    }}
                    className="px-4 py-2 rounded-xl bg-white border border-emerald-300 text-xs font-semibold text-emerald-800 hover:bg-emerald-100 cursor-pointer"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="block text-xs font-semibold text-slate-700">
                        Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Your full name"
                        className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-[#FF595E]"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="block text-xs font-semibold text-slate-700">
                        Email *
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="parent@example.com"
                        className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-[#FF595E]"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-slate-700">
                      Phone *
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-[#FF595E]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-slate-700">
                      Message *
                    </label>
                    <textarea
                      rows={4}
                      required
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Tell us what you are looking for (age group, clothing size, toy recommendation, or order query)..."
                      className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-[#FF595E]"
                    />
                  </div>

                  <button
                    type="submit"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#FF595E] hover:bg-[#e6484d] text-white text-sm font-semibold shadow-sm transition-colors cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    <span>Send Message</span>
                  </button>
                </form>
              )}

              {/* Social Media Brand Presence Bar */}
              <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-500">
                <div className="flex items-center gap-4">
                  <a
                    href="https://instagram.com/kid.x_official"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 font-semibold text-slate-700 hover:text-[#FF595E]"
                  >
                    <Instagram className="w-4 h-4 text-pink-600" />
                    <span>Instagram: @kid.x_official</span>
                  </a>
                  <span aria-hidden="true">·</span>
                  <a
                    href="https://facebook.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 font-semibold text-slate-700 hover:text-[#1982C4]"
                  >
                    <Facebook className="w-4 h-4 text-blue-600" />
                    <span>Facebook: KID.X</span>
                  </a>
                </div>
                <span>Ages 0–10 Years · ₹ INR</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
