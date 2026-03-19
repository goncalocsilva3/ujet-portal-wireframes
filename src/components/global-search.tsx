"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { createPortal } from "react-dom";
import {
  Search,
  X,
  ChevronUp,
  LayoutGrid,
  Settings,
  Globe,
  Monitor,
  Users,
  Headset,
  Radio,
  ListOrdered,
  Wrench,
  CalendarClock,
  Megaphone,
  Shell,
  BarChart3,
  FileText,
  Phone,
  MessageSquare,
  Mail,
  Clock,
  Shield,
  Key,
  Database,
} from "lucide-react";

// ─── Search data types ───────────────────────────────────

interface SearchItem {
  id: string;
  name: string;
  page: string;
  category: string;
  breadcrumb: string;
  icon: React.ReactNode;
  keywords: string[];
  content: string;
}

type FilterCategory = "Dashboards" | "Settings" | "Tools" | "Call" | "Chat" | "Email" | "WFM" | "Users and Teams";

// ─── Search data ─────────────────────────────────────────

const searchItems: SearchItem[] = [
  // SETTINGS — General
  {
    id: "contact-center-details",
    name: "Contact Center Details",
    page: "/settings/contact-center-details",
    category: "Settings",
    breadcrumb: "General",
    icon: <Settings className="size-4" />,
    keywords: ["contact center", "details", "organization", "company", "avatar"],
    content: "Manage your contact center details settings including name, timezone, and branding.",
  },
  {
    id: "hours-of-operation",
    name: "Hours of Operation and Holidays",
    page: "/settings/hours-of-operation",
    category: "Settings",
    breadcrumb: "General",
    icon: <Clock className="size-4" />,
    keywords: ["hours", "operation", "holidays", "schedule", "business hours"],
    content: "Configure business hours and holiday schedules for your contact center.",
  },
  {
    id: "phone-numbers",
    name: "Phone Numbers",
    page: "/settings/phone-numbers",
    category: "Settings",
    breadcrumb: "General",
    icon: <Phone className="size-4" />,
    keywords: ["phone", "numbers", "telephony", "caller", "DID", "outbound"],
    content: "Manage phone numbers and telephony settings for call routing.",
  },
  {
    id: "system-settings",
    name: "System Settings",
    page: "/settings/system-settings",
    category: "Settings",
    breadcrumb: "General",
    icon: <Shield className="size-4" />,
    keywords: ["system", "security", "integrations", "api", "configuration"],
    content: "Security, integrations, and system-wide configuration settings.",
  },
  {
    id: "consumer-management",
    name: "Consumer Management",
    page: "/settings/consumer-management",
    category: "Settings",
    breadcrumb: "General",
    icon: <Users className="size-4" />,
    keywords: ["consumer", "privacy", "blocklist", "customer", "management"],
    content: "Configure consumer privacy and blocklist settings.",
  },
  {
    id: "agent-desktop-settings",
    name: "Agent Desktop Settings",
    page: "/settings/agent-desktop-settings",
    category: "Settings",
    breadcrumb: "General",
    icon: <Monitor className="size-4" />,
    keywords: ["agent", "desktop", "toolbar", "agent experience"],
    content: "Configure the agent desktop experience and available tools.",
  },
  // SETTINGS — Languages & Messages
  {
    id: "languages-and-messages",
    name: "Languages and Messages",
    page: "/settings/languages-and-messages",
    category: "Settings",
    breadcrumb: "Settings",
    icon: <Globe className="size-4" />,
    keywords: ["languages", "messages", "localization", "translations", "i18n"],
    content: "Configure languages, localization, and message templates.",
  },
  // SETTINGS — Customer Engagement
  {
    id: "customer-satisfaction-ratings",
    name: "Customer Satisfaction Ratings",
    page: "/settings/customer-satisfaction-ratings",
    category: "Settings",
    breadcrumb: "Customer Engagement",
    icon: <Monitor className="size-4" />,
    keywords: ["csat", "satisfaction", "ratings", "feedback", "survey"],
    content: "Configure CSAT surveys and rating settings.",
  },
  {
    id: "forms",
    name: "Forms",
    page: "/settings/forms",
    category: "Settings",
    breadcrumb: "Customer Engagement",
    icon: <FileText className="size-4" />,
    keywords: ["forms", "fields", "customer forms", "data collection"],
    content: "Manage customer-facing forms and fields.",
  },
  {
    id: "surveys",
    name: "Surveys",
    page: "/settings/surveys",
    category: "Settings",
    breadcrumb: "Customer Engagement",
    icon: <FileText className="size-4" />,
    keywords: ["surveys", "questionnaire", "post-call", "feedback"],
    content: "Create and manage customer surveys.",
  },
  // SETTINGS — Channels
  {
    id: "channel-operations",
    name: "Channel Operations",
    page: "/settings/channel-operations",
    category: "Settings",
    breadcrumb: "Channels",
    icon: <Radio className="size-4" />,
    keywords: ["channel", "operations", "routing", "barge", "wrap-up"],
    content: "Configure channel-wide operation settings.",
  },
  {
    id: "call",
    name: "Call",
    page: "/settings/call",
    category: "Settings",
    breadcrumb: "Channels",
    icon: <Phone className="size-4" />,
    keywords: ["call", "voice", "telephony", "inbound", "outbound", "IVR"],
    content: "Configure call channel settings and features.",
  },
  {
    id: "chat",
    name: "Chat",
    page: "/settings/chat",
    category: "Settings",
    breadcrumb: "Channels",
    icon: <MessageSquare className="size-4" />,
    keywords: ["chat", "messaging", "web chat", "live chat"],
    content: "Configure chat channel settings.",
  },
  {
    id: "email",
    name: "Email",
    page: "/settings/email",
    category: "Settings",
    breadcrumb: "Channels",
    icon: <Mail className="size-4" />,
    keywords: ["email", "inbox", "email channel"],
    content: "Configure email channel settings.",
  },
  // SETTINGS — Queues
  {
    id: "queues",
    name: "Queues",
    page: "/settings/queues",
    category: "Settings",
    breadcrumb: "Queues",
    icon: <ListOrdered className="size-4" />,
    keywords: ["queues", "routing", "assignment", "priority", "skills-based"],
    content: "Configure queue settings, routing, and assignments.",
  },
  {
    id: "queue-groups",
    name: "Queue Groups",
    page: "/settings/queue-groups",
    category: "Settings",
    breadcrumb: "Queues",
    icon: <ListOrdered className="size-4" />,
    keywords: ["queue groups", "grouping", "categorization"],
    content: "Manage queue groups and queue categorization.",
  },
  // SETTINGS — Tools
  {
    id: "tools",
    name: "Tools",
    page: "/settings/tools",
    category: "Settings",
    breadcrumb: "Operations",
    icon: <Wrench className="size-4" />,
    keywords: ["tools", "utilities", "automation"],
    content: "Configure tools and utilities.",
  },
  // SETTINGS — People
  {
    id: "users-and-teams",
    name: "Users and Teams",
    page: "/settings/users-and-teams",
    category: "Settings",
    breadcrumb: "People",
    icon: <Users className="size-4" />,
    keywords: ["users", "teams", "agents", "supervisors", "admin"],
    content: "Manage users, teams, and organizational structure.",
  },
  {
    id: "roles-and-permissions",
    name: "Roles and Permissions",
    page: "/settings/roles-and-permissions",
    category: "Settings",
    breadcrumb: "People",
    icon: <Shield className="size-4" />,
    keywords: ["roles", "permissions", "access", "security", "RBAC"],
    content: "Configure roles and permission levels.",
  },
  {
    id: "agent-skills",
    name: "Agent Skills",
    page: "/settings/agent-skills",
    category: "Settings",
    breadcrumb: "People / Agents",
    icon: <Headset className="size-4" />,
    keywords: ["skills", "agent skills", "proficiency", "routing"],
    content: "Manage agent skills and proficiency settings.",
  },
  {
    id: "availability-preferences",
    name: "Availability Preferences",
    page: "/settings/availability-preferences",
    category: "Settings",
    breadcrumb: "People / Agents",
    icon: <Headset className="size-4" />,
    keywords: ["availability", "preferences", "agent status", "schedule"],
    content: "Configure availability and scheduling preferences.",
  },
  // SETTINGS — Apps
  {
    id: "wfm-general-settings",
    name: "WFM General Settings",
    page: "/settings/wfm-general-settings",
    category: "Settings",
    breadcrumb: "Apps / WFM",
    icon: <CalendarClock className="size-4" />,
    keywords: ["wfm", "workforce", "management", "scheduling", "forecasting"],
    content: "Workforce management general settings.",
  },
  {
    id: "campaigns",
    name: "Campaigns",
    page: "/settings/campaigns",
    category: "Settings",
    breadcrumb: "Apps",
    icon: <Megaphone className="size-4" />,
    keywords: ["campaign", "outbound", "dialer", "proactive"],
    content: "Campaign manager settings.",
  },
  {
    id: "api-credentials",
    name: "API Credentials",
    page: "/settings/api-credentials",
    category: "Settings",
    breadcrumb: "System Settings",
    icon: <Key className="size-4" />,
    keywords: ["api", "credentials", "keys", "tokens", "authentication"],
    content: "Generate and manage API keys for programmatic access.",
  },
  // DASHBOARDS
  {
    id: "dash-agent-performance",
    name: "Agent Performance",
    page: "Dashboard:Agent Performance",
    category: "Dashboards",
    breadcrumb: "Dashboards / Agents",
    icon: <BarChart3 className="size-4" />,
    keywords: ["agent", "performance", "metrics", "KPI"],
    content: "View agent performance metrics and KPIs.",
  },
  {
    id: "dash-agent-availability",
    name: "Agent Availability",
    page: "Dashboard:Agent Availability",
    category: "Dashboards",
    breadcrumb: "Dashboards / Agents",
    icon: <BarChart3 className="size-4" />,
    keywords: ["agent", "availability", "online", "status"],
    content: "Monitor real-time agent availability.",
  },
  {
    id: "dash-agent-activity",
    name: "Agent Activity Timeline",
    page: "Dashboard:Agent Activity",
    category: "Dashboards",
    breadcrumb: "Dashboards / Agents",
    icon: <BarChart3 className="size-4" />,
    keywords: ["agent", "activity", "timeline", "history"],
    content: "Agent activity timeline and work history.",
  },
  {
    id: "dash-agent-extensions",
    name: "Agent Extensions",
    page: "Dashboard:Agent Extensions",
    category: "Dashboards",
    breadcrumb: "Dashboards / Agents",
    icon: <BarChart3 className="size-4" />,
    keywords: ["agent", "extensions", "phone"],
    content: "Agent extension usage and statistics.",
  },
  {
    id: "dash-missed-interactions",
    name: "Missed Interactions",
    page: "Dashboard:Missed Interactions",
    category: "Dashboards",
    breadcrumb: "Dashboards / Agents",
    icon: <BarChart3 className="size-4" />,
    keywords: ["missed", "interactions", "abandoned", "calls"],
    content: "Dashboard for missed and abandoned interactions.",
  },
  {
    id: "dash-active-deactivated",
    name: "Active / Deactivated Users",
    page: "Dashboard:Active Users",
    category: "Dashboards",
    breadcrumb: "Dashboards / Agents",
    icon: <BarChart3 className="size-4" />,
    keywords: ["active", "deactivated", "users", "agents"],
    content: "View active and deactivated user accounts.",
  },
  {
    id: "dash-realtime-monitoring",
    name: "Real-time Agent Monitoring",
    page: "Dashboard:Realtime Monitoring",
    category: "Dashboards",
    breadcrumb: "Dashboards / Agents",
    icon: <BarChart3 className="size-4" />,
    keywords: ["realtime", "monitoring", "live", "agent", "supervisor"],
    content: "Real-time monitoring of agent activity and queues.",
  },
  {
    id: "dash-queue-overview",
    name: "Queue Overview",
    page: "Dashboard:Queue Overview",
    category: "Dashboards",
    breadcrumb: "Dashboards / Queues",
    icon: <BarChart3 className="size-4" />,
    keywords: ["queue", "overview", "wait times", "SLA"],
    content: "Queue performance overview and SLA metrics.",
  },
  {
    id: "dash-customer-experience",
    name: "Customer Experience",
    page: "Dashboard:Customer Experience",
    category: "Dashboards",
    breadcrumb: "Dashboards",
    icon: <BarChart3 className="size-4" />,
    keywords: ["customer", "experience", "CSAT", "NPS", "satisfaction"],
    content: "Customer experience and satisfaction dashboard.",
  },
];

