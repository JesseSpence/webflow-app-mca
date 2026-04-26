"use client";

import { useState } from "react";
import { RichTextEditor } from "./RichTextEditor";
import { adminUpsertSection, adminDeleteSection } from "@/lib/admin/actions";
import type { PageSectionRecord } from "@/lib/content/types";

interface Props {
  pageSlug: string;
  sections: PageSectionRecord[];
}

export function SectionEditor({ pageSlug, sections: initial }: Props) {
  const [sections, setSections] = useState(initial);
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleDelete(id: string) {
    if (!confirm("Delete this section?")) return;
    try {
      await adminDeleteSection(id, pageSlug);
      setSections((prev) => prev.filter((s) => s.id !== id));
    } catch {
      setError("Delete failed");
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    fd.set("target_page_slug", pageSlug);
    try {
      await adminUpsertSection(fd);
      setAdding(false);
      setEditingId(null);
      window.location.reload();
    } catch {
      setError("Save failed");
    }
  }

  const SectionForm = ({ section }: { section?: PageSectionRecord }) => (
    <form onSubmit={handleSubmit} className="border border-indigo-200 rounded-lg p-4 space-y-3 bg-indigo-50">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Section key *</label>
          <input
            name="section_key"
            defaultValue={section?.section_key}
            required
            placeholder="e.g. hero, definition"
            className="w-full px-3 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Sort order</label>
          <input
            name="sort_order"
            type="number"
            defaultValue={section?.sort_order ?? sections.length}
            className="w-full px-3 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">Heading</label>
        <input
          name="heading"
          defaultValue={section?.heading ?? ""}
          className="w-full px-3 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">Keyword theme</label>
        <input
          name="keyword_theme"
          defaultValue={section?.keyword_theme ?? ""}
          className="w-full px-3 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
        />
      </div>
      <RichTextEditor name="content_html" defaultValue={section?.content_html} label="Content *" />
      <div className="flex gap-2 justify-end">
        <button
          type="button"
          onClick={() => { setAdding(false); setEditingId(null); }}
          className="px-3 py-1.5 text-sm border border-gray-300 rounded hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-3 py-1.5 text-sm bg-indigo-600 text-white rounded hover:bg-indigo-700"
        >
          Save section
        </button>
      </div>
    </form>
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-gray-800">Sections ({sections.length})</h2>
        {!adding && (
          <button
            type="button"
            onClick={() => setAdding(true)}
            className="px-3 py-1.5 text-sm bg-white border border-gray-300 rounded hover:bg-gray-50"
          >
            + Add section
          </button>
        )}
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      {adding && <SectionForm />}

      {sections.map((section) => (
        <div key={section.id}>
          {editingId === section.id ? (
            <SectionForm section={section} />
          ) : (
            <div className="border border-gray-200 rounded-lg p-4 bg-white">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="inline-block bg-gray-100 text-gray-700 text-xs font-mono px-2 py-0.5 rounded mr-2">
                    {section.section_key}
                  </span>
                  <span className="text-xs text-gray-400">order: {section.sort_order}</span>
                  {section.heading && (
                    <p className="text-sm font-medium text-gray-800 mt-1">{section.heading}</p>
                  )}
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button
                    type="button"
                    onClick={() => setEditingId(section.id)}
                    className="text-xs text-indigo-600 hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(section.id)}
                    className="text-xs text-red-500 hover:underline"
                  >
                    Delete
                  </button>
                </div>
              </div>
              {section.content_html && (
                <div
                  className="mt-2 text-xs text-gray-500 line-clamp-2"
                  dangerouslySetInnerHTML={{
                    __html: section.content_html.replace(/<[^>]+>/g, " ").slice(0, 160) + "…",
                  }}
                />
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
