"use client";
import React, { useState } from "react";

const PlayerActions = ({ player, isDraftedByUser, isDraftedByOther, onDraftStatusChange }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleDraftByUser = async () => {
    if (isLoading) return;
    setIsLoading(true);
    
    try {
      const response = await fetch(`/api/players/${player.id}/draft/user`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        }
      });
      
      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}`);
      }
      
      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message || "Failed to update draft status");
      }
      
      // Call the callback to update parent state
      onDraftStatusChange?.("user");
    } catch (error) {
      console.error("Error:", error);
      alert(error.message || "Failed to draft player. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDraftByOther = async () => {
    if (isLoading) return;
    setIsLoading(true);
    
    try {
      const response = await fetch(`/api/players/${player.id}/draft/other`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        }
      });
      
      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}`);
      }
      
      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message || "Failed to update draft status");
      }
      
      // Call the callback to update parent state
      onDraftStatusChange?.("other");
    } catch (error) {
      console.error("Error:", error);
      alert(error.message || "Failed to draft player. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetDraft = async () => {
    if (isLoading) return;
    setIsLoading(true);
    
    try {
      const response = await fetch(`/api/players/${player.id}/draft/reset`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        }
      });
      
      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}`);
      }
      
      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message || "Failed to reset draft status");
      }
      
      // Call the callback to update parent state
      onDraftStatusChange?.(null);
    } catch (error) {
      console.error("Error:", error);
      alert(error.message || "Failed to reset draft status. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={handleDraftByUser}
        disabled={isDraftedByUser || isDraftedByOther || isLoading}
        className="px-3 py-1.5 bg-gradient-to-r from-green-500 to-green-600 text-white text-xs rounded-md hover:from-green-600 hover:to-green-700 disabled:from-gray-400 disabled:to-gray-500 transition-all duration-300 disabled:cursor-not-allowed flex items-center gap-1 min-w-[90px] justify-center"
      >
        {isLoading ? (
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        ) : (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        )}
        Draft by me
      </button>
      
      <button
        onClick={handleDraftByOther}
        disabled={isDraftedByUser || isDraftedByOther || isLoading}
        className="px-3 py-1.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs rounded-md hover:from-blue-600 hover:to-blue-700 disabled:from-gray-400 disabled:to-gray-500 transition-all duration-300 disabled:cursor-not-allowed flex items-center gap-1 min-w-[90px] justify-center"
      >
        {isLoading ? (
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        ) : (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        )}
        Draft by other
      </button>

      <button
        onClick={handleResetDraft}
        disabled={(!isDraftedByUser && !isDraftedByOther) || isLoading}
        className="px-3 py-1.5 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs rounded-md hover:from-red-600 hover:to-red-700 disabled:from-gray-400 disabled:to-gray-500 transition-all duration-300 disabled:cursor-not-allowed flex items-center gap-1 min-w-[90px] justify-center"
      >
        {isLoading ? (
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        ) : (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        )}
        Reset draft
      </button>
    </div>
  );
};

export default PlayerActions;