// ─── Popular searches (shown when empty) ─────────────────

const recentSearches = [
  { name: "CRM", time: "15 minutes ago" },
  { name: "General and Operations", time: "30 minutes ago" },
  { name: "Calls", time: "1 hour ago" },
];

const popularSearches: { name: string; breadcrumb: string; icon: React.ReactNode }[] = [
  { name: "Users and Teams", breadcrumb: "Settings / People", icon: <Users className="size-4 text-[#6b7280]" /> },
  { name: "Queues", breadcrumb: "Settings / Queues", icon: <ListOrdered className="size-4 text-[#6b7280]" /> },
  { name: "Call", breadcrumb: "Settings / Channels", icon: <Phone className="size-4 text-[#6b7280]" /> },
];

// ─── Fuzzy matching algorithm ────────────────────────────

function levenshteinDistance(a: string, b: string): number {
  const matrix: number[][] = [];
  for (let i = 0; i <= a.length; i++) matrix[i] = [i];
  for (let j = 0; j <= b.length; j++) matrix[0][j] = j;
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + cost
      );
    }
  }
  return matrix[a.length][b.length];
}

function fuzzyMatchWord(query: string, target: string): number {
  const q = query.toLowerCase();
  const t = target.toLowerCase();

  // Exact match
  if (q === t) return 1.0;
  // Starts with
  if (t.startsWith(q)) return 0.95;
  // Contains
  if (t.includes(q)) return 0.85;

  // Typo tolerance (Levenshtein) for queries >= 4 chars
  if (q.length >= 4) {
    const dist = levenshteinDistance(q, t);
    const maxLen = Math.max(q.length, t.length);
    const similarity = 1 - dist / maxLen;
    if (similarity >= 0.7) return similarity * 0.8;
  }

  // Partial matching for queries >= 3 chars
  if (q.length >= 3) {
    let matched = 0;
    for (let i = 0; i < Math.min(q.length, t.length); i++) {
      if (q[i] === t[i]) matched++;
      else break;
    }
    if (matched >= 2 && matched / q.length >= 0.5) {
      return 0.75 * (matched / q.length);
    }
  }

  return 0;
}

