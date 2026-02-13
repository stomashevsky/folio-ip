import { Badge } from "@plexui/ui/components/Badge";
import { SectionHeading, KeyValueTable } from "@/components/shared";
import { behavioralRiskDescriptions } from "@/lib/data/check-descriptions";
import type { KeyValueSection } from "@/components/shared/KeyValueTable";
import type { BehavioralRisk } from "@/lib/types";
import { InfoTip } from "./InfoTip";

function ThreatBadge({ level }: { level: string }) {
  const color = level === "low" ? "success" : level === "medium" ? "warning" : "danger";
  const label = level.charAt(0).toUpperCase() + level.slice(1);
  return (
    <Badge color={color} size="sm">
      {label}
    </Badge>
  );
}

function riskLabel(name: string) {
  const desc = behavioralRiskDescriptions[name];
  return (
    <span className="inline-flex items-center gap-1">
      {name}
      {desc && <InfoTip text={desc} />}
    </span>
  );
}

export function BehavioralRiskSignals({ risk }: { risk: BehavioralRisk }) {
  const mins = Math.floor(risk.completionTime / 60);
  const secs = risk.completionTime % 60;
  const completionStr = `${mins}m ${secs}s`;

  const sections: KeyValueSection[] = [
    {
      title: "Overall risk scores",
      rows: [
        { label: riskLabel("Behavior threat level"), value: <ThreatBadge level={risk.behaviorThreatLevel} /> },
        { label: riskLabel("Bot score"), value: risk.botScore },
      ],
    },
    {
      title: "Spoof attempts",
      rows: [
        { label: riskLabel("Request spoof attempts"), value: risk.requestSpoofAttempts },
        { label: riskLabel("User agent spoof attempts"), value: risk.userAgentSpoofAttempts },
        { label: riskLabel("Restricted mobile SDK requests"), value: risk.mobileSdkRestricted },
        { label: riskLabel("Restricted API version requests"), value: risk.apiVersionRestricted },
      ],
    },
    {
      title: "User behavior",
      rows: [
        { label: riskLabel("User completion time"), value: completionStr },
        { label: riskLabel("Distraction events"), value: risk.distractionEvents },
        { label: riskLabel("Hesitation percentage"), value: `${risk.hesitationPercent}%` },
      ],
    },
    {
      title: "Form filling",
      rows: [
        { label: riskLabel("Shortcut usage (copies)"), value: risk.shortcutCopies },
        { label: riskLabel("Shortcut usage (pastes)"), value: risk.pastes },
        { label: riskLabel("Autofill starts"), value: risk.autofillStarts },
      ],
    },
  ];

  return (
    <div>
      <SectionHeading>Behavioral risk signals</SectionHeading>
      <div className="overflow-x-auto">
        <KeyValueTable sections={sections} />
      </div>
    </div>
  );
}
