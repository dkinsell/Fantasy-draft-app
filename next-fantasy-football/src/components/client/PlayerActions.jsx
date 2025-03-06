"use client";
import React, { useState } from "react";

const PlayerActions = ({ player, isDraftedByUser, isDraftedByOther }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [draftedByUser, setDraftedByUser] = useState(isDraftedByUser);
  const [draftedByOther, setDraftedByOther] = useState(isDraftedByOther);

  // Function to handle a player being drafted by the user
  const handleDraftByUser = () => {
    if (isLoading) return;
    // Optimistically update UI state
    setIsLoading(true);
    setDraftedByUser(true);
    setDraftedByOther(false);

    fetch(`/api/players/${player.id}/draft/user`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Server responded with ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        if (!data.success) {
          // Revert to previous state if API call failed
          setDraftedByUser(false);
          console.error("Failed to update draft status:", data.error);
        }
      })
      .catch((error) => {
        // Revert to previous state on error
        setDraftedByUser(false);
        console.error("Error:", error);
        alert("Failed to update draft status. Please try again.");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  // Function to handle a player being drafted by someone other than the user
  const handleDraftByOther = () => {
    if (isLoading) return;
    // Optimistically update UI state
    setIsLoading(true);
    setDraftedByUser(false);
    setDraftedByOther(true);

    fetch(`/api/players/${player.id}/draft/other`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Server responded with ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        if (!data.success) {
          // Revert to previous state if API call failed
          setDraftedByOther(false);
          console.error("Failed to update draft status:", data.error);
        }
      })
      .catch((error) => {
        // Revert to previous state on error
        setDraftedByOther(false);
        console.error("Error:", error);
        alert("Failed to update draft status. Please try again.");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  // Function to reset the player's draft status
  const handleResetDraft = () => {
    if (isLoading) return;
    // Optimistically update UI state
    setIsLoading(true);
    setDraftedByUser(false);
    setDraftedByOther(false);

    fetch(`/api/players/${player.id}/draft/reset`, {
      method: "PATCH",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Server responded with ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        if (!data.success) {
          // Need to determine previous state, this is a simplification
          console.error("Failed to reset draft status:", data.error);
        }
      })
      .catch((error) => {
        // Since we don't know the previous state easily, we'll rely on parent refresh
        console.error("Error:", error);
        alert("Failed to reset draft status. Please try again.");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={handleDraftByUser}
        disabled={draftedByUser || draftedByOther || isLoading}
        className="px-3 py-1.5 bg-gradient-to-r from-green-500 to-green-600 text-white text-xs rounded-md hover:from-green-600 hover:to-green-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
      >
        {isLoading ? (
          <svg className="animate-spin h-3 w-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        )}
        Draft by me
      </button>
      
      <button
        onClick={handleDraftByOther}
        disabled={draftedByUser || draftedByOther || isLoading}
        className="px-3 py-1.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs rounded-md hover:from-blue-600 hover:to-blue-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
      >
        {isLoading ? (
          <svg className="animate-spin h-3 w-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        )}
        Draft by other
      </button>
      
      <button
        onClick={handleResetDraft}
        disabled={(!draftedByUser && !draftedByOther) || isLoading}
        className="px-3 py-1.5 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs rounded-md hover:from-red-600 hover:to-red-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
      >
        {isLoading ? (
          <svg className="animate-spin h-3 w-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        )}
        Reset
      </button>
    </div>
  );
};

export default PlayerActions;