function bestWordMatch(queryWord: string, targetWords: string[]): number {
  let best = 0;
  for (const tw of targetWords) {
    const score = fuzzyMatchWord(queryWord, tw);
    if (score > best) best = score;
  }
  return best;
}

interface SearchResult extends SearchItem {
  score: number;
  typoMatch?: string;
}

function searchAll(query: string, filter: FilterCategory | null): SearchResult[] {
  if (!query.trim() && !filter) return [];

  const items = filter
    ? searchItems.filter((item) => item.category === filter)
    : searchItems;

  if (!query.trim()) {
    // Filter only: return all items in category
    return items.map((item) => ({ ...item, score: 1 }));
  }

  const queryWords = query.trim().toLowerCase().split(/\s+/);
  const results: SearchResult[] = [];

  for (const item of items) {
    const titleWords = item.name.toLowerCase().split(/\s+/);
    const keywordWords = item.keywords.join(" ").toLowerCase().split(/\s+/);
    const contentWords = item.content.toLowerCase().split(/\s+/);
    const allTargetWords = [...titleWords, ...keywordWords, ...contentWords];

    // Check if all query words match
    let allMatch = true;
    let totalScore = 0;
    let hasTypo = false;

    for (const qw of queryWords) {
      // Priority: title > keywords > content
      const titleScore = bestWordMatch(qw, titleWords);
      const keywordScore = bestWordMatch(qw, keywordWords) * 0.9;
      const contentScore = bestWordMatch(qw, contentWords) * 0.8;
      const wordScore = Math.max(titleScore, keywordScore, contentScore);

      if (queryWords.length > 1 && wordScore <= 0.4) {
        allMatch = false;
        break;
      }
      if (queryWords.length === 1 && wordScore <= 0) {
        allMatch = false;
        break;
      }

      // Check for typo correction
      if (wordScore > 0 && wordScore < 0.85) {
        const bestTarget = allTargetWords.reduce((best, tw) => {
          const s = fuzzyMatchWord(qw, tw);
          return s > best.score ? { word: tw, score: s } : best;
        }, { word: "", score: 0 });
        if (bestTarget.score >= 0.6 && bestTarget.word !== qw) {
          hasTypo = true;
        }
      }

      totalScore += wordScore;
    }

    if (allMatch) {
      const avgScore = totalScore / queryWords.length;
      results.push({
        ...item,
        score: avgScore,
        typoMatch: hasTypo ? query : undefined,
      });
    }
  }

  results.sort((a, b) => b.score - a.score);
  return results;
}

