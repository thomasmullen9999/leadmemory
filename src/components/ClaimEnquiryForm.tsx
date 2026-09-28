"use client";

import { FormEvent, useState } from "react";

type FormData = {
  name: string;
  email: string;
  phone: string;
  postcode: string;
  preferredContact: string;
  claimType: string;
  providerName: string;
  claimReference: string;
  issueStartDate: string;
  claimSummary: string;
  previousComplaint: boolean;
  hasSupportingEvidence: boolean;
  consentToContact: boolean;
  acceptedPrivacyPolicy: boolean;
};

const initialFormData: FormData = {
  name: "",
  email: "",
  phone: "",
  postcode: "",
  preferredContact: "EMAIL",
  claimType: "",
  providerName: "",
  claimReference: "",
  issueStartDate: "",
  claimSummary: "",
  previousComplaint: false,
  hasSupportingEvidence: false,
  consentToContact: false,
  acceptedPrivacyPolicy: false,
};

export function ClaimEnquiryForm() {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function updateField<K extends keyof FormData>(
    field: K,
    value: FormData[K],
  ) {
    setFormData((current) => ({
      ...current,
      [field]: value,
    }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setSubmitting(true);
    setError("");

    try {
      const response = await fetch("/api/claim-enquiries", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.error || "We could not submit your enquiry. Please try again.",
        );
      }

      setSubmitted(true);
      setFormData(initialFormData);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "We could not submit your enquiry. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <section className="rounded-2xl border border-teal-200 bg-white p-8 text-center shadow-sm">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-teal-100 text-2xl text-teal-700">
          ✓
        </div>

        <h2 className="mt-5 text-2xl font-semibold text-slate-900">
          Your enquiry has been received
        </h2>

        <p className="mx-auto mt-3 max-w-xl leading-7 text-slate-600">
          Thank you for getting in touch. A member of the team will review the
          information you provided and contact you using your preferred method.
        </p>

        <button
          type="button"
          onClick={() => setSubmitted(false)}
          className="mt-6 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
        >
          Submit another enquiry
        </button>
      </section>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
    >
      <div className="border-b border-slate-100 pb-6">
        <h2 className="text-lg font-semibold text-slate-900">
          Your contact details
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          We will use these details only to respond to your enquiry.
        </p>
      </div>

      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label
            htmlFor="name"
            className="mb-1.5 block text-sm font-medium text-slate-700"
          >
            Full name <span className="text-red-600">*</span>
          </label>

          <input
            id="name"
            required
            value={formData.name}
            onChange={(event) => updateField("name", event.target.value)}
            placeholder="Your full name"
            className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-teal-600 focus:ring-4 focus:ring-teal-100"
          />
        </div>

        <div>
          <label
            htmlFor="email"
            className="mb-1.5 block text-sm font-medium text-slate-700"
          >
            Email address <span className="text-red-600">*</span>
          </label>

          <input
            id="email"
            required
            type="email"
            value={formData.email}
            onChange={(event) => updateField("email", event.target.value)}
            placeholder="you@example.com"
            className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-teal-600 focus:ring-4 focus:ring-teal-100"
          />
        </div>

        <div>
          <label
            htmlFor="phone"
            className="mb-1.5 block text-sm font-medium text-slate-700"
          >
            Phone number <span className="text-red-600">*</span>
          </label>

          <input
            id="phone"
            required
            type="tel"
            value={formData.phone}
            onChange={(event) => updateField("phone", event.target.value)}
            placeholder="Your phone number"
            className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-teal-600 focus:ring-4 focus:ring-teal-100"
          />
        </div>

        <div>
          <label
            htmlFor="postcode"
            className="mb-1.5 block text-sm font-medium text-slate-700"
          >
            Postcode
          </label>

          <input
            id="postcode"
            value={formData.postcode}
            onChange={(event) => updateField("postcode", event.target.value)}
            placeholder="e.g. M1 1AE"
            className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-teal-600 focus:ring-4 focus:ring-teal-100"
          />
        </div>

        <div>
          <label
            htmlFor="preferredContact"
            className="mb-1.5 block text-sm font-medium text-slate-700"
          >
            Preferred contact method
          </label>

          <select
            id="preferredContact"
            value={formData.preferredContact}
            onChange={(event) =>
              updateField("preferredContact", event.target.value)
            }
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-teal-600 focus:ring-4 focus:ring-teal-100"
          >
            <option value="EMAIL">Email</option>
            <option value="PHONE">Phone</option>
            <option value="EITHER">Email or phone</option>
          </select>
        </div>
      </div>

      <div className="mt-9 border-b border-slate-100 pb-6">
        <h2 className="text-lg font-semibold text-slate-900">
          About your enquiry
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          This helps us understand what support may be relevant.
        </p>
      </div>

      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <div>
          <label
            htmlFor="claimType"
            className="mb-1.5 block text-sm font-medium text-slate-700"
          >
            What do you need help with? <span className="text-red-600">*</span>
          </label>

          <select
            id="claimType"
            required
            value={formData.claimType}
            onChange={(event) => updateField("claimType", event.target.value)}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-teal-600 focus:ring-4 focus:ring-teal-100"
          >
            <option value="">Choose an option</option>
            <option value="Consumer finance">Consumer finance</option>
            <option value="Credit agreement">Credit agreement</option>
            <option value="Insurance">Insurance</option>
            <option value="Banking">Banking</option>
            <option value="Investment or savings">Investment or savings</option>
            <option value="Financial product complaint">
              Financial product complaint
            </option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="providerName"
            className="mb-1.5 block text-sm font-medium text-slate-700"
          >
            Provider or company involved
          </label>

          <input
            id="providerName"
            value={formData.providerName}
            onChange={(event) =>
              updateField("providerName", event.target.value)
            }
            placeholder="e.g. provider, lender or insurer"
            className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-teal-600 focus:ring-4 focus:ring-teal-100"
          />
        </div>

        <div>
          <label
            htmlFor="claimReference"
            className="mb-1.5 block text-sm font-medium text-slate-700"
          >
            Account or reference number
          </label>

          <input
            id="claimReference"
            value={formData.claimReference}
            onChange={(event) =>
              updateField("claimReference", event.target.value)
            }
            placeholder="Optional"
            className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-teal-600 focus:ring-4 focus:ring-teal-100"
          />
        </div>

        <div>
          <label
            htmlFor="issueStartDate"
            className="mb-1.5 block text-sm font-medium text-slate-700"
          >
            Approximate date the issue started
          </label>

          <input
            id="issueStartDate"
            type="date"
            value={formData.issueStartDate}
            onChange={(event) =>
              updateField("issueStartDate", event.target.value)
            }
            className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-teal-600 focus:ring-4 focus:ring-teal-100"
          />
        </div>

        <div className="sm:col-span-2">
          <label
            htmlFor="claimSummary"
            className="mb-1.5 block text-sm font-medium text-slate-700"
          >
            Please tell us what happened{" "}
            <span className="text-red-600">*</span>
          </label>

          <textarea
            id="claimSummary"
            required
            rows={6}
            value={formData.claimSummary}
            onChange={(event) =>
              updateField("claimSummary", event.target.value)
            }
            placeholder="Briefly explain the issue and why you are contacting us. Please do not include passwords, card details, or security answers."
            className="w-full resize-y rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-teal-600 focus:ring-4 focus:ring-teal-100"
          />
        </div>
      </div>

      <div className="mt-6 space-y-4 rounded-xl bg-slate-50 p-4">
        <label className="flex cursor-pointer items-start gap-3">
          <input
            type="checkbox"
            checked={formData.previousComplaint}
            onChange={(event) =>
              updateField("previousComplaint", event.target.checked)
            }
            className="mt-1 h-4 w-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500"
          />

          <span className="text-sm text-slate-700">
            I have already raised this issue with the provider or company.
          </span>
        </label>

        <label className="flex cursor-pointer items-start gap-3">
          <input
            type="checkbox"
            checked={formData.hasSupportingEvidence}
            onChange={(event) =>
              updateField("hasSupportingEvidence", event.target.checked)
            }
            className="mt-1 h-4 w-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500"
          />

          <span className="text-sm text-slate-700">
            I have documents or other information that may support my enquiry.
          </span>
        </label>
      </div>

      <div className="mt-9 border-b border-slate-100 pb-6">
        <h2 className="text-lg font-semibold text-slate-900">
          Your consent
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Please confirm that you are happy for us to review your enquiry.
        </p>
      </div>

      <div className="mt-6 space-y-4">
        <label className="flex cursor-pointer items-start gap-3">
          <input
            required
            type="checkbox"
            checked={formData.consentToContact}
            onChange={(event) =>
              updateField("consentToContact", event.target.checked)
            }
            className="mt-1 h-4 w-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500"
          />

          <span className="text-sm leading-6 text-slate-700">
            I agree that the team may contact me about this enquiry using the
            contact details I have provided.
          </span>
        </label>

        <label className="flex cursor-pointer items-start gap-3">
          <input
            required
            type="checkbox"
            checked={formData.acceptedPrivacyPolicy}
            onChange={(event) =>
              updateField("acceptedPrivacyPolicy", event.target.checked)
            }
            className="mt-1 h-4 w-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500"
          />

          <span className="text-sm leading-6 text-slate-700">
            I confirm that the information I have provided is accurate to the
            best of my knowledge and that I have read the privacy information.
          </span>
        </label>
      </div>

      {error && (
        <div
          role="alert"
          className="mt-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {error}
        </div>
      )}

      <div className="mt-8 flex flex-col gap-3 border-t border-slate-100 pt-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-xl text-xs leading-5 text-slate-500">
          Fields marked with an asterisk are required.
        </p>

        <button
          type="submit"
          disabled={submitting}
          className="rounded-lg bg-teal-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-teal-800 focus:outline-none focus:ring-4 focus:ring-teal-200 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? "Submitting enquiry..." : "Submit enquiry"}
        </button>
      </div>
    </form>
  );
}