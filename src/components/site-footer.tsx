import { site } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-blush">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-8 text-sm text-ink/70 sm:flex-row sm:justify-between sm:px-6">
        <p>
          © {site.name}. A demo store; no real payments are taken.
        </p>
        <a href={`mailto:${site.contactEmail}`} className="hover:text-rose">
          {site.contactEmail}
        </a>
      </div>
    </footer>
  );
}
