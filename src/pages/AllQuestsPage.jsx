import { useSpaceContext } from "../context/SpaceContext";
import { Card } from "../components/ui/card";
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";

function AllQuestsPage() {
  const [quests, setQuests] = useState([]);
  const { spaces } = useSpaceContext();
  const { spaceId } = useParams();

  useEffect(() => {
    const space = spaces.find((space) => space._id === spaceId);
    if (space) {
      setQuests(space.context?.quests || []);
    }
  }, [spaceId, spaces]);

  return (
    <div>
      {quests.length > 0 ? (
        <div className="space-y-4">
          {quests.map((quest, index) => (
            <Link key={index} to={`/quests/${spaceId}/${index}`}>
              <Card className="p-4 flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-bold">{quest.title}</h3>
                  <p className="text-sm text-gray-600">
                    Reward: {quest.reward}
                  </p>
                </div>
                <FaArrowRight />
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <p>No quests found for this space.</p>
      )}
    </div>
  );
}

export default AllQuestsPage;
