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
  BookOpen,
  HelpCircle,
  Clock,
  Calendar,
  Tag,
  MessageCircle,
} from "lucide-react";
import { auth, db, firebaseConfigured } from "@/lib/firebase";
import type { Project } from "@/lib/types";
import {
  DEFAULT_MAIN_CATEGORIES,
  PLATFORM_OPTIONS,
} from "@/lib/categories";
import { useIndustries } from "@/lib/useIndustries";
import { SAMPLE_PROJECTS } from "@/lib/usePortfolioProjects";
import { useBlogPosts, DEFAULT_AUTHOR } from "@/lib/useBlogPosts";
import { BLOG_CATEGORIES, type BlogPost } from "@/lib/blogTypes";
import { useFaqs } from "@/lib/useFaqs";
import { FAQ_CATEGORIES, type FAQItem } from "@/lib/faqTypes";

const blankProject: Project = {
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

const blankBlogPost: Omit<BlogPost, "id"> = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  cover: "",
  category: "UI/UX Strategy",
  tags: ["UI/UX", "Product Design"],
  author: DEFAULT_AUTHOR,
  date: "May 2026",
  readingTime: "5 min read",
  featured: false,
  published: true,
  order: 0,
};

const blankFaq: Omit<FAQItem, "id"> = {
  question: "",
  answer: "",
  category: "Process",
  order: 0,
  published: true,
};

