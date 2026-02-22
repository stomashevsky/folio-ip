export const TABLE_PAGE_WRAPPER = "flex h-full flex-col overflow-hidden";
export const TABLE_PAGE_CONTENT = "flex min-h-0 flex-1 flex-col px-4 pt-4 md:px-6";

/* ─── Shared table cell styles ─── */

/** Base <th> styles without text-align (uppercase, sort-ready) */
export const TABLE_TH_BASE = "whitespace-nowrap py-1.5 pr-2 text-xs font-semibold uppercase tracking-[0.5px] text-[var(--color-text-tertiary)]";

/** <th> className for DataTable-style headers (left-aligned) */
export const TABLE_TH = `text-left ${TABLE_TH_BASE}`;

/** Wrapper <div> inside <th> for sortable header content */
export const TABLE_TH_SORTABLE = "cursor-pointer select-none hover:text-[var(--color-text)]";

/** Sort icon size (px) */
export const TABLE_SORT_ICON_SIZE = 14;

/** <td> className for DataTable rows */
export const TABLE_TD = "truncate py-0 pr-2 align-middle text-sm text-[var(--color-text)]";

/** <td> className for CountriesTab rows (taller row height than DataTable) */
export const COUNTRIES_TD = "py-2 pr-2 align-middle";
