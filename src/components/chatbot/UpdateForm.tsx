import { useState, FormEvent } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface UpdateFormProps {
  fieldLabel: string;
  fieldName: string;
  placeholder: string;
  inputType?: string;
  onSubmit: (value: string) => void;
}

export const UpdateForm = ({ fieldLabel, fieldName, placeholder, inputType = "text", onSubmit }: UpdateFormProps) => {
  const [value, setValue] = useState("");

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (value.trim()) {
      onSubmit(value);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3 mt-3">
      <div>
        <label className="text-sm">{fieldLabel}</label>
        <Input
          name={fieldName}
          type={inputType}
          placeholder={placeholder}
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
      </div>
      <Button type="submit" disabled={!value.trim()}>
        Save Changes
      </Button>
    </form>
  );
};