export default function Admin() {
  const [user, setUser] = useState<User | null>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [projects, setProjects] = useState<Project[]>(SAMPLE_PROJECTS);
  const [form, setForm] = useState<Project>(blankProject);
  const [editing, setEditing] = useState<string | null>(null);
  const [msg, setMsg] = useState("");

  // Navigation tab
  const [activeTab, setActiveTab] = useState<
    "projects" | "industries" | "editor" | "blog" | "blog-editor" | "faqs"
  >("projects");

  // Dynamic Industries
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

  // Blog Management
  const {
    posts,
    addBlogPost,
    updateBlogPost,
    deleteBlogPost,
    resetBlogPosts,
  } = useBlogPosts();

  const [blogForm, setBlogForm] = useState<Omit<BlogPost, "id">>(blankBlogPost);
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [blogSearch, setBlogSearch] = useState("");

  // FAQ Management
  const {
    faqs,
    addFaq,
    updateFaq,
    deleteFaq,
    resetFaqs,
  } = useFaqs();

  const [faqForm, setFaqForm] = useState<Omit<FAQItem, "id">>(blankFaq);
  const [editingFaqId, setEditingFaqId] = useState<string | null>(null);
  const [editingFaqQuestion, setEditingFaqQuestion] = useState("");
  const [editingFaqAnswer, setEditingFaqAnswer] = useState("");
  const [editingFaqCategory, setEditingFaqCategory] = useState("Process");

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
      slug:
        prev.slug === "" ||
        prev.slug === prev.title.toLowerCase().replace(/\s+/g, "-")
          ? generatedSlug
          : prev.slug,
    }));
  }

  function handleBlogTitleChange(val: string) {
    const generatedSlug = val
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");

    setBlogForm((prev) => ({
      ...prev,
      title: val,
      slug:
        prev.slug === "" ||
        prev.slug === prev.title.toLowerCase().replace(/\s+/g, "-")
          ? generatedSlug
          : prev.slug,
    }));
  }

  async function saveProject() {
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
        if (editing) {
          setProjects((prev) =>
            prev.map((p) => (p.id === editing ? { ...data, id: editing } : p))
          );
        } else {
          const newId = "local-" + Date.now();
          setProjects((prev) => [...prev, { ...data, id: newId }]);
        }
      }

      setForm(blankProject);
      setEditing(null);
      setMsg("Project saved successfully.");
      setActiveTab("projects");
      load();
    } catch (e: any) {
      setMsg(e.message || "Failed to save project.");
    }
  }

  async function removeProject(id: string) {
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

  // Blog save
  async function handleSaveBlogPost() {
    if (!blogForm.title.trim()) {
      alert("Please provide an article title.");
      return;
    }

    if (editingPostId) {
      await updateBlogPost(editingPostId, blogForm);
      setMsg(`Article "${blogForm.title}" updated successfully.`);
    } else {
      await addBlogPost(blogForm);
      setMsg(`Article "${blogForm.title}" published.`);
    }

    setBlogForm(blankBlogPost);
    setEditingPostId(null);
    setActiveTab("blog");
  }

  async function handleDeleteBlogPost(id: string, title: string) {
    if (confirm(`Delete article "${title}"?`)) {
      await deleteBlogPost(id);
      setMsg(`Deleted article "${title}".`);
    }
  }

  // FAQ save
  async function handleAddFaqSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!faqForm.question.trim() || !faqForm.answer.trim()) {
      alert("Please fill in both Question and Answer.");
      return;
    }
    await addFaq(faqForm);
    setFaqForm(blankFaq);
    setMsg("New FAQ created successfully.");
  }

  async function handleSaveEditFaq(id: string) {
    if (!editingFaqQuestion.trim() || !editingFaqAnswer.trim()) return;
    await updateFaq(id, {
      question: editingFaqQuestion.trim(),
      answer: editingFaqAnswer.trim(),
      category: editingFaqCategory,
    });
    setEditingFaqId(null);
    setMsg("FAQ item updated.");
  }

  // Dynamic Industry actions
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

  const filteredBlogPosts = useMemo(() => {
    if (!blogSearch.trim()) return posts;
    const q = blogSearch.toLowerCase();
    return posts.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.excerpt.toLowerCase().includes(q)
    );
  }, [posts, blogSearch]);

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
              Sign in with your administrator credentials to manage portfolio projects,
              blog articles, and client FAQs.
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

  const setProj = (k: keyof Project, v: any) => setForm((prev) => ({ ...prev, [k]: v }));
  const setBlog = (k: keyof BlogPost, v: any) => setBlogForm((prev) => ({ ...prev, [k]: v }));

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
            <span className="topbar-badge">Pro CMS v2.6</span>
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
          <a
            className="topbar-preview-btn"
            href="/blog"
            target="_blank"
            rel="noreferrer"
            title="Open live blog in new tab"
          >
            <span>Live Blog</span>
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

          {/* Section 1: Portfolio & Projects */}
          <div className="sidebar-nav-group">
            <span className="sidebar-group-title">Projects &amp; Case Studies</span>
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
                if (!editing) setForm(blankProject);
                setActiveTab("editor");
              }}
            >
              <span className="nav-btn-label">
                <Plus size={16} /> {editing ? "Edit Active Project" : "Create Project"}
              </span>
              {editing && <span className="nav-btn-counter edit-active">Active</span>}
            </button>
          </div>

          {/* Section 2: Articles & Publications */}
          <div className="sidebar-nav-group">
            <span className="sidebar-group-title">Articles &amp; Blog</span>
            <button
              type="button"
              className={`sidebar-nav-btn ${activeTab === "blog" ? "active" : ""}`}
              onClick={() => setActiveTab("blog")}
            >
              <span className="nav-btn-label">
                <BookOpen size={16} /> Blog Articles
              </span>
              <span className="nav-btn-counter">{posts.length}</span>
            </button>

            <button
              type="button"
              className={`sidebar-nav-btn ${activeTab === "blog-editor" ? "active" : ""}`}
              onClick={() => {
                if (!editingPostId) setBlogForm(blankBlogPost);
                setActiveTab("blog-editor");
              }}
            >
              <span className="nav-btn-label">
                <Plus size={16} /> {editingPostId ? "Edit Article" : "Write Article"}
              </span>
              {editingPostId && <span className="nav-btn-counter edit-active">Active</span>}
            </button>
          </div>

          {/* Section 3: Inquiries & FAQ */}
          <div className="sidebar-nav-group">
            <span className="sidebar-group-title">Clarity &amp; Inquiries</span>
            <button
              type="button"
              className={`sidebar-nav-btn ${activeTab === "faqs" ? "active" : ""}`}
              onClick={() => setActiveTab("faqs")}
            >
              <span className="nav-btn-label">
                <HelpCircle size={16} /> Manage FAQs
              </span>
              <span className="nav-btn-counter">{faqs.length}</span>
            </button>
          </div>

          {/* Section 4: Public Views */}
          <div className="sidebar-nav-group">
            <span className="sidebar-group-title">Public Views</span>
            <a
              href="/work"
              target="_blank"
              rel="noreferrer"
              className="sidebar-nav-link"
            >
              <span className="nav-btn-label">
                <Globe size={15} /> All Work Gallery
              </span>
              <ExternalLink size={12} className="external-link-arrow" />
            </a>
            <a
              href="/blog"
              target="_blank"
              rel="noreferrer"
              className="sidebar-nav-link"
            >
              <span className="nav-btn-label">
                <BookOpen size={15} /> Live Blog Page
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
              <span>Database Sync</span>
            </div>
            <p className="db-status-detail">
              {firebaseConfigured
                ? "Firestore cloud database connected"
                : "Local storage persistence operational"}
            </p>
            <span className="db-doc-count">
              {projects.length} Projects · {posts.length} Articles · {faqs.length} FAQs
            </span>
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
                <span className="stat-tile-label">Case Studies</span>
                <span className="stat-tile-icon-wrap">
                  <FolderGit2 size={16} />
                </span>
              </div>
              <div className="stat-tile-number">{projects.length}</div>
              <span className="stat-tile-sub">Portfolio Projects</span>
            </div>

            <div className="admin-stat-tile">
              <div className="stat-tile-top">
                <span className="stat-tile-label">Blog Articles</span>
                <span className="stat-tile-icon-wrap lime">
                  <BookOpen size={16} />
                </span>
              </div>
              <div className="stat-tile-number">{posts.length}</div>
              <span className="stat-tile-sub">Editorial Publications</span>
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
                <span className="stat-tile-label">Client FAQs</span>
                <span className="stat-tile-icon-wrap green">
                  <HelpCircle size={16} />
                </span>
              </div>
              <div className="stat-tile-number">{faqs.length}</div>
              <span className="stat-tile-sub">Accordion Items</span>
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
                      setForm(blankProject);
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
                                setForm({ ...blankProject, ...p, gallery: p.gallery || [] });
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
                              onClick={() => removeProject(p.id!)}
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
                    onChange={(e) => setProj("slug", e.target.value)}
                  />
                  <small className="field-hint">Preview: /work/{form.slug || "slug"}</small>
                </div>

                {/* Year */}
                <div className="field">
                  <label>Year</label>
                  <input
                    className="input"
                    value={form.year}
                    onChange={(e) => setProj("year", e.target.value)}
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
                    onChange={(e) => setProj("category", e.target.value)}
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
                    onChange={(e) => setProj("industry", e.target.value)}
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
                    onChange={(e) => setProj("platform", e.target.value)}
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
                    onChange={(e) => setProj("client", e.target.value)}
                  />
                </div>

                {/* Duration */}
                <div className="field">
                  <label>Duration</label>
                  <input
                    className="input"
                    placeholder="e.g. 8 Weeks"
                    value={form.duration}
                    onChange={(e) => setProj("duration", e.target.value)}
                  />
                </div>

                {/* Role */}
                <div className="field">
                  <label>Your Role</label>
                  <input
                    className="input"
                    placeholder="e.g. Lead Product Designer"
                    value={form.role}
                    onChange={(e) => setProj("role", e.target.value)}
                  />
                </div>

                {/* Cover Image URL */}
                <div className="field form-full">
                  <label>Project Cover Image URL *</label>
                  <input
                    className="input"
                    placeholder="https://images.unsplash.com/... or /images/..."
                    value={form.cover}
                    onChange={(e) => setProj("cover", e.target.value)}
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
                      setProj(
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
                    onChange={(e) => setProj("description", e.target.value)}
                  />
                </div>

                {/* Case Study Narrative */}
                <div className="field form-full">
                  <label>01. The Challenge</label>
                  <textarea
                    className="textarea"
                    rows={3}
                    placeholder="What problem did the client or users face?"
                    value={form.challenge}
                    onChange={(e) => setProj("challenge", e.target.value)}
                  />
                </div>

                <div className="field form-full">
                  <label>02. Process &amp; Research</label>
                  <textarea
                    className="textarea"
                    rows={3}
                    placeholder="How did you research, strategize, and architect the experience?"
                    value={form.process}
                    onChange={(e) => setProj("process", e.target.value)}
                  />
                </div>

                <div className="field form-full">
                  <label>03. The Solution</label>
                  <textarea
                    className="textarea"
                    rows={3}
                    placeholder="What was designed, built, and delivered?"
                    value={form.solution}
                    onChange={(e) => setProj("solution", e.target.value)}
                  />
                </div>

                <div className="field form-full">
                  <label>04. Outcome &amp; Impact</label>
                  <textarea
                    className="textarea"
                    rows={3}
                    placeholder="Metrics, user feedback, or business results achieved..."
                    value={form.outcome}
                    onChange={(e) => setProj("outcome", e.target.value)}
                  />
                </div>

                {/* External Links */}
                <div className="field">
                  <label>Figma Preview URL</label>
                  <input
                    className="input"
                    placeholder="https://figma.com/..."
                    value={form.figma}
                    onChange={(e) => setProj("figma", e.target.value)}
                  />
                </div>

                <div className="field">
                  <label>Live Project URL</label>
                  <input
                    className="input"
                    placeholder="https://client-site.com"
                    value={form.live}
                    onChange={(e) => setProj("live", e.target.value)}
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
                      setProj(
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
                    onChange={(e) => setProj("order", Number(e.target.value))}
                  />
                </div>

                <div className="field">
                  <label>Visibility Options</label>
                  <div className="editor-checkbox-row">
                    <label className="checkbox-pill-label">
                      <input
                        type="checkbox"
                        checked={form.featured}
                        onChange={(e) => setProj("featured", e.target.checked)}
                      />
                      <span>Featured on Homepage</span>
                    </label>
                    <label className="checkbox-pill-label">
                      <input
                        type="checkbox"
                        checked={form.published}
                        onChange={(e) => setProj("published", e.target.checked)}
                      />
                      <span>Published Live</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Form Action Controls */}
              <div className="editor-bottom-bar">
                <button type="button" className="pill primary" onClick={saveProject}>
                  <Sparkles size={15} />
                  {editing ? "Update Project" : "Publish Project"}
                </button>
                <button
                  type="button"
                  className="pill"
                  onClick={() => {
                    setForm(blankProject);
                    setEditing(null);
                    setActiveTab("projects");
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* TAB 4: BLOG ARTICLES INVENTORY */}
          {activeTab === "blog" && (
            <div className="studio-card">
              <div className="card-header-bar">
                <div>
                  <div className="card-kicker">Publications</div>
                  <h2 className="card-title">Blog Articles</h2>
                  <p className="card-subtitle">
                    Publish and manage insights on UI/UX, design tokens, and product engineering.
                  </p>
                </div>
                <div className="card-actions-cluster">
                  <div className="table-search-wrap">
                    <Search size={14} className="search-box-icon" />
                    <input
                      type="text"
                      className="search-box-input"
                      placeholder="Search articles..."
                      value={blogSearch}
                      onChange={(e) => setBlogSearch(e.target.value)}
                    />
                  </div>
                  <button
                    type="button"
                    className="pill primary"
                    onClick={() => {
                      setBlogForm(blankBlogPost);
                      setEditingPostId(null);
                      setActiveTab("blog-editor");
                    }}
                  >
                    <Plus size={15} /> Write Article
                  </button>
                  <button
                    type="button"
                    className="pill"
                    onClick={() => {
                      if (confirm("Reset to 5 default sample articles?")) {
                        resetBlogPosts();
                        setMsg("Articles reset to presets.");
                      }
                    }}
                    title="Reset sample articles"
                  >
                    <RotateCcw size={13} /> Reset
                  </button>
                </div>
              </div>

              <div className="studio-table-wrap">
                <table className="studio-table">
                  <thead>
                    <tr>
                      <th>Article</th>
                      <th>Category</th>
                      <th>Reading Time</th>
                      <th>Date</th>
                      <th>Status</th>
                      <th style={{ textAlign: "right" }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredBlogPosts.map((p) => (
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
                                <BookOpen size={16} />
                              </div>
                            )}
                            <div>
                              <strong className="table-project-title">{p.title}</strong>
                              <span className="table-project-slug">/blog/{p.slug}</span>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span className="badge badge-category">{p.category}</span>
                        </td>
                        <td>
                          <span className="table-year-cell">{p.readingTime}</span>
                        </td>
                        <td>
                          <span className="table-year-cell">{p.date}</span>
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
                                setBlogForm({ ...p });
                                setEditingPostId(p.id || null);
                                setActiveTab("blog-editor");
                              }}
                              title="Edit article"
                            >
                              <Edit2 size={13} />
                              <span>Edit</span>
                            </button>
                            <button
                              type="button"
                              className="action-btn delete"
                              onClick={() => handleDeleteBlogPost(p.id!, p.title)}
                              title="Delete article"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 5: BLOG ARTICLE EDITOR */}
          {activeTab === "blog-editor" && (
            <div className="studio-card">
              <div className="card-header-bar">
                <div>
                  <div className="card-kicker">
                    {editingPostId ? "Edit Article" : "New Publication"}
                  </div>
                  <h2 className="card-title">
                    {editingPostId ? `Editing: ${blogForm.title}` : "Write Blog Article"}
                  </h2>
                  <p className="card-subtitle">
                    Compose articles with markdown-style headings (###), blockquotes (&gt;), and bullet points.
                  </p>
                </div>
                <button
                  type="button"
                  className="pill"
                  onClick={() => setActiveTab("blog")}
                >
                  ← Back to Articles
                </button>
              </div>

              <div className="editor-form-grid">
                {/* Title */}
                <div className="field form-full">
                  <label>Article Title *</label>
                  <input
                    className="input"
                    placeholder="e.g. The 2026 Guide to Scalable Design Tokens"
                    value={blogForm.title}
                    onChange={(e) => handleBlogTitleChange(e.target.value)}
                  />
                </div>

                {/* Slug */}
                <div className="field">
                  <label>URL Slug</label>
                  <input
                    className="input"
                    placeholder="scalable-design-tokens"
                    value={blogForm.slug}
                    onChange={(e) => setBlog("slug", e.target.value)}
                  />
                  <small className="field-hint">Preview: /blog/{blogForm.slug || "slug"}</small>
                </div>

                {/* Category */}
                <div className="field">
                  <label>Category *</label>
                  <select
                    className="input select-styled"
                    value={blogForm.category}
                    onChange={(e) => setBlog("category", e.target.value)}
                  >
                    {BLOG_CATEGORIES.filter((c) => c !== "All").map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Reading Time */}
                <div className="field">
                  <label>Reading Time</label>
                  <input
                    className="input"
                    placeholder="e.g. 5 min read"
                    value={blogForm.readingTime}
                    onChange={(e) => setBlog("readingTime", e.target.value)}
                  />
                </div>

                {/* Date */}
                <div className="field">
                  <label>Publication Date</label>
                  <input
                    className="input"
                    placeholder="e.g. May 15, 2026"
                    value={blogForm.date}
                    onChange={(e) => setBlog("date", e.target.value)}
                  />
                </div>

                {/* Cover Image */}
                <div className="field form-full">
                  <label>Featured Cover Image URL</label>
                  <input
                    className="input"
                    placeholder="https://images.unsplash.com/..."
                    value={blogForm.cover}
                    onChange={(e) => setBlog("cover", e.target.value)}
                  />
                  {blogForm.cover && (
                    <div className="editor-cover-preview">
                      <img
                        src={blogForm.cover}
                        alt="Cover preview"
                        onError={(e) => ((e.target as HTMLElement).style.display = "none")}
                      />
                      <span>Article Cover Preview</span>
                    </div>
                  )}
                </div>

                {/* Excerpt */}
                <div className="field form-full">
                  <label>Short Excerpt (Displayed on Cards &amp; SEO)</label>
                  <textarea
                    className="textarea"
                    rows={2}
                    placeholder="A compelling 1-2 sentence hook summarizing the article..."
                    value={blogForm.excerpt}
                    onChange={(e) => setBlog("excerpt", e.target.value)}
                  />
                </div>

                {/* Tags */}
                <div className="field form-full">
                  <label>Tags (Comma-separated)</label>
                  <input
                    className="input"
                    placeholder="Figma, Design Tokens, UX Research"
                    value={(blogForm.tags || []).join(", ")}
                    onChange={(e) =>
                      setBlog(
                        "tags",
                        e.target.value.split(",").map((t) => t.trim())
                      )
                    }
                  />
                </div>

                {/* Full Article Content */}
                <div className="field form-full">
                  <label>Article Body Content (Markdown supported)</label>
                  <textarea
                    className="textarea"
                    rows={12}
                    placeholder="Write article content here. Use ### for subheadings, > for quotes, and - for bullet lists..."
                    value={blogForm.content}
                    onChange={(e) => setBlog("content", e.target.value)}
                  />
                </div>

                {/* Visibility */}
                <div className="field form-full">
                  <label>Visibility &amp; Spotlight</label>
                  <div className="editor-checkbox-row">
                    <label className="checkbox-pill-label">
                      <input
                        type="checkbox"
                        checked={blogForm.featured}
                        onChange={(e) => setBlog("featured", e.target.checked)}
                      />
                      <span>Featured Editorial (Hero Spot)</span>
                    </label>
                    <label className="checkbox-pill-label">
                      <input
                        type="checkbox"
                        checked={blogForm.published}
                        onChange={(e) => setBlog("published", e.target.checked)}
                      />
                      <span>Published Live</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="editor-bottom-bar">
                <button type="button" className="pill primary" onClick={handleSaveBlogPost}>
                  <Sparkles size={15} />
                  {editingPostId ? "Update Article" : "Publish Article"}
                </button>
                <button
                  type="button"
                  className="pill"
                  onClick={() => {
                    setBlogForm(blankBlogPost);
                    setEditingPostId(null);
                    setActiveTab("blog");
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* TAB 6: FAQ ACCORDION MANAGER */}
          {activeTab === "faqs" && (
            <div className="studio-card">
              <div className="card-header-bar">
                <div>
                  <div className="card-kicker">Client Clarity</div>
                  <h2 className="card-title">Frequently Asked Questions</h2>
                  <p className="card-subtitle">
                    Manage the accordion items displayed on the homepage. Changes immediately reflect on the live site.
                  </p>
                </div>
                <button
                  type="button"
                  className="pill"
                  onClick={() => {
                    if (confirm("Reset to 6 standard client FAQs?")) {
                      resetFaqs();
                      setMsg("FAQs reset to defaults.");
                    }
                  }}
                  title="Reset to 6 standard FAQs"
                >
                  <RotateCcw size={13} /> Reset Defaults
                </button>
              </div>

              {/* Add New FAQ Form */}
              <form onSubmit={handleAddFaqSubmit} className="faq-admin-creator">
                <h4 style={{ margin: "0 0 14px", fontSize: 14, color: "#eee" }}>
                  + Add New FAQ Item
                </h4>
                <div className="editor-form-grid">
                  <div className="field form-full">
                    <label>Question *</label>
                    <input
                      className="input"
                      placeholder="e.g. What assets and Figma files do I receive?"
                      value={faqForm.question}
                      onChange={(e) =>
                        setFaqForm((prev) => ({ ...prev, question: e.target.value }))
                      }
                    />
                  </div>
                  <div className="field form-full">
                    <label>Answer *</label>
                    <textarea
                      className="textarea"
                      rows={3}
                      placeholder="Clear, professional explanation..."
                      value={faqForm.answer}
                      onChange={(e) =>
                        setFaqForm((prev) => ({ ...prev, answer: e.target.value }))
                      }
                    />
                  </div>
                  <div className="field">
                    <label>Category</label>
                    <select
                      className="input select-styled"
                      value={faqForm.category}
                      onChange={(e) =>
                        setFaqForm((prev) => ({ ...prev, category: e.target.value }))
                      }
                    >
                      {FAQ_CATEGORIES.filter((c) => c !== "All").map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="field">
                    <label>Order (0 = First)</label>
                    <input
                      className="input"
                      type="number"
                      value={faqForm.order}
                      onChange={(e) =>
                        setFaqForm((prev) => ({
                          ...prev,
                          order: Number(e.target.value),
                        }))
                      }
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="pill primary"
                  style={{ marginTop: 16 }}
                >
                  <Plus size={14} /> Add FAQ Item
                </button>
              </form>

              {/* FAQ Items List */}
              <div className="faq-admin-list" style={{ marginTop: 32 }}>
                <h4 style={{ margin: "0 0 16px", fontSize: 13, color: "#888", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                  Active FAQs ({faqs.length})
                </h4>

                <div className="faq-admin-deck">
                  {faqs.map((faq, index) => {
                    const isEditing = editingFaqId === faq.id;

                    return (
                      <div key={faq.id} className="faq-admin-card">
                        {isEditing ? (
                          <div className="faq-inline-edit-wrap">
                            <div className="field" style={{ marginBottom: 12 }}>
                              <label>Question</label>
                              <input
                                className="input"
                                value={editingFaqQuestion}
                                onChange={(e) => setEditingFaqQuestion(e.target.value)}
                              />
                            </div>
                            <div className="field" style={{ marginBottom: 12 }}>
                              <label>Answer</label>
                              <textarea
                                className="textarea"
                                rows={3}
                                value={editingFaqAnswer}
                                onChange={(e) => setEditingFaqAnswer(e.target.value)}
                              />
                            </div>
                            <div className="field" style={{ marginBottom: 16 }}>
                              <label>Category</label>
                              <select
                                className="input select-styled"
                                value={editingFaqCategory}
                                onChange={(e) => setEditingFaqCategory(e.target.value)}
                              >
                                {FAQ_CATEGORIES.filter((c) => c !== "All").map((c) => (
                                  <option key={c} value={c}>
                                    {c}
                                  </option>
                                ))}
                              </select>
                            </div>
                            <div style={{ display: "flex", gap: 8 }}>
                              <button
                                type="button"
                                className="pill primary"
                                onClick={() => handleSaveEditFaq(faq.id)}
                              >
                                <Check size={14} /> Save FAQ
                              </button>
                              <button
                                type="button"
                                className="pill"
                                onClick={() => setEditingFaqId(null)}
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="faq-admin-view">
                            <div className="faq-admin-content">
                              <div className="faq-admin-meta">
                                <span className="faq-admin-num">
                                  #{String(index + 1).padStart(2, "0")}
                                </span>
                                <span className="badge badge-category">
                                  {faq.category}
                                </span>
                              </div>
                              <h3 className="faq-admin-q">{faq.question}</h3>
                              <p className="faq-admin-a">{faq.answer}</p>
                            </div>
                            <div className="faq-admin-actions">
                              <button
                                type="button"
                                className="action-btn edit"
                                onClick={() => {
                                  setEditingFaqId(faq.id);
                                  setEditingFaqQuestion(faq.question);
                                  setEditingFaqAnswer(faq.answer);
                                  setEditingFaqCategory(faq.category);
                                }}
                                title="Edit FAQ"
                              >
                                <Edit2 size={13} /> Edit
                              </button>
                              <button
                                type="button"
                                className="action-btn delete"
                                onClick={async () => {
                                  if (confirm("Delete this FAQ item?")) {
                                    await deleteFaq(faq.id);
                                    setMsg("FAQ item deleted.");
                                  }
                                }}
                                title="Delete FAQ"
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
            </div>
          )}
        </section>
      </div>
    </main>
  );
}