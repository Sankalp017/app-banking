import { useState, useEffect, useRef, ReactNode, FormEvent } from "react";
import { BotMessage } from "../components/chatbot/BotMessage";
import { UserMessage } from "../components/chatbot/UserMessage";
import { ChatInput } from "../components/chatbot/ChatInput";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Check, CheckCircle, CircleDashed, Edit, FileUp, Loader2, Mail, Phone, ScanLine, Upload, XCircle, Fingerprint, PenSquare } from "lucide-react";
import { Separator } from "@/components/ui/separator";

type Step =
  | "GREETING" | "ID_SCANNING" | "CUSTOMER_FOUND" | "CUSTOMER_NOT_FOUND"
  | "SHOW_PROFILE_FOR_EDIT" | "UPDATE_ADDRESS" | "ADDRESS_UPLOADING"
  | "ADDRESS_CONFIRM" | "UPDATE_CONTACT" | "OTP_MOBILE" | "OTP_EMAIL"
  | "REVIEW" | "PROCESSING" | "SUCCESS";

const initialUserData = {
  name: "John Doe",
  cif: "123456",
  mobile: "+91 98765 43210",
  email: "john.doe@email.com",
  address: "12 Green Street, Mumbai",
  nic: "9876543210V",
  signature: "John Doe",
};

