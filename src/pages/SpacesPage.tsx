import { Card } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import { useSpaceContext } from "../context/SpaceContext";
import { useState, useEffect } from "react";
import axios from "axios";

interface Space {
  _id: string;
  title: string;
}

interface Quest {
  title: string;
  reward: string;
}

interface AddContextProps {
  space: Space;
}

export default function SpacesPage() {
  const { spaces, addSpace } = useSpaceContext();
  const [newSpaceName, setNewSpaceName] = useState<string>("");
  const [showAddContext, setShowAddContext] = useState<boolean>(false);
  const [selectedSpace, setSelectedSpace] = useState<Space | null>(null);

  const handleAddContext = (space: Space) => {
    setSelectedSpace(space);
    setShowAddContext(true);
  };

  console.log(spaces);

  return (
    <div className="flex">
      <aside className="w-1/4 bg-gray-100 p-4">
        <h2 className="text-xl font-bold">LearnHattan</h2>
        <ul className="mt-4">
          <li className="text-gray-700">Spaces</li>
        </ul>
      </aside>

      <main className="flex-1 p-6">
        <Card className="p-4 mb-6">
          <h3 className="text-lg font-bold mb-4">Add Space</h3>
          <div className="flex items-center space-x-4">
            <Input
              placeholder="Title"
              value={newSpaceName}
              onChange={(e) => setNewSpaceName(e.target.value)}
            />
            <Button
              onClick={() => {
                addSpace(newSpaceName);
                setNewSpaceName("");
              }}
            >
              Add Space
            </Button>
          </div>
        </Card>

        {spaces ? (
          <div className="space-y-4">
            {spaces.map((space) => (
              <Card
                key={space._id}
                className="p-4 flex justify-between items-center"
              >
                <span>{space.title}</span>
                <div className="space-x-2">
                  {space.context?.totalRewardPool === "" ? (
                    <Button
                      variant="secondary"
                      onClick={() => handleAddContext(space)}
                    >
                      Add Context
                    </Button>
                  ) : (
                    ""
                  )}
                  <a href={`/quests/${space._id}`}>
                    <Button>View</Button>
                  </a>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          ""
        )}
      </main>

      {selectedSpace && (
        <Dialog open={showAddContext} onOpenChange={setShowAddContext}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Context</DialogTitle>
            </DialogHeader>
            <AddContextPage space={selectedSpace} />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

function AddContextPage({ space }: AddContextProps) {
  const [rewardPool, setRewardPool] = useState<string>("");
  const [totalQuests, setTotalQuests] = useState<string>("0");
  const [quests, setQuests] = useState<Quest[]>([]);

  useEffect(() => {
    const questCount = Number(totalQuests) || 0;
    const newQuests = Array.from({ length: questCount }, (_, index) => ({
      title: quests[index]?.title || "",
      reward: quests[index]?.reward || "",
    }));
    setQuests(newQuests);
  }, [totalQuests]);

  const saveContext = async () => {
    try {
      await axios.post(
        `http://localhost:5000/api/spaces/${space._id}/context`,
        {
          totalRewardPool: rewardPool,
          totalQuests: Number(totalQuests),
          quests,
        }
      );
      alert("Context added successfully!");
    } catch (err) {
      console.error("Error adding context:", err);
    }
  };

  return (
    <Card className="p-4">
      <h3 className="text-lg font-bold mb-4">Add Context to {space.title}</h3>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium">
            Total Reward Pool:
          </label>
          <Input
            placeholder="2000"
            value={rewardPool}
            onChange={(e) => setRewardPool(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Total Quests:</label>
          <Input
            placeholder="3"
            value={totalQuests}
            onChange={(e) => setTotalQuests(e.target.value)}
          />
        </div>
        {quests.map((quest, index) => (
          <div key={index} className="flex items-center space-x-4">
            <Input
              placeholder={`Title`}
              value={quest.title}
              onChange={(e) =>
                setQuests((prev) =>
                  prev.map((q, i) =>
                    i === index ? { ...q, title: e.target.value } : q
                  )
                )
              }
            />
            <Input
              placeholder={`Reward`}
              value={quest.reward}
              onChange={(e) =>
                setQuests((prev) =>
                  prev.map((q, i) =>
                    i === index ? { ...q, reward: e.target.value } : q
                  )
                )
              }
            />
          </div>
        ))}
        <Button className="mt-4" onClick={saveContext}>
          Save
        </Button>
      </div>
    </Card>
  );
}
