import { ROLE_COLORS } from "../../utils/constants";
import { titleCase } from "../../utils/formatters";

export default function RoleBadge({ role }) {
  const color = ROLE_COLORS[role] || "#8B9CB0";
  return (
    <span
      className="inline-flex rounded-full px-2.5 py-1 text-xs font-semibold"
      style={{ backgroundColor: `${color}22`, color }}
    >
      {titleCase(role)}
    </span>
  );
}
