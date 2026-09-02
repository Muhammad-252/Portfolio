"use client";

import { useEffect, useState, useMemo } from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  User,
} from "firebase/auth";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  updateDoc,
} from "firebase/firestore";
import {
  Plus,
  Trash2,
  Edit2,
  Check,
  X,
  Building2,
  Layers,
  MonitorSmartphone,
  FolderGit2,
  ExternalLink,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  Globe,
  Database,
  ArrowRight,
  Search,
  LogOut,
  Shield,
  FileText,
} from "lucide-react";
import { auth, db, firebaseConfigured } from "@/lib/firebase";
import type { Project } from "@/lib/types";
import {
  DEFAULT_MAIN_CATEGORIES,
  PLATFORM_OPTIONS,
} from "@/lib/categories";
import { useIndustries } from "@/lib/useIndustries";
import { SAMPLE_PROJECTS } from "@/lib/usePortfolioProjects";

const blank: Project = {
  title: "",
  slug: "",
  category: "UI/UX Design",
  industry: "Real Estate",
  platform: "Web App",
  year: "2026",
  description: "",
  cover: "",
  gallery: [],
  role: "Lead UI/UX Designer",
  client: "",
  duration: "6 Weeks",
  tools: ["Figma", "Design System"],
  challenge: "",
  process: "",
  solution: "",
  outcome: "",
  figma: "",
  live: "",
  featured: false,
  published: true,
  order: 0,
};

