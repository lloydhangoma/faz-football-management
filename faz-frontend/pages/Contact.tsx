import React, { FormEvent, useMemo, useState } from "react";
import { Link } from "react-router-dom";

type InquiryType =
  | "General Inquiry"
  | "Media & Press"
  | "Match Day & Tickets"
  | "Player Registration"
  | "Refereeing"
  | "Sponsorship & Partnerships";

interface ContactFormData {
  fullName: string;
  email: string;
  phone: string;
  inquiryType: InquiryType;
  subject: string;
  message: string;
  consent: boolean;
}

interface FormErrors {
  fullName?: string;
  email?: string;
  subject?: string;
  message?: string;
  consent?: string;
}

interface FAQItem {
  question: string;
  answer: string;
}

const initialFormState: ContactFormData = {
  fullName: "",
  email: "",
  phone: "",
  inquiryType: "General Inquiry",
  subject: "",
  message: "",
  consent: false,
};

const inquiryOptions: InquiryType[] = [
  "General Inquiry",
  "Media & Press",
  "Match Day & Tickets",
  "Player Registration",
  "Refereeing",
  "Sponsorship & Partnerships",
];

const faqItems: FAQItem[] = [
  {
    question: "How long does FAZ take to respond to inquiries?",
    answer:
      "Most inquiries are answered within 2 to 5 working days, depending on the department handling your request.",
  },
  {
    question: "Can I submit match-day ticket issues through this form?",
    answer:
      "Yes. Select 'Match Day & Tickets' in Inquiry Type and include your match details so the team can assist faster.",
  },
  {
    question: "Where is FAZ headquartered?",
    answer:
      "Football House, Alick Nkata Road, Lusaka, Zambia, P.O Box 34751, Lusaka, Zambia.",
  },
  {
    question: "How can media houses request interviews or accreditation?",
    answer:
      "Use the contact form and select 'Media & Press', or email faz@zamnet.zm with your publication details and deadline.",
  },
];

