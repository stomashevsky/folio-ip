import { KeyValueTable } from "@/components/shared";

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
  const rows = [
    { label: "Device", value: `${session.deviceOs}, ${session.deviceType}` },
    { label: "Coordinates", value: `${lat.toFixed(4)}° N ${Math.abs(lng).toFixed(4)}° ${lng >= 0 ? "E" : "W"}` },
    { label: "Region", value: session.networkRegion },
    { label: "Country", value: session.networkCountry },
  ];

  return (
    <div className={borderLeft ? "border-t border-[var(--color-border)] md:border-l md:border-t-0" : ""}>
      <KeyValueTable bare title={title} rows={rows} />
    </div>
  );
}
