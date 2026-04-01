"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { IconSidebar } from "@/components/icon-sidebar";
import { NavSidebar, navGroups } from "@/components/nav-sidebar";
import { TopBar } from "@/components/top-bar";
import { PageHeader } from "@/components/page-header";
import { PageLayout, type PageLayoutType } from "@/components/page-layout";

// Page content components
import { ContactCenterDetailsPage } from "@/components/pages/contact-center-details";
import {
  HoursOfOperationTab,
  HolidaysTab,
} from "@/components/pages/hours-of-operation";
import {
  PhoneNumbersGeneralTab,
  PhoneNumberManagementTab,
} from "@/components/pages/phone-numbers";
import { ConsumerManagementPage } from "@/components/pages/consumer-management";
import { AgentDesktopSettingsPage } from "@/components/pages/agent-desktop-settings";
import { SystemSettingsPage } from "@/components/pages/system-settings";
import { ApiCredentialsPage } from "@/components/pages/api-credentials";
import { ChannelOperationsPage } from "@/components/pages/channel-operations";
import { CallPage } from "@/components/pages/call";
import { OverviewPage } from "@/components/pages/overview";
import { GlobalSearch } from "@/components/global-search";
import {
  LanguagesTab,
  MessagesTab,
} from "@/components/pages/languages-and-messages";
import { ToolsPage } from "@/components/pages/tools";
import { QueuesPage } from "@/components/pages/queues";
import { WrapUpPage } from "@/components/pages/wrap-up-2";
import { ChatGeneralSettingsTab, ChatWebAndMobileTab, ChatSmsTab } from "@/components/pages/chat";
import { SocialWhatsappTab, SocialAmbTab } from "@/components/pages/social";

// ─── Types ───────────────────────────────────────────────

interface Breadcrumb {
  label: string;
  href?: string;
  separator?: "chevron" | "pipe";
  clickable?: boolean;
}

// ─── Page hierarchy helpers ───────────────────────────────

/** For pages accessed from within another page (not directly from the nav) */
const pageParents: Record<string, { href: string; label: string; defaultTab?: string }> = {
  "/settings/api-credentials": { href: "/settings/system-settings", label: "System Settings" },
  "/settings/wrap-up": { href: "/settings/channel-operations", label: "Channel Operations" },
};

/** Walk navGroups to find the organizer label (parent expander item) for a given href */
function getOrganizer(href: string): string | null {
  for (const group of navGroups) {
    for (const item of group.items) {
      if (item.subItems?.some((s) => s.href === href)) {
        return item.label; // e.g. "General Settings", "Customer Engagement"
      }
    }
  }
  return null;
}

interface Tab {
  label: string;
  value: string;
}

interface PageConfig {
  title: string;
  description: string;
  layout: PageLayoutType;
  tabs?: Tab[];
  defaultTab?: string;
  /** When a tab changes, the layout may change too */
  tabLayouts?: Record<string, PageLayoutType>;
}

// ─── Page configurations ─────────────────────────────────

