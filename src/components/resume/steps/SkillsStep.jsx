import React, { useState, useContext, useEffect } from "react";
import { ResumeInfoContext } from "../../../context/ResumeInfoContext";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Trash, Plus } from "lucide-react";

const levels = ["Beginner", "Intermediate", "Advanced", "Expert"];
// const SkillsStep = () => {
//   const [skillInput, setSkillInput] = useState("");
//   const [isOn, setIsOn] = useState(false);
//   const [level, setLevel] = useState(3);

//   const addSkill = () => {
//     // if (skill.trim() && !resumeData?.skills.includes(skill.trim())) {
//     //   setResumeData({
//     //     ...resumeData,
//     //     skills: [...resumeData?.skills, skill.trim()],
//     //   });
//     // }
//     const newSkill = {
//       id: Date.now().toString(),
//       name: "",
//       level: "",
//     };
//     setResumeData({
//       ...resumeData,
//       skills: [...resumeData?.skills, newSkill],
//     });
//   };


//   const handleAddSkill = () => {
//     addSkill();
//     setSkillInput("");
//   };

//   const suggestedSkills = [
//     "JavaScript",
//     "Python",
//     "React",
//     "Node.js",
//     "SQL",
//     "Git",
//     "AWS",
//     "Docker",
//     "TypeScript",
//     "MongoDB",
//     "GraphQL",
//     "Redux",
//   ];

//   const { resumeData, setResumeData } = useContext(ResumeInfoContext);

//   if (!resumeData.skills.length === 0) {
//     addSkill(); // Add a default skill if none exists
//   }

//   const removeSkill = (skill) => {
//     setResumeData({
//       ...resumeData,
//       skills: resumeData?.skills.filter((s) => s !== skill),
//     });
//   };

//   return (
//     <div className="space-y-6">
//       <div className="flex items-center gap-3">
//         <label className="relative inline-flex items-center cursor-pointer">
//           <input
//             type="checkbox"
//             checked={isOn}
//             onChange={() => setIsOn(!isOn)}
//             className="sr-only peer"
//           />

//           {/* slider */}
//           <div
//             className="
//           w-11 h-6
//           bg-gray-300
//           rounded-full
//           peer
//           peer-checked:bg-primary
//           transition-colors
//         "
//           ></div>

//           {/* circle */}
//           <div
//             className="
//           absolute left-1 top-1
//           w-4 h-4
//           bg-white
//           rounded-full
//           transition-transform
//           peer-checked:translate-x-5
//         "
//           ></div>
//         </label>
//         <span className="font-medium">Don't show experience level</span>
//       </div>
//       {/* <div>
//         <Label htmlFor="skillInput">Add Skills</Label>
//         <div className="flex gap-2 mt-2">
//           <Input
//             id="skillInput"
//             value={skillInput}
//             onChange={(e) => setSkillInput(e.target.value)}
//             placeholder="Enter a skill..."
//             onKeyPress={(e) => e.key === "Enter" && handleAddSkill()}
//           />
//           <Button onClick={handleAddSkill} className={"h-12"} variant="outline">
//             <Plus className="w-4 h-4" />
//           </Button>
//         </div>
//       </div> */}

//       {resumeData.skills.map((skill, index) => (
//         <Card key={skill.id} className="border-orange-200">
//           <CardHeader className="pb-4">
//             <div className="flex justify-between items-center">
//               <CardTitle className="text-lg">Skill #{index + 1}</CardTitle>
//               {/* <Button
//                 variant="ghost"
//                 size="sm"
//                 onClick={() => removeExperience(exp.id)}
//                 className="text-red-500 hover:text-red-600"
//               >
//                 <X className="w-4 h-4" />
//               </Button> */}
//               <Trash
//                 size={18}
//                 className="cursor-pointer text-gray-500 hover:text-primary"
//                 onClick={() => removeSkill(skill.id)}
//               />
//             </div>
//           </CardHeader>
//           <CardContent className="space-y-4">
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div>
//                 <Label htmlFor="skillInput">Add Skills</Label>
//                 <div className="flex gap-2 mt-2">
//                   <Input
//                     id="skillInput"
//                     value={skillInput}
//                     onChange={(e) => setSkillInput(e.target.value)}
//                     placeholder="Enter a skill..."
//                     onKeyPress={(e) => e.key === "Enter" && handleAddSkill()}
//                   />
//                   <div className="w-full max-w-md">
//                     {/* Label */}
//                     <p className="mb-2 text-sm font-medium">
//                       Level —{" "}
//                       <span className="text-indigo-500">{levels[level]}</span>
//                     </p>

//                     {/* Level Bar */}
//                     <div className="flex items-center bg-indigo-50 rounded-lg p-2 gap-2">
//                       {levels.map((_, index) => (
//                         <div
//                           key={index}
//                           onClick={() => setLevel(index)}
//                           className={`flex-1 h-8 rounded-md cursor-pointer transition-all
//                           ${
//                               index <= level
//                               ? "bg-indigo-400"
//                               : "bg-transparent border border-indigo-200"
//                           }
//                         `}
//                         />
//                       ))}
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </CardContent>
//         </Card>
//       ))}

