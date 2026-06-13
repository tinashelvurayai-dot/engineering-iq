import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppHeader } from "@/components/AppHeader";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Cpu, KeyRound, Sparkles, Mail, BookOpen, Zap, Trophy, Brain, Clock, CheckCircle2, Download, UserPlus, UserCheck, Coffee, Star, Users } from "lucide-react";
import logo from "@/assets/logo.png";
import { InstallAppButton } from "@/components/InstallAppButton";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/")({ component: Landing });

function Landing() {
  const [settings, setSettings] = useState<{ primary_agent_name: string; solo_amount: number; pair_amount: number } | null>(null);
  const [userCount, setUserCount] = useState<number>(1428);
  useEffect(() => {
    supabase.rpc("get_public_pricing").then(({ data }) => {
      const row = Array.isArray(data) ? data[0] : null;
      if (row) setSettings({ primary_agent_name: "", solo_amount: Number(row.solo_amount), pair_amount: Number(row.pair_amount) });
    });
    supabase.rpc("get_public_user_count").then(({ data }) => {
      if (typeof data === "number") setUserCount(data);
    });
  }, []);
  const DEFAULT_AGENT_PLACEHOLDER = "Contact admin for agent details";
  const agentRaw = settings?.primary_agent_name?.trim();
  const agent = agentRaw && agentRaw !== DEFAULT_AGENT_PLACEHOLDER ? agentRaw : null;
  const solo = settings?.solo_amount ?? 5;
  const pair = settings?.pair_amount ?? 8;
  return (
    <div className="min-h-screen bg-hero">
      <AppHeader />
      <main>
        {/* HERO */}
        <section className="container mx-auto px-4 pt-16 pb-12 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-secondary/40 bg-secondary/10 px-3 py-1 text-xs text-secondary mb-6">
            <Zap className="h-3 w-3" /> Built from real National Diploma past papers
          </div>
          <p className="font-serif italic text-amber-200/90 text-base md:text-lg mb-3 tracking-wide">
            « La dolce revisione&nbsp;- studiare come un&rsquo;arte. »
          </p>
          <p className="text-xs uppercase tracking-[0.35em] text-amber-300/70 mb-6">
            Un&rsquo;edizione artigianale &middot; Italian-crafted study experience
          </p>
          <img src={logo} alt="Industrial Automation logo" className="mx-auto h-28 w-auto mb-6 drop-shadow-[0_0_60px_rgba(99,102,241,0.55)]" />
          <h1 className="font-display text-4xl md:text-6xl font-bold tracking-tight leading-tight text-white">
            Master Automation.<br />
            <span className="text-brand-gradient">Ace your exam with confidence.</span>
          </h1>
          <p className="mt-5 max-w-2xl mx-auto text-lg text-white/80">
            Notes, past papers and smart practice - built for students preparing for their final Industrial Automation exams.
            <em className="block mt-2 text-white/70">Concepts your brain actually remembers.</em>
          </p>
          {/* Social proof strip */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-sm text-white/85">
            <span className="inline-flex items-center gap-1">
              <span className="text-amber-300 tracking-tight">★★★★★</span>
              <strong className="text-white">4.9 / 5</strong>
              <span className="text-white/60">from students</span>
            </span>
            <span className="hidden sm:inline text-white/30">·</span>
            <span className="inline-flex items-center gap-1.5">
              <Users className="h-4 w-4 text-secondary" />
              <strong className="text-white">{userCount.toLocaleString()}</strong>
              <span className="text-white/60">users preparing now · join the race</span>
            </span>
          </div>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button asChild size="lg" className="bg-brand-gradient text-primary-foreground shadow-glow text-base">
              <Link to="/request-access"><UserPlus className="h-4 w-4 mr-1" /> Request Access</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="text-white border-white/40 hover:bg-white/10 hover:text-white">
              <Link to="/sign-in"><KeyRound className="h-4 w-4 mr-1" /> I have a code</Link>
            </Button>
            <InstallAppButton />

          </div>
          <div className="mt-6 flex flex-wrap justify-center items-center gap-x-6 gap-y-2 text-xs text-white/70">
            <span className="flex items-center gap-1"><CheckCircle2 className="h-3 w-3 text-secondary" /> Cancel any month</span>
            <span className="flex items-center gap-1"><CheckCircle2 className="h-3 w-3 text-secondary" /> No exam dates, ever</span>
            <span className="flex items-center gap-1"><CheckCircle2 className="h-3 w-3 text-secondary" /> Works offline once installed</span>
          </div>
        </section>

        {/* PAIN _ AGITATE */}
        <section className="container mx-auto px-4 py-12">
          <Card className="p-8 md:p-12 bg-card text-card-foreground shadow-card-elev">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-4">You already know what's coming.</h2>
                <p className="text-muted-foreground">
                  The same Boolean simplifications. The same Laplace transforms. The same partial fraction tricks.
                  The same five sensors, the same PLC ladder, the same hydraulic schematic. Year after year.
                </p>
                <p className="mt-4 font-semibold">
                  The students who pass aren't smarter. <span className="text-brand-gradient">They've just seen the questions before.</span>
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { i: Brain, n: "75+", l: "cards drawn from real papers" },
                  { i: Trophy, n: "100%", l: "model-answer accuracy" },
                  { i: Clock, n: "15 min", l: "a day is enough" },
                  { i: BookOpen, n: "5", l: "complete past paper sets" },
                ].map(({ i: Icon, n, l }) => (
                  <div key={l} className="rounded-xl border border-black/20 p-4 text-center bg-white">
                    <Icon className="h-5 w-5 mx-auto text-secondary mb-2" />
                    <p className="text-2xl font-bold text-black">{n}</p>
                    <p className="text-xs text-black mt-1">{l}</p>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </section>

        {/* HOW */}
        <section className="container mx-auto px-4 py-12">
          <h2 className="text-3xl font-bold text-center mb-2 text-white">From confused to confident in 3 steps</h2>
          <p className="text-center text-white/70 mb-10">No downloads required. No setup. Open and revise.</p>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { i: Sparkles, t: "1. Request access", d: "Enter your full name, WhatsApp number and email. The system needs your email to send your access code." },
              { i: KeyRound, t: "2. Pay an agent", d: `Hand over $${solo} (solo, monthly) or $${pair} (two of you together, monthly) to an authorised agent. Agent calls admin with your name. Admin approves.` },
              { i: Cpu, t: "3. Get code by email", d: "Your access code arrives by email. Sign in with your full name + code, every card unlocks. Install to your phone and revise offline." },
            ].map(({ i: Icon, t, d }) => (
              <Card key={t} className="p-6 bg-card text-card-foreground shadow-card-elev hover:border-secondary transition border-2 border-transparent">
                <div className="h-12 w-12 rounded-lg bg-brand-gradient flex items-center justify-center mb-4">
                  <Icon className="h-6 w-6 text-primary-foreground" />
                </div>
                <h3 className="font-semibold text-lg">{t}</h3>
                <p className="text-muted-foreground mt-2 text-sm">{d}</p>
              </Card>
            ))}
          </div>
        </section>

        {/* PRICE */}
        <section className="container mx-auto px-4 py-12">
          <Card className="p-10 bg-card text-card-foreground shadow-card-elev">
            <h2 className="text-3xl font-bold text-center">Simple monthly pricing.</h2>
            <p className="text-center text-muted-foreground mt-2">Pay monthly. Keep full access while you study. Cancel any time - just stop paying.</p>
            <div className="grid md:grid-cols-2 gap-6 mt-8">
              <div className="rounded-xl border-2 border-border p-6 text-center">
                <p className="text-sm uppercase tracking-wider text-muted-foreground">Solo</p>
                <p className="text-5xl font-bold mt-2">${solo}<span className="text-base font-normal text-muted-foreground">/month</span></p>
                <p className="text-sm text-muted-foreground mt-2">One individual, full access for the month</p>
              </div>
              <div className="rounded-xl border-2 border-secondary p-6 text-center bg-secondary/5 relative">
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-xs bg-secondary text-secondary-foreground px-2 py-0.5 rounded-full font-semibold">BEST VALUE</span>
                <p className="text-sm uppercase tracking-wider text-secondary">Pair (sign up together)</p>
                <p className="text-5xl font-bold mt-2">${pair}<span className="text-base font-normal text-muted-foreground">/month</span></p>
                <p className="text-sm text-muted-foreground mt-2">
                  Two new users, registered together. Save together when you sign up as a pair.
                </p>
              </div>
            </div>
            <p className="text-center mt-6 text-sm text-muted-foreground">Pay any authorised agent in cash each month. No card. No online payment.</p>
            <div className="mt-6 rounded-lg border border-secondary/40 bg-secondary/5 p-4 flex items-center justify-center gap-2 text-sm text-center">
              <UserCheck className="h-4 w-4 text-secondary shrink-0" />
              {agent
                ? <span className="text-foreground">Authorised agent: <strong>{agent}</strong></span>
                : <span className="text-muted-foreground">Admin will name your authorised agent after you submit a request.</span>}
            </div>
          </Card>
        </section>

        {/* TESTIMONIALS */}
        <section className="container mx-auto px-4 py-12">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 text-amber-300 mb-2">
              <Star className="h-4 w-4 fill-amber-300" />
              <span className="text-sm font-semibold tracking-wide">4.9 / 5 from students</span>
              <Star className="h-4 w-4 fill-amber-300" />
            </div>
            <h2 className="text-3xl font-bold text-white">What students say</h2>
            <p className="text-white/60 text-sm mt-2">
              <strong className="text-white">{userCount.toLocaleString()}</strong> users preparing now · join the race
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { n: "Tariro M.", b: "+27%", q: "Smashed two mock papers in a weekend. The AI tutor is unreal." },
              { n: "Bongani K.", b: "Top 5%", q: "Finally understood PID tuning. Worth way more than $5." },
              { n: "Aisha R.", b: "Distinction", q: "Past papers + practice in one place. Saved my finals." },
            ].map(({ n, b, q }) => (
              <Card key={n} className="p-6 bg-card text-card-foreground shadow-card-elev">
                <div className="flex items-center justify-between mb-3">
                  <p className="font-semibold">{n}</p>
                  <span className="text-xs bg-brand-gradient text-primary-foreground px-2 py-0.5 rounded-full font-semibold">{b}</span>
                </div>
                <div className="text-amber-400 text-sm mb-2 tracking-tight">★★★★★</div>
                <p className="text-sm text-muted-foreground italic">"{q}"</p>
              </Card>
            ))}
          </div>
        </section>






        {/* TRUST */}
        <section className="container mx-auto px-4 py-12">
          <div className="grid sm:grid-cols-3 gap-4 text-sm">
            {[
              { i: BookOpen, t: "Real exam content", d: "Five full past paper sets, model answers verified." },
              { i: Download, t: "Install on phone", d: "Add to home screen, revise even offline." },
              { i: Mail, t: "Real human support", d: "examgeniuspro@gmail.com" },
            ].map(({ i: Icon, t, d }) => (
              <Card key={t} className="p-4 bg-card text-card-foreground">
                <Icon className="h-5 w-5 text-secondary mb-2" />
                <p className="font-semibold">{t}</p>
                <p className="text-xs text-muted-foreground mt-1">{d}</p>
              </Card>
            ))}
          </div>
        </section>

        {/* ESPRESSO DIVIDER */}
        <section className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-center gap-4 max-w-md mx-auto">
            <span className="h-px flex-1 bg-gradient-to-r from-transparent via-amber-400/40 to-amber-400/60" />
            <Coffee className="h-5 w-5 text-amber-300" />
            <span className="font-serif italic text-amber-200/80 text-sm whitespace-nowrap">prenditi un caffè, poi rivedi</span>
            <Coffee className="h-5 w-5 text-amber-300" />
            <span className="h-px flex-1 bg-gradient-to-l from-transparent via-amber-400/40 to-amber-400/60" />
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="container mx-auto px-4 py-16 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white">Your future self is begging you to start.</h2>
          <p className="text-white/70 mt-3 max-w-xl mx-auto">5 free cards per topic. No code needed. Click. Request access. Revise.</p>
          <Button asChild size="lg" className="mt-6 bg-brand-gradient text-primary-foreground shadow-glow">
            <Link to="/request-access">Request Access</Link>
          </Button>
          <p className="font-serif italic text-amber-200/70 mt-6 text-sm">
            « Il sapere è il pane dell&rsquo;anima. » <span className="not-italic text-white/40">- proverbio italiano</span>
          </p>
        </section>
      </main>
      <footer className="border-t border-border/40 mt-6 py-10 text-center text-sm text-white/60">
        <div className="inline-flex flex-col items-center gap-3">
          <div className="inline-flex items-center gap-3 rounded-full border border-amber-400/30 bg-gradient-to-r from-amber-950/30 via-orange-950/20 to-amber-950/30 px-5 py-2">
            <span className="font-serif italic text-amber-300/90">Forgiato a mano da</span>
            <span className="font-display font-bold tracking-wider text-amber-200">Ultimate_Developers</span>
            <span className="text-amber-400/60">·</span>
            <span className="text-xs uppercase tracking-[0.25em] text-amber-300/70">Bottega Digitale</span>
          </div>
          <p>© Industrial Automation. Automate · Control · Optimize · Innovate.</p>
        </div>
      </footer>
    </div>
  );
}