// ─── Filter options ──────────────────────────────────────

const filterOptions: { label: FilterCategory; icon: React.ReactNode }[] = [
  { label: "Dashboards", icon: <BarChart3 className="size-3" /> },
  { label: "Settings", icon: <Settings className="size-3" /> },
  { label: "Tools", icon: <Wrench className="size-3" /> },
  { label: "Call", icon: <Phone className="size-3" /> },
  { label: "Chat", icon: <MessageSquare className="size-3" /> },
  { label: "Email", icon: <Mail className="size-3" /> },
  { label: "WFM", icon: <CalendarClock className="size-3" /> },
  { label: "Users and Teams", icon: <Users className="size-3" /> },
];

// ─── Component ───────────────────────────────────────────

interface GlobalSearchProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onNavigate: (href: string, label: string) => void;
}

export function GlobalSearch({ open, onOpenChange, onNavigate }: GlobalSearchProps) {
  const [query, setQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<FilterCategory | null>(null);
  const [filtersExpanded, setFiltersExpanded] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input when opened
  useEffect(() => {
    if (open) {
      const timer = setTimeout(() => inputRef.current?.focus(), 50);
      return () => clearTimeout(timer);
    }
  }, [open]);

  // Reset on close
  useEffect(() => {
    if (!open) {
      setQuery("");
      setActiveFilter(null);
    }
  }, [open]);

  // Keyboard shortcut: Cmd/Ctrl + K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        onOpenChange(!open);
      }
      if (e.key === "Escape" && open) {
        e.preventDefault();
        onOpenChange(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onOpenChange]);

  const handleInputKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      // Backspace on empty input with filter: remove filter
      if ((e.key === "Backspace" || e.key === "Delete") && !query && activeFilter) {
        e.preventDefault();
        setActiveFilter(null);
      }
    },
    [query, activeFilter]
  );

  const handleSelectResult = useCallback(
    (item: SearchResult | { page: string; name: string }) => {
      const page = "page" in item ? item.page : "";
      const name = "name" in item ? item.name : "";

      // Only navigate for settings pages that exist
      if (page.startsWith("/settings/")) {
        onNavigate(page, name);
      }
      onOpenChange(false);
      setQuery("");
      setActiveFilter(null);
    },
    [onNavigate, onOpenChange]
  );

  const handlePopularClick = useCallback(
    (item: (typeof popularSearches)[number]) => {
      const found = searchItems.find((si) => si.name === item.name);
      if (found) {
        onNavigate(found.page, found.name);
      }
      onOpenChange(false);
    },
    [onNavigate, onOpenChange]
  );

  const handleClearQuery = useCallback(() => {
    setQuery("");
    inputRef.current?.focus();
  }, []);

  const handleFilterClick = useCallback(
    (filter: FilterCategory) => {
      setActiveFilter((prev) => (prev === filter ? null : filter));
      inputRef.current?.focus();
    },
    []
  );

  const handleRemoveFilter = useCallback(() => {
    setActiveFilter(null);
    inputRef.current?.focus();
  }, []);

  const results = useMemo(() => searchAll(query, activeFilter), [query, activeFilter]);

  // Group results by category
  const groupedResults = useMemo(() => {
    const groups: Record<string, SearchResult[]> = {};
    for (const r of results) {
      if (!groups[r.category]) groups[r.category] = [];
      groups[r.category].push(r);
    }
    return groups;
  }, [results]);

  const totalResults = results.length;
  const hasQuery = query.trim().length > 0;
  const showResults = hasQuery || activeFilter;

  if (!open) return null;

  const modalContent = (
    <div className="fixed inset-0 z-[100]">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={() => onOpenChange(false)}
      />

      {/* Modal */}
      <div className="absolute left-1/2 top-16 w-full max-w-[774px] -translate-x-1/2">
        <div className="mx-4 flex flex-col overflow-hidden rounded-xl border border-[#e5e7eb] bg-white shadow-2xl">
          {/* Search input */}
          <div className="flex items-center gap-2 border-b border-[#e5e7eb] px-4 py-3">
            <Search className="size-4 shrink-0 text-[#6b7280]" />

            {/* Filter chip */}
            {activeFilter && (
              <span className="inline-flex shrink-0 items-center gap-1 rounded-md bg-[#f3f4f6] px-2 py-0.5 text-xs font-medium text-[#030712]">
                {activeFilter}
                <button
                  onClick={handleRemoveFilter}
                  className="ml-0.5 rounded-full p-0.5 transition-colors hover:bg-[#e5e7eb]"
                >
                  <X className="size-3" />
                </button>
              </span>
            )}

            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleInputKeyDown}
              placeholder={
                activeFilter
                  ? `Search in ${activeFilter}...`
                  : "Search for Settings, Dashboards, Agents, Queues, etc"
              }
              className="flex-1 bg-transparent text-sm text-[#030712] placeholder:text-[#9ca3af] outline-none"
            />

            {hasQuery && (
              <button
                onClick={handleClearQuery}
                className="rounded-full p-1 transition-colors hover:bg-[#f3f4f6]"
              >
                <X className="size-3.5 text-[#6b7280]" />
              </button>
            )}
            <button
              onClick={() => onOpenChange(false)}
              className="rounded-full p-1 transition-colors hover:bg-[#f3f4f6]"
            >
              <X className="size-4 text-[#6b7280]" />
            </button>
          </div>

          {/* Filter by category — collapsible */}
          <div className="border-b border-[#e5e7eb] px-4 py-2.5">
            <button
              onClick={() => setFiltersExpanded((p) => !p)}
              className="mb-1 flex w-full items-center justify-between"
            >
              <span className="text-[10px] font-medium uppercase tracking-wider text-[#6b7280]">
                Filter by Category
              </span>
              <ChevronUp
                className={`size-3.5 text-[#9ca3af] transition-transform duration-200 ${
                  filtersExpanded ? "" : "rotate-180"
                }`}
              />
            </button>
            <div
              className={`flex flex-wrap gap-1.5 overflow-hidden transition-all duration-200 ${
                filtersExpanded ? "mt-1 max-h-[80px] opacity-100" : "max-h-0 opacity-0"
              }`}
            >
              {filterOptions.map((opt) => (
                <button
                  key={opt.label}
                  onClick={() => handleFilterClick(opt.label)}
                  className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                    activeFilter === opt.label
                      ? "border-[#030712] bg-[#030712] text-white"
                      : "border-[#e5e7eb] bg-white text-[#030712] hover:bg-[#f3f4f6]"
                  }`}
                >
                  {opt.icon}
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Results area — scrollable */}
          <div className="min-h-0 flex-1 overflow-y-auto" style={{ maxHeight: "400px" }}>
            {showResults ? (
              totalResults > 0 ? (
                <div className="py-1">
                  {/* Results header */}
                  <div className="px-4 py-2">
                    <span className="text-[10px] font-medium uppercase tracking-wider text-[#6b7280]">
                      {hasQuery ? (
                        <>Best matches for <span className="font-bold text-[#030712]">{query}</span> · {totalResults} result{totalResults !== 1 ? "s" : ""}</>
                      ) : (
                        <>{activeFilter} · {totalResults} result{totalResults !== 1 ? "s" : ""}</>
                      )}
                    </span>
                  </div>

                  {/* Grouped results */}
                  {Object.entries(groupedResults).map(([category, items]) => (
                    <div key={category}>
                      {Object.keys(groupedResults).length > 1 && (
                        <div className="px-4 pb-1 pt-3">
                          <span className="text-[10px] font-medium uppercase tracking-wider text-[#9ca3af]">
                            {category}
                          </span>
                        </div>
                      )}
                      {items.map((item) => (
                        <button
                          key={item.id}
                          onClick={() => handleSelectResult(item)}
                          className="flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors hover:bg-[#f3f4f6]"
                        >
                          <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-[#f3f4f6] text-[#6b7280]">
                            {item.icon}
                          </span>
                          <div className="flex min-w-0 flex-1 flex-col">
                            <span className="truncate text-sm font-medium text-[#030712]">
                              {item.name}
                            </span>
                            <span className="truncate text-xs text-[#9ca3af]">
                              {item.breadcrumb}
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12">
                  <Search className="mb-2 size-8 text-[#d1d5db]" />
                  <span className="text-sm font-medium text-[#6b7280]">No results found</span>
                  <span className="mt-1 text-xs text-[#9ca3af]">
                    Try modifying your search or removing filters
                  </span>
                </div>
              )
            ) : (
              /* Empty state: recent & popular */
              <div className="py-1">
                {/* Recent searches */}
                <div className="px-4 py-2">
                  <span className="text-[10px] font-medium uppercase tracking-wider text-[#6b7280]">
                    Recent Searches
                  </span>
                </div>
                {recentSearches.map((item) => (
                  <button
                    key={item.name}
                    onClick={() => setQuery(item.name)}
                    className="flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors hover:bg-[#f3f4f6]"
                  >
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-lg text-[#9ca3af]">
                      <Clock className="size-4" />
                    </span>
                    <div className="flex min-w-0 flex-1 flex-col">
                      <span className="truncate text-sm font-medium text-[#030712]">{item.name}</span>
                      <span className="truncate text-xs text-[#9ca3af]">{item.time}</span>
                    </div>
                  </button>
                ))}

                {/* Popular searches */}
                <div className="px-4 pb-1 pt-3">
                  <span className="text-[10px] font-medium uppercase tracking-wider text-[#6b7280]">
                    Popular Searches
                  </span>
                </div>
                {popularSearches.map((item) => (
                  <button
                    key={item.name}
                    onClick={() => handlePopularClick(item)}
                    className="flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors hover:bg-[#f3f4f6]"
                  >
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-[#f3f4f6] text-[#6b7280]">
                      {item.icon}
                    </span>
                    <div className="flex min-w-0 flex-1 flex-col">
                      <span className="truncate text-sm font-medium text-[#030712]">{item.name}</span>
                      <span className="truncate text-xs text-[#9ca3af]">{item.breadcrumb}</span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Footer — fixed at bottom */}
          <div className="shrink-0 flex items-center gap-4 border-t border-[#e5e7eb] px-4 py-2">
            <div className="flex items-center gap-1">
              <kbd className="rounded border border-[#e5e7eb] bg-[#f3f4f6] px-1.5 py-0.5 font-mono text-[10px] text-[#6b7280]">↑</kbd>
              <kbd className="rounded border border-[#e5e7eb] bg-[#f3f4f6] px-1.5 py-0.5 font-mono text-[10px] text-[#6b7280]">↓</kbd>
              <span className="text-[10px] text-[#9ca3af]">Navigate</span>
            </div>
            <div className="flex items-center gap-1">
              <kbd className="rounded border border-[#e5e7eb] bg-[#f3f4f6] px-1.5 py-0.5 font-mono text-[10px] text-[#6b7280]">↵</kbd>
              <span className="text-[10px] text-[#9ca3af]">Select</span>
            </div>
            <div className="flex items-center gap-1">
              <kbd className="rounded border border-[#e5e7eb] bg-[#f3f4f6] px-1.5 py-0.5 font-mono text-[10px] text-[#6b7280]">ESC</kbd>
              <span className="text-[10px] text-[#9ca3af]">Close</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Use portal to render at document body level
  if (typeof window === "undefined") return null;
  return createPortal(modalContent, document.body);
}
