import { useState, useEffect, useRef, ReactNode, FormEvent } from "react";
import { BotMessage } from "../components/chatbot/BotMessage";
import { UserMessage } from "../components/chatbot/UserMessage";
import { ChatInput } from "../components/chatbot/ChatInput";
import { ActionableMessage } from "../components/chatbot/ActionableMessage";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Bot, Check, CheckCircle, CircleDashed, Edit, FileUp, Loader2, Mail, MoreVertical, Phone, ScanLine, Search, Upload, XCircle, Fingerprint, PenSquare, MapPin, ArrowRight } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { UserUploadMessage } from "../components/chatbot/UserUploadMessage";

type Step =
  | "GREETING" | "ID_SCANNING" | "CUSTOMER_FOUND" | "CUSTOMER_NOT_FOUND"
  | "SHOW_PROFILE_FOR_EDIT" | "UPDATE_ADDRESS" | "ADDRESS_UPLOADING"
  | "ADDRESS_CONFIRM" | "UPDATE_MOBILE" | "UPDATE_EMAIL" | "OTP_MOBILE" | "OTP_EMAIL"
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
            <ActionableMessage
              key="greeting"
              ctas={[
                { label: <><ScanLine className="mr-2 h-4 w-4" /> Scan ID Card</>, onClick: () => handleIdScan('scan') },
                { label: <><Upload className="mr-2 h-4 w-4" /> Upload ID</>, onClick: () => handleIdScan('upload'), variant: 'secondary' }
              ]}
            >
              <p className="font-bold">Hello, I'm Ava. How can I help you today?</p>
              <p>To get started with account maintenance, please present your ID card.</p>
            </ActionableMessage>
          );
          break;
        case "ID_SCANNING":
          addMessage(<BotMessage key="scanning"><div className="flex items-center gap-2"><Loader2 className="h-5 w-5 animate-spin" /> <p>Analysing ID card...</p></div><div className="mt-2 border-2 border-dashed border-primary rounded-lg p-4 text-center animate-pulse"><p className="text-sm text-gray-500">NIC: 9876543210V</p></div></BotMessage>);
          setTimeout(() => setStep(Math.random() > 0.2 ? 'CUSTOMER_FOUND' : 'CUSTOMER_NOT_FOUND'), 2500);
          break;
        case "CUSTOMER_FOUND":
          addMessage(
            <ActionableMessage
              key="customer-found"
              ctas={[
                { label: <><Edit className="mr-2 h-4 w-4" /> Maintain existing account</>, onClick: handleMaintainAccount },
                { label: 'Open another account', onClick: () => {}, variant: 'secondary', disabled: true }
              ]}
            >
              <p className="font-bold text-green-600">Profile found ✅</p><p>Welcome back, {userData.name}. What would you like to do today?</p>
              <Card className="mt-3"><CardContent className="p-4 text-sm space-y-2"><p><strong>Name:</strong> {userData.name}</p><p><strong>CIF:</strong> {userData.cif}</p></CardContent></Card>
            </ActionableMessage>
          );
          break;
        case "CUSTOMER_NOT_FOUND":
          addMessage(
            <ActionableMessage
              key="customer-not-found"
              ctas={[
                { label: 'Open new account', onClick: () => {}, variant: 'secondary' },
                { label: 'Try again', onClick: () => { setMessages([]); setStep('GREETING'); } },
                { label: 'Contact Support', onClick: () => {}, variant: 'outline' }
              ]}
            >
              <div className="flex items-center gap-2 font-bold text-red-600"><XCircle /> <p>Customer Not Found</p></div><p>We couldn’t find a customer record linked to this NIC.</p>
            </ActionableMessage>
          );
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
                  <EditableField label="Physical Address" value={updatedData.address} icon={<MapPin className="h-4 w-4 text-gray-500" />} onEdit={() => setStep('UPDATE_ADDRESS')} completed={completedUpdates.has('address')} />
                  <Separator />
                  <EditableField label="Mobile Number" value={updatedData.mobile} icon={<Phone className="h-4 w-4 text-gray-500" />} onEdit={() => setStep('UPDATE_MOBILE')} completed={completedUpdates.has('mobile')} />
                  <Separator />
                  <EditableField label="Email Address" value={updatedData.email} icon={<Mail className="h-4 w-4 text-gray-500" />} onEdit={() => setStep('UPDATE_EMAIL')} completed={completedUpdates.has('email')} />
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
           addMessage(
            <ActionableMessage
              key="address-confirm"
              ctas={[{ label: <><Check className="mr-2 h-4 w-4" /> Confirm Address</>, onClick: handleConfirmAddress }]}
            >
              <p>We've extracted the following address. Please review and confirm.</p>
              <div className="mt-3"><Input id="address-input" defaultValue="45 Blue Residency, Andheri East, Mumbai" /></div>
            </ActionableMessage>
          );
          break;
        case "UPDATE_MOBILE":
          addMessage(
            <BotMessage key="update-mobile">
              <p>Please enter your new mobile number.</p>
              <form onSubmit={handleSaveMobile} className="space-y-3 mt-3">
                <div><label className="text-sm">New Mobile Number</label><Input name="mobile" defaultValue={updatedData.mobile} /></div>
                <Button type="submit">Save Changes</Button>
              </form>
            </BotMessage>
          );
          break;
        case "UPDATE_EMAIL":
          addMessage(
            <BotMessage key="update-email">
              <p>Please enter your new email address.</p>
              <form onSubmit={handleSaveEmail} className="space-y-3 mt-3">
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
          addMessage(<BotMessage key="otp-email"><p>An OTP has been sent to <strong>{updatedData.email}</strong>.</p><form onSubmit={handleVerifyOtp} className="flex gap-2 mt-3"><Input placeholder="6-digit OTP" maxLength={6} /><Button type="submit">Verify</Button></form></BotMessage>);
          break;
        case "REVIEW":
          const changes = [];
          if (updatedData.address !== userData.address) {
            changes.push(<ChangeItem key="address" label="Address" from={userData.address} to={updatedData.address} />);
          }
          if (updatedData.mobile !== userData.mobile) {
            changes.push(<ChangeItem key="mobile" label="Mobile Number" from={userData.mobile} to={updatedData.mobile} />);
          }
          if (updatedData.email !== userData.email) {
            changes.push(<ChangeItem key="email" label="Email Address" from={userData.email} to={updatedData.email} />);
          }
          addMessage(
            <ActionableMessage
              key="review"
              ctas={[
                { label: <><Check className="mr-2 h-4 w-4" /> Confirm</>, onClick: handleConfirmChanges },
                { label: 'Go Back', onClick: () => setStep('SHOW_PROFILE_FOR_EDIT'), variant: 'outline' }
              ]}
            >
              <p>Here’s a summary of your changes. Please confirm to proceed.</p>
              <Card className="mt-3"><CardContent className="p-4 space-y-4">{changes}</CardContent></Card>
            </ActionableMessage>
          );
          break;
        case "PROCESSING":
          addMessage(<ProcessingMessage onComplete={() => setStep('SUCCESS')} />);
          break;
        case "SUCCESS":
          addMessage(
            <ActionableMessage
              key="success"
              ctas={[
                { label: 'Start New', onClick: () => window.location.reload() },
                { label: 'View electronic form', onClick: () => {}, variant: 'secondary' }
              ]}
            >
              <p className="font-bold text-lg">All set! 🎉</p><p>Your account details have been updated successfully.</p>
            </ActionableMessage>
          );
          break;
      }
    };
    processStep();
  }, [step]);

  const handleIdScan = (method: 'scan' | 'upload') => {
    if (method === 'upload') {
      addMessage(<UserUploadMessage key="id-upload-action" fileName="ID Card Uploaded" fileType="Image" />);
    } else {
      addMessage(<UserMessage key="id-scan-action">ID Card Scanned</UserMessage>);
    }
    setStep('ID_SCANNING');
  };
  const handleMaintainAccount = () => { addMessage(<UserMessage key="maintain-action">Maintain existing account</UserMessage>); setStep('SHOW_PROFILE_FOR_EDIT'); };
  const handleUploadBill = () => {
    addMessage(<UserUploadMessage key="upload-bill-action" fileName="UtilityBill_Aug2025.pdf" fileType="PDF Document" />);
    setStep('ADDRESS_UPLOADING');
  };
  
  const handleConfirmAddress = () => {
    const newAddress = (document.getElementById('address-input') as HTMLInputElement).value;
    setUpdatedData(prev => ({ ...prev, address: newAddress }));
    setCompletedUpdates(prev => new Set(prev).add('address'));
    addMessage(<UserMessage key="confirm-address-action">Address confirmed</UserMessage>);
    setStep('SHOW_PROFILE_FOR_EDIT');
  };

  const handleSaveMobile = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    setUpdatedData(prev => ({ ...prev, mobile: formData.get('mobile') as string }));
    addMessage(<UserMessage key="save-mobile-action">New mobile number entered</UserMessage>);
    setStep('OTP_MOBILE');
  };

  const handleSaveEmail = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    setUpdatedData(prev => ({ ...prev, email: formData.get('email') as string }));
    addMessage(<UserMessage key="save-email-action">New email address entered</UserMessage>);
    setStep('OTP_EMAIL');
  };

  const handleVerifyOtp = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    addMessage(<UserMessage key={`otp-verified-${step}`}>OTP Verified</UserMessage>);
    if (step === 'OTP_MOBILE') {
      setCompletedUpdates(prev => new Set(prev).add('mobile'));
      setStep('SHOW_PROFILE_FOR_EDIT');
    } else if (step === 'OTP_EMAIL') {
      setCompletedUpdates(prev => new Set(prev).add('email'));
      setStep('SHOW_PROFILE_FOR_EDIT');
    }
  };

  const handleConfirmChanges = () => { addMessage(<UserMessage key="confirm-changes-action">Confirm Changes</UserMessage>); setStep('PROCESSING'); };

  return (
    <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-950">
      <header className="p-4 border-b dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm sticky top-0 z-10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative flex-shrink-0">
            <div className="bg-primary text-primary-foreground w-10 h-10 flex items-center justify-center rounded-full">
              <Bot size={20} />
            </div>
            <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-green-500 ring-2 ring-white dark:ring-gray-900" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-800 dark:text-gray-100">Ava</h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">Digital Banking Assistant</p>
          </div>
        </div>
        <div className="flex items-center">
          <Button size="icon" variant="ghost">
            <Search className="h-5 w-5 text-gray-500" />
          </Button>
          <Button size="icon" variant="ghost">
            <MoreVertical className="h-5 w-5 text-gray-500" />
          </Button>
        </div>
      </header>
      <main className="flex-1 overflow-y-auto p-4 space-y-6">
        {messages}
        <div ref={bottomRef} />
      </main>
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

const ChangeItem = ({ label, from, to }: { label: string, from: string, to: string }) => (
  <div>
    <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{label}</p>
    <div className="flex items-center gap-2 text-sm">
      <span className="text-gray-500 line-through">{from}</span>
      <ArrowRight className="h-4 w-4 text-gray-400" />
      <span className="text-primary font-semibold">{to}</span>
    </div>
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