"use client";

import { useActionState, useEffect, useState } from "react";
import { RichTextEditor } from "./RichTextEditor";
import { adminUpsertPage } from "@/lib/admin/actions";
import type { PageRecord } from "@/lib/content/types";

const PAGE_TEMPLATES = ["type", "sector", "guide", "comparison", "faq", "use_case", "custom"];
const PAGE_GROUPS = ["types", "sectors", "guides", "compare", "faqs", "use-cases", "core"];
const PUBLISH_MODES = ["page", "section_only", "faq_only", "hold"];
const STATUSES = ["draft", "published", "archived"];

interface Props {
  page?: PageRecord;
}

export function PageForm({ page }: Props) {
  type FormState = { ok: boolean; error: string };
  const [state, action, pending] = useActionState(
    async (_prev: FormState, fd: FormData): Promise<FormState> => {
      try {
        await adminUpsertPage(fd);
        return { ok: true, error: "" };
      } catch (e: unknown) {
        return { ok: false, error: e instanceof Error ? e.message : "Save failed" };
      }
    },
    { ok: false, error: "" },
  );

  const [template, setTemplate] = useState(page?.page_template ?? "sector");
  const [group, setGroup] = useState(page?.page_group ?? "sectors");

  // Auto-derive full_path from group + slug
  const [slug, setSlug] = useState(page?.slug ?? "");
  const [fullPath, setFullPath] = useState(page?.full_path ?? "");

  useEffect(() => {
    if (!page && slug) {
      const groupPath = group === "core" ? "" : `/${group}`;
      setFullPath(`${groupPath}/${slug}`);
    }
  }, [slug, group, page]);

  return (
    <form action={action} className="space-y-8">
      {state.error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-md">
          {state.error}
        </div>
      )}
      {state.ok && (
        <div className="bg-green-50 border border-green-200 text-green-700 text-sm px-4 py-3 rounded-md">
          Saved successfully.
        </div>
      )}

      {/* Identity */}
      <section className="bg-white border border-gray-200 rounded-lg p-6 space-y-4">
        <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Identity</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Slug *</label>
            <input
              name="slug"
              required
              defaultValue={page?.slug}
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              readOnly={!!page}
              placeholder="e.g. restaurant"
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 read-only:bg-gray-50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full path *</label>
            <input
              name="full_path"
              required
              value={fullPath}
              onChange={(e) => setFullPath(e.target.value)}
              placeholder="e.g. /sectors/restaurant"
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Template *</label>
            <select
              name="page_template"
              value={template}
              onChange={(e) => setTemplate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {PAGE_TEMPLATES.map((t) => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Group *</label>
            <select
              name="page_group"
              value={group}
              onChange={(e) => setGroup(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {PAGE_GROUPS.map((g) => <option key={g}>{g}</option>)}
            </select>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              name="status"
              defaultValue={page?.status ?? "draft"}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {STATUSES.map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Publish mode</label>
            <select
              name="publish_mode"
              defaultValue={page?.publish_mode ?? "page"}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {PUBLISH_MODES.map((m) => <option key={m}>{m}</option>)}
            </select>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="hidden"
            name="indexable"
            value="false"
          />
          <input
            type="checkbox"
            id="indexable"
            name="indexable"
            value="true"
            defaultChecked={page?.indexable ?? true}
          />
          <label htmlFor="indexable" className="text-sm text-gray-700">
            Indexable (allow Google to index this page)
          </label>
        </div>
      </section>

      {/* SEO */}
      <section className="bg-white border border-gray-200 rounded-lg p-6 space-y-4">
        <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">SEO</h2>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Title <span className="text-gray-400 font-normal">(shown in browser tab, max 70 chars)</span>
          </label>
          <input
            name="title"
            required
            defaultValue={page?.title}
            maxLength={70}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Meta title <span className="text-gray-400 font-normal">(Google title, max 60 chars)</span>
          </label>
          <input
            name="meta_title"
            required
            defaultValue={page?.meta_title}
            maxLength={60}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Meta description <span className="text-gray-400 font-normal">(110–165 chars)</span>
          </label>
          <textarea
            name="meta_description"
            required
            defaultValue={page?.meta_description}
            rows={2}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">H1</label>
          <input
            name="h1"
            required
            defaultValue={page?.h1}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Canonical URL</label>
          <input
            name="canonical_url"
            defaultValue={page?.canonical_url ?? ""}
            type="url"
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </section>

      {/* Content */}
      <section className="bg-white border border-gray-200 rounded-lg p-6 space-y-4">
        <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Content</h2>
        <RichTextEditor
          name="intro_html"
          defaultValue={page?.intro_html ?? ""}
          label="Intro paragraph"
        />
        <RichTextEditor
          name="body_html"
          defaultValue={page?.body_html ?? ""}
          label="Body HTML (optional — sections are preferred)"
        />
      </section>

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={pending}
          className="px-5 py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 disabled:opacity-50 transition-colors"
        >
          {pending ? "Saving…" : page ? "Save changes" : "Create page"}
        </button>
        <a
          href="/admin/pages"
          className="px-5 py-2.5 border border-gray-300 text-gray-700 text-sm rounded-md hover:bg-gray-50 transition-colors"
        >
          Cancel
        </a>
      </div>
    </form>
  );
}
