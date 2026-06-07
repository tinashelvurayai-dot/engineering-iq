import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { accessApi } from "@/lib/access-api";
import { ArrowLeft, UserPlus, CheckCircle2, Mail, UserCheck, Users } from "lucide-react";
import logo from "@/assets/logo.png";

export const Route = createFileRoute("/request-access")({ component: RequestAccessPage });

const emailOk = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e.trim());

function RequestAccessPage() {
  const nav = useNavigate();
  const [isPair, setIsPair] = useState(false);
  const [full_name, setName] = useState("");
  const [whatsapp, setWa] = useState("");
  const [email, setEmail] = useState("");
  const [name2, setName2] = useState("");
  const [wa2, setWa2] = useState("");
  const [email2, setEmail2] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [agentName] = useState<string>("Contact admin for agent details");

  useEffect(() => { void agentName; }, [agentName]);

  const send = async () => {
    if (!full_name.trim() || !whatsapp.trim() || !email.trim()) {
      return toast.error("Full name, WhatsApp number and email are all required");
    }
    if (!emailOk(email)) return toast.error("Enter a valid email address");
    if (isPair) {
      if (!name2.trim() || !wa2.trim() || !email2.trim()) {
        return toast.error("Fill in details for both users in the pair");
      }
      if (!emailOk(email2)) return toast.error("Enter a valid email for the second user");
      if (email.trim().toLowerCase() === email2.trim().toLowerCase()) {
        return toast.error("The two pair emails must be different");
      }
    }
    setBusy(true);
    try {
      await accessApi.submit({
        full_name,
        whatsapp,
        email,
        is_pair: isPair,
        ...(isPair ? { second_full_name: name2, second_whatsapp: wa2, second_email: email2 } : {}),
      });
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
              Now pay an authorised agent in cash ($5 solo / $8 pair, monthly). The agent will call admin
              with your name. Once admin confirms payment, the <strong>access code(s) will be emailed
              to the address(es) you entered</strong>. Come back here and sign in with your full name + code.
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

            <div className="mt-4 flex items-center justify-between rounded-md border border-border bg-muted/30 p-3">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-secondary" />
                <div>
                  <p className="text-sm font-semibold">Pair signup</p>
                  <p className="text-xs text-muted-foreground">Two new users registering together (cheaper monthly).</p>
                </div>
              </div>
              <Switch checked={isPair} onCheckedChange={setIsPair} />
            </div>

            <div className="space-y-3 mt-6">
              <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">User 1</p>
              <div>
                <Label>Full name *</Label>
                <Input value={full_name} onChange={(e) => setName(e.target.value)} maxLength={120} />
              </div>
              <div>
                <Label>WhatsApp number *</Label>
                <Input value={whatsapp} onChange={(e) => setWa(e.target.value)} placeholder="+263 7X XXX XXXX" maxLength={40} />
              </div>
              <div>
                <Label className="flex items-center gap-1"><Mail className="h-3 w-3" /> Email *</Label>
                <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} maxLength={255} placeholder="you@example.com" />
              </div>

              {isPair && (
                <>
                  <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold pt-3 border-t border-border">User 2</p>
                  <div>
                    <Label>Full name *</Label>
                    <Input value={name2} onChange={(e) => setName2(e.target.value)} maxLength={120} />
                  </div>
                  <div>
                    <Label>WhatsApp number *</Label>
                    <Input value={wa2} onChange={(e) => setWa2(e.target.value)} placeholder="+263 7X XXX XXXX" maxLength={40} />
                  </div>
                  <div>
                    <Label className="flex items-center gap-1"><Mail className="h-3 w-3" /> Email *</Label>
                    <Input type="email" value={email2} onChange={(e) => setEmail2(e.target.value)} maxLength={255} placeholder="partner@example.com" />
                  </div>
                </>
              )}

              <p className="text-xs text-muted-foreground">
                Access code{isPair ? "s are" : " is"} sent to the email address{isPair ? "es" : ""} above after admin approves payment.
              </p>

              <Button onClick={send} disabled={busy} className="w-full bg-brand-gradient">
                <UserPlus className="h-4 w-4 mr-2" /> {busy ? "Submitting…" : isPair ? "Submit pair request" : "Submit request"}
              </Button>
              <p className="text-xs text-muted-foreground text-center">
                Already have a code?{" "}
                <Link to="/sign-in" className="underline">Sign in</Link>
              </p>
            </div>
          </>
        )}
      </Card>
    </div>
  );
}
