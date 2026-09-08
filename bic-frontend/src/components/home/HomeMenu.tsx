import { Link } from "react-router-dom";
import {
  FilePlus2,
  User,
  Building2,
  Search,
  PencilLine,
  Bell,
  ChevronRight,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface MenuLeaf {
  label: string;
  to?: string;
  icon: LucideIcon;
  disabled?: boolean;
  hint?: string;
}

interface MenuGroup {
  label: string;
  icon: LucideIcon;
  items: MenuLeaf[];
}

const menu: (MenuGroup | MenuLeaf)[] = [
  {
    label: "Nouvelle demande",
    icon: FilePlus2,
    items: [
      { label: "Individu", to: "/demande/nouvelle/individu", icon: User },
      { label: "Entreprise", icon: Building2, disabled: true, hint: "À venir" },
    ],
  },
  {
    label: "Recherche",
    icon: Search,
    items: [{ label: "Recherche par individu", to: "/recherche/individu", icon: User }],
  },
  { label: "Modification demande", to: "/demande/modifier", icon: PencilLine },
  { label: "Alertes", to: "/alertes", icon: Bell },
];

function isGroup(entry: MenuGroup | MenuLeaf): entry is MenuGroup {
  return "items" in entry;
}

export function HomeMenu() {
  return (
    <div className="mx-auto max-w-xl py-10">
      <h2 className="mb-1 text-xl font-semibold text-slate-900">Que voulez-vous faire ?</h2>
      <p className="mb-6 text-sm text-slate-500">Choisissez une action pour commencer.</p>

      <nav className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        {menu.map((entry, i) => (
          <div key={entry.label} className={cn(i > 0 && "border-t border-slate-100")}>
            {isGroup(entry) ? (
              <>
                <div className="flex items-center gap-2 px-4 pt-4 pb-1 text-sm font-medium text-slate-500">
                  <entry.icon className="size-4" />
                  {entry.label}
                </div>
                <ul>
                  {entry.items.map((item) => (
                    <MenuRow key={item.label} item={item} indent />
                  ))}
                </ul>
              </>
            ) : (
              <ul>
                <MenuRow item={entry} />
              </ul>
            )}
          </div>
        ))}
      </nav>
    </div>
  );
}

function MenuRow({ item, indent }: { item: MenuLeaf; indent?: boolean }) {
  const content = (
    <div
      className={cn(
        "flex items-center justify-between gap-3 px-4 py-3 text-sm transition-colors",
        indent && "pl-10",
        item.disabled ? "cursor-not-allowed text-slate-300" : "text-slate-700 hover:bg-slate-50"
      )}
    >
      <span className="flex items-center gap-2">
        <item.icon className="size-4" />
        {item.label}
      </span>
      {item.disabled ? (
        <span className="text-xs text-slate-300">{item.hint}</span>
      ) : (
        <ChevronRight className="size-4 text-slate-300" />
      )}
    </div>
  );

  if (item.disabled || !item.to) return <li>{content}</li>;
  return (
    <li>
      <Link to={item.to}>{content}</Link>
    </li>
  );
}