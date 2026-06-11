import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppHeader } from "@/components/AppHeader";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Plus, Trash2, ShieldOff, ShieldCheck, Copy, Download, Search, Edit3, Save, X, Check, Send, Mail, AlertTriangle, Upload, Sparkles, Inbox, KeyRound, BookOpen, Users as UsersIcon, MessageSquare, CreditCard, UserCheck, Settings as SettingsIcon, HelpCircle } from "lucide-react";
import { accessApi } from "@/lib/access-api";
import { UserManualPanel } from "@/components/admin/DeploymentManualPanels";

export const Route = createFileRoute("/admin")({ component: Admin });

function randCode() {
  const seg = () => Math.random().toString(36).slice(2, 6).toUpperCase();
  return `AUT-${seg()}-${seg()}`;
}

function Admin() {
  const { user, isAdmin, loading } = useAuth();
  const nav = useNavigate();

  useEffect(() => {
    if (!loading) {
      if (!user) nav({ to: "/admin-setup" });
      else if (!isAdmin) nav({ to: "/dashboard" });
    }
  }, [user, isAdmin, loading, nav]);

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-hero">
      <AppHeader showBack backTo="/dashboard" />
      <main className="container mx-auto px-4 py-10">
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="h-4 w-4 text-secondary" />
            <span className="text-xs uppercase tracking-wider text-secondary font-semibold">La Bottega - Admin Control</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">Admin dashboard</h1>
          <p className="text-white/70 mt-2 max-w-2xl">
            Manage requests, codes, content and users. Everything you need, organised the same way the student dashboard is - calm, clear, fast.
          </p>
        </div>

        <Tabs defaultValue="requests">
          <TabsList className="flex flex-wrap h-auto gap-1 bg-card/40 backdrop-blur p-1.5 rounded-xl border border-border/60">
            <TabsTrigger value="requests" className="data-[state=active]:bg-brand-gradient data-[state=active]:text-white"><Inbox className="h-4 w-4 mr-1.5" />Requests</TabsTrigger>
            <TabsTrigger value="codes" className="data-[state=active]:bg-brand-gradient data-[state=active]:text-white"><KeyRound className="h-4 w-4 mr-1.5" />Codes</TabsTrigger>
            <TabsTrigger value="content" className="data-[state=active]:bg-brand-gradient data-[state=active]:text-white"><BookOpen className="h-4 w-4 mr-1.5" />Content</TabsTrigger>
            <TabsTrigger value="users" className="data-[state=active]:bg-brand-gradient data-[state=active]:text-white"><UsersIcon className="h-4 w-4 mr-1.5" />Users</TabsTrigger>
            <TabsTrigger value="tickets" className="data-[state=active]:bg-brand-gradient data-[state=active]:text-white"><MessageSquare className="h-4 w-4 mr-1.5" />Messages</TabsTrigger>
            <TabsTrigger value="payments" className="data-[state=active]:bg-brand-gradient data-[state=active]:text-white"><CreditCard className="h-4 w-4 mr-1.5" />Payments</TabsTrigger>
            <TabsTrigger value="agents" className="data-[state=active]:bg-brand-gradient data-[state=active]:text-white"><UserCheck className="h-4 w-4 mr-1.5" />Agents</TabsTrigger>
            <TabsTrigger value="settings" className="data-[state=active]:bg-brand-gradient data-[state=active]:text-white"><SettingsIcon className="h-4 w-4 mr-1.5" />Settings</TabsTrigger>
            <TabsTrigger value="manual" className="data-[state=active]:bg-brand-gradient data-[state=active]:text-white"><HelpCircle className="h-4 w-4 mr-1.5" />Manual</TabsTrigger>
          </TabsList>
          <TabsContent value="requests"><RequestsPanel /></TabsContent>
          <TabsContent value="codes"><CodesPanel /></TabsContent>
          <TabsContent value="content"><ContentPanel /></TabsContent>
          <TabsContent value="users"><UsersPanel /></TabsContent>
          <TabsContent value="tickets"><TicketsPanel /></TabsContent>
          <TabsContent value="payments"><PaymentsPanel /></TabsContent>
          <TabsContent value="agents"><AgentsPanel /></TabsContent>
          <TabsContent value="settings"><SettingsPanel /></TabsContent>
          <TabsContent value="manual"><UserManualPanel /></TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

function RequestsPanel() {
  const [rows, setRows] = useState<any[]>([]);
  const [filter, setFilter] = useState<"pending" | "all">("pending");

  const load = async () => {
    let q = supabase.from("access_requests").select("*").order("created_at", { ascending: false });
    if (filter === "pending") q = q.eq("status", "pending");
    const { data } = await q;
    setRows(data || []);
  };
  useEffect(() => { load(); }, [filter]);

  const applyTpl = (tpl: string, vars: Record<string, string>) =>
    tpl.replace(/\{\{\s*(\w+)\s*\}\}/g, (_m, k) => vars[k] ?? "");

  const openGmailCompose = async (to: string, fullName: string, code: string) => {
    const { data: s } = await supabase
      .from("app_settings")
      .select("access_email_subject, access_email_body")
      .eq("id", true)
      .maybeSingle();
    const subjTpl = (s as any)?.access_email_subject || "Your Industrial Automation Access Code";
    const bodyTpl = (s as any)?.access_email_body
      || "Hi {{full_name}},\n\nYour access code is:\n\n{{code}}\n\n- Ultimate_Developers";
    const vars = { full_name: fullName, code };
    const subject = applyTpl(subjTpl, vars);
    const body = applyTpl(bodyTpl, vars);
    const mailto = `mailto:${encodeURIComponent(to)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(mailto, "_blank");
  };

  const sendCodes = async (
    res: { email: string; full_name: string; code: string; is_pair?: boolean; second_email?: string | null; second_full_name?: string | null; second_code?: string | null }
  ) => {
    await openGmailCompose(res.email, res.full_name, res.code);
    if (res.is_pair && res.second_email && res.second_code) {
      // Small delay so the second window/tab isn't blocked by popup throttling
      await new Promise((r) => setTimeout(r, 400));
      await openGmailCompose(res.second_email, res.second_full_name || "", res.second_code);
    }
  };

  const approve = async (id: string) => {
    try {
      const res = await accessApi.approve({ request_id: id });
      try {
        const clip = res.is_pair && res.second_code
          ? `${res.full_name}: ${res.code}\n${res.second_full_name}: ${res.second_code}`
          : res.code;
        await navigator.clipboard?.writeText(clip);
      } catch {}
      toast.success(res.is_pair ? "Pair approved. Both codes copied. Opening Gmail x2..." : `Approved. Code ${res.code} copied. Opening Gmail...`);
      await sendCodes(res);
      load();
    } catch (e: any) { toast.error(e?.message || "Approval failed"); }
  };
  const resend = async (id: string) => {
    try {
      const res = await accessApi.resend({ request_id: id });
      await sendCodes(res);
      toast.success(res.is_pair ? "Opening Gmail for both pair members..." : "Opening Gmail with code...");
    } catch (e: any) { toast.error(e?.message || "Resend failed"); }
  };
  const reject = async (id: string) => {
    if (!confirm("Reject this request?")) return;
    try { await accessApi.reject({ request_id: id }); toast.success("Rejected"); load(); }
    catch (e: any) { toast.error(e?.message || "Failed"); }
  };
  const del = async (id: string) => {
    if (!confirm("Delete this request?")) return;
    await supabase.from("access_requests").delete().eq("id", id);
    load();
  };
  const copy = (code: string) => { navigator.clipboard?.writeText(code); toast.success(`Copied ${code}`); };

  return (
    <div className="space-y-4 mt-4">
      <Card className="p-4 bg-amber-500/10 border-amber-500/40 text-white text-sm">
        <p className="flex items-start gap-2 text-white"><AlertTriangle className="h-4 w-4 mt-0.5 text-amber-500 shrink-0" />
          <span className="text-white"><strong className="text-white">Approval flow:</strong> Agent calls you with the name of the person who paid. Find their pending
          request below, click <strong className="text-white">Approve & send</strong> - a unique access code is generated, copied to your clipboard,
          and your device&rsquo;s default email app (e.g. Gmail) opens with the message pre-filled. Just hit Send.</span></p>
      </Card>
      <div className="flex gap-2">
        <Button size="sm" variant={filter === "pending" ? "default" : "outline"} onClick={() => setFilter("pending")}>Pending</Button>
        <Button size="sm" variant={filter === "all" ? "default" : "outline"} onClick={() => setFilter("all")}>All</Button>
        <div className="ml-auto text-sm text-muted-foreground self-center">{rows.length} request(s)</div>
      </div>
      {rows.length === 0 && <Card className="p-6 bg-card text-card-foreground text-sm text-muted-foreground">No requests.</Card>}
      {rows.map(r => (
        <Card key={r.id} className="p-5 bg-card text-card-foreground">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h4 className="font-semibold">{r.full_name}</h4>
                <Badge variant={r.status === "approved" ? "default" : r.status === "rejected" ? "destructive" : "outline"}>{r.status}</Badge>
                {r.is_pair && <Badge variant="secondary">Pair signup</Badge>}
              </div>
              <p className="text-sm text-muted-foreground mt-1">📱 <a className="underline" href={`https://wa.me/${r.whatsapp.replace(/[^0-9]/g, "")}`} target="_blank" rel="noreferrer">{r.whatsapp}</a></p>
              {r.email && <p className="text-sm text-muted-foreground">✉️ <a href={`mailto:${r.email}`} className="underline">{r.email}</a></p>}
              {r.is_pair && (
                <div className="mt-3 p-3 rounded bg-muted/30 border border-border/60 text-sm">
                  <p className="font-semibold text-xs uppercase tracking-wider text-muted-foreground mb-1">Pair partner</p>
                  <p>{r.second_full_name}</p>
                  {r.second_whatsapp && <p className="text-muted-foreground">📱 <a className="underline" href={`https://wa.me/${r.second_whatsapp.replace(/[^0-9]/g, "")}`} target="_blank" rel="noreferrer">{r.second_whatsapp}</a></p>}
                  {r.second_email && <p className="text-muted-foreground">✉️ <a href={`mailto:${r.second_email}`} className="underline">{r.second_email}</a></p>}
                </div>
              )}
              {r.generated_code && (
                <div className="mt-3 p-3 rounded bg-secondary/10 border border-secondary/40">
                  <p className="text-xs text-secondary uppercase tracking-wider font-semibold mb-1">Access code{r.is_pair ? "s" : ""}</p>
                  <div className="flex items-center gap-2">
                    <code className="text-lg font-mono font-bold">{r.generated_code}</code>
                    <Button size="sm" variant="ghost" onClick={() => copy(r.generated_code)}><Copy className="h-3 w-3" /></Button>
                    <span className="text-xs text-muted-foreground">· {r.full_name}</span>
                  </div>
                  {r.second_generated_code && (
                    <div className="flex items-center gap-2 mt-1">
                      <code className="text-lg font-mono font-bold">{r.second_generated_code}</code>
                      <Button size="sm" variant="ghost" onClick={() => copy(r.second_generated_code)}><Copy className="h-3 w-3" /></Button>
                      <span className="text-xs text-muted-foreground">· {r.second_full_name}</span>
                    </div>
                  )}
                </div>
              )}
              <p className="text-xs text-muted-foreground mt-2">Submitted {new Date(r.created_at).toLocaleString()}</p>
            </div>
            <div className="flex gap-2 flex-wrap">
              {r.status === "pending" && (
                <>
                  <Button size="sm" onClick={() => approve(r.id)} className="bg-brand-gradient"><Check className="h-4 w-4 mr-1" /> Approve & send</Button>
                  <Button size="sm" variant="outline" onClick={() => reject(r.id)}><X className="h-4 w-4 mr-1" /> Reject</Button>
                </>
              )}
              {r.status === "approved" && r.generated_code && (
                <Button size="sm" variant="outline" onClick={() => resend(r.id)}><Mail className="h-4 w-4 mr-1" /> Open email</Button>
              )}
              <Button size="sm" variant="ghost" onClick={() => del(r.id)}><Trash2 className="h-4 w-4" /></Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}

function CodesPanel() {
  const [codes, setCodes] = useState<any[]>([]);
  const [seats, setSeats] = useState(1);
  const [amount, setAmount] = useState(5);
  const [agent, setAgent] = useState("");
  const [assigned, setAssigned] = useState("");
  const [bulk, setBulk] = useState(1);
  const [search, setSearch] = useState("");

  const load = async () => {
    const { data } = await supabase.from("access_codes").select("*").order("created_at", { ascending: false });
    setCodes(data || []);
  };
  useEffect(() => { load(); }, []);

  const generate = async () => {
    const assignedList = assigned.split(",").map(s => s.trim().toLowerCase()).filter(Boolean);
    const rows = Array.from({ length: Math.max(1, bulk) }, () => ({
      code: randCode(), total_seats: seats, amount, agent_name: agent || null, assigned_emails: assignedList,
    }));
    const { error } = await supabase.from("access_codes").insert(rows);
    if (error) return toast.error(error.message);
    toast.success(`Generated ${rows.length} code${rows.length > 1 ? "s" : ""}`);
    setAgent(""); setAssigned("");
    load();
  };

  const del = async (id: string) => {
    if (!confirm("Delete code?")) return;
    await supabase.from("access_codes").delete().eq("id", id);
    load();
  };

  const copy = (code: string) => { navigator.clipboard?.writeText(code); toast.success(`Copied ${code}`); };

  const exportCsv = () => {
    const header = "code,seats_used,seats_total,amount,agent,assigned,created_at\n";
    const rows = codes.map(c => `${c.code},${c.used_seats},${c.total_seats},${c.amount},"${c.agent_name || ""}","${(c.assigned_emails || []).join(";")}",${c.created_at}`).join("\n");
    const blob = new Blob([header + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = `access-codes-${Date.now()}.csv`; a.click();
    URL.revokeObjectURL(url);
  };

  const filtered = codes.filter(c => !search ||
    c.code.toLowerCase().includes(search.toLowerCase()) ||
    (c.agent_name || "").toLowerCase().includes(search.toLowerCase()) ||
    (c.assigned_emails || []).join(",").toLowerCase().includes(search.toLowerCase()));


  return (
    <div className="space-y-6 mt-4">
      <Card className="p-6 bg-card text-card-foreground">
        <h3 className="font-semibold mb-3">Generate code(s)</h3>
        <div className="grid md:grid-cols-5 gap-3">
          <div><Label>Quantity</Label><Input type="number" min={1} max={100} value={bulk} onChange={e => setBulk(+e.target.value)} /></div>
          <div><Label>Seats per code</Label><Input type="number" min={1} value={seats} onChange={e => setSeats(+e.target.value)} /></div>
          <div><Label>Amount ($)</Label><Input type="number" min={0} step="0.01" value={amount} onChange={e => setAmount(+e.target.value)} /></div>
          <div><Label>Agent name</Label><Input value={agent} onChange={e => setAgent(e.target.value)} /></div>
          <div><Label>Assigned emails (comma)</Label><Input value={assigned} onChange={e => setAssigned(e.target.value)} placeholder="optional" /></div>
        </div>
        <Button onClick={generate} className="mt-4 bg-brand-gradient"><Plus className="h-4 w-4 mr-1" /> Generate</Button>
      </Card>

      <Card className="p-4 bg-card text-card-foreground">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search code, agent, email..." className="pl-9" />
          </div>
          <Button variant="outline" onClick={exportCsv}><Download className="h-4 w-4 mr-1" /> Export CSV</Button>
          <div className="text-sm text-muted-foreground">{filtered.length} of {codes.length} codes</div>
        </div>
      </Card>

      <Card className="p-0 bg-card text-card-foreground overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/40"><tr>
            <th className="text-left p-3">Code</th><th className="text-left p-3">Seats</th>
            <th className="text-left p-3">Amount</th><th className="text-left p-3">Agent</th>
            <th className="text-left p-3">Assigned</th><th></th>
          </tr></thead>
          <tbody>
            {filtered.map(c => (
              <tr key={c.id} className="border-t border-border/40">
                <td className="p-3 font-mono flex items-center gap-2">{c.code}
                  <Button variant="ghost" size="sm" onClick={() => copy(c.code)}><Copy className="h-3 w-3" /></Button>
                </td>
                <td className="p-3">{c.used_seats}/{c.total_seats}</td>
                <td className="p-3">${c.amount}</td>
                <td className="p-3">{c.agent_name || "_"}</td>
                <td className="p-3 text-xs">{(c.assigned_emails || []).join(", ") || "any"}</td>
                <td className="p-3"><Button variant="ghost" size="sm" onClick={() => del(c.id)}><Trash2 className="h-4 w-4" /></Button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}


function ContentPanel() {
  const [sets, setSets] = useState<any[]>([]);
  const [activeSet, setActiveSet] = useState<string>("");
  const [cards, setCards] = useState<any[]>([]);
  const [q, setQ] = useState(""); const [a, setA] = useState("");
  const [limit, setLimit] = useState(5);
  const [newSetTitle, setNewSetTitle] = useState("");
  const [newSetDesc, setNewSetDesc] = useState("");
  const [editing, setEditing] = useState<string | null>(null);
  const [editQ, setEditQ] = useState(""); const [editA, setEditA] = useState("");

  const loadSets = async () => {
    const { data } = await supabase.from("topic_sets").select("*").order("order_index");
    setSets(data || []);
    if (data && data[0] && !activeSet) setActiveSet(data[0].id);
  };
  useEffect(() => { loadSets(); }, []);

  const loadCards = async () => {
    if (!activeSet) return;
    const { data } = await supabase.from("cards").select("*").eq("topic_set_id", activeSet).order("order_index");
    setCards(data || []);
  };

  useEffect(() => {
    loadCards();
    const s = sets.find(s => s.id === activeSet);
    if (s) setLimit(s.free_card_limit);
  }, [activeSet, sets]);

  const addCard = async () => {
    if (!q.trim() || !a.trim()) return;
    const order = cards.length + 1;
    const { error } = await supabase.from("cards").insert({ topic_set_id: activeSet, question: q, answer: a, order_index: order });
    if (error) return toast.error(error.message);
    toast.success("Card added"); setQ(""); setA(""); loadCards();
  };

  const delCard = async (id: string) => {
    if (!confirm("Delete card?")) return;
    await supabase.from("cards").delete().eq("id", id);
    setCards(c => c.filter(x => x.id !== id));
  };

  const startEdit = (c: any) => { setEditing(c.id); setEditQ(c.question); setEditA(c.answer); };
  const saveEdit = async () => {
    if (!editing) return;
    await supabase.from("cards").update({ question: editQ, answer: editA }).eq("id", editing);
    setEditing(null); toast.success("Card updated"); loadCards();
  };

  const updateLimit = async () => {
    await supabase.from("topic_sets").update({ free_card_limit: limit }).eq("id", activeSet);
    toast.success("Free limit updated"); loadSets();
  };

  const createSet = async () => {
    if (!newSetTitle.trim()) return;
    const order = sets.length + 1;
    const { data, error } = await supabase.from("topic_sets").insert({ title: newSetTitle, description: newSetDesc, order_index: order }).select().single();
    if (error) return toast.error(error.message);
    toast.success("Topic set created"); setNewSetTitle(""); setNewSetDesc("");
    await loadSets(); if (data) setActiveSet(data.id);
  };

  const deleteSet = async () => {
    if (!activeSet) return;
    if (!confirm("Delete this topic set and ALL its cards?")) return;
    await supabase.from("cards").delete().eq("topic_set_id", activeSet);
    await supabase.from("topic_sets").delete().eq("id", activeSet);
    setActiveSet(""); loadSets();
  };

  return (
    <div className="space-y-6 mt-4">
      <Card className="p-6 bg-card text-card-foreground">
        <h3 className="font-semibold mb-3">Create new topic set</h3>
        <div className="grid md:grid-cols-3 gap-3">
          <Input placeholder="Title (e.g. Paper 3 _ Boolean Algebra)" value={newSetTitle} onChange={e => setNewSetTitle(e.target.value)} />
          <Input placeholder="Description" value={newSetDesc} onChange={e => setNewSetDesc(e.target.value)} />
          <Button onClick={createSet} className="bg-brand-gradient"><Plus className="h-4 w-4 mr-1" /> Create</Button>
        </div>
      </Card>

      <Card className="p-6 bg-card text-card-foreground">
        <Label>Active topic set</Label>
        <div className="flex gap-2 mt-1">
          <select value={activeSet} onChange={e => setActiveSet(e.target.value)} className="flex-1 rounded-md border border-input bg-background text-foreground p-2">
            {sets.map(s => <option key={s.id} value={s.id}>{s.title}</option>)}
          </select>
          <Button variant="destructive" onClick={deleteSet}><Trash2 className="h-4 w-4" /></Button>
        </div>
        <div className="mt-3 flex items-end gap-3">
          <div><Label>Free card limit</Label><Input type="number" value={limit} onChange={e => setLimit(+e.target.value)} className="w-32" /></div>
          <Button onClick={updateLimit}>Save limit</Button>
          <div className="text-sm text-muted-foreground ml-auto">{cards.length} cards in this set</div>
        </div>
      </Card>

      <Card className="p-6 bg-card text-card-foreground">
        <h3 className="font-semibold mb-3">Add card</h3>
        <p className="text-xs text-muted-foreground mb-2">
          Math: wrap inline in <code>$...$</code>, block in <code>$$...$$</code>. ASCII art: triple backticks.
          Real SVG diagrams: <code>```diagram closed-loop```</code>. Available:
          closed-loop, open-loop, dcs-pyramid, pneumatic-valve, butterfly-valve, bode, nyquist, root-locus, plc-architecture.
        </p>
        <div className="space-y-2">
          <div><Label>Question</Label><textarea value={q} onChange={e => setQ(e.target.value)} rows={2} className="w-full rounded-md border border-input bg-background text-foreground p-2 text-sm" /></div>
          <div><Label>Answer</Label><textarea value={a} onChange={e => setA(e.target.value)} rows={5} className="w-full rounded-md border border-input bg-background text-foreground p-2 text-sm font-mono" /></div>
          <Button onClick={addCard} className="bg-brand-gradient"><Plus className="h-4 w-4 mr-1" /> Add card</Button>
        </div>
      </Card>

      <BulkImportCard activeSet={activeSet} existingCount={cards.length} onImported={loadCards} />

      <Card className="p-0 bg-card text-card-foreground overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/40"><tr><th className="text-left p-3 w-12">#</th><th className="text-left p-3">Question</th><th className="w-32"></th></tr></thead>
          <tbody>
            {cards.map(c => (
              <tr key={c.id} className="border-t border-border/40 align-top">
                <td className="p-3">{c.order_index}</td>
                <td className="p-3">
                  {editing === c.id ? (
                    <div className="space-y-2">
                      <textarea value={editQ} onChange={e => setEditQ(e.target.value)} rows={2} className="w-full rounded-md border border-input bg-background text-foreground p-2 text-sm" />
                      <textarea value={editA} onChange={e => setEditA(e.target.value)} rows={5} className="w-full rounded-md border border-input bg-background text-foreground p-2 text-sm font-mono" />
                    </div>
                  ) : c.question}
                </td>
                <td className="p-3 text-right">
                  {editing === c.id ? (
                    <>
                      <Button variant="ghost" size="sm" onClick={saveEdit}><Save className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="sm" onClick={() => setEditing(null)}><X className="h-4 w-4" /></Button>
                    </>
                  ) : (
                    <>
                      <Button variant="ghost" size="sm" onClick={() => startEdit(c)}><Edit3 className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="sm" onClick={() => delCard(c.id)}><Trash2 className="h-4 w-4" /></Button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );

}

// _____________________________________________________________________________
// Bulk-import cards from a pasted Markdown block.
// Supported formats (parser is liberal _ asterisks/bold/numbering are stripped):
//
//   Q: What is Ohm's law?
//   A: V = I * R. Voltage equals current times resistance.
//
//   Q: Define a transducer.
//   A: A device that converts one form of energy to another.
//
// Separator lines (---, ===, blank lines) are optional. Markdown bold (**...**),
// italic (*...* / _..._) and leading list markers (1., -, *) are auto-removed
// from the *delimiters* but preserved inside the answer body so diagrams,
// tables and math survive intact.
function parseMarkdownCards(input: string): { question: string; answer: string }[] {
  const cards: { question: string; answer: string }[] = [];
  // Normalise line endings and split.
  const lines = input.replace(/\r\n?/g, "\n").split("\n");

  // Helper: strip bold/italic markers and leading list markers from a label line
  const cleanLabel = (s: string) =>
    s
      .replace(/^\s*[-*+]\s+/, "") // list markers
      .replace(/^\s*\d+[.)]\s+/, "") // numbered list
      .replace(/\*\*/g, "")
      .replace(/__/g, "")
      .replace(/^\s*#+\s*/, "")
      .trim();

  let current: { question: string[]; answer: string[]; mode: "q" | "a" | null } = {
    question: [],
    answer: [],
    mode: null,
  };

  const flush = () => {
    const q = current.question.join("\n").trim();
    const a = current.answer.join("\n").trim();
    if (q && a) cards.push({ question: q, answer: a });
    current = { question: [], answer: [], mode: null };
  };

  const qRe = /^\s*(?:\*\*|__)?\s*(?:Q(?:uestion)?|\d+[.)])\s*[:.\-]\s*(.*)$/i;
  const aRe = /^\s*(?:\*\*|__)?\s*A(?:nswer)?\s*[:.\-]\s*(.*)$/i;

  for (const rawLine of lines) {
    const line = rawLine;
    const trimmed = line.trim();

    // Hard separator => commit current card
    if (/^(?:---+|===+|\*\*\*+)$/.test(trimmed)) {
      flush();
      continue;
    }

    const qMatch = line.match(qRe);
    const aMatch = line.match(aRe);

    if (qMatch) {
      // New question starts: flush previous card if it had both parts.
      flush();
      current.mode = "q";
      const rest = cleanLabel(qMatch[1] ?? "");
      if (rest) current.question.push(rest);
      continue;
    }
    if (aMatch) {
      current.mode = "a";
      const rest = (aMatch[1] ?? "").replace(/\*\*/g, "").replace(/__/g, "").trim();
      if (rest) current.answer.push(rest);
      continue;
    }

    if (current.mode === "q") current.question.push(line);
    else if (current.mode === "a") current.answer.push(line);
    // lines before any Q: are ignored (preamble)
  }
  flush();
  return cards;
}

function BulkImportCard({
  activeSet,
  existingCount,
  onImported,
}: {
  activeSet: string;
  existingCount: number;
  onImported: () => void;
}) {
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);

  const preview = parseMarkdownCards(text);

  const importCards = async () => {
    if (!activeSet) return toast.error("Pick a topic set first.");
    if (preview.length === 0) return toast.error("No Q/A pairs detected. Use 'Q:' and 'A:' labels.");
    setBusy(true);
    const rows = preview.map((c, i) => ({
      topic_set_id: activeSet,
      question: c.question,
      answer: c.answer,
      order_index: existingCount + i + 1,
    }));
    const { error } = await supabase.from("cards").insert(rows);
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success(`Imported ${rows.length} card${rows.length > 1 ? "s" : ""}`);
    setText("");
    onImported();
  };

  return (
    <Card className="p-6 bg-card text-card-foreground border-secondary/30">
      <div className="flex items-center justify-between flex-wrap gap-3 mb-3">
        <div>
          <h3 className="font-semibold flex items-center gap-2"><Upload className="h-4 w-4 text-secondary" /> Bulk-import from Markdown</h3>
          <p className="text-xs text-muted-foreground mt-1">
            Paste a whole exam paper. Asterisks/bold are stripped automatically. Diagrams and tables in the
            answer body are kept intact. Each card needs a <code>Q:</code> and <code>A:</code> label.
          </p>
        </div>
        <Badge variant={preview.length > 0 ? "default" : "outline"}>
          {preview.length} card{preview.length === 1 ? "" : "s"} detected
        </Badge>
      </div>

      <details className="mb-3 text-xs text-muted-foreground">
        <summary className="cursor-pointer hover:text-foreground">Example format (click to expand)</summary>
        <pre className="mt-2 p-3 bg-muted/30 rounded text-xs whitespace-pre-wrap">{`Q: State Ohm's law.
A: V = I R. The voltage across a resistor equals the current through it times its resistance.

Q: Define a transducer.
A: A device that converts one form of energy to another, e.g. a thermocouple converts heat into an EMF.

---

Q: Draw the closed-loop block diagram.
A: \`\`\`diagram closed-loop\`\`\`
The setpoint R(s) goes into a summing junction; the error E(s) drives the controller and plant G(s); H(s) feeds the output back.`}</pre>
      </details>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={12}
        placeholder="Paste your exam paper here..."
        className="w-full rounded-md border border-input bg-background text-foreground p-2 text-sm font-mono"
      />

      {preview.length > 0 && (
        <div className="mt-3 p-3 rounded bg-muted/20 max-h-48 overflow-auto text-xs">
          <div className="font-semibold mb-2">Preview</div>
          {preview.slice(0, 5).map((c, i) => (
            <div key={i} className="mb-2 pb-2 border-b border-border/40 last:border-0">
              <div><strong>Q{i + 1}:</strong> {c.question.slice(0, 120)}{c.question.length > 120 ? "..." : ""}</div>
              <div className="text-muted-foreground"><strong>A:</strong> {c.answer.slice(0, 160)}{c.answer.length > 160 ? "..." : ""}</div>
            </div>
          ))}
          {preview.length > 5 && <div className="text-muted-foreground">...and {preview.length - 5} more</div>}
        </div>
      )}

      <div className="flex gap-2 mt-3">
        <Button onClick={importCards} disabled={busy || preview.length === 0} className="bg-brand-gradient">
          <Upload className="h-4 w-4 mr-1" /> Import {preview.length > 0 ? `${preview.length} card${preview.length === 1 ? "" : "s"}` : ""}
        </Button>
        <Button variant="outline" onClick={() => setText("")} disabled={busy || !text}>
          <X className="h-4 w-4 mr-1" /> Clear
        </Button>
      </div>
    </Card>
  );
}

function UsersPanel() {
  const [users, setUsers] = useState<any[]>([]);
  const [codesByUser, setCodesByUser] = useState<Record<string, any[]>>({});
  const [search, setSearch] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState<Record<string, number>>({});

  const load = async () => {
    const { data: u } = await supabase.from("profiles").select("*").order("created_at", { ascending: false });
    setUsers(u || []);
    // Codes issued/bound directly to the user
    const { data: bound } = await supabase.from("access_codes").select("id, code, amount, total_seats, used_seats, agent_name, bound_user_id, created_at");
    // Codes the user redeemed
    const { data: usage } = await supabase.from("access_code_usage").select("user_id, used_at, access_codes(code, amount, agent_name)");
    const map: Record<string, any[]> = {};
    (bound || []).forEach((c: any) => {
      if (!c.bound_user_id) return;
      (map[c.bound_user_id] ||= []).push({ code: c.code, amount: c.amount, agent: c.agent_name, source: "issued", at: c.created_at });
    });
    (usage || []).forEach((r: any) => {
      const c = r.access_codes;
      if (!c) return;
      (map[r.user_id] ||= []).push({ code: c.code, amount: c.amount, agent: c.agent_name, source: "redeemed", at: r.used_at });
    });
    setCodesByUser(map);
  };
  useEffect(() => { load(); }, []);

  const toggle = async (u: any) => {
    const next = u.access_level === "full" ? "free" : "full";
    await supabase.from("profiles").update({ access_level: next }).eq("id", u.id);
    load();
  };

  const handleUserNameClick = (userId: string) => {
    setDeleteConfirm(prev => ({
      ...prev,
      [userId]: (prev[userId] || 0) + 1
    }));
    setTimeout(() => {
      setDeleteConfirm(prev => ({
        ...prev,
        [userId]: 0
      }));
    }, 1000);
  };

  const deleteUser = async (userId: string) => {
    try {
      await supabase.from("profiles").delete().eq("id", userId);
      toast.success("User deleted");
      setDeleteConfirm(prev => ({ ...prev, [userId]: 0 }));
      load();
    } catch (e: any) {
      toast.error(e?.message || "Delete failed");
    }
  };

  const copy = (s: string) => { navigator.clipboard?.writeText(s); toast.success(`Copied ${s}`); };

  const filtered = users.filter(u =>
    !search ||
    (u.email || "").toLowerCase().includes(search.toLowerCase()) ||
    (u.full_name || "").toLowerCase().includes(search.toLowerCase()) ||
    (codesByUser[u.id] || []).some((c) => c.code.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-4 mt-4">
      <Card className="p-4 bg-card text-card-foreground">
        <div className="relative">
          <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search user or code..." className="pl-9" />
        </div>
      </Card>
      <Card className="p-0 bg-card text-card-foreground overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/40"><tr>
            <th className="text-left p-3">Email</th>
            <th className="text-left p-3">Name</th>
            <th className="text-left p-3">Access</th>
            <th className="text-left p-3">Access codes</th>
            <th></th>
          </tr></thead>
          <tbody>
            {filtered.map(u => {
              const codes = codesByUser[u.id] || [];
              const tapCount = deleteConfirm[u.id] || 0;
              const showDelete = tapCount >= 3;
              return (
                <tr key={u.id} className="border-t border-border/40 align-top">
                  <td className="p-3 break-all">{u.email}</td>
                  <td className="p-3 cursor-pointer hover:underline select-none" onClick={() => handleUserNameClick(u.id)} title={tapCount >= 3 ? "Tap once more to delete" : `Tap ${3 - tapCount} more times to delete`}>
                    {u.full_name || "_"}
                    {tapCount > 0 && <span className="text-xs text-muted-foreground ml-2">({tapCount}/3)</span>}
                  </td>
                  <td className="p-3"><Badge variant={u.access_level === "full" ? "default" : "outline"}>{u.access_level}</Badge></td>
                  <td className="p-3">
                    {codes.length === 0 ? (
                      <span className="text-xs text-muted-foreground">_</span>
                    ) : (
                      <div className="space-y-1">
                        {codes.map((c, i) => (
                          <div key={i} className="flex items-center gap-2 flex-wrap">
                            <code className="font-mono text-xs bg-secondary/10 border border-secondary/30 rounded px-2 py-0.5">{c.code}</code>
                            <Button variant="ghost" size="sm" className="h-6 px-1" onClick={() => copy(c.code)}><Copy className="h-3 w-3" /></Button>
                            <Badge variant="outline" className="text-[10px]">{c.source}</Badge>
                            {c.agent && <span className="text-[11px] text-muted-foreground">· {c.agent}</span>}
                            <span className="text-[11px] text-muted-foreground">· ${c.amount}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </td>
                  <td className="p-3 flex gap-2">
                    {showDelete ? (
                      <Button variant="destructive" size="sm" onClick={() => deleteUser(u.id)}>
                        Delete user
                      </Button>
                    ) : (
                      <Button variant="ghost" size="sm" onClick={() => toggle(u)}>
                        {u.access_level === "full" ? <><ShieldOff className="h-4 w-4 mr-1" />Downgrade</> : <><ShieldCheck className="h-4 w-4 mr-1" />Upgrade</>}
                      </Button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

function TicketsPanel() {
  const [tickets, setTickets] = useState<any[]>([]);
  const [replyDraft, setReplyDraft] = useState<Record<string, string>>({});

  const load = async () => {
    const { data } = await supabase.from("support_tickets").select("*").order("created_at", { ascending: false });
    setTickets(data || []);
  };
  useEffect(() => { load(); }, []);

  const sendReply = async (t: any) => {
    const reply = (replyDraft[t.id] || "").trim();
    if (!reply) return toast.error("Write a reply first");
    const { error } = await supabase.from("support_tickets")
      .update({ admin_reply: reply, replied_at: new Date().toISOString(), status: "closed" })
      .eq("id", t.id);
    if (error) return toast.error(error.message);
    toast.success("Reply saved (user will see it on Support page)");
    setReplyDraft((d) => ({ ...d, [t.id]: "" }));
    load();
  };

  const del = async (id: string) => {
    if (!confirm("Delete this message?")) return;
    await supabase.from("support_tickets").delete().eq("id", id);
    load();
  };

  return (
    <div className="space-y-3 mt-4">
      {tickets.length === 0 && <p className="text-muted-foreground text-sm">No messages.</p>}
      {tickets.map(t => (
        <Card key={t.id} className="p-4 bg-card text-card-foreground">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <div className="flex items-center gap-2 text-sm"><strong>{t.subject}</strong><Badge variant="outline">{t.status}</Badge></div>
              <p className="text-xs text-muted-foreground mt-1">From: {t.user_email} · {new Date(t.created_at).toLocaleString()}</p>
              <p className="text-sm mt-2 whitespace-pre-wrap">{t.message}</p>
              {t.admin_reply && (
                <div className="mt-3 rounded-md border border-secondary/40 bg-secondary/5 p-3">
                  <p className="text-xs text-secondary font-semibold mb-1">Your reply · {t.replied_at ? new Date(t.replied_at).toLocaleString() : ""}</p>
                  <p className="text-sm whitespace-pre-wrap">{t.admin_reply}</p>
                </div>
              )}
              <div className="mt-3 space-y-2">
                <Textarea
                  value={replyDraft[t.id] || ""}
                  onChange={(e) => setReplyDraft((d) => ({ ...d, [t.id]: e.target.value }))}
                  rows={3}
                  placeholder={t.admin_reply ? "Send another reply…" : "Write a reply…"}
                />
                <Button size="sm" onClick={() => sendReply(t)} className="bg-brand-gradient">
                  <Send className="h-4 w-4 mr-1" /> Send reply
                </Button>
              </div>
            </div>
            <Button size="sm" variant="ghost" onClick={() => del(t.id)}><Trash2 className="h-4 w-4" /></Button>
          </div>
        </Card>
      ))}
    </div>
  );
}


function PaymentsPanel() {
  const [reqs, setReqs] = useState<any[]>([]);
  const [email, setEmail] = useState(""); const [email2, setEmail2] = useState("");
  const [amount, setAmount] = useState(5); const [agent, setAgent] = useState("");

  const load = async () => {
    const { data } = await supabase.from("payment_requests").select("*").order("created_at", { ascending: false });
    setReqs(data || []);
  };
  useEffect(() => { load(); }, []);

  const add = async () => {
    if (!email) return toast.error("Email required");
    await supabase.from("payment_requests").insert({ student_email: email, student_email_2: email2 || null, amount, agent_name: agent || null });
    setEmail(""); setEmail2(""); setAgent(""); load();
  };

  return (
    <div className="space-y-4 mt-4">
      <Card className="p-6 bg-card text-card-foreground">
        <h3 className="font-semibold mb-3">Log payment notification</h3>
        <div className="grid md:grid-cols-4 gap-3">
          <Input placeholder="Student email" value={email} onChange={e => setEmail(e.target.value)} />
          <Input placeholder="Second email (if pair)" value={email2} onChange={e => setEmail2(e.target.value)} />
          <Input type="number" placeholder="Amount" value={amount} onChange={e => setAmount(+e.target.value)} />
          <Input placeholder="Agent" value={agent} onChange={e => setAgent(e.target.value)} />
        </div>
        <Button onClick={add} className="mt-3 bg-brand-gradient">Log</Button>
      </Card>
      <Card className="p-0 bg-card text-card-foreground overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/40"><tr><th className="text-left p-3">Email(s)</th><th className="text-left p-3">Amount</th><th className="text-left p-3">Agent</th><th className="text-left p-3">Status</th></tr></thead>
          <tbody>{reqs.map(r => (
            <tr key={r.id} className="border-t border-border/40">
              <td className="p-3">{r.student_email}{r.student_email_2 ? `, ${r.student_email_2}` : ""}</td>
              <td className="p-3">${r.amount}</td>
              <td className="p-3">{r.agent_name || "_"}</td>
              <td className="p-3"><Badge variant="outline">{r.status}</Badge></td>
            </tr>
          ))}</tbody>
        </table>
      </Card>
    </div>
  );
}

function AgentsPanel() {
  const [agents, setAgents] = useState<any[]>([]);
  const [name, setName] = useState(""); const [contact, setContact] = useState("");
  const load = async () => { const { data } = await supabase.from("agents").select("*").order("created_at", { ascending: false }); setAgents(data || []); };
  useEffect(() => { load(); }, []);
  const add = async () => {
    if (!name) return;
    await supabase.from("agents").insert({ name, contact });
    setName(""); setContact(""); load();
  };
  const del = async (id: string) => { await supabase.from("agents").delete().eq("id", id); load(); };
  return (
    <div className="space-y-4 mt-4">
      <Card className="p-6 bg-card text-card-foreground">
        <div className="grid md:grid-cols-3 gap-3">
          <Input placeholder="Name" value={name} onChange={e => setName(e.target.value)} />
          <Input placeholder="Contact" value={contact} onChange={e => setContact(e.target.value)} />
          <Button onClick={add} className="bg-brand-gradient">Add agent</Button>
        </div>
      </Card>
      <Card className="p-0 bg-card text-card-foreground overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/40"><tr><th className="text-left p-3">Name</th><th className="text-left p-3">Contact</th><th></th></tr></thead>
          <tbody>{agents.map(a => (
            <tr key={a.id} className="border-t border-border/40">
              <td className="p-3">{a.name}</td><td className="p-3">{a.contact}</td>
              <td className="p-3"><Button variant="ghost" size="sm" onClick={() => del(a.id)}><Trash2 className="h-4 w-4" /></Button></td>
            </tr>
          ))}</tbody>
        </table>
      </Card>
    </div>
  );
}

function SettingsPanel() {
  const [agent, setAgent] = useState("");
  const [solo, setSolo] = useState(5);
  const [pair, setPair] = useState(8);
  const [emailSubject, setEmailSubject] = useState("");
  const [emailBody, setEmailBody] = useState("");
  const [busy, setBusy] = useState(false);

  const load = async () => {
    const { data } = await supabase.from("app_settings").select("*").eq("id", true).maybeSingle();
    if (data) {
      setAgent(data.primary_agent_name);
      setSolo(Number(data.solo_amount));
      setPair(Number(data.pair_amount));
      setEmailSubject((data as any).access_email_subject || "");
      setEmailBody((data as any).access_email_body || "");
    }
  };
  useEffect(() => { load(); }, []);

  const save = async () => {
    if (!agent.trim()) return toast.error("Agent name required");
    setBusy(true);
    const { error } = await supabase.from("app_settings").upsert({
      id: true,
      primary_agent_name: agent.trim(),
      solo_amount: solo,
      pair_amount: pair,
      access_email_subject: emailSubject.trim() || "Your Industrial Automation Access Code",
      access_email_body: emailBody,
      updated_at: new Date().toISOString(),
    });
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success("Settings updated");
  };

  return (
    <div className="space-y-4 mt-4">
      <Card className="p-6 bg-card text-card-foreground">
        <h3 className="font-semibold mb-1">Public app settings</h3>
        <p className="text-xs text-muted-foreground mb-4">Agent contact is now shared only with signed-in users (security fix).</p>
        <div className="grid md:grid-cols-3 gap-3">
          <div className="md:col-span-3">
            <Label>Authorised agent name &amp; contact</Label>
            <Input value={agent} onChange={e => setAgent(e.target.value)} maxLength={255} placeholder="e.g. John Doe (+263 77 123 4567)" />
          </div>
          <div>
            <Label>Solo amount ($)</Label>
            <Input type="number" min={0} step="0.01" value={solo} onChange={e => setSolo(+e.target.value)} />
          </div>
          <div>
            <Label>Pair amount ($)</Label>
            <Input type="number" min={0} step="0.01" value={pair} onChange={e => setPair(+e.target.value)} />
          </div>
        </div>
      </Card>

      <Card className="p-6 bg-card text-card-foreground">
        <h3 className="font-semibold mb-1">Access-code email template</h3>
        <p className="text-xs text-muted-foreground mb-4">
          When you approve a request, your device&rsquo;s email app (Gmail, Mail, etc.) opens with this subject and body pre-filled. Use the placeholders{" "}
          <code className="px-1 rounded bg-muted">{`{{full_name}}`}</code> and{" "}
          <code className="px-1 rounded bg-muted">{`{{code}}`}</code> - they are replaced automatically before the email opens.
        </p>
        <div className="space-y-3">
          <div>
            <Label>Subject</Label>
            <Input value={emailSubject} onChange={e => setEmailSubject(e.target.value)} placeholder="Your Industrial Automation Access Code" />
          </div>
          <div>
            <Label>Body</Label>
            <Textarea value={emailBody} onChange={e => setEmailBody(e.target.value)} rows={12} placeholder={"Hi {{full_name}},\n\nYour access code is:\n\n{{code}}\n\n- Ultimate_Developers"} className="font-mono text-sm" />
          </div>
        </div>
      </Card>

      <Button onClick={save} disabled={busy} className="bg-brand-gradient"><Save className="h-4 w-4 mr-1" /> {busy ? "Saving…" : "Save all settings"}</Button>
    </div>
  );
}
