import Link from "next/link";
import Image from "next/image";

import type { FaqItemRecord, PageRecord, PageSectionRecord } from "@/lib/content/types";

interface SeoPageRendererProps {
  page: PageRecord;
  sections: PageSectionRecord[];
  faqs: FaqItemRecord[];
}

const primaryIcons = [
  "https://cdn.prod.website-files.com/69d60c7f2cadcb17fa6da42c/69d60c812cadcb17fa6da505_ArrowUp%20(1).svg",
  "https://cdn.prod.website-files.com/69d60c7f2cadcb17fa6da42c/69d60c812cadcb17fa6da4ca_Coins.svg",
  "https://cdn.prod.website-files.com/69d60c7f2cadcb17fa6da42c/69d60c812cadcb17fa6da4e0_Feather.svg",
  "https://cdn.prod.website-files.com/69d60c7f2cadcb17fa6da42c/69d60c812cadcb17fa6da4ec_Tab%20Icon-4.svg",
  "https://cdn.prod.website-files.com/69d60c7f2cadcb17fa6da42c/69d60c812cadcb17fa6da4ee_Tab%20Icon-3.svg",
  "https://cdn.prod.website-files.com/69d60c7f2cadcb17fa6da42c/69d60c812cadcb17fa6da4eb_Tab%20Icons-2.svg",
  "https://cdn.prod.website-files.com/69d60c7f2cadcb17fa6da42c/69d60c812cadcb17fa6da4ed_Tab%20Icons-1.svg",
];

const supportIcons = [
  "https://cdn.prod.website-files.com/69d60c7f2cadcb17fa6da42c/69d60c812cadcb17fa6da573_Third%20Tab%20Icon-4.svg",
  "https://cdn.prod.website-files.com/69d60c7f2cadcb17fa6da42c/69d60c812cadcb17fa6da574_Third%20Tab%20Icon-2.svg",
  "https://cdn.prod.website-files.com/69d60c7f2cadcb17fa6da42c/69d60c812cadcb17fa6da575_Third%20Tab%20Icon-3.svg",
];

export function SeoPageRenderer({ page, sections, faqs }: SeoPageRendererProps) {
  const faqSchemaItems = faqs
    .filter((faq) => faq.schema_enabled)
    .map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer_html.replace(/<[^>]+>/g, " ").trim(),
      },
    }));

  const sectionRows = sections.map((section, index) => ({
    ...section,
    icon: primaryIcons[index % primaryIcons.length],
  }));

  const pitchPoints = [
    "Fast decisions with clear next steps",
    "Flexible repayment tied to sales performance",
    "Straightforward process built for UK businesses",
  ];

  return (
    <main className="bg-slate-50">
      <section className="bg-gradient-to-br from-slate-900 via-blue-900 to-slate-950 text-white">
        <div className="mx-auto grid w-full max-w-6xl gap-8 px-6 py-14 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <p className="inline-flex rounded-full border border-blue-300/35 bg-blue-500/15 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-blue-100">
              {page.page_group}
            </p>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">{page.h1}</h1>
            {page.intro_html ? (
              <section
                className="prose prose-invert mt-5 max-w-none text-blue-50"
                dangerouslySetInnerHTML={{ __html: page.intro_html }}
              />
            ) : null}
            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href="/eligibility"
                className="rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-slate-900 transition hover:bg-blue-100"
              >
                Check eligibility
              </Link>
              <Link
                href="/calculator"
                className="rounded-full border border-white/40 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Use repayment calculator
              </Link>
            </div>
          </div>

          <div className="rounded-2xl border border-white/15 bg-white/10 p-6 shadow-2xl backdrop-blur">
            <h2 className="text-xl font-semibold">Why businesses choose this route</h2>
            <div className="mt-5 space-y-4">
              {pitchPoints.map((point, index) => (
                <div key={point} className="flex items-start gap-3 rounded-xl bg-white/10 p-3">
                  <Image
                    src={supportIcons[index % supportIcons.length]}
                    alt=""
                    width={24}
                    height={24}
                    className="mt-0.5 h-6 w-6"
                  />
                  <p className="text-sm text-blue-50">{point}</p>
                </div>
              ))}
            </div>
            <p className="mt-5 text-xs text-blue-100/80">
              Built for conversion-first funding pages with clear information and frictionless next actions.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-6 py-12">
        <div className="grid gap-4 md:grid-cols-3">
          {[
            "No hidden process complexity",
            "Designed for intent-driven traffic",
            "Clear path from content to enquiry",
          ].map((value, index) => (
            <article key={value} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <Image src={primaryIcons[index]} alt="" width={32} height={32} className="h-8 w-8" />
              <p className="mt-3 text-sm font-medium text-slate-800">{value}</p>
            </article>
          ))}
        </div>

        <div className="mt-10 grid gap-5 lg:grid-cols-2">
          {sectionRows.map((section) => (
            <article key={section.id} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <Image src={section.icon} alt="" width={28} height={28} className="h-7 w-7" />
                <h2 className="text-xl font-semibold text-slate-900">
                  {section.heading ?? section.section_label ?? section.section_key}
                </h2>
              </div>
              <div
                className="prose mt-4 max-w-none prose-slate"
                dangerouslySetInnerHTML={{ __html: section.content_html }}
              />
            </article>
          ))}
        </div>

        {page.body_html ? (
          <section className="prose mt-10 max-w-none rounded-2xl border border-slate-200 bg-white p-6 prose-slate">
            <div dangerouslySetInnerHTML={{ __html: page.body_html }} />
          </section>
        ) : null}

        {faqs.length > 0 ? (
          <section className="mt-14 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-semibold text-slate-900">Frequently Asked Questions</h2>
            <div className="mt-6 space-y-4">
              {faqs.map((faq) => (
                <article key={faq.id} className="rounded-xl border border-slate-200 p-4">
                  <h3 className="text-base font-semibold text-slate-900">{faq.question}</h3>
                  <div
                    className="prose mt-2 max-w-none text-sm prose-slate"
                    dangerouslySetInnerHTML={{ __html: faq.answer_html }}
                  />
                </article>
              ))}
            </div>
          </section>
        ) : null}

        <section className="mt-14 rounded-2xl bg-slate-900 p-7 text-white">
          <h2 className="text-2xl font-semibold">Ready to explore options?</h2>
          <p className="mt-2 text-sm text-slate-200">
            Use the calculator to set expectations, then check eligibility to move forward with confidence.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              href="/calculator"
              className="rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-slate-900 transition hover:bg-blue-100"
            >
              Open calculator
            </Link>
            <Link
              href="/eligibility"
              className="rounded-full border border-white/40 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              Start eligibility
            </Link>
          </div>
        </section>

        <footer className="mt-10 border-t border-slate-200 pt-6 text-sm text-slate-500">
          <Link href="/" className="hover:text-slate-900">
            Back to homepage shell
          </Link>
        </footer>
      </section>

      {faqSchemaItems.length > 0 ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: faqSchemaItems,
            }),
          }}
        />
      ) : null}
    </main>
  );
}
