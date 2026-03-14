import React, { useContext } from "react";
import { ResumeInfoContext } from "../../../context/ResumeInfoContext";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { Button } from "../../ui/button";
import { Card, CardContent } from "../../ui/card";
import {
  FolderGit2, Award, Languages, Heart, Plus, Trash,
  CheckCircle2, Circle,
} from "lucide-react";

// ─── Section configs ──────────────────────────────────────────────────────────
const SECTIONS = [
  {
    key: "certifications",
    title: "Certifications",
    icon: Award,
    color: "blue",
    description: "Professional certifications & licenses",
    empty: { id: "", name: "", issuer: "", date: "", url: "" },
    fields: [
      { key: "name",   label: "Certification Name", placeholder: "AWS Solutions Architect", span: 2 },
      { key: "issuer", label: "Issuing Organization", placeholder: "Amazon Web Services" },
      { key: "date",   label: "Issue Date", placeholder: "Jan 2024" },
      { key: "url",    label: "Credential URL", placeholder: "https://...", span: 2 },
    ],
  },
  {
    key: "languages",
    title: "Languages",
    icon: Languages,
    color: "purple",
    description: "Languages you speak or write",
    empty: { id: "", language: "", proficiency: "Conversational" },
    fields: [
      { key: "language",    label: "Language", placeholder: "Spanish", span: 2 },
      {
        key: "proficiency", label: "Proficiency", type: "select", span: 2,
        options: ["Native", "Fluent", "Professional", "Conversational", "Elementary"],
      },
    ],
  },
  {
    key: "volunteer",
    title: "Volunteer Work",
    icon: Heart,
    color: "red",
    description: "Volunteering & community involvement",
    empty: { id: "", role: "", organization: "", startDate: "", endDate: "", description: "" },
    fields: [
      { key: "role",         label: "Role / Position", placeholder: "Volunteer Coordinator", span: 2 },
      { key: "organization", label: "Organization", placeholder: "Red Cross" },
      { key: "startDate",    label: "Start Date", placeholder: "Jan 2022" },
      { key: "endDate",      label: "End Date", placeholder: "Present", span: 2 },
      { key: "description",  label: "Description", placeholder: "What you did and impact made…", span: 2, multiline: true },
    ],
  },
  {
    key: "awards",
    title: "Awards & Honors",
    icon: Award,
    color: "amber",
    description: "Recognition, honors & achievements",
    empty: { id: "", title: "", issuer: "", date: "", description: "" },
    fields: [
      { key: "title",       label: "Award Title", placeholder: "Employee of the Year", span: 2 },
      { key: "issuer",      label: "Issued By", placeholder: "Tech Corp" },
      { key: "date",        label: "Date", placeholder: "Dec 2023" },
      { key: "description", label: "Description", placeholder: "Brief context…", span: 2, multiline: true },
    ],
  },
];

const colorMap = {
  blue:   { badge: "bg-blue-50 border-blue-200",   icon: "text-blue-600 bg-blue-50",   ring: "ring-blue-400",   add: "border-blue-200 text-blue-500 hover:bg-blue-50" },
  purple: { badge: "bg-purple-50 border-purple-200", icon: "text-purple-600 bg-purple-50", ring: "ring-purple-400", add: "border-purple-200 text-purple-500 hover:bg-purple-50" },
  red:    { badge: "bg-red-50 border-red-200",     icon: "text-red-500 bg-red-50",     ring: "ring-red-400",    add: "border-red-200 text-red-500 hover:bg-red-50" },
  amber:  { badge: "bg-amber-50 border-amber-200", icon: "text-amber-600 bg-amber-50", ring: "ring-amber-400",  add: "border-amber-200 text-amber-500 hover:bg-amber-50" },
};

// ─── Per-section panel ────────────────────────────────────────────────────────
const SectionPanel = ({ section }) => {
  const { resumeData, setResumeData } = useContext(ResumeInfoContext);
  const items = resumeData[section.key] || [];
  const c = colorMap[section.color];
  const Icon = section.icon;

  const addItem = () => {
    setResumeData((prev) => ({
      ...prev,
      [section.key]: [...(prev[section.key] || []), { ...section.empty, id: Date.now().toString() }],
    }));
  };

  const removeItem = (id) => {
    setResumeData((prev) => ({
      ...prev,
      [section.key]: prev[section.key].filter((item) => item.id !== id),
    }));
  };

  const updateItem = (id, field, value) => {
    setResumeData((prev) => ({
      ...prev,
      [section.key]: prev[section.key].map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      ),
    }));
  };

  return (
    <div className="space-y-3">
      {/* Section header */}
      <div className={`flex items-center gap-3 p-3 rounded-xl border ${c.badge}`}>
        <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${c.icon}`}>
          <Icon size={16} />
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold text-foreground">{section.title}</p>
          <p className="text-xs text-muted-foreground">{section.description}</p>
        </div>
        {items.length > 0 && (
          <CheckCircle2 size={16} className="text-green-500 flex-shrink-0" />
        )}
      </div>

      {/* Items */}
      {items.map((item, index) => (
        <Card key={item.id} className="border-orange-100">
          <CardContent className="p-4">
            <div className="flex justify-between items-center mb-3">
              <span className="text-xs font-medium text-muted-foreground">
                {section.title} #{index + 1}
              </span>
              <Button variant="ghost" size="icon-sm" onClick={() => removeItem(item.id)} className="text-muted-foreground hover:text-red-500 hover:bg-red-50 h-6 w-6">
                <Trash size={13} />
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {section.fields.map((field) => (
                <div key={field.key} className={field.span === 2 ? "col-span-2" : "col-span-1"}>
                  <Label className="text-xs mb-1 block">{field.label}</Label>
                  {field.type === "select" ? (
                    <select
                      value={item[field.key] || ""}
                      onChange={(e) => updateItem(item.id, field.key, e.target.value)}
                      className="w-full h-8 text-sm rounded-md border border-input bg-background px-2 focus:outline-none focus:ring-1 focus:ring-orange-300"
                    >
                      {field.options.map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  ) : field.multiline ? (
                    <textarea
                      value={item[field.key] || ""}
                      onChange={(e) => updateItem(item.id, field.key, e.target.value)}
                      placeholder={field.placeholder}
                      rows={2}
                      className="w-full text-sm rounded-md border border-input bg-background px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-orange-300 resize-none"
                    />
                  ) : (
                    <Input
                      value={item[field.key] || ""}
                      onChange={(e) => updateItem(item.id, field.key, e.target.value)}
                      placeholder={field.placeholder}
                      className="h-8 text-sm"
                    />
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Add button */}
      <Button variant="outline" onClick={addItem} className="w-full border-dashed">
        <Plus size={14} /> Add {section.title}
      </Button>
    </div>
  );
};

// ─── Main component ───────────────────────────────────────────────────────────
const AdditionalStep = () => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-semibold text-foreground mb-1">Additional Sections</h3>
        <p className="text-xs text-muted-foreground">
          Add optional sections to strengthen your resume. Fill in only what's relevant to you.
        </p>
      </div>

      {SECTIONS.map((section) => (
        <SectionPanel key={section.key} section={section} />
      ))}
    </div>
  );
};

export default AdditionalStep;