const Contact: React.FC = () => {
  const [formData, setFormData] = useState<ContactFormData>(initialFormState);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [activeFaqIndex, setActiveFaqIndex] = useState<number | null>(0);

  const isFormValid = useMemo(() => {
    return (
      formData.fullName.trim().length >= 2 &&
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) &&
      formData.subject.trim().length >= 4 &&
      formData.message.trim().length >= 10 &&
      formData.consent
    );
  }, [formData]);

  const validate = (): FormErrors => {
    const nextErrors: FormErrors = {};

    if (formData.fullName.trim().length < 2) {
      nextErrors.fullName = "Please enter your full name.";
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      nextErrors.email = "Please enter a valid email address.";
    }

    if (formData.subject.trim().length < 4) {
      nextErrors.subject = "Subject must be at least 4 characters.";
    }

    if (formData.message.trim().length < 10) {
      nextErrors.message = "Message must be at least 10 characters.";
    }

    if (!formData.consent) {
      nextErrors.consent = "You must agree before submitting.";
    }

    return nextErrors;
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const validation = validate();
    setErrors(validation);

    if (Object.keys(validation).length > 0) return;

    console.log("Submitted contact request:", formData);
    setIsSubmitted(true);
    setFormData(initialFormState);
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,_#f8fff7,_#edf4ef_40%,_#e8eeea_100%)] text-gray-900">
      <section className="relative h-[500px] md:h-[600px] overflow-hidden">
        <img
          src="https://res.cloudinary.com/djuz1gf78/image/upload/v1769085842/fazPhoto1_g4eo3r.jpg"
          alt="FAZ Heritage"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent flex items-center">
          <div className="max-w-[1440px] mx-auto px-4 md:px-12 w-full">
            <div className="max-w-2xl">
              <h1 className="text-5xl md:text-6xl font-condensed font-black text-white uppercase tracking-tighter leading-none mb-6">
                Contact FAZ
              </h1>
              <p className="text-lg md:text-xl text-gray-100 mb-8 leading-relaxed max-w-xl">
                Reach the Football Association of Zambia for official inquiries, media requests, competition support, and general assistance.
              </p>
              <Link
                to="/contact#contact-form"
                className="inline-block px-8 py-4 bg-faz-orange hover:bg-faz-orange/90 text-white font-black uppercase tracking-widest text-sm transition-all transform hover:scale-105 shadow-lg"
              >
                Send Us a Message
              </Link>
            </div>
          </div>
        </div>
      </section>

      <main
        id="contact-form"
        className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-6 pb-12 pt-10 lg:grid-cols-3"
      >
        <aside className="space-y-6 lg:col-span-1">
          <div className="rounded-2xl border border-emerald-900/10 bg-white/90 p-6 shadow-sm backdrop-blur">
            <h2 className="mb-4 text-sm font-bold uppercase tracking-[0.2em] text-green-900">
              Headquarters
            </h2>
            <p className="leading-relaxed text-gray-700">
              Football House, Alick Nkata Road, Lusaka, Zambia, P.O Box 34751,
              Lusaka, Zambia
            </p>
            <div className="mt-5 space-y-2 text-sm text-gray-700">
              <p>
                <span className="font-semibold text-gray-900">Phone:</span>{" "}
                0211 250 940
              </p>
              <p>
                <span className="font-semibold text-gray-900">Mobile:</span>{" "}
                0211 250 940
              </p>
              <p>
                <span className="font-semibold text-gray-900">Email:</span>{" "}
                faz@zamnet.zm
              </p>
              <p>
                <span className="font-semibold text-gray-900">
                  Working Hours:
                </span>{" "}
                Mon - Fri, 08:00 - 17:00
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-emerald-900/10 bg-white/90 p-6 shadow-sm backdrop-blur">
            <h2 className="mb-4 text-sm font-bold uppercase tracking-[0.2em] text-green-900">
              Department Contacts
            </h2>
            <ul className="space-y-4 text-sm text-gray-700">
              <li>
                <p className="font-semibold text-gray-900">Media Office</p>
                <p>faz@zamnet.zm</p>
              </li>
              <li>
                <p className="font-semibold text-gray-900">Competitions</p>
                <p>faz@zamnet.zm</p>
              </li>
              <li>
                <p className="font-semibold text-gray-900">Referees</p>
                <p>faz@zamnet.zm</p>
              </li>
              <li>
                <p className="font-semibold text-gray-900">Safeguarding</p>
                <p>faz@zamnet.zm</p>
              </li>
              <li>
                <p className="font-semibold text-gray-900">
                  Official Twitter Account
                </p>
                <a
                  href="https://twitter.com/FAZFootball"
                  target="_blank"
                  rel="noreferrer"
                  className="font-semibold text-green-900 transition-colors hover:text-green-700"
                >
                  @FAZFootball
                </a>
              </li>
            </ul>
          </div>
        </aside>

        <section className="rounded-2xl border border-emerald-900/10 bg-white/90 p-8 shadow-sm backdrop-blur lg:col-span-2">
          <h2 className="mb-2 text-2xl font-black uppercase tracking-tight text-gray-900">
            Send Us a Message
          </h2>
          <p className="mb-8 text-gray-600">
            Complete the form below and our team will respond as soon as
            possible.
          </p>

          {isSubmitted && (
            <div className="mb-6 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-900">
              Your message has been submitted successfully.
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6" noValidate>
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div>
                <label
                  className="mb-2 block text-xs font-semibold uppercase tracking-widest text-gray-600"
                  htmlFor="fullName"
                >
                  Full Name *
                </label>
                <input
                  id="fullName"
                  type="text"
                  value={formData.fullName}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, fullName: e.target.value }))
                  }
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition-all focus:border-green-700 focus:ring-4 focus:ring-green-100"
                  placeholder="Enter your full name"
                />
                {errors.fullName && (
                  <p className="mt-2 text-xs text-red-600">{errors.fullName}</p>
                )}
              </div>

              <div>
                <label
                  className="mb-2 block text-xs font-semibold uppercase tracking-widest text-gray-600"
                  htmlFor="email"
                >
                  Email *
                </label>
                <input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, email: e.target.value }))
                  }
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition-all focus:border-green-700 focus:ring-4 focus:ring-green-100"
                  placeholder="name@example.com"
                />
                {errors.email && (
                  <p className="mt-2 text-xs text-red-600">{errors.email}</p>
                )}
              </div>

              <div>
                <label
                  className="mb-2 block text-xs font-semibold uppercase tracking-widest text-gray-600"
                  htmlFor="phone"
                >
                  Phone
                </label>
                <input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, phone: e.target.value }))
                  }
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition-all focus:border-green-700 focus:ring-4 focus:ring-green-100"
                  placeholder="+260..."
                />
              </div>

              <div>
                <label
                  className="mb-2 block text-xs font-semibold uppercase tracking-widest text-gray-600"
                  htmlFor="inquiryType"
                >
                  Inquiry Type
                </label>
                <select
                  id="inquiryType"
                  value={formData.inquiryType}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      inquiryType: e.target.value as InquiryType,
                    }))
                  }
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition-all focus:border-green-700 focus:ring-4 focus:ring-green-100"
                >
                  {inquiryOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label
                className="mb-2 block text-xs font-semibold uppercase tracking-widest text-gray-600"
                htmlFor="subject"
              >
                Subject *
              </label>
              <input
                id="subject"
                type="text"
                value={formData.subject}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, subject: e.target.value }))
                }
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition-all focus:border-green-700 focus:ring-4 focus:ring-green-100"
                placeholder="Brief subject of your inquiry"
              />
              {errors.subject && (
                <p className="mt-2 text-xs text-red-600">{errors.subject}</p>
              )}
            </div>

            <div>
              <label
                className="mb-2 block text-xs font-semibold uppercase tracking-widest text-gray-600"
                htmlFor="message"
              >
                Message *
              </label>
              <textarea
                id="message"
                rows={6}
                value={formData.message}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, message: e.target.value }))
                }
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition-all focus:border-green-700 focus:ring-4 focus:ring-green-100"
                placeholder="Write your message here"
              />
              {errors.message && (
                <p className="mt-2 text-xs text-red-600">{errors.message}</p>
              )}
            </div>

            <div>
              <label className="flex items-start gap-3 text-sm text-gray-700">
                <input
                  type="checkbox"
                  checked={formData.consent}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, consent: e.target.checked }))
                  }
                  className="mt-1 h-4 w-4 rounded border-gray-300 text-green-800 focus:ring-green-700"
                />
                <span>
                  I confirm the information provided is accurate and consent to
                  FAZ processing this inquiry. *
                </span>
              </label>
              {errors.consent && (
                <p className="mt-2 text-xs text-red-600">{errors.consent}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={!isFormValid}
              className="inline-flex items-center justify-center rounded-xl bg-green-900 px-7 py-3 text-xs font-bold uppercase tracking-[0.2em] text-white transition-all hover:bg-green-800 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
            >
              Submit Message
            </button>
          </form>
        </section>
      </main>

      <section className="mx-auto max-w-7xl px-6 pb-16">
        <div className="rounded-2xl border border-emerald-900/10 bg-white/90 p-8 shadow-sm backdrop-blur">
          <h2 className="mb-2 text-2xl font-black uppercase tracking-tight text-gray-900">
            Frequently Asked Questions
          </h2>
          <p className="mb-8 text-gray-600">
            Quick answers to common FAZ contact and support questions.
          </p>

          <div className="overflow-hidden rounded-2xl border border-gray-200">
            {faqItems.map((item, index) => {
              const isOpen = activeFaqIndex === index;
              return (
                <div
                  key={item.question}
                  className="border-b border-gray-200 last:border-b-0"
                >
                  <button
                    type="button"
                    className="flex w-full items-center justify-between gap-4 bg-white px-5 py-4 text-left transition-colors hover:bg-gray-50"
                    onClick={() => setActiveFaqIndex(isOpen ? null : index)}
                  >
                    <span className="font-semibold text-gray-900">
                      {item.question}
                    </span>
                    <span className="text-lg font-bold leading-none text-green-900">
                      {isOpen ? "-" : "+"}
                    </span>
                  </button>
                  {isOpen && (
                    <div className="bg-emerald-50/40 px-5 pb-5 text-sm leading-relaxed text-gray-700">
                      {item.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