const Chatbot = () => {
  const [messages, setMessages] = useState<ReactNode[]>([]);
  const [step, setStep] = useState<Step>("GREETING");
  const [userData] = useState(initialUserData);
  const [updatedData, setUpdatedData] = useState(initialUserData);
  const [completedUpdates, setCompletedUpdates] = useState<Set<string>>(new Set());
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const addMessage = (message: ReactNode) => {
    setMessages((prev) => [...prev, message]);
  };

  useEffect(() => {
    const processStep = () => {
      switch (step) {
        case "GREETING":
          addMessage(
            <BotMessage key="greeting">
              <p className="font-bold">Hello, I'm Ava. How can I help you today?</p>
              <p>To get started with account maintenance, please present your ID card.</p>
              <div className="flex gap-2 mt-3">
                <Button onClick={() => handleIdScan('scan')}><ScanLine className="mr-2 h-4 w-4" /> Scan ID Card</Button>
                <Button onClick={() => handleIdScan('upload')} variant="secondary"><Upload className="mr-2 h-4 w-4" /> Upload ID</Button>
              </div>
            </BotMessage>
          );
          break;
        case "ID_SCANNING":
          addMessage(<BotMessage key="scanning"><div className="flex items-center gap-2"><Loader2 className="h-5 w-5 animate-spin" /> <p>Scanning ID... Align your card inside the frame.</p></div><div className="mt-2 border-2 border-dashed border-primary rounded-lg p-4 text-center animate-pulse"><p className="text-sm text-gray-500">NIC: 9876543210V</p></div></BotMessage>);
          setTimeout(() => setStep(Math.random() > 0.2 ? 'CUSTOMER_FOUND' : 'CUSTOMER_NOT_FOUND'), 2500);
          break;
        case "CUSTOMER_FOUND":
          addMessage(
            <BotMessage key="customer-found">
              <p className="font-bold text-green-600">Profile found ✅</p><p>Welcome back, {userData.name}. What would you like to do today?</p>
              <Card className="mt-3"><CardContent className="p-4 text-sm space-y-2"><p><strong>Name:</strong> {userData.name}</p><p><strong>CIF:</strong> {userData.cif}</p></CardContent></Card>
              <div className="flex gap-2 mt-3"><Button onClick={handleMaintainAccount}><Edit className="mr-2 h-4 w-4" /> Maintain existing account</Button><Button variant="secondary">Open another account</Button></div>
            </BotMessage>
          );
          break;
        case "CUSTOMER_NOT_FOUND":
          addMessage(<BotMessage key="customer-not-found"><div className="flex items-center gap-2 font-bold text-red-600"><XCircle /> <p>Customer Not Found</p></div><p>We couldn’t find a customer record linked to this NIC.</p><div className="flex flex-wrap gap-2 mt-3"><Button variant="secondary">Open new account</Button><Button onClick={() => { setMessages([]); setStep('GREETING'); }}>Try again</Button><Button variant="outline">Contact Support</Button></div></BotMessage>);
          break;
        case "SHOW_PROFILE_FOR_EDIT":
          addMessage(
            <BotMessage key={`profile-edit-${Date.now()}`}>
              <p>Here is your current information. Click edit on any section you'd like to update.</p>
              <Card className="mt-3">
                <CardContent className="p-4 space-y-4">
                  <EditableField label="NIC" value={updatedData.nic} icon={<Fingerprint className="h-4 w-4 text-gray-500" />} onEdit={() => addMessage(<BotMessage>NIC updates are not yet supported.</BotMessage>)} completed={completedUpdates.has('nic')} />
                  <Separator />
                  <EditableField label="Signature" value={updatedData.signature} icon={<PenSquare className="h-4 w-4 text-gray-500" />} onEdit={() => addMessage(<BotMessage>Signature updates are not yet supported.</BotMessage>)} completed={completedUpdates.has('signature')} />
                  <Separator />
                  <EditableField label="Physical Address" value={updatedData.address} icon={<Phone className="h-4 w-4 text-gray-500" />} onEdit={() => setStep('UPDATE_ADDRESS')} completed={completedUpdates.has('address')} />
                  <Separator />
                  <EditableField label="Email & Mobile" value={`${updatedData.email} / ${updatedData.mobile}`} icon={<Mail className="h-4 w-4 text-gray-500" />} onEdit={() => setStep('UPDATE_CONTACT')} completed={completedUpdates.has('contact')} />
                </CardContent>
              </Card>
              <div className="flex gap-2 mt-3"><Button onClick={() => setStep('REVIEW')} disabled={JSON.stringify(userData) === JSON.stringify(updatedData)}>Review Changes</Button></div>
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
                <Card><CardContent className="p-4 text-sm space-y-2">
                  <p className="font-bold">Before</p>
                  <p><strong>Address:</strong> {userData.address}</p>
                  <p><strong>Mobile:</strong> {userData.mobile}</p>
                  <p><strong>Email:</strong> {userData.email}</p>
                </CardContent></Card>
                <Card className="border-primary"><CardContent className="p-4 text-sm space-y-2">
                  <p className="font-bold">After</p>
                  <p><strong>Address:</strong> {updatedData.address}</p>
                  <p><strong>Mobile:</strong> {updatedData.mobile}</p>
                  <p><strong>Email:</strong> {updatedData.email}</p>
                </CardContent></Card>
              </div>
              <div className="flex gap-2 mt-3"><Button onClick={handleConfirmChanges}><Check className="mr-2 h-4 w-4" /> Confirm</Button><Button variant="outline" onClick={() => setStep('SHOW_PROFILE_FOR_EDIT')}>Go Back</Button></div>
            </BotMessage>
          );
          break;
        case "PROCESSING":
          addMessage(<ProcessingMessage onComplete={() => setStep('SUCCESS')} />);
          break;
        case "SUCCESS":
          addMessage(<BotMessage key="success"><p className="font-bold text-lg">All set! 🎉</p><p>Your account details have been updated successfully.</p><div className="flex gap-2 mt-3"><Button onClick={() => window.location.reload()}>Start New</Button><Button variant="secondary">View electronic form</Button></div></BotMessage>);
          break;
      }
    };
    processStep();
  }, [step]);

  const handleIdScan = (method: 'scan' | 'upload') => { addMessage(<UserMessage key="id-scan-action">{method === 'scan' ? 'Scanning ID Card...' : 'Uploading ID Card...'}</UserMessage>); setStep('ID_SCANNING'); };
  const handleMaintainAccount = () => { addMessage(<UserMessage key="maintain-action">Maintain existing account</UserMessage>); setStep('SHOW_PROFILE_FOR_EDIT'); };
  const handleUploadBill = () => { addMessage(<UserMessage key="upload-bill-action">Uploading UtilityBill_Aug2025.pdf</UserMessage>); setStep('ADDRESS_UPLOADING'); };
  
  const handleConfirmAddress = () => {
    const newAddress = (document.getElementById('address-input') as HTMLInputElement).value;
    setUpdatedData(prev => ({ ...prev, address: newAddress }));
    setCompletedUpdates(prev => new Set(prev).add('address'));
    addMessage(<UserMessage key="confirm-address-action">Address confirmed</UserMessage>);
    setStep('SHOW_PROFILE_FOR_EDIT');
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
      setCompletedUpdates(prev => new Set(prev).add('contact'));
      setStep('SHOW_PROFILE_FOR_EDIT');
    }
  };

  const handleConfirmChanges = () => { addMessage(<UserMessage key="confirm-changes-action">Confirm Changes</UserMessage>); setStep('PROCESSING'); };

  return (
    <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-950">
      <header className="p-4 border-b dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm sticky top-0 z-10">
        <h1 className="text-xl font-bold text-left text-gray-800 dark:text-gray-100">Ava | Digital Banking Assistant</h1>
      </header>
      <main className="flex-1 overflow-y-auto p-4 space-y-6">{messages}</main>
      <div ref={bottomRef} />
      <ChatInput />
    </div>
  );
};

const EditableField = ({ label, value, icon, onEdit, completed }: { label: string, value: string, icon: ReactNode, onEdit: () => void, completed?: boolean }) => (
  <div className="flex justify-between items-center">
    <div className="flex items-center gap-3">
      {icon}
      <div>
        <p className="text-sm font-medium">{label}</p>
        <p className="text-sm text-gray-600 dark:text-gray-400">{value}</p>
      </div>
    </div>
    {completed ? (
      <div className="flex items-center gap-1 text-green-600">
        <CheckCircle className="h-4 w-4" />
        <span className="text-sm font-medium">Done</span>
      </div>
    ) : (
      <Button size="sm" variant="ghost" onClick={onEdit}><Edit className="h-4 w-4" /></Button>
    )}
  </div>
);

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