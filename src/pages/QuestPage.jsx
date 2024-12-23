import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // Import Quill's CSS for styling

import { useState, useEffect } from "react";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { useSpaceContext } from "../context/SpaceContext";
import { useParams, Link } from "react-router-dom";
function QuestPage() {
  const [isEditing, setIsEditing] = useState(false);
  const [valueSetting, setValueSetting] = useState(false);
  const { spaces, addSpace } = useSpaceContext();
  const [sections, setSections] = useState([]);
  const { spaceId } = useParams();
  const { questId } = useParams();
  const [targetQuest, setTargetQuest] = useState([]);
  const [content, setContent] = useState([]);
  const [targetSpace, setTargetSpace] = useState(null);
  const [editSection, setEditSection] = useState(false);

  useEffect(() => {
    const findContent = () => {
      // Find the space by ID
      const targetSpaceX = spaces.find((space) => space._id === spaceId);
      console.log("target space is ", targetSpaceX);
      setTargetSpace(targetSpaceX);

      // Find the quest by questId
      if (targetSpace) {
        console.log("entered");
        const quest = targetSpace.context.quests.find(
          (q) => q.questId.toString() === questId
        );
        if (quest) {
          console.log("found quest", quest);
          setTargetQuest(quest);

          // Set content if tableOfContent exists
          if (quest.tableOfContent) {
            console.log("content", quest.tableOfContent);
            setContent(quest.tableOfContent);
            if (quest.tableOfContent.length > 0) {
              setSections(quest.tableOfContent);
            }
          }
        }
      }
    };

    findContent();
  });

  const addSection = () => {
    setSections((prevSections) => [
      ...prevSections,
      { id: Date.now(), overview: "", index: "", description: "" },
    ]);
  };
  const editTheSection = () => {
    setEditSection(true);
  };

  const removeSection = (id) => {
    setSections((prevSections) =>
      prevSections.filter((section) => section.id !== id)
    );
  };

  const handleBack = () => {
    setIsEditing(false);
    setValueSetting(false);
  };

  const handleInputChange = (id, field, value) => {
    setSections((prevSections) =>
      prevSections.map((section) =>
        section.id === id ? { ...section, [field]: value } : section
      )
    );
  };

  const handleSave = async () => {
    const contentData = {
      content: sections.map((section) => ({
        overview: section.overview,
        indexNo: parseInt(section.index),
        description: section.description,
      })),
    };

    try {
      const response = await fetch(
        `http://localhost:5000/api/spaces/${spaceId}/quests/${questId}/content`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(contentData),
        }
      );

      console.log(response);

      if (response.ok) {
        alert("Content saved successfully!");
        setIsEditing(false);
      } else {
        alert("Failed to save content.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while saving the content.");
    }
  };

  const handleSaveValues = async () => {
    const expValue = document.querySelector(
      'input[placeholder="+2000 XP"]'
    ).value;
    const winningSlotsValue = document.querySelector(
      'input[placeholder="100"]'
    ).value;

    try {
      const response = await fetch(
        `http://localhost:5000/api/spaces/${spaceId}/quests/${questId}/values`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            exp: expValue,
            winningSlts: winningSlotsValue,
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log("Quest values updated successfully:", data);
        alert("Quest values updated successfully!");
      } else {
        const errorData = await response.json();
        console.error("Error updating quest values:", errorData);
        alert(`Failed to update quest values: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Error calling API:", error);
      alert("An unexpected error occurred. Please try again later.");
    }
  };

  return (
    <div className="p-8">
      {!valueSetting ? (
        <>
          {!isEditing ? (
            <Card className="p-6 space-y-6">
              {/* Section 3 */}
              <div>
                <h2 className="text-2xl font-bold mb-4">
                  Building Authentication System with Express Js
                </h2>
                <div className="grid grid-cols-4 gap-4 mb-6">
                  <div className="flex flex-col items-center">
                    <span className="font-medium">Joinings:</span>
                    <span className="text-gray-500">---</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="font-medium">Rewards:</span>
                    <span className="text-gray-500">
                      {targetQuest.reward || "---"}
                    </span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="font-medium">Winning Slots:</span>
                    <span className="text-gray-500">
                      {targetQuest.value?.WinningSlts || "---"}
                    </span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="font-medium">Experience:</span>
                    <span className="text-gray-500">
                      {targetQuest.value?.Exp || "---"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  {content ? (
                    <>
                      {content.map((data, i) => (
                        <div className="mb-4">
                          <label className="block font-extrabold text-sm ">
                            {data.overview}
                          </label>
                          <p>{data.description}</p>
                        </div>
                      ))}
                    </>
                  ) : (
                    ""
                  )}
                </div>

                <div className="space-y-4">
                  <Button
                    variant="outline"
                    onClick={() => setValueSetting(true)}
                    className="w-full"
                  >
                    Edit Value
                  </Button>
                  <Button
                    variant="default"
                    className="w-full"
                    onClick={() => setIsEditing(true)}
                  >
                    Edit Content
                  </Button>
                  <Card className="p-4">
                    <h3 className="text-lg font-bold mb-2">Table Of Content</h3>
                    <ul className="space-y-2">
                      {content.map((section) => (
                        <li key={section._id}>
                          {section.indexNo}. {section.overview}
                        </li>
                      ))}
                    </ul>
                  </Card>
                </div>
              </div>
            </Card>
          ) : (
            <Card className="p-6 space-y-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">LearnHattan</h2>
                <Button onClick={() => handleBack()}>Back</Button>
              </div>
              <Card className="p-4 space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-bold">Table Of Content</h3>
                  <div className="flex gap-3">
                    <Button onClick={addSection}>Add</Button>
                    <Button onClick={editTheSection}>Edit</Button>
                  </div>
                </div>
                <div className="space-y-4">
                  {content.length > 0 ? (
                    <>
                      {content.map((content) => (
                        <>
                          <div
                            key={content.id}
                            className="p-4 border rounded hover:bg-gray-100 relative"
                          >
                            <Button
                              className="absolute top-0 right-0 mt-2 mr-2 text-sm"
                              variant="link"
                              onClick={() => removeSection(content.id)}
                            >
                              Remove
                            </Button>
                            <div className="flex mb-4 items-center gap-4">
                              <Input
                                placeholder="Overview"
                                value={content.overview}
                                onChange={(e) =>
                                  handleInputChange(
                                    content.id,
                                    "overview",
                                    e.target.value
                                  )
                                }
                              />
                              <Input
                                placeholder="Index No."
                                value={content.index}
                                onChange={(e) =>
                                  handleInputChange(
                                    content.id,
                                    "index",
                                    e.target.value
                                  )
                                }
                              />
                            </div>
                            {editSection ? (
                              <>
                                <ReactQuill
                                  value={content.description}
                                  className="resize-none"
                                />
                              </>
                            ) : (
                              <Textarea
                                placeholder="Description"
                                className="resize-none mt-2"
                                value={content.description}
                                onChange={(e) =>
                                  handleInputChange(
                                    content.id,
                                    "description",
                                    e.target.value
                                  )
                                }
                              />
                            )}
                          </div>
                        </>
                      ))}
                    </>
                  ) : (
                    <>
                      {sections.map((section) => (
                        <div
                          key={section.id}
                          className="p-4 border rounded hover:bg-gray-100 relative"
                        >
                          <Button
                            className="absolute top-0 right-0 mt-2 mr-2 text-sm"
                            variant="link"
                            onClick={() => removeSection(section.id)}
                          >
                            Remove
                          </Button>
                          <div className="flex items-center gap-4">
                            <Input
                              placeholder="Overview"
                              value={section.overview}
                              onChange={(e) =>
                                handleInputChange(
                                  section.id,
                                  "overview",
                                  e.target.value
                                )
                              }
                            />
                            <Input
                              placeholder="Index No."
                              value={section.index}
                              onChange={(e) =>
                                handleInputChange(
                                  section.id,
                                  "index",
                                  e.target.value
                                )
                              }
                            />
                          </div>
                          <Textarea
                            placeholder="Description"
                            className="resize-none mt-2"
                            value={section.description}
                            onChange={(e) =>
                              handleInputChange(
                                section.id,
                                "description",
                                e.target.value
                              )
                            }
                          />
                        </div>
                      ))}
                    </>
                  )}
                </div>
                <Button className="w-full" onClick={handleSave}>
                  Save
                </Button>
              </Card>
            </Card>
          )}
        </>
      ) : (
        <>
          <Card className="p-6 space-y-6">
            <div className="flex justify-between">
              <h3 className="text-xl font-bold mb-4">Quest Values</h3>
              <Button onClick={() => handleBack()}>Back</Button>{" "}
            </div>

            {/* XP Field */}
            <div className="flex items-center justify-between">
              <label className="text-lg font-medium">Exp</label>
              <Input placeholder="+2000 XP" className="w-2/3" />
              <span className="text-gray-500">Input</span>
            </div>

            {/* Winning Slots Field */}
            <div className="flex items-center justify-between">
              <label className="text-lg font-medium">Winning Slots</label>
              <Input placeholder="100" className="w-2/3" />
              <span className="text-gray-500">Input</span>
            </div>

            {/* Quest Pool Field */}
            <div className="flex items-center justify-between">
              <label className="text-lg font-medium">Quest Pool</label>
              <Input
                value={
                  targetSpace ? targetSpace.context.totalRewardPool : "1000x--"
                }
                readOnly
                className="w-2/3"
              />
              <span className="text-gray-500">Pre defined</span>
            </div>

            {/* Reward Field */}
            <div className="flex items-center justify-between">
              <label className="text-lg font-medium">Reward</label>
              <Input
                value={targetQuest ? targetQuest.reward : "--"}
                readOnly
                className="w-2/3"
              />
              <span className="text-gray-500">Auto</span>
            </div>

            {/* Save Button */}
            <Button onClick={handleSaveValues} className="w-full mt-4">
              Save
            </Button>
          </Card>
        </>
      )}
    </div>
  );
}

export default QuestPage;
