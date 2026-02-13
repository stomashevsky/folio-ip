import type { KeyValueRow } from "@/components/shared/KeyValueTable";

function locationRows(
  session: { deviceOs: string; deviceType: string; networkRegion: string; networkCountry: string },
  lat: number,
  lng: number,
): KeyValueRow[] {
  return [
    { label: "Device", value: `${session.deviceOs}, ${session.deviceType}` },
    { label: "Coordinates", value: `${lat.toFixed(4)}° N ${Math.abs(lng).toFixed(4)}° ${lng >= 0 ? "E" : "W"}` },
    { label: "Region", value: session.networkRegion },
    { label: "Country", value: session.networkCountry },
  ];
}

export function LocationPanel({
  title,
  session,
  lat,
  lng,
  borderLeft,
}: {
  title: string;
  session: { deviceOs: string; deviceType: string; networkRegion: string; networkCountry: string };
  lat: number;
  lng: number;
  borderLeft?: boolean;
}) {
  const rows = locationRows(session, lat, lng);
  return (
    <div className={borderLeft ? "border-t border-[var(--color-border)] md:border-l md:border-t-0" : ""}>
      <div className="border-b border-[var(--color-border)] bg-[var(--color-surface-secondary)] px-4 py-2">
        <span className="text-xs font-medium text-[var(--color-text-tertiary)]">{title}</span>
      </div>
      <table className="w-full">
        <tbody>
          {rows.map((row) => (
            <tr key={String(row.label)} className="border-b border-[var(--color-border)] last:border-b-0">
              <td className="w-2/5 px-4 py-2 text-sm text-[var(--color-text-tertiary)]">{row.label}</td>
              <td className="px-4 py-2 text-sm text-[var(--color-text)]">{row.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
