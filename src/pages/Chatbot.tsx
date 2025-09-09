import { useState, useEffect, useRef, ReactNode, FormEvent } from "react";
import { BotMessage } from "../components/chatbot/BotMessage";
import { UserMessage } from "../components/chatbot/UserMessage";
import { ChatInput } from "../components/chatbot/ChatInput";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Check, CheckCircle, CircleDashed, Edit, FileUp, Loader2, Mail, Phone, ScanLine, Upload, XCircle, Fingerprint, PenSquare } from "lucide-react";
import { Separator } from "@/components/ui/separator";

type Step =
  | "GREETING" | "ID_SCANNING" | "CUSTOMER_FOUND" | "CUSTOMER_NOT_FOUND"
  | "SELECT_MAINTENANCE_OPTIONS" | "UPDATE_ADDRESS" | "ADDRESS_UPLOADING"
  | "ADDRESS_CONFIRM" | "UPDATE_CONTACT" | "OTP_MOBILE" | "OTP_EMAIL"
  | "REVIEW" | "PROCESSING" | "SUCCESS";

type MaintenanceSelection = "nic" | "signature" | "address" | "contact";

const initialUserData = {
  name: "John Doe",
  cif: "123456",
  mobile: "+91 98765 43210",
  email: "john.doe@email.com",
  address: "12 Green Street, Mumbai",
};