const pageConfigs: Record<string, PageConfig> = {
  "/settings/contact-center-details": {
    title: "Contact Center Details",
    description: "Manage your contact center details settings",
    layout: "centered",
  },
  "/settings/hours-of-operation": {
    title: "Hours of Operation and Holidays",
    description: "Configure business hours and holiday schedules",
    layout: "full-width",
    tabs: [
      { label: "Hours of Operation", value: "hours" },
      { label: "Holidays", value: "holidays" },
    ],
    defaultTab: "hours",
    tabLayouts: { hours: "full-width", holidays: "full-width" },
  },
  "/settings/phone-numbers": {
    title: "Phone Numbers",
    description: "Manage phone numbers and telephony settings",
    layout: "centered",
    tabs: [
      { label: "General Settings", value: "general" },
      { label: "Phone Number Management", value: "management" },
    ],
    defaultTab: "general",
    tabLayouts: { general: "centered", management: "full-width" },
  },
  "/settings/consumer-management": {
    title: "Consumer Management",
    description: "Configure consumer privacy and blocklist settings",
    layout: "centered",
  },
  "/settings/agent-desktop-settings": {
    title: "Agent Desktop Settings",
    description: "Configure the agent desktop experience and available tools",
    layout: "full-width",
  },
  "/settings/system-settings": {
    title: "System Settings",
    description: "Security, integrations, and system-wide configuration",
    layout: "centered",
  },
  "/settings/channel-operations": {
    title: "Channel Operations",
    description: "Configure channel-wide operation settings",
    layout: "centered",
  },
  "/settings/call": {
    title: "Call",
    description: "Configure call channel settings and features",
    layout: "centered",
  },
  "/settings/languages-and-messages": {
    title: "Languages and Messages",
    description: "Configure languages, localization, and message templates",
    layout: "centered",
    tabs: [
      { label: "Languages", value: "languages" },
      { label: "Messages", value: "messages" },
    ],
    defaultTab: "languages",
    tabLayouts: { languages: "centered", messages: "centered" },
  },
  "/settings/api-credentials": {
    title: "API Credentials",
    description: "Generate and manage API keys for programmatic access to UJET services",
    layout: "full-width",
  },
  "/settings/customer-satisfaction-ratings": {
    title: "Customer Satisfaction Ratings",
    description: "Configure CSAT surveys and rating settings",
    layout: "centered",
  },
  "/settings/forms": {
    title: "Forms",
    description: "Manage customer-facing forms and fields",
    layout: "centered",
  },
  "/settings/surveys": {
    title: "Surveys",
    description: "Create and manage customer surveys",
    layout: "centered",
  },
  "/settings/tools": {
    title: "Tools",
    description: "Manage tools and external integrations",
    layout: "full-width",
  },
  "/settings/wrap-up": {
    title: "Wrap-up",
    description: "Configure wrap-up settings and after-call work options",
    layout: "centered",
  },
  "/settings/campaigns": {
    title: "Campaigns",
    description: "Manage campaigns and campaign settings",
    layout: "centered",
  },
  "/settings/spiral": {
    title: "Spiral",
    description: "Configure Spiral integration settings",
    layout: "centered",
  },
  "/settings/users-and-teams": {
    title: "Users and Teams",
    description: "Manage users, teams, and assignments",
    layout: "centered",
  },
  "/settings/roles-and-permissions": {
    title: "Roles and Permissions",
    description: "Configure roles and access permissions",
    layout: "centered",
  },
  "/settings/bulk-user-management": {
    title: "Bulk User Management",
    description: "Import and manage users in bulk",
    layout: "centered",
  },
  "/settings/agent-skills": {
    title: "Agent Skills",
    description: "Define and manage agent skill sets",
    layout: "centered",
  },
  "/settings/availability-preferences": {
    title: "Availability Preferences",
    description: "Configure agent availability and scheduling preferences",
    layout: "centered",
  },
  "/settings/agent-status": {
    title: "Agent Status",
    description: "Manage agent status types and transitions",
    layout: "centered",
  },
  "/settings/chat": {
    title: "Chat",
    description: "Configure chat channel settings and features",
    layout: "centered",
    tabs: [
      { label: "General Settings", value: "general" },
      { label: "Web and Mobile", value: "web-mobile" },
      { label: "SMS", value: "sms" },
    ],
    defaultTab: "general",
  },
  "/settings/email": {
    title: "Email",
    description: "Configure email channel settings and routing",
    layout: "centered",
  },
  "/settings/social": {
    title: "Social",
    description: "Configure social media channel integrations",
    layout: "centered",
    tabs: [
      { label: "Whatsapp", value: "whatsapp" },
      { label: "AMB", value: "amb" },
    ],
    defaultTab: "whatsapp",
  },
  "/settings/blended-sms": {
    title: "Blended SMS",
    description: "Configure blended SMS channel settings",
    layout: "centered",
  },
  "/settings/queues": {
    title: "Queues",
    description: "Set up and manage queue configurations",
    layout: "centered",
  },
  "/settings/queue-groups": {
    title: "Queue Groups",
    description: "Organize queues into logical groups",
    layout: "centered",
  },
  "/settings/wfm-general-settings": {
    title: "WFM General Settings",
    description: "Configure workforce management general settings",
    layout: "centered",
  },
  "/settings/wfm-bulk-import": {
    title: "WFM Bulk Import",
    description: "Import workforce management data in bulk",
    layout: "centered",
  },
};

