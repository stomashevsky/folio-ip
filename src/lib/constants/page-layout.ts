import type { ControlSize } from "@plexui/ui/types";

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


/* ─── Modal / settings panel control constants ─── */

/** Control size for all Input, Select, Tabs inside modals and settings panels */
export const MODAL_CONTROL_SIZE: ControlSize = "sm";

/** Width for small number inputs (age, days, etc.) inside modals */
export const MODAL_NUMBER_INPUT_WIDTH = "w-20";

/** Width for Select dropdowns inside per-row modal settings */
export const MODAL_ROW_SELECT_WIDTH = "w-[320px]";

/** Width for Select dropdowns inside split-panel modal settings */
export const MODAL_PANEL_SELECT_WIDTH = "w-64";

/** Width for left panel in split-layout modals */
export const MODAL_SPLIT_LEFT_WIDTH = "w-[280px]";


/* ─── Two-column panel header ─── */

/** Column header container (border-b + bg). Height driven by text-sm line-height so all columns match. */
export const COLUMN_HEADER = "flex shrink-0 items-center gap-2.5 border-b border-[var(--color-border)] bg-[var(--color-surface-secondary)] px-4 py-2.5";

/** Column header label (uppercase, tertiary) */
export const COLUMN_HEADER_LABEL = "flex-1 truncate text-xs font-semibold uppercase tracking-[0.5px] text-[var(--color-text-tertiary)]";

/** Column header value (right side counter / status text). Sets text-sm which drives min row height. */
export const COLUMN_HEADER_VALUE = "shrink-0 whitespace-nowrap text-sm text-[var(--color-text)]";