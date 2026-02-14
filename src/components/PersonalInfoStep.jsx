import React, { use, useEffect } from "react";
import { useContext } from "react";
import { ResumeInfoContext } from "../context/ResumeInfoContext";
// import { generateText } from "../lib/aiService";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Textarea } from "./ui/textarea";
import { useState } from "react";
import { cn } from "../lib/utils";
import { supabase } from "../lib/supabaseClient";

// import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  User,
  Briefcase,
  GraduationCap,
  Award,
  Brain,
  Download,
  Eye,
  Plus,
  X,
  Trash,
  Sparkles,
  FileText,
  ArrowLeft,
  Home,
  Github,
  Linkedin,
  Globe,
  Code,
  Palette,
  PenTool,
  BarChart3,
  Megaphone,
} from "lucide-react";

const PersonalInfoStep = () => {
  const roles = [
    { value: "developer", label: "Software Developer/Engineer", icon: Code },
    { value: "designer", label: "UI/UX Designer", icon: Palette },
    { value: "writer", label: "Content Writer/Editor", icon: PenTool },
    { value: "analyst", label: "Business Analyst", icon: BarChart3 },
    { value: "marketer", label: "Digital Marketer", icon: Megaphone },
    { value: "other", label: "Other", icon: User },
  ];
  const { resumeData, setResumeData } = useContext(ResumeInfoContext);
  const { inputFields, setInputFields } = useContext(ResumeInfoContext);

  

  const updatePersonalInfo = (field, value) => {
    setResumeData({
      ...resumeData,
      [field]: value,
    });
  };

  const selectValueChange = (field, value) => {
    setResumeData({
      ...resumeData,
      [field]: value,
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    console.log(name, value);
    setResumeData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const generateText = async (userPrompt) => {
    try {
      const { data, error } = await supabase.functions.invoke(
        "generate-resume-text",
        {
          body: { prompt: userPrompt },
          // By default, invoke uses POST, but you can specify method if needed
          // method: 'POST',
        }
      );

      if (error) {
        console.error("Error invoking AI function:", error);
        return `Error: ${error.message}`;
      }

      // The 'data' object will contain what your Edge Function returns
      // In our case: { generatedText: "..." }
      // return data.generatedText;
      setResumeData({
        ...resumeData,
        summary: data?.generatedText,
      });
    } catch (err) {
      console.error("Network or unexpected error:", err);
      return `An unexpected error occurred: ${err.message}`;
    }
  };

  const addInfo = (value) => {
    setInputFields((prev) => ({
      ...prev,
      [value]: inputFields[value] ? false : true,
    }));
    if (!inputFields[value] === false) {
      setResumeData({
        ...resumeData,
        [value]: "",
      });
    }
  };



  return (
    <div className="space-y-6">
      {/* Basic Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <Label htmlFor="firstName">First Name</Label>
          <Input
            name="firstName"
            className={"my-2"}
            value={resumeData.firstName || ""}
            // onChange={(e) => updatePersonalInfo("firstName", e.target.value)}
            onChange={handleInputChange}
            placeholder="John Doe"
          />
        </div>
        <div>
          <Label htmlFor="lastName">Last Name</Label>
          <Input
            name="lastName"
            className={"my-2"}
            value={resumeData?.lastName || ""}
            onChange={handleInputChange}
            placeholder="John Doe"
          />
        </div>
        <div>
          <Label htmlFor="phone">Phone</Label>
          <Input
            name="phone"
            className={"my-2"}
            value={resumeData?.phone || ""}
            onChange={handleInputChange}
            placeholder="(555) 123-4567"
          />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            name="email"
            className={"my-2"}
            type="email"
            value={resumeData?.email || ""}
            onChange={handleInputChange}
            placeholder="john@example.com"
          />
        </div>
        <div>
          <Label htmlFor="city">City</Label>
          <Input
            name="city"
            className={"my-2"}
            value={resumeData?.city || ""}
            onChange={handleInputChange}
            placeholder="John Doe"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <Label htmlFor="country">Country</Label>
            <Input
              name="country"
              className={"my-2"}
              value={resumeData?.country || ""}
              onChange={handleInputChange}
              placeholder="John Doe"
            />
          </div>

          <div>
            <Label htmlFor="pinCode">Pin Code</Label>
            <Input
              name="pinCode"
              className={"my-2"}
              value={resumeData?.pinCode || ""}
              onChange={handleInputChange}
              placeholder="New York, NY"
            />
          </div>
        </div>
      </div>

      {/* Role Selection */}
      <div>
        <Label htmlFor="role">Job Profession</Label>
        <Input
          name="role"
          className={"my-2"}
          value={resumeData?.role || ""}
          onChange={handleInputChange}
          placeholder="Web Developer"
        />
      </div>
      {/* Professional Links */}
      <div className="space-y-4">
        {/* <div className="flex items-center gap-2 mb-4">
              <Globe className="w-5 h-5 text-orange-600" />
              <h4 className="font-medium">Professional Links</h4>
              </div> */}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {inputFields?.linkedin && (
            <div>
              <Label htmlFor="linkedin" className="flex items-center gap-2">
                {/* <Linkedin className="w-4 h-4 text-blue-600" /> */}
                LinkedIn
              </Label>
              <div className="flex items-center relative">
              <Input
                name="linkedin"
                className={"my-2 pr-10"}
                value={resumeData?.linkedin || ""}
                onChange={handleInputChange}
                placeholder="https://linkedin.com/in/yourname"
                // className="pd-10"
              />

              <Trash
                size={18}
                className="cursor-pointer absolute right-3 text-gray-500 hover:text-primary"
                onClick={() => addInfo("linkedin")}
              />
              </div>
            </div>
          )}

          {inputFields?.github && (
            <div>
              <Label htmlFor="github" className="flex items-center gap-2">
                <Github className="w-4 h-4" />
                GitHub Profile
              </Label>
              <div className="flex items-center relative">
              <Input
                name="github"
                className={"my-2 pr-10"}
                value={resumeData?.github || ""}
                onChange={handleInputChange}
                placeholder="https://github.com/yourusername"
              />
              <Trash
                size={18}
                className="cursor-pointer absolute right-3 text-gray-500 hover:text-primary"
                onClick={() => addInfo("github")}
              />
              </div>
            </div>
          )}
        </div>
      </div>
      {(inputFields.linkedin && inputFields.github) || (
        <Label>Add additional information to your resume (optional)</Label>
      )}

      <div className=" flex flex-wrap gap-3">
        {!inputFields.linkedin && (
          <Button

            variant={"outline"}
            name="linkedin"
            onClick={() => addInfo("linkedin")}
          >
            LinkedIn +
          </Button>
      //     <button
      //   onClick={() => addInfo("linkedin")}
      //   className="p-1 rounded-md border-2 border-dashed border-gray-300 text-gray-400 hover:bg-orange-50 hover:text-primary hover:border-primary font-medium"
      // >
      //   + LinkedIn
      // </button>
        )}
        {!inputFields.github && (
          <Button
          
            variant={"outline"}
            name="github"
            onClick={() => addInfo("github")}
          >
            Github +
          </Button>
      //     <button
      //   onClick={() => addInfo("github")}
      //   className="p-1 rounded-md border-2 border-dashed border-gray-300 text-gray-400 hover:bg-orange-50 hover:text-primary hover:border-primary font-medium"
      // >
      //   + GitHub
      // </button>
        )}
      </div>

      
    </div>
  );
};

export default PersonalInfoStep;