// ─── Page content renderer ───────────────────────────────

function PageContent({
  activePage,
  activeTab,
  onNavigate,
  unsavedGuardRef,
  sidebarCollapsed,
}: {
  activePage: string;
  activeTab: string;
  onNavigate: (href: string, label: string, parentLabel?: string) => void;
  unsavedGuardRef?: React.MutableRefObject<((href: string, label: string) => boolean) | null>;
  sidebarCollapsed?: boolean;
}) {
  switch (activePage) {
    case "/settings/contact-center-details":
      return <ContactCenterDetailsPage onNavigateAttempt={(cb) => { if (unsavedGuardRef) unsavedGuardRef.current = cb; }} sidebarCollapsed={sidebarCollapsed} />;

    case "/settings/hours-of-operation":
      return activeTab === "holidays" ? <HolidaysTab /> : <HoursOfOperationTab />;

    case "/settings/phone-numbers":
      return activeTab === "management" ? (
        <PhoneNumberManagementTab />
      ) : (
        <PhoneNumbersGeneralTab />
      );

    case "/settings/consumer-management":
      return <ConsumerManagementPage />;

    case "/settings/agent-desktop-settings":
      return <AgentDesktopSettingsPage />;

    case "/settings/system-settings":
      return <SystemSettingsPage onNavigate={onNavigate} />;

    case "/settings/api-credentials":
      return <ApiCredentialsPage />;

    case "/settings/channel-operations":
      return <ChannelOperationsPage onNavigate={onNavigate} />;

    case "/settings/call":
      return <CallPage />;

    case "/settings/languages-and-messages":
      return activeTab === "messages" ? <MessagesTab /> : <LanguagesTab />;

    case "/settings/tools":
      return <ToolsPage />;

    case "/settings/wrap-up":
      return <WrapUpPage />;


    case "/settings/customer-satisfaction-ratings":
    case "/settings/forms":
    case "/settings/surveys":
    case "/settings/campaigns":
    case "/settings/spiral":
    case "/settings/users-and-teams":
    case "/settings/roles-and-permissions":
    case "/settings/bulk-user-management":
    case "/settings/agent-skills":
    case "/settings/availability-preferences":
    case "/settings/agent-status":
    case "/settings/chat":
      if (activeTab === "web-mobile") return <ChatWebAndMobileTab />;
      if (activeTab === "sms") return <ChatSmsTab />;
      return <ChatGeneralSettingsTab />;

    case "/settings/social":
      if (activeTab === "amb") return <SocialAmbTab />;
      return <SocialWhatsappTab />;

    case "/settings/queues":
      return <QueuesPage />;

    case "/settings/email":
    case "/settings/blended-sms":
    case "/settings/queue-groups":
    case "/settings/wfm-general-settings":
    case "/settings/wfm-bulk-import":
      return (
        <div className="flex items-center justify-center py-20 text-sm text-[#6b7280]">
          Content coming soon
        </div>
      );

    default:
      return <OverviewPage onNavigate={onNavigate} />;
  }
}

// ─── Main Component ──────────────────────────────────────

