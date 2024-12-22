import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

interface Space {
  _id: string;
  title: string;
}

interface SpaceContextProps {
  spaces: Space[];
  fetchSpaces: () => Promise<void>;
  addSpace: (title: string) => Promise<void>;
}

const SpaceContext = createContext<SpaceContextProps | undefined>(undefined);

export const SpaceProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [spaces, setSpaces] = useState<Space[]>([]);

  const fetchSpaces = async () => {
    try {
      const response = await axios.get<{ spaces: Space[] }>(
        "http://localhost:5000/api/spaces"
      );
      setSpaces(response.data);
    } catch (err) {
      console.error("Error fetching spaces:", err);
    }
  };

  const addSpace = async (title: string) => {
    try {
      const response = await axios.post<{ space: Space }>(
        "http://localhost:5000/api/spaces",
        {
          title,
        }
      );
      setSpaces((prevSpaces) => [...prevSpaces, response.data.space]);
    } catch (err) {
      console.error("Error adding space:", err);
    }
  };

  useEffect(() => {
    fetchSpaces();
  }, []);

  return (
    <SpaceContext.Provider value={{ spaces, fetchSpaces, addSpace }}>
      {children}
    </SpaceContext.Provider>
  );
};

export const useSpaceContext = () => {
  const context = useContext(SpaceContext);
  if (!context) {
    throw new Error("useSpaceContext must be used within a SpaceProvider");
  }
  return context;
};