export default function Admin() {
  const [user, setUser] = useState<User | null>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [projects, setProjects] = useState<Project[]>(SAMPLE_PROJECTS);
  const [form, setForm] = useState<Project>(blank);
  const [editing, setEditing] = useState<string | null>(null);
  const [msg, setMsg] = useState("");
  const [activeTab, setActiveTab] = useState<"projects" | "industries" | "editor">("projects");

  // Dynamic Industries Management
  const {
    industries,
    addIndustry,
    updateIndustry,
    deleteIndustry,
    resetToDefaults,
  } = useIndustries();

  const [newIndustryName, setNewIndustryName] = useState("");
  const [editingIndustryOld, setEditingIndustryOld] = useState<string | null>(null);
  const [editingIndustryNew, setEditingIndustryNew] = useState("");
  const [adminSearch, setAdminSearch] = useState("");

  useEffect(() => {
    if (!firebaseConfigured || !auth) {
      setAuthChecked(true);
      return;
    }
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setAuthChecked(true);
    });
    return () => unsub();
  }, []);

  async function load() {
    if (!firebaseConfigured || !db) return;
    try {
      const s = await getDocs(
        query(collection(db, "projects"), orderBy("order", "asc"))
      );
      if (!s.empty) {
        setProjects(s.docs.map((d) => ({ ...d.data(), id: d.id }) as Project));
      }
    } catch (e: any) {
      console.warn("Could not load from Firestore, using local data", e);
    }
  }

  useEffect(() => {
    if (user || !firebaseConfigured) {
      load();
    }
  }, [user]);

  async function login() {
    try {
      setMsg("");
      await signInWithEmailAndPassword(auth, email, pass);
    } catch (e: any) {
      setMsg(e.message);
    }
  }

  // Auto slug generation from title
  function handleTitleChange(val: string) {
    const generatedSlug = val
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");

    setForm((prev) => ({
      ...prev,
      title: val,
      slug: prev.slug === "" || prev.slug === prev.title.toLowerCase().replace(/\s+/g, "-") ? generatedSlug : prev.slug,
    }));
  }

  async function save() {
    try {
      setMsg("");
      if (!form.title.trim()) {
        setMsg("Please provide a Project Title.");
        return;
      }

      const data = {
        ...form,
        title: form.title.trim(),
        slug: form.slug.trim() || form.title.toLowerCase().replace(/\s+/g, "-"),
        tools: form.tools.filter(Boolean),
        gallery: (form.gallery || []).filter(Boolean),
      };

      if (firebaseConfigured && db && user) {
        if (editing) {
          await updateDoc(doc(db, "projects", editing), data as any);
        } else {
          await addDoc(collection(db, "projects"), data);
        }
      } else {
        // Local mode fallback
        if (editing) {
          setProjects((prev) =>
            prev.map((p) => (p.id === editing ? { ...data, id: editing } : p))
          );
        } else {
          const newId = "local-" + Date.now();
          setProjects((prev) => [...prev, { ...data, id: newId }]);
        }
      }

      setForm(blank);
      setEditing(null);
      setMsg("Project saved successfully.");
      setActiveTab("projects");
      load();
    } catch (e: any) {
      setMsg(e.message || "Failed to save project.");
    }
  }

  async function remove(id: string) {
    if (confirm("Are you sure you want to delete this project?")) {
      try {
        if (firebaseConfigured && db && user) {
          await deleteDoc(doc(db, "projects", id));
        } else {
          setProjects((prev) => prev.filter((p) => p.id !== id));
        }
        load();
      } catch (e: any) {
        alert("Could not delete: " + e.message);
      }
    }
  }

  async function handleAddIndustry(e: React.FormEvent) {
    e.preventDefault();
    if (!newIndustryName.trim()) return;
    const ok = await addIndustry(newIndustryName);
    if (ok) {
      setNewIndustryName("");
      setMsg(`Added industry: "${newIndustryName.trim()}"`);
    } else {
      alert("Industry already exists or is invalid.");
    }
  }

  async function handleSaveEditIndustry(oldName: string) {
    if (!editingIndustryNew.trim()) return;
    const ok = await updateIndustry(oldName, editingIndustryNew);
    if (ok) {
      setProjects((prev) =>
        prev.map((p) =>
          p.industry === oldName ? { ...p, industry: editingIndustryNew.trim() } : p
        )
      );
      setEditingIndustryOld(null);
      setEditingIndustryNew("");
      setMsg(`Updated industry "${oldName}" to "${editingIndustryNew.trim()}"`);
    } else {
      alert("Industry name already exists or is invalid.");
    }
  }

  async function handleDeleteIndustry(name: string) {
    const usageCount = projects.filter((p) => p.industry === name).length;
    const warning =
      usageCount > 0
        ? `"${name}" is currently assigned to ${usageCount} project(s). Are you sure you want to delete it?`
        : `Delete industry "${name}"?`;

    if (confirm(warning)) {
      await deleteIndustry(name);
      setMsg(`Removed industry "${name}"`);
    }
  }

  const filteredProjects = useMemo(() => {
    if (!adminSearch.trim()) return projects;
    const q = adminSearch.toLowerCase();
    return projects.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.industry.toLowerCase().includes(q) ||
        (p.platform && p.platform.toLowerCase().includes(q))
    );
  }, [projects, adminSearch]);

  // Login View
  if (firebaseConfigured && auth && !user && authChecked) {
    return (
      <main className="admin-shell">
        <div className="admin-login-wrapper">
          <div className="admin-login-card">
            <div className="login-badge">
              <Shield size={14} /> Admin Access
            </div>
            <h1>Arslan Studio CMS</h1>
            <p>
              Sign in with your administrator credentials to manage portfolio projects, case
              studies, and taxonomies.
            </p>
            <div className="field">
              <label>Email Address</label>
              <input
                className="input"
                type="email"
                placeholder="admin@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="field" style={{ marginTop: 16 }}>
              <label>Password</label>
              <input
                className="input"
                type="password"
                placeholder="••••••••"
                value={pass}
                onChange={(e) => setPass(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && login()}
              />
            </div>
            <div className="admin-actions" style={{ marginTop: 24 }}>
              <button className="pill primary full-width-btn" onClick={login}>
                Sign In to Dashboard <ArrowRight size={15} />
              </button>
            </div>
            <div style={{ marginTop: 16, textAlign: "center" }}>
              <a href="/" className="back-site-link">
                ← Return to Public Portfolio
              </a>
            </div>
            {msg && <div className="notice" style={{ marginTop: 16 }}>{msg}</div>}
          </div>
        </div>
      </main>
    );
  }

  const set = (k: keyof Project, v: any) => setForm((prev) => ({ ...prev, [k]: v }));

  return (
    <main className="admin-shell">
      {/* Studio Header Bar */}
      <header className="admin-topbar">
        <div className="admin-topbar-left">
          <a className="logo" href="/">
            ARSLAN<i>.</i>
          </a>
          <span className="topbar-divider" />
          <div className="topbar-title-wrap">
            <span className="topbar-product-name">Portfolio Studio</span>
            <span className="topbar-badge">Pro CMS v2.5</span>
          </div>
        </div>

        <div className="admin-topbar-right">
          <div className="system-status-indicator">
            <span className="system-status-pulse" />
            <span className="system-status-text">
              {firebaseConfigured ? "Firestore Cloud" : "Local Storage Mode"}
            </span>
          </div>
          <a
            className="topbar-preview-btn"
            href="/work"
            target="_blank"
            rel="noreferrer"
            title="Open live gallery in new tab"
          >
            <span>Live Portfolio</span>
            <ExternalLink size={13} />
          </a>
          {user && (
            <button
              type="button"
              className="topbar-logout-btn"
              onClick={() => signOut(auth)}
              title="Sign out"
            >
              <LogOut size={14} />
            </button>
          )}
        </div>
      </header>

      {/* Main Studio Workspace */}
      <div className="admin-workspace">
        {/* Luxury Sidebar */}
        <aside className="admin-sidebar">
          {/* Profile Card */}
          <div className="sidebar-profile-card">
            <div className="sidebar-avatar">
              <span>MA</span>
              <span className="avatar-online-dot" />
            </div>
            <div className="sidebar-profile-info">
              <span className="sidebar-user-name">Muhammad Arslan</span>
              <span className="sidebar-user-role">Lead UI/UX Designer</span>
            </div>
          </div>

          {/* Nav Section: Core Management */}
          <div className="sidebar-nav-group">
            <span className="sidebar-group-title">Content &amp; Portfolio</span>
            <button
              type="button"
              className={`sidebar-nav-btn ${activeTab === "projects" ? "active" : ""}`}
              onClick={() => setActiveTab("projects")}
            >
              <span className="nav-btn-label">
                <FolderGit2 size={16} /> All Projects
              </span>
              <span className="nav-btn-counter">{projects.length}</span>
            </button>

            <button
              type="button"
              className={`sidebar-nav-btn ${activeTab === "industries" ? "active" : ""}`}
              onClick={() => setActiveTab("industries")}
            >
              <span className="nav-btn-label">
                <Building2 size={16} /> Dynamic Industries
              </span>
              <span className="nav-btn-counter">{industries.length}</span>
            </button>

            <button
              type="button"
              className={`sidebar-nav-btn ${activeTab === "editor" ? "active" : ""}`}
              onClick={() => {
                if (!editing) setForm(blank);
                setActiveTab("editor");
              }}
            >
              <span className="nav-btn-label">
                <Plus size={16} /> {editing ? "Edit Active Entry" : "Create Project"}
              </span>
              {editing && <span className="nav-btn-counter edit-active">Active</span>}
            </button>
          </div>

          {/* Nav Section: Quick Links */}
          <div className="sidebar-nav-group">
            <span className="sidebar-group-title">Public Views</span>
            <a
              href="/work"
              target="_blank"
              rel="noreferrer"
              className="sidebar-nav-link"
            >
              <span className="nav-btn-label">
                <Globe size={15} /> All Work Page
              </span>
              <ExternalLink size={12} className="external-link-arrow" />
            </a>
            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className="sidebar-nav-link"
            >
              <span className="nav-btn-label">
                <Sparkles size={15} /> Homepage Hero
              </span>
              <ExternalLink size={12} className="external-link-arrow" />
            </a>
          </div>

          {/* Database Footer Status */}
          <div className="sidebar-footer-card">
            <div className="db-status-header">
              <Database size={14} className="db-icon" />
              <span>Database Engine</span>
            </div>
            <p className="db-status-detail">
              {firebaseConfigured
                ? "Google Firestore cloud synchronized"
                : "Local storage fallback operational"}
            </p>
            <span className="db-doc-count">{projects.length} Project Records</span>
          </div>
        </aside>

        {/* Main Content Area */}
        <section className="admin-content-canvas">
          {/* Notification Banner */}
          {msg && (
            <div className="admin-floating-alert">
              <div className="alert-content">
                <CheckCircle2 size={16} className="alert-icon" />
                <span>{msg}</span>
              </div>
              <button
                type="button"
                onClick={() => setMsg("")}
                className="alert-close-btn"
                aria-label="Dismiss alert"
              >
                <X size={14} />
              </button>
            </div>
          )}

          {/* 4-Stat Metric Strip */}
          <div className="admin-stat-deck">
            <div className="admin-stat-tile">
              <div className="stat-tile-top">
                <span className="stat-tile-label">Total Projects</span>
                <span className="stat-tile-icon-wrap">
                  <FolderGit2 size={16} />
                </span>
              </div>
              <div className="stat-tile-number">{projects.length}</div>
              <span className="stat-tile-sub">Client Case Studies</span>
            </div>

            <div className="admin-stat-tile">
              <div className="stat-tile-top">
                <span className="stat-tile-label">Spotlight Featured</span>
                <span className="stat-tile-icon-wrap lime">
                  <Sparkles size={16} />
                </span>
              </div>
              <div className="stat-tile-number">
                {projects.filter((p) => p.featured).length}
              </div>
              <span className="stat-tile-sub">Homepage Selected</span>
            </div>

            <div className="admin-stat-tile">
              <div className="stat-tile-top">
                <span className="stat-tile-label">Dynamic Industries</span>
                <span className="stat-tile-icon-wrap blue">
                  <Building2 size={16} />
                </span>
              </div>
              <div className="stat-tile-number">{industries.length}</div>
              <span className="stat-tile-sub">Active Taxonomies</span>
            </div>

            <div className="admin-stat-tile">
              <div className="stat-tile-top">
                <span className="stat-tile-label">Live Published</span>
                <span className="stat-tile-icon-wrap green">
                  <CheckCircle2 size={16} />
                </span>
              </div>
              <div className="stat-tile-number">
                {projects.filter((p) => p.published).length}
              </div>
              <span className="stat-tile-sub">Public Visibility</span>
            </div>
          </div>

          {/* TAB 1: ALL PROJECTS INVENTORY */}
          {activeTab === "projects" && (
            <div className="studio-card">
              <div className="card-header-bar">
                <div>
                  <div className="card-kicker">Repository</div>
                  <h2 className="card-title">Projects Inventory</h2>
                  <p className="card-subtitle">
                    Manage client case studies, taxonomy classifications, and display ordering.
                  </p>
                </div>
                <div className="card-actions-cluster">
                  <div className="table-search-wrap">
                    <Search size={14} className="search-box-icon" />
                    <input
                      type="text"
                      className="search-box-input"
                      placeholder="Search title, category, industry..."
                      value={adminSearch}
                      onChange={(e) => setAdminSearch(e.target.value)}
                    />
                    {adminSearch && (
                      <button
                        type="button"
                        onClick={() => setAdminSearch("")}
                        className="search-clear-icon"
                      >
                        <X size={12} />
                      </button>
                    )}
                  </div>
                  <button
                    type="button"
                    className="pill primary"
                    onClick={() => {
                      setForm(blank);
                      setEditing(null);
                      setActiveTab("editor");
                    }}
                  >
                    <Plus size={15} /> Add Project
                  </button>
                </div>
              </div>

              <div className="studio-table-wrap">
                <table className="studio-table">
                  <thead>
                    <tr>
                      <th>Project</th>
                      <th>Main Category</th>
                      <th>Dynamic Industry</th>
                      <th>Platform</th>
                      <th>Year</th>
                      <th>Status</th>
                      <th style={{ textAlign: "right" }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProjects.map((p) => (
                      <tr key={p.id || p.slug}>
                        <td>
                          <div className="table-project-cell">
                            {p.cover ? (
                              <img
                                src={p.cover}
                                alt=""
                                className="table-project-thumb"
                                onError={(e) => ((e.target as HTMLElement).style.display = "none")}
                              />
                            ) : (
                              <div className="table-project-thumb-fallback">
                                <FileText size={16} />
                              </div>
                            )}
                            <div>
                              <strong className="table-project-title">{p.title}</strong>
                              <span className="table-project-slug">/work/{p.slug}</span>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span className="badge badge-category">{p.category}</span>
                        </td>
                        <td>
                          <span className="badge badge-industry">{p.industry}</span>
                        </td>
                        <td>
                          <span className="badge badge-platform">{p.platform || "Web App"}</span>
                        </td>
                        <td>
                          <span className="table-year-cell">{p.year}</span>
                        </td>
                        <td>
                          <span
                            className={`table-status-pill ${p.published ? "published" : "draft"}`}
                          >
                            <span className="status-dot" />
                            {p.published ? "Published" : "Draft"}
                          </span>
                        </td>
                        <td>
                          <div className="table-row-actions">
                            <button
                              type="button"
                              className="action-btn edit"
                              onClick={() => {
                                setForm({ ...blank, ...p, gallery: p.gallery || [] });
                                setEditing(p.id || null);
                                setActiveTab("editor");
                              }}
                              title="Edit project"
                            >
                              <Edit2 size={13} />
                              <span>Edit</span>
                            </button>
                            <button
                              type="button"
                              className="action-btn delete"
                              onClick={() => remove(p.id!)}
                              title="Delete project"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {!filteredProjects.length && (
                      <tr>
                        <td colSpan={7} className="table-empty-row">
                          No matching projects found. Click &quot;Add Project&quot; to create one.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 2: MANAGE DYNAMIC INDUSTRIES */}
          {activeTab === "industries" && (
            <div className="studio-card">
              <div className="card-header-bar">
                <div>
                  <div className="card-kicker">Taxonomy Engine</div>
                  <h2 className="card-title">Dynamic Industries</h2>
                  <p className="card-subtitle">
                    Add, rename, or delete industries on-the-fly. Changes dynamically populate the
                    Project Editor and live portfolio filters.
                  </p>
                </div>
                <button
                  type="button"
                  className="pill"
                  onClick={() => {
                    if (confirm("Reset industries to the default 13 presets?")) {
                      resetToDefaults();
                      setMsg("Industries reset to presets.");
                    }
                  }}
                  title="Reset to 13 initial defaults"
                >
                  <RotateCcw size={13} /> Reset Defaults
                </button>
              </div>

              {/* Add New Industry Form */}
              <form onSubmit={handleAddIndustry} className="industry-create-bar">
                <input
                  type="text"
                  className="input industry-input-box"
                  placeholder="Type new industry name (e.g. CleanTech, Automotive, Crypto, BioTech)..."
                  value={newIndustryName}
                  onChange={(e) => setNewIndustryName(e.target.value)}
                />
                <button type="submit" className="pill primary">
                  <Plus size={15} /> Add Industry
                </button>
              </form>

              {/* Industries Cards Grid */}
              <div className="industry-deck-grid">
                {industries.map((ind) => {
                  const usageCount = projects.filter((p) => p.industry === ind).length;
                  const isEditing = editingIndustryOld === ind;

                  return (
                    <div key={ind} className="industry-deck-card">
                      {isEditing ? (
                        <div className="industry-inline-edit-form">
                          <input
                            type="text"
                            className="input inline-edit-input"
                            value={editingIndustryNew}
                            onChange={(e) => setEditingIndustryNew(e.target.value)}
                            autoFocus
                            onKeyDown={(e) => {
                              if (e.key === "Enter") handleSaveEditIndustry(ind);
                              if (e.key === "Escape") setEditingIndustryOld(null);
                            }}
                          />
                          <button
                            type="button"
                            className="inline-save-btn"
                            onClick={() => handleSaveEditIndustry(ind)}
                            title="Save"
                          >
                            <Check size={14} />
                          </button>
                          <button
                            type="button"
                            className="inline-cancel-btn"
                            onClick={() => setEditingIndustryOld(null)}
                            title="Cancel"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ) : (
                        <div className="industry-card-view">
                          <div className="industry-details">
                            <span className="industry-title-text">{ind}</span>
                            <span className="industry-usage-pill">
                              {usageCount} {usageCount === 1 ? "project" : "projects"}
                            </span>
                          </div>
                          <div className="industry-btn-actions">
                            <button
                              type="button"
                              className="industry-tool-btn"
                              title="Rename industry"
                              onClick={() => {
                                setEditingIndustryOld(ind);
                                setEditingIndustryNew(ind);
                              }}
                            >
                              <Edit2 size={13} />
                            </button>
                            <button
                              type="button"
                              className="industry-tool-btn delete"
                              title="Delete industry"
                              onClick={() => handleDeleteIndustry(ind)}
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: PROJECT EDITOR */}
          {activeTab === "editor" && (
            <div className="studio-card">
              <div className="card-header-bar">
                <div>
                  <div className="card-kicker">
                    {editing ? "Edit Mode" : "New Creation"}
                  </div>
                  <h2 className="card-title">
                    {editing ? `Editing: ${form.title}` : "Create Portfolio Project"}
                  </h2>
                  <p className="card-subtitle">
                    Configure case study details, media assets, and taxonomy filters.
                  </p>
                </div>
                <button
                  type="button"
                  className="pill"
                  onClick={() => setActiveTab("projects")}
                >
                  ← Back to Inventory
                </button>
              </div>

              <div className="editor-form-grid">
                {/* Project Title */}
                <div className="field form-full">
                  <label>Project Title *</label>
                  <input
                    className="input"
                    placeholder="e.g. EstateFlow — Luxury Real Estate Portal"
                    value={form.title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                  />
                </div>

                {/* Slug */}
                <div className="field">
                  <label>URL Slug</label>
                  <input
                    className="input"
                    placeholder="estateflow-luxury"
                    value={form.slug}
                    onChange={(e) => set("slug", e.target.value)}
                  />
                  <small className="field-hint">Preview: /work/{form.slug || "slug"}</small>
                </div>

                {/* Year */}
                <div className="field">
                  <label>Year</label>
                  <input
                    className="input"
                    value={form.year}
                    onChange={(e) => set("year", e.target.value)}
                  />
                </div>

                {/* Main Category */}
                <div className="field">
                  <label>
                    <Layers size={13} className="label-icon" /> Main Category *
                  </label>
                  <select
                    className="input select-styled"
                    value={form.category}
                    onChange={(e) => set("category", e.target.value)}
                  >
                    {DEFAULT_MAIN_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Industry (Dynamic) */}
                <div className="field">
                  <div className="field-label-row">
                    <label>
                      <Building2 size={13} className="label-icon" /> Dynamic Industry *
                    </label>
                    <button
                      type="button"
                      className="field-inline-action"
                      onClick={() => setActiveTab("industries")}
                    >
                      + Manage Industries
                    </button>
                  </div>
                  <select
                    className="input select-styled"
                    value={form.industry}
                    onChange={(e) => set("industry", e.target.value)}
                  >
                    {industries.map((ind) => (
                      <option key={ind} value={ind}>
                        {ind}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Platform / Project Type */}
                <div className="field">
                  <label>
                    <MonitorSmartphone size={13} className="label-icon" /> Platform / Project Type *
                  </label>
                  <select
                    className="input select-styled"
                    value={form.platform || "Web App"}
                    onChange={(e) => set("platform", e.target.value)}
                  >
                    {PLATFORM_OPTIONS.map((plat) => (
                      <option key={plat} value={plat}>
                        {plat}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Client */}
                <div className="field">
                  <label>Client / Brand</label>
                  <input
                    className="input"
                    placeholder="e.g. EstateFlow Global"
                    value={form.client}
                    onChange={(e) => set("client", e.target.value)}
                  />
                </div>

                {/* Duration */}
                <div className="field">
                  <label>Duration</label>
                  <input
                    className="input"
                    placeholder="e.g. 8 Weeks"
                    value={form.duration}
                    onChange={(e) => set("duration", e.target.value)}
                  />
                </div>

                {/* Role */}
                <div className="field">
                  <label>Your Role</label>
                  <input
                    className="input"
                    placeholder="e.g. Lead Product Designer"
                    value={form.role}
                    onChange={(e) => set("role", e.target.value)}
                  />
                </div>

                {/* Cover Image URL */}
                <div className="field form-full">
                  <label>Project Cover Image URL *</label>
                  <input
                    className="input"
                    placeholder="https://images.unsplash.com/... or /images/..."
                    value={form.cover}
                    onChange={(e) => set("cover", e.target.value)}
                  />
                  {form.cover && (
                    <div className="editor-cover-preview">
                      <img
                        src={form.cover}
                        alt="Cover preview"
                        onError={(e) => ((e.target as HTMLElement).style.display = "none")}
                      />
                      <span>Cover Preview</span>
                    </div>
                  )}
                </div>

                {/* Tools */}
                <div className="field form-full">
                  <label>Tools &amp; Technologies (Comma-separated)</label>
                  <input
                    className="input"
                    placeholder="Figma, Webflow, Design System, React"
                    value={(form.tools || []).join(", ")}
                    onChange={(e) =>
                      set(
                        "tools",
                        e.target.value.split(",").map((x) => x.trim())
                      )
                    }
                  />
                </div>

                {/* Short Description */}
                <div className="field form-full">
                  <label>Short Description (Overview on Cards)</label>
                  <textarea
                    className="textarea"
                    rows={3}
                    placeholder="A brief executive summary of the project and impact..."
                    value={form.description}
                    onChange={(e) => set("description", e.target.value)}
                  />
                </div>

                {/* Case Study Details */}
                <div className="field form-full">
                  <label>01. The Challenge</label>
                  <textarea
                    className="textarea"
                    rows={3}
                    placeholder="What problem did the client or users face?"
                    value={form.challenge}
                    onChange={(e) => set("challenge", e.target.value)}
                  />
                </div>

                <div className="field form-full">
                  <label>02. Process &amp; Research</label>
                  <textarea
                    className="textarea"
                    rows={3}
                    placeholder="How did you research, strategize, and architect the experience?"
                    value={form.process}
                    onChange={(e) => set("process", e.target.value)}
                  />
                </div>

                <div className="field form-full">
                  <label>03. The Solution</label>
                  <textarea
                    className="textarea"
                    rows={3}
                    placeholder="What was designed, built, and delivered?"
                    value={form.solution}
                    onChange={(e) => set("solution", e.target.value)}
                  />
                </div>

                <div className="field form-full">
                  <label>04. Outcome &amp; Impact</label>
                  <textarea
                    className="textarea"
                    rows={3}
                    placeholder="Metrics, user feedback, or business results achieved..."
                    value={form.outcome}
                    onChange={(e) => set("outcome", e.target.value)}
                  />
                </div>

                {/* External Links */}
                <div className="field">
                  <label>Figma Preview URL</label>
                  <input
                    className="input"
                    placeholder="https://figma.com/..."
                    value={form.figma}
                    onChange={(e) => set("figma", e.target.value)}
                  />
                </div>

                <div className="field">
                  <label>Live Project URL</label>
                  <input
                    className="input"
                    placeholder="https://client-site.com"
                    value={form.live}
                    onChange={(e) => set("live", e.target.value)}
                  />
                </div>

                {/* Gallery Images */}
                <div className="field form-full">
                  <label>Gallery Images (One URL per line)</label>
                  <textarea
                    className="textarea"
                    rows={4}
                    placeholder="https://example.com/screen1.jpg&#10;https://example.com/screen2.jpg"
                    value={(form.gallery || []).join("\n")}
                    onChange={(e) =>
                      set(
                        "gallery",
                        e.target.value.split("\n").map((url) => url.trim())
                      )
                    }
                  />
                </div>

                {/* Sorting & Flags */}
                <div className="field">
                  <label>Display Order (0 = First)</label>
                  <input
                    className="input"
                    type="number"
                    value={form.order}
                    onChange={(e) => set("order", Number(e.target.value))}
                  />
                </div>

                <div className="field">
                  <label>Visibility Options</label>
                  <div className="editor-checkbox-row">
                    <label className="checkbox-pill-label">
                      <input
                        type="checkbox"
                        checked={form.featured}
                        onChange={(e) => set("featured", e.target.checked)}
                      />
                      <span>Featured on Homepage</span>
                    </label>
                    <label className="checkbox-pill-label">
                      <input
                        type="checkbox"
                        checked={form.published}
                        onChange={(e) => set("published", e.target.checked)}
                      />
                      <span>Published Live</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Form Action Controls */}
              <div className="editor-bottom-bar">
                <button type="button" className="pill primary" onClick={save}>
                  <Sparkles size={15} />
                  {editing ? "Update Project" : "Publish Project"}
                </button>
                <button
                  type="button"
                  className="pill"
                  onClick={() => {
                    setForm(blank);
                    setEditing(null);
                    setActiveTab("projects");
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}