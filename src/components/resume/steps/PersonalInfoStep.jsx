import React, { useContext, useRef, useState } from "react";
import { ResumeInfoContext } from "../../../context/ResumeInfoContext";
import { TEMPLATES } from "../templates";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import {
  User,
  Github,
  Trash,
  Code,
  Palette,
  PenTool,
  BarChart3,
  Megaphone,
  Camera,
  Lock,
  X,
  Upload,
} from "lucide-react";

const PersonalInfoStep = () => {
  const { resumeData, setResumeData, inputFields, setInputFields } =
    useContext(ResumeInfoContext);

  const fileInputRef = useRef(null);
  const [photoError, setPhotoError] = useState("");

  // ─── Derive whether the selected template supports photos ──────────────────
  const templateId = resumeData.templateId || "modern";
  const templateMeta = TEMPLATES[templateId];
  const supportsPhoto = templateMeta?.supportsPhoto ?? false;

  // ─── Helpers ───────────────────────────────────────────────────────────────
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setResumeData((prev) => ({ ...prev, [name]: value }));
  };

  const addInfo = (value) => {
    const isCurrentlyOn = inputFields[value];
    setInputFields((prev) => ({ ...prev, [value]: !isCurrentlyOn }));
    if (isCurrentlyOn) {
      setResumeData((prev) => ({ ...prev, [value]: "" }));
    }
  };

  // ─── Photo upload ──────────────────────────────────────────────────────────
  const handlePhotoChange = (e) => {
    setPhotoError("");
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate type
    if (!file.type.startsWith("image/")) {
      setPhotoError("Please select an image file (JPG, PNG, WebP).");
      return;
    }
    // Validate size — 2 MB limit to keep base64 reasonable
    if (file.size > 2 * 1024 * 1024) {
      setPhotoError("Photo must be smaller than 2 MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (ev) => {
      setResumeData((prev) => ({ ...prev, profilePhoto: ev.target.result }));
    };
    reader.readAsDataURL(file);

    // Reset input so selecting the same file again fires onChange
    e.target.value = "";
  };

  const handleRemovePhoto = () => {
    setResumeData((prev) => ({ ...prev, profilePhoto: "" }));
    setPhotoError("");
  };

  // ─── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6">

      {/* ── PROFILE PHOTO ────────────────────────────────────────────────── */}
      <div>
        <Label className="mb-2 block">Profile Photo</Label>

        {supportsPhoto ? (
          /* Supported — show uploader */
          <div className="flex items-center gap-5">
            {/* Preview / placeholder circle */}
            <div
              className="relative flex-shrink-0 w-20 h-20 rounded-full border-2 border-dashed border-gray-300 overflow-hidden bg-gray-50 flex items-center justify-center cursor-pointer hover:border-orange-400 transition-colors"
              onClick={() => fileInputRef.current?.click()}
              title="Click to upload photo"
            >
              {resumeData.profilePhoto ? (
                <img
                  src={resumeData.profilePhoto}
                  alt="Profile preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-8 h-8 text-gray-300" />
              )}
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-black/30 opacity-0 hover:opacity-100 flex items-center justify-center rounded-full transition-opacity">
                <Camera className="w-5 h-5 text-white" />
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-2">
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2 text-sm"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="w-4 h-4" />
                {resumeData.profilePhoto ? "Change Photo" : "Upload Photo"}
              </Button>

              {resumeData.profilePhoto && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center gap-2 text-sm text-red-500 hover:text-red-600 hover:bg-red-50"
                  onClick={handleRemovePhoto}
                >
                  <X className="w-4 h-4" />
                  Remove Photo
                </Button>
              )}

              <p className="text-xs text-gray-400">JPG, PNG or WebP · max 2 MB</p>
              {photoError && (
                <p className="text-xs text-red-500">{photoError}</p>
              )}
            </div>

            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handlePhotoChange}
            />
          </div>
        ) : (
          /* Not supported — locked state */
          <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 select-none">
            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
              <Lock className="w-4 h-4 text-gray-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">
                Photo upload not available
              </p>
              <p className="text-xs text-gray-400 mt-0.5">
                The <span className="font-semibold">{templateMeta?.name ?? "selected"}</span> template doesn't support a profile photo.
                Switch to <span className="font-semibold">Executive</span> or <span className="font-semibold">Elegant</span> to enable this feature.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* ── BASIC INFORMATION ────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <Label htmlFor="firstName">First Name</Label>
          <Input
            name="firstName"
            className="my-2"
            value={resumeData.firstName || ""}
            onChange={handleInputChange}
            placeholder="John"
          />
        </div>
        <div>
          <Label htmlFor="lastName">Last Name</Label>
          <Input
            name="lastName"
            className="my-2"
            value={resumeData?.lastName || ""}
            onChange={handleInputChange}
            placeholder="Doe"
          />
        </div>
        <div>
          <Label htmlFor="phone">Phone</Label>
          <Input
            name="phone"
            className="my-2"
            value={resumeData?.phone || ""}
            onChange={handleInputChange}
            placeholder="(555) 123-4567"
          />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            name="email"
            className="my-2"
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
            className="my-2"
            value={resumeData?.city || ""}
            onChange={handleInputChange}
            placeholder="New York"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <Label htmlFor="country">Country</Label>
            <Input
              name="country"
              className="my-2"
              value={resumeData?.country || ""}
              onChange={handleInputChange}
              placeholder="USA"
            />
          </div>
          <div>
            <Label htmlFor="pinCode">Pin Code</Label>
            <Input
              name="pinCode"
              className="my-2"
              value={resumeData?.pinCode || ""}
              onChange={handleInputChange}
              placeholder="10001"
            />
          </div>
        </div>
      </div>

      {/* ── JOB PROFESSION ───────────────────────────────────────────────── */}
      <div>
        <Label htmlFor="role">Job Profession</Label>
        <Input
          name="role"
          className="my-2"
          value={resumeData?.role || ""}
          onChange={handleInputChange}
          placeholder="Web Developer"
        />
      </div>

      {/* ── PROFESSIONAL LINKS ───────────────────────────────────────────── */}
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {inputFields?.linkedin && (
            <div>
              <Label htmlFor="linkedin" className="flex items-center gap-2">
                LinkedIn
              </Label>
              <div className="flex items-center relative">
                <Input
                  name="linkedin"
                  className="my-2 pr-10"
                  value={resumeData?.linkedin || ""}
                  onChange={handleInputChange}
                  placeholder="https://linkedin.com/in/yourname"
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
                  className="my-2 pr-10"
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

      <div className="flex flex-wrap gap-3">
        {!inputFields.linkedin && (
          <Button variant="outline" name="linkedin" onClick={() => addInfo("linkedin")}>
            LinkedIn +
          </Button>
        )}
        {!inputFields.github && (
          <Button variant="outline" name="github" onClick={() => addInfo("github")}>
            Github +
          </Button>
        )}
      </div>
    </div>
  );
};

export default PersonalInfoStep;