//       {/* {resumeData.skills.length > 0 && (
//         <div>
//           <Label>Your Skills</Label>
//           <div className="flex flex-wrap gap-2 mt-2">
//             {resumeData.skills.map((skill) => (
//               <Badge
//                 key={skill}
//                 variant="secondary"
//                 className="bg-orange-100 text-orange-800 hover:bg-orange-200"
//               >
//                 {skill}
//                 <Button
//                   variant="ghost"
//                   size="sm"
//                   onClick={() => removeSkill(skill)}
//                   className="ml-1 h-auto p-0 text-orange-600 hover:text-orange-800"
//                 >
//                   <X className="w-3 h-3" />
//                 </Button>
//               </Badge>
//             ))}
//           </div>
//         </div>
//       )} */}

//       {/* <div>
//         <Label>Suggested Skills</Label>
//         <div className="flex flex-wrap gap-2 mt-2">
//           {suggestedSkills
//             .filter((skill) => !resumeData.skills.includes(skill))
//             .map((skill) => (
//               <Badge
//                 key={skill}
//                 variant="outline"
//                 className="cursor-pointer hover:bg-orange-50 border-orange-300"
//                 onClick={() => addSkill(skill)}
//               >
//                 <Plus className="w-3 h-3 mr-1" />
//                 {skill}
//               </Badge>
//             ))}
//         </div>
//       </div> */}

//       {/* <Button
//         variant="outline"
//         className="bg-gradient-to-r from-orange-500 to-red-500 text-white border-0 hover:from-orange-600 hover:to-red-600"
//       >
//         <Brain className="w-4 h-4 mr-2" />
//         AI Skill Suggestions
//       </Button> */}
//     </div>
//   );
// };

const SkillsStep = () => {
  const { resumeData, setResumeData } = useContext(ResumeInfoContext);
  const [hideLevel, setHideLevel] = useState(false);

  // Add default skill once
  useEffect(() => {
    if (resumeData.skills.length === 0) {
      setResumeData({
        ...resumeData,
        skills: [
          {
            id: Date.now().toString(),
            name: "",
            level: 3,
          },
        ],
      });
    }
  }, []);

  const addSkill = () => {
    setResumeData({
      ...resumeData,
      skills: [
        ...resumeData.skills,
        { id: Date.now().toString(), name: "", level: 3 },
      ],
    });
  };

  const removeSkill = (id) => {
    setResumeData({
      ...resumeData,
      skills: resumeData.skills.filter((s) => s.id !== id),
    });
  };

  const updateSkillName = (id, value) => {
    setResumeData({
      ...resumeData,
      skills: resumeData.skills.map((s) =>
        s.id === id ? { ...s, name: value } : s
      ),
    });
  };

  const updateSkillLevel = (id, level) => {
    setResumeData({
      ...resumeData,
      skills: resumeData.skills.map((s) =>
        s.id === id ? { ...s, level } : s
      ),
    });
  };

  return (
    <div className="space-y-6">
      {/* Toggle */}
      <div className="flex items-center gap-3">
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={hideLevel}
            onChange={() => setHideLevel(!hideLevel)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:bg-primary transition-colors" />
          <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-5" />
        </label>
        <span className="font-medium">
          Don&apos;t show experience level
        </span>
      </div>

      {/* Skills */}
      {resumeData.skills.map((skill, index) => (
        <Card key={skill.id} className="border-orange-200">
          <CardHeader className="pb-4">
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg">
                Skill #{index + 1}
              </CardTitle>
              <Trash
                size={18}
                className="cursor-pointer text-gray-500 hover:text-primary"
                onClick={() => removeSkill(skill.id)}
              />
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Skill Name */}
            <div>
              <Label>Skill Name</Label>
              <Input
                value={skill.name}
                onChange={(e) =>
                  updateSkillName(skill.id, e.target.value)
                }
                placeholder="e.g. React, Python"
              />
            </div>

            {/* Skill Level */}
            {!hideLevel && (
              <div className="w-full max-w-md">
                <p className="mb-2 text-sm font-medium">
                  Level —{" "}
                  <span className="text-indigo-500">
                    {levels[skill.level]}
                  </span>
                </p>

                <div className="flex bg-indigo-50 rounded-lg p-2 gap-2">
                  {levels.map((_, i) => (
                    <div
                      key={i}
                      onClick={() =>
                        updateSkillLevel(skill.id, i)
                      }
                      className={`flex-1 h-8 rounded-md cursor-pointer transition-all
                        ${
                          i <= skill.level
                            ? "bg-indigo-400"
                            : "border border-indigo-200"
                        }`}
                    />
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      ))}

      {/* Add Skill Button */}
      <button
        onClick={addSkill}
        className="w-full py-3 rounded-lg border-2 border-dashed border-orange-300 text-orange-500 hover:bg-orange-50 font-medium"
      >
        + Add Another Skill
      </button>
    </div>
  );
};

export default SkillsStep;
