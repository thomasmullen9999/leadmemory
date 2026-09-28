import { NavBar } from "@/components/NavBar";
import { ClaimEnquiryForm } from "@/components/ClaimEnquiryForm";

export default function StartAClaimPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <NavBar />

      <main className="mx-auto max-w-4xl px-6 py-12">
        <section className="mb-8 text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-teal-700">
            Claim enquiry
          </p>

          <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
            Start your claim enquiry
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-slate-600">
            Tell us a little about your situation and a member of the team can
            review your enquiry and contact you about the next steps.
          </p>
        </section>

        <ClaimEnquiryForm />

        <p className="mx-auto mt-6 max-w-3xl text-center text-xs leading-5 text-slate-500">
          Submitting an enquiry does not guarantee eligibility, acceptance,
          compensation, or a successful outcome. Please do not include bank
          card numbers, passwords, security answers, or other highly sensitive
          credentials in this form.
        </p>
      </main>
    </div>
  );
}