const Chatbot = () => {
  const [messages, setMessages] = useState<ReactNode[]>([]);
  const [step, setStep] = useState<Step>("GREETING");
  const [userData] = useState(initialUserData);
  const [updatedData, setUpdatedData] = useState(initialUserData);
  const [selections, setSelections] = useState({ nic: false, signature: false, address: false, contact: false });
  const [updateQueue, setUpdateQueue] = useState<MaintenanceSelection[]>([]);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const addMessage = (message: ReactNode) => {
    setMessages((prev) => [...prev, message]);
  };

  const processNextUpdate = () => {
    if (updateQueue.length > 0) {
      const nextUpdate = updateQueue[0];
      setUpdateQueue(prev => prev.slice(1));
      switch (nextUpdate) {
        case "address": setStep("UPDATE_ADDRESS"); break;
        case "contact": setStep("UPDATE_CONTACT"); break;
        default:
          addMessage(<BotMessage key={`${nextUpdate}-placeholder`}>This update option is not yet implemented. Moving to the next.</BotMessage>);
          processNextUpdate();
          break;
      }
    } else {
      setStep("REVIEW");
    }
  };

  useEffect(() => {
    const processStep = () => {
      switch (step) {
        case "GREETING":
          addMessage(
            <BotMessage key="greeting">
              <p className="font-bold">Hello 👋 Welcome back!</p>
              <p>Let’s get started with your account maintenance. Please present your ID card.</p>
              <div className="flex gap-2 mt-3">
                <Button onClick={() => handleIdScan('scan')}><ScanLine className="mr-2 h-4 w-4" /> Scan ID Card</Button>
                <Button onClick={() => handleIdScan('upload')} variant="secondary"><Upload className="mr-2 h-4 w-4" /> Upload ID</Button>
              </div>
            </BotMessage>
          );
          break;
        case "ID_SCANNING":
          addMessage(<BotMessage key="scanning"><div className="flex items-center gap-2"><Loader2 className="h-5 w-5 animate-spin" /> <p>Scanning ID... Align your card inside the frame.</p></div><div className="mt-2 border-2 border-dashed border-primary rounded-lg p-4 text-center animate-pulse"><p className="text-sm text-gray-500">NIC: 9876543210</p></div></BotMessage>);
          setTimeout(() => setStep(Math.random() > 0.2 ? 'CUSTOMER_FOUND' : 'CUSTOMER_NOT_FOUND'), 2500);
          break;
        case "CUSTOMER_FOUND":
          addMessage(
            <BotMessage key="customer-found">
              <p className="font-bold text-green-600">Profile found ✅</p><p>You already have an account with us. What would you like to do today?</p>
              <Card className="mt-3"><CardContent className="p-4 text-sm space-y-2"><p><strong>Name:</strong> {userData.name}</p><p><strong>CIF:</strong> {userData.cif}</p></CardContent></Card>
              <div className="flex gap-2 mt-3"><Button onClick={handleMaintainAccount}><Edit className="mr-2 h-4 w-4" /> Maintain existing account</Button><Button variant="secondary">Open another account</Button></div>
            </BotMessage>
          );
          break;
        case "CUSTOMER_NOT_FOUND":
          addMessage(<BotMessage key="customer-not-found"><div className="flex items-center gap-2 font-bold text-red-600"><XCircle /> <p>Customer Not Found</p></div><p>We couldn’t find a customer record linked to this NIC.</p><div className="flex flex-wrap gap-2 mt-3"><Button variant="secondary">Open new account</Button><Button onClick={() => { setMessages([]); setStep('GREETING'); }}>Try again</Button><Button variant="outline">Contact Support</Button></div></BotMessage>);
          break;
        case "SELECT_MAINTENANCE_OPTIONS":
          addMessage(
            <BotMessage key="select-maintenance">
              <p>Which information would you like to modify?</p>
              <div className="space-y-3 mt-3">
                <div className="flex items-center space-x-2"><Checkbox id="nic" checked={selections.nic} onCheckedChange={(checked) => setSelections(s => ({ ...s, nic: !!checked }))} /><Label htmlFor="nic" className="flex items-center gap-2"><Fingerprint className="h-4 w-4" /> NIC</Label></div>
                <div className="flex items-center space-x-2"><Checkbox id="signature" checked={selections.signature} onCheckedChange={(checked) => setSelections(s => ({ ...s, signature: !!checked }))} /><Label htmlFor="signature" className="flex items-center gap-2"><PenSquare className="h-4 w-4" /> Signature</Label></div>
                <div className="flex items-center space-x-2"><Checkbox id="address" checked={selections.address} onCheckedChange={(checked) => setSelections(s => ({ ...s, address: !!checked }))} /><Label htmlFor="address" className="flex items-center gap-2"><Phone className="h-4 w-4" /> Physical Address</Label></div>
                <div className="flex items-center space-x-2"><Checkbox id="contact" checked={selections.contact} onCheckedChange={(checked) => setSelections(s => ({ ...s, contact: !!checked }))} /><Label htmlFor="contact" className="flex items-center gap-2"><Mail className="h-4 w-4" /> Email & Mobile</Label></div>
              </div>
              <div className="mt-4"><Button onClick={handleStartMaintenance} disabled={!Object.values(selections).some(v => v)}>Continue ➜</Button></div>
            </BotMessage>
          );
          break;
        case "UPDATE_ADDRESS":
          addMessage(<BotMessage key="update-address"><p>To update your address, please upload a recent utility bill.</p><div className="mt-3 border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:border-primary" onClick={handleUploadBill}><FileUp className="mx-auto h-10 w-10 text-gray-400" /><p className="mt-2 text-sm">Click to upload</p></div></BotMessage>);
          break;
        case "ADDRESS_UPLOADING":
          addMessage(<BotMessage key="address-uploading"><div className="flex items-center gap-2"><Loader2 className="h-5 w-5 animate-spin" /><p>Scanning document...</p></div></BotMessage>);
          setTimeout(() => setStep('ADDRESS_CONFIRM'), 2000);
          break;
        case "ADDRESS_CONFIRM":
          addMessage(<BotMessage key="address-confirm"><p>We've extracted the following address. Please review and confirm.</p><div className="mt-3"><Input id="address-input" defaultValue="45 Blue Residency, Andheri East, Mumbai" /></div><div className="flex gap-2 mt-3"><Button onClick={handleConfirmAddress}><Check className="mr-2 h-4 w-4" /> Confirm Address</Button></div></BotMessage>);
          break;
        case "UPDATE_CONTACT":
          addMessage(
            <BotMessage key="update-contact">
              <p>Please enter your new mobile number and email address.</p>
              <form onSubmit={handleSaveContact} className="space-y-3 mt-3">
                <div><label className="text-sm">New Mobile Number</label><Input name="mobile" defaultValue={updatedData.mobile} /></div>
                <div><label className="text-sm">New Email Address</label><Input name="email" type="email" defaultValue={updatedData.email} /></div>
                <Button type="submit">Save Changes</Button>
              </form>
            </BotMessage>
          );
          break;
        case "OTP_MOBILE":
          addMessage(<BotMessage key="otp-mobile"><p>We've sent an OTP to <strong>{updatedData.mobile}</strong>. Please enter it below.</p><form onSubmit={handleVerifyOtp} className="flex gap-2 mt-3"><Input placeholder="6-digit OTP" maxLength={6} /><Button type="submit">Verify</Button></form></BotMessage>);
          break;
        case "OTP_EMAIL":
          addMessage(<BotMessage key="otp-email"><p>Great! Now, an OTP has been sent to <strong>{updatedData.email}</strong>.</p><form onSubmit={handleVerifyOtp} className="flex gap-2 mt-3"><Input placeholder="6-digit OTP" maxLength={6} /><Button type="submit">Verify</Button></form></BotMessage>);
          break;
        case "REVIEW":
          addMessage(
            <BotMessage key="review">
              <p>Here’s a summary of your changes. Please confirm to proceed.</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                <Card><CardHeader><CardTitle className="text-base">Before</CardTitle></CardHeader><CardContent className="text-sm space-y-2"><p><strong>Address:</strong> {userData.address}</p><p><strong>Mobile:</strong> {userData.mobile}</p><p><strong>Email:</strong> {userData.email}</p></CardContent></Card>
                <Card className="border-primary"><CardHeader><CardTitle className="text-base">After</CardTitle></CardHeader><CardContent className="text-sm space-y-2"><p><strong>Address:</strong> {updatedData.address}</p><p><strong>Mobile:</strong> {updatedData.mobile}</p><p><strong>Email:</strong> {updatedData.email}</p></CardContent></Card>
              </div>
              <div className="flex gap-2 mt-3"><Button onClick={handleConfirmChanges}><Check className="mr-2 h-4 w-4" /> Confirm</Button><Button variant="outline" onClick={() => setStep('SELECT_MAINTENANCE_OPTIONS')}>Go Back</Button></div>
            </BotMessage>
          );
          break;
        case "PROCESSING":
          addMessage(<ProcessingMessage onComplete={() => setStep('SUCCESS')} />);
          break;
        case "SUCCESS":
          addMessage(<BotMessage key="success"><p className="font-bold text-lg">All set! 🎉</p><p>Your account details have been updated successfully.</p><div className="flex gap-2 mt-3"><Button onClick={() => window.location.reload()}>Finish</Button><Button variant="secondary">View electronic form</Button></div></BotMessage>);
          break;
      }
    };
    processStep();
  }, [step]);

  const handleIdScan = (method: 'scan' | 'upload') => { addMessage(<UserMessage key="id-scan-action">{method === 'scan' ? 'Scanning ID Card...' : 'Uploading ID Card...'}</UserMessage>); setStep('ID_SCANNING'); };
  const handleMaintainAccount = () => { addMessage(<UserMessage key="maintain-action">Maintain existing account</UserMessage>); setStep('SELECT_MAINTENANCE_OPTIONS'); };
  const handleStartMaintenance = () => {
    const queue = (Object.keys(selections) as MaintenanceSelection[]).filter(key => selections[key]);
    setUpdateQueue(queue);
    addMessage(<UserMessage key="selections-made">Okay, let's update the selected information.</UserMessage>);
    processNextUpdate();
  };
  const handleUploadBill = () => { addMessage(<UserMessage key="upload-bill-action">Uploading UtilityBill_Aug2025.pdf</UserMessage>); setStep('ADDRESS_UPLOADING'); };
  const handleConfirmAddress = () => {
    const newAddress = (document.getElementById('address-input') as HTMLInputElement).value;
    setUpdatedData(prev => ({ ...prev, address: newAddress }));
    addMessage(<UserMessage key="confirm-address-action">Address confirmed</UserMessage>);
    processNextUpdate();
  };
  const handleSaveContact = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    setUpdatedData(prev => ({ ...prev, mobile: formData.get('mobile') as string, email: formData.get('email') as string }));
    addMessage(<UserMessage key="save-contact-action">Contact details updated</UserMessage>);
    setStep('OTP_MOBILE');
  };
  const handleVerifyOtp = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    addMessage(<UserMessage key={`otp-verified-${step}`}>OTP Verified</UserMessage>);
    if (step === 'OTP_MOBILE') {
      setStep('OTP_EMAIL');
    } else {
      processNextUpdate();
    }
  };
  const handleConfirmChanges = () => { addMessage(<UserMessage key="confirm-changes-action">Confirm Changes</UserMessage>); setStep('PROCESSING'); };

  return (
    <div className="flex flex-col h-screen bg-blue-50 dark:bg-slate-900">
      <main className="flex-1 overflow-y-auto p-4 space-y-6">{messages}</main>
      <div ref={bottomRef} />
      <ChatInput />
    </div>
  );
};

const ProcessingMessage = ({ onComplete }: { onComplete: () => void }) => {
  const items = ["Update Finacle with new data", "Keep an audit trail", "Send electronic notification", "Notify OPC", "Store form in DMS", "Update other systems"];
  const [checked, setChecked] = useState<boolean[]>(new Array(items.length).fill(false));
  useEffect(() => {
    items.forEach((_, i) => setTimeout(() => setChecked(p => { const n = [...p]; n[i] = true; return n; }), (i + 1) * 700));
    setTimeout(onComplete, (items.length + 1) * 700);
  }, []);
  return (<BotMessage key="processing"><div className="flex items-center gap-2 mb-3"><Loader2 className="h-5 w-5 animate-spin" /><p>Processing your request...</p></div><ul className="space-y-2 text-sm">{items.map((item, i) => <li key={i} className="flex items-center gap-2">{checked[i] ? <CheckCircle className="h-4 w-4 text-green-500" /> : <CircleDashed className="h-4 w-4 text-gray-400 animate-spin" />}<span>{item}</span></li>)}</ul></BotMessage>);
};

export default Chatbot;