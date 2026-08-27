"use client";
import { useEffect, useState } from "react";
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
import { auth, db } from "@/lib/firebase";
import type { Project } from "@/lib/types";

const blank: Project = {
  title: "",
  slug: "",
  category: "UI/UX",
  year: "2026",
  description: "",
  cover: "",
  gallery: [],
  role: "UI/UX Designer",
  client: "",
  duration: "",
  tools: [],
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
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [projects, setProjects] = useState<Project[]>([]);
  const [form, setForm] = useState<Project>(blank);
  const [editing, setEditing] = useState<string | null>(null);
  const [msg, setMsg] = useState("");

  useEffect(() => onAuthStateChanged(auth, setUser), []);

  async function load() {
    if (!auth.currentUser) return;
    const s = await getDocs(
      query(collection(db, "projects"), orderBy("order", "asc")),
    );
    setProjects(s.docs.map((d) => ({ ...d.data(), id: d.id }) as Project));
  }

  useEffect(() => {
    if (user) load();
  }, [user]);

  async function login() {
    try {
      await signInWithEmailAndPassword(auth, email, pass);
    } catch (e: any) {
      setMsg(e.message);
    }
  }

  async function save() {
    try {
      const data = {
        ...form,
        tools: form.tools.filter(Boolean),
        gallery: (form.gallery || []).filter(Boolean),
      };
      if (editing) await updateDoc(doc(db, "projects", editing), data as any);
      else await addDoc(collection(db, "projects"), data);
      setForm(blank);
      setEditing(null);
      setMsg("Project saved.");
      load();
    } catch (e: any) {
      setMsg(e.message);
    }
  }

  async function remove(id: string) {
    if (confirm("Delete this project?")) {
      await deleteDoc(doc(db, "projects", id));
      load();
    }
  }

  if (!user)
    return (
      <main className="admin-shell">
        <div className="container" style={{ paddingTop: 100, maxWidth: 560 }}>
          <div className="kicker">Private CMS</div>
          <h1 className="admin-title">Portfolio Admin</h1>
          <div className="admin-card">
            <div className="field">
              <label>Email</label>
              <input
                className="input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="field" style={{ marginTop: 15 }}>
              <label>Password</label>
              <input
                className="input"
                type="password"
                value={pass}
                onChange={(e) => setPass(e.target.value)}
              />
            </div>
            <div className="admin-actions">
              <button className="pill primary" onClick={login}>
                Sign in
              </button>
              <a className="pill" href="/">
                Back to site
              </a>
            </div>
            {msg && <div className="notice">{msg}</div>}
          </div>
        </div>
      </main>
    );

  const set = (k: keyof Project, v: any) => setForm({ ...form, [k]: v });

  return (
    <main className="admin-shell">
      <header className="admin-nav container">
        <a className="logo" href="/">
          ARSLAN<i>.</i>
        </a>
        <div className="admin-actions">
          <a className="pill" href="/">
            View site ↗
          </a>
          <button className="pill" onClick={() => signOut(auth)}>
            Sign out
          </button>
        </div>
      </header>
      <div className="admin-layout">
        <aside className="sidebar">
          <a className="side-link active" href="/admin">
            Overview
          </a>
          <a className="side-link" href="#projects">
            Projects
          </a>
          <a className="side-link" href="#editor">
            Add / Edit
          </a>
        </aside>
        <section className="admin-main">
          <div className="kicker">Dashboard</div>
          <h1 className="admin-title">Portfolio CMS</h1>
          <div className="stat-grid">
            <div className="stat">
              <b>{projects.length}</b>
              <span>Total projects</span>
            </div>
            <div className="stat">
              <b>{projects.filter((p) => p.featured).length}</b>
              <span>Featured</span>
            </div>
            <div className="stat">
              <b>{projects.filter((p) => p.published).length}</b>
              <span>Published</span>
            </div>
            <div className="stat">
              <b>{new Set(projects.map((p) => p.category)).size}</b>
              <span>Categories</span>
            </div>
          </div>
          <div className="admin-card" id="projects">
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <h2>Projects</h2>
              <button
                className="pill primary"
                onClick={() => {
                  setForm(blank);
                  setEditing(null);
                }}
              >
                + New project
              </button>
            </div>
            <table className="table">
              <thead>
                <tr>
                  <th>Project</th>
                  <th>Category</th>
                  <th>Year</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {projects.map((p) => (
                  <tr key={p.id}>
                    <td>{p.title}</td>
                    <td>{p.category}</td>
                    <td>{p.year}</td>
                    <td>{p.published ? "Published" : "Draft"}</td>
                    <td>
                      <button
                        className="pill"
                        onClick={() => {
                          setForm({ ...blank, ...p, gallery: p.gallery || [] });
                          setEditing(p.id || null);
                          location.hash = "editor";
                        }}
                      >
                        Edit
                      </button>{" "}
                      <button
                        className="pill danger"
                        onClick={() => remove(p.id!)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="admin-card" id="editor">
            <h2>{editing ? "Edit project" : "Create project"}</h2>
            <div className="form-grid">
              {[
                ["title", "Project title"],
                ["slug", "Slug"],
                ["year", "Year"],
                ["category", "Category"],
                ["client", "Client"],
                ["duration", "Duration"],
                ["role", "Your role"],
                ["cover", "Cover image URL"],
                ["figma", "Figma URL"],
                ["live", "Live URL"],
              ].map(([k, l]) => (
                <div className="field" key={k}>
                  <label>{l}</label>
                  <input
                    className="input"
                    value={(form as any)[k] || ""}
                    onChange={(e) => set(k as keyof Project, e.target.value)}
                  />
                </div>
              ))}
              <div className="field full">
                <label>Tools — comma separated</label>
                <input
                  className="input"
                  value={(form.tools || []).join(", ")}
                  onChange={(e) =>
                    set(
                      "tools",
                      e.target.value.split(",").map((x) => x.trim()),
                    )
                  }
                />
              </div>

              {[
                ["description", "Short description"],
                ["challenge", "Challenge"],
                ["process", "Process / research"],
                ["solution", "Solution"],
                ["outcome", "Outcome"],
              ].map(([k, l]) => (
                <div className="field full" key={k}>
                  <label>{l}</label>
                  <textarea
                    className="textarea"
                    value={(form as any)[k] || ""}
                    onChange={(e) => set(k as keyof Project, e.target.value)}
                  />
                </div>
              ))}

              {/* Gallery Image URLs Field */}
              <div className="field full">
                <label>
                  Gallery Images — additional image URLs (one per line)
                </label>
                <textarea
                  className="textarea"
                  rows={5}
                  placeholder="https://example.com/image1.jpg&#10;https://example.com/image2.jpg"
                  value={(form.gallery || []).join("\n")}
                  onChange={(e) =>
                    set(
                      "gallery",
                      e.target.value.split("\n").map((url) => url.trim()),
                    )
                  }
                />
                <small style={{ color: "var(--muted, #888)", marginTop: 6, display: "block" }}>
                  Paste direct image URLs separated by line breaks. These map directly to the project gallery array.
                </small>
              </div>

              {/* Live Preview for Gallery Images */}
              {form.gallery && form.gallery.filter(Boolean).length > 0 && (
                <div className="field full">
                  <label>Gallery Preview</label>
                  <div
                    style={{
                      display: "flex",
                      gap: "10px",
                      flexWrap: "wrap",
                      marginTop: "8px",
                    }}
                  >
                    {form.gallery.filter(Boolean).map((url, idx) => (
                      <div
                        key={idx}
                        style={{
                          width: "80px",
                          height: "80px",
                          borderRadius: "6px",
                          overflow: "hidden",
                          border: "1px solid #333",
                        }}
                      >
                        <img
                          src={url}
                          alt={`Gallery item ${idx + 1}`}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                          onError={(e) => {
                            (e.target as HTMLElement).style.display = "none";
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="field">
                <label>Order</label>
                <input
                  className="input"
                  type="number"
                  value={form.order}
                  onChange={(e) => set("order", Number(e.target.value))}
                />
              </div>
              <div className="field">
                <label>Featured / Published</label>
                <div className="admin-actions">
                  <label>
                    <input
                      type="checkbox"
                      checked={form.featured}
                      onChange={(e) => set("featured", e.target.checked)}
                    />{" "}
                    Featured
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      checked={form.published}
                      onChange={(e) => set("published", e.target.checked)}
                    />{" "}
                    Published
                  </label>
                </div>
              </div>
            </div>
            <div className="admin-actions" style={{ marginTop: 20 }}>
              <button className="pill primary" onClick={save}>
                {editing ? "Update project" : "Publish project"}
              </button>
              <button
                className="pill"
                onClick={() => {
                  setForm(blank);
                  setEditing(null);
                }}
              >
                Clear
              </button>
            </div>
            {msg && <div className="notice">{msg}</div>}
          </div>
        </section>
      </div>
    </main>
  );
}