export default function Home() {
  const [activePage, setActivePage] = useState("overview");
  const [breadcrumbs, setBreadcrumbs] = useState<Breadcrumb[]>([
    { label: "Overview" },
  ]);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState("");
  const [globalSearchOpen, setGlobalSearchOpen] = useState(false);
  const unsavedGuardRef = useRef<((href: string, label: string) => boolean) | null>(null);

  // Listen for force-navigate events from unsaved changes dialog
  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail?.href && detail?.label) {
        unsavedGuardRef.current = null;
        handleNavigateInternal(detail.href, detail.label);
      }
    };
    window.addEventListener("force-navigate", handler);
    return () => window.removeEventListener("force-navigate", handler);
  }, []);

  // Derive everything from config
  const config = pageConfigs[activePage];
  const pageTitle = config?.title ?? "Overview";
  const pageDescription =
    config?.description ?? "Overview of all settings and configurations";
  const tabs = config?.tabs;

  // Determine layout: if there are tab-specific layouts, use those
  const layout = config
    ? config.tabLayouts && activeTab
      ? config.tabLayouts[activeTab] ?? config.layout
      : config.layout
    : "centered";

  const handleNavigateInternal = useCallback(
    (href: string, label: string) => {
      if (href === "/settings/overview") {
        setActivePage("overview");
        setActiveTab("");
        setBreadcrumbs([{ label: "Overview" }]);
        return;
      }

      setActivePage(href);
      const newConfig = pageConfigs[href];
      const parentEntry = pageParents[href];
      setActiveTab(parentEntry?.defaultTab ?? newConfig?.defaultTab ?? "");

      const parent = pageParents[href];
      if (parent) {
        // Sub-page: "Organizer | Parent > Current"
        const organizer = getOrganizer(parent.href);
        const crumbs: Breadcrumb[] = [];
        if (organizer) {
          crumbs.push({ label: organizer, clickable: false });
          crumbs.push({ label: parent.label, separator: "pipe", href: parent.href });
        } else {
          crumbs.push({ label: parent.label, href: parent.href });
        }
        crumbs.push({ label, separator: "chevron" });
        setBreadcrumbs(crumbs);
      } else {
        // Regular page: "Organizer | Page" or just "Page"
        const organizer = getOrganizer(href);
        if (organizer) {
          setBreadcrumbs([
            { label: organizer, clickable: false },
            { label, separator: "pipe" },
          ]);
        } else {
          setBreadcrumbs([{ label }]);
        }
      }
    },
    []
  );

  const handleNavigate = useCallback(
    (href: string, label: string) => {
      if (unsavedGuardRef.current) {
        const allowed = unsavedGuardRef.current(href, label);
        if (!allowed) return;
      }
      unsavedGuardRef.current = null;
      handleNavigateInternal(href, label);
    },
    [handleNavigateInternal]
  );

  const handleBreadcrumbClick = useCallback(
    (href: string, label: string) => {
      handleNavigate(href, label);
    },
    [handleNavigate]
  );

  // Show back button for sub-pages
  const parentPage = pageParents[activePage];
  const handleBack = parentPage
    ? () => handleNavigate(parentPage.href, parentPage.label)
    : undefined;

  const handleToggleSidebar = useCallback(() => {
    setSidebarCollapsed((prev) => !prev);
  }, []);

  const handleTabChange = useCallback((value: string) => {
    setActiveTab(value);
  }, []);

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Dark icon sidebar */}
      <IconSidebar />

      {/* Secondary nav sidebar */}
      <NavSidebar
        activePage={activePage}
        onNavigate={handleNavigate}
        collapsed={sidebarCollapsed}
      />

      {/* Main content area */}
      <div className="flex flex-1 flex-col min-w-0">
        <TopBar
          breadcrumbs={breadcrumbs}
          sidebarCollapsed={sidebarCollapsed}
          onToggleSidebar={handleToggleSidebar}
          onBreadcrumbClick={handleBreadcrumbClick}
          onSearchClick={() => setGlobalSearchOpen(true)}
        />

        {/* Page header (fixed) + scrollable content */}
        <div className="flex flex-1 flex-col min-h-0 bg-white">
          {/* PageHeader is fixed — not inside the scroll area */}
          <div className="shrink-0">
            <PageHeader
              title={pageTitle}
              description={pageDescription}
              tabs={tabs}
              activeTab={activeTab}
              onTabChange={handleTabChange}
              onBack={handleBack}
            />
          </div>

          {/* Scrollable content area */}
          <div className="flex-1 overflow-auto">
            {layout === "centered" ? (
              <PageLayout layout="centered">
                <PageContent activePage={activePage} activeTab={activeTab} onNavigate={handleNavigate} unsavedGuardRef={unsavedGuardRef} sidebarCollapsed={sidebarCollapsed} />
              </PageLayout>
            ) : (
              <PageContent activePage={activePage} activeTab={activeTab} onNavigate={handleNavigate} unsavedGuardRef={unsavedGuardRef} sidebarCollapsed={sidebarCollapsed} />
            )}
          </div>
        </div>
      </div>

      {/* Global Search Modal */}
      <GlobalSearch
        open={globalSearchOpen}
        onOpenChange={setGlobalSearchOpen}
        onNavigate={handleNavigate}
      />
    </div>
  );
}
