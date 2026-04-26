"use client";

import { useState } from "react";
import { RichTextEditor } from "./RichTextEditor";
import { adminUpsertFaq, adminDeleteFaq } from "@/lib/admin/actions";
import type { FaqItemRecord } from "@/lib/content/types";

interface Props {
  pageSlug: string;
  faqs: FaqItemRecord[];
}

export function FaqEditor({ pageSlug, faqs: initial }: Props) {
  const [faqs, setFaqs] = useState(initial);
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleDelete(id: string) {
    if (!confirm("Delete this FAQ?")) return;
    try {
      await adminDeleteFaq(id, pageSlug);
      setFaqs((prev) => prev.filter((f) => f.id !== id));
    } catch {
      setError("Delete failed");
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    fd.set("target_page_slug", pageSlug);
    try {
      await adminUpsertFaq(fd);
      setAdding(false);
      window.location.reload();
    } catch {
      setError("Save failed");
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-gray-800">FAQs ({faqs.length})</h2>
        {!adding && (
          <button
            type="button"
            onClick={() => setAdding(true)}
            className="px-3 py-1.5 text-sm bg-white border border-gray-300 rounded hover:bg-gray-50"
          >
            + Add FAQ
          </button>
        )}
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      {adding && (
        <form onSubmit={handleSubmit} className="border border-indigo-200 rounded-lg p-4 space-y-3 bg-indigo-50">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Question *</label>
            <input
              name="question"
              required
              className="w-full px-3 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
          <RichTextEditor name="answer_html" label="Answer *" />
          <div className="flex items-center gap-2">
            <input type="checkbox" name="schema_enabled" value="true" id="schema_enabled" defaultChecked />
            <label htmlFor="schema_enabled" className="text-sm text-gray-700">
              Include in FAQ schema (Google rich result)
            </label>
          </div>
          <div className="flex gap-2 justify-end">
            <button
              type="button"
              onClick={() => setAdding(false)}
              className="px-3 py-1.5 text-sm border border-gray-300 rounded hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-3 py-1.5 text-sm bg-indigo-600 text-white rounded hover:bg-indigo-700"
            >
              Save FAQ
            </button>
          </div>
        </form>
      )}

      {faqs.map((faq) => (
        <div key={faq.id} className="border border-gray-200 rounded-lg p-4 bg-white">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-800">{faq.question}</p>
              <div
                className="mt-1 text-xs text-gray-500 line-clamp-2"
                dangerouslySetInnerHTML={{
                  __html: faq.answer_html.replace(/<[^>]+>/g, " ").slice(0, 160) + "…",
                }}
              />
              {faq.schema_enabled && (
                <span className="inline-block mt-1 text-xs text-green-600">schema enabled</span>
              )}
            </div>
            <button
              type="button"
              onClick={() => handleDelete(faq.id)}
              className="text-xs text-red-500 hover:underline flex-shrink-0"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
