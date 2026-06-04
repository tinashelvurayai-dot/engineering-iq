import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { accessApi } from "@/lib/access-api";
import { ArrowLeft, UserPlus, CheckCircle2, Mail, UserCheck } from "lucide-react";
import logo from "@/assets/logo.png";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/request-access")({ component: RequestAccessPage });

function RequestAccessPage() {
  const nav = useNavigate();
  const [full_name, setName] = useState("");
  const [whatsapp, setWa] = useState("");
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [agentName, setAgentName] = useState<string>("Contact admin for agent details");

  // Agent contact is shared privately after approval — not exposed publicly here.
  useEffect(() => { void agentName; }, [agentName]);

  const send = async () => {
    if (!full_name.trim() || !whatsapp.trim() || !email.trim()) {
      return toast.error("Full name, WhatsApp number and email are all required");
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      return toast.error("Enter a valid email address");
    }
    setBusy(true);
    try {
      await accessApi.submit({ full_name, whatsapp, email });
      setDone(true);
      toast.success("Request submitted");
    } catch (e: any) {
      toast.error(e?.message || "Could not submit request");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen bg-hero flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 bg-card text-card-foreground shadow-card-elev">
        <Link to="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4">
          <ArrowLeft className="h-4 w-4 mr-1" /> Back
        </Link>
        <Link to="/" className="flex justify-center mb-6">
          <img src={logo} alt="Industrial Automation" className="h-16" />
        </Link>

        {done ? (
          <div className="text-center space-y-4">
            <CheckCircle2 className="h-12 w-12 text-secondary mx-auto" />
            <h2 className="text-2xl font-bold">Request received</h2>
            <p className="text-sm text-muted-foreground">
              Now pay an authorised agent in cash ($5 solo / $8 pair). The agent will call admin
              with your name. Once admin confirms payment, your <strong>access code will be emailed
              to {email || "your email"}</strong>. Come back here and sign in with your full name + code.
            </p>
            <Button onClick={() => nav({ to: "/sign-in" })} className="bg-brand-gradient w-full">
              Go to sign in
            </Button>
          </div>
        ) : (
          <>
            <h1 className="text-2xl font-bold text-center">Request Access</h1>
            <p className="text-sm text-muted-foreground text-center mt-1">
              Fill in your details. After payment is confirmed, your access code is emailed to you.
            </p>
            <div className="mt-4 rounded-md border border-secondary/40 bg-secondary/5 p-3 flex items-start gap-2 text-sm">
              <UserCheck className="h-4 w-4 text-secondary mt-0.5" />
              <span>Authorised agent: <strong>{agentName}</strong></span>
            </div>
            <div className="space-y-3 mt-6">
              <div>
                <Label>Full name *</Label>
                <Input value={full_name} onChange={(e) => setName(e.target.value)} maxLength={120} />
              </div>
              <div>
                <Label>WhatsApp number *</Label>
                <Input
                  value={whatsapp}
                  onChange={(e) => setWa(e.target.value)}
                  placeholder="+263 7X XXX XXXX"
                  maxLength={40}
                />
              </div>
              <div>
                <Label className="flex items-center gap-1">
                  <Mail className="h-3 w-3" /> Email *
                </Label>
                <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} maxLength={255} placeholder="you@example.com" />
                <p className="text-xs text-muted-foreground mt-1">Your access code will be sent to your email after admin approves your payment.</p>
              </div>
              <Button onClick={send} disabled={busy} className="w-full bg-brand-gradient">
                <UserPlus className="h-4 w-4 mr-2" /> {busy ? "Submitting…" : "Submit request"}
              </Button>
              <p className="text-xs text-muted-foreground text-center">
                Already have a code?{" "}
                <Link to="/sign-in" className="underline">
                  Sign in
                </Link>
              </p>
            </div>
          </>
        )}
      </Card>
    </div>
  );
}
