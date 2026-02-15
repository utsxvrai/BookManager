"use client";

import { useEffect } from "react";

type Props = {
  open: boolean;
  onClose: () => void;
  onSignIn: () => void;
};

/**
 * Modal: "Sign in with Google first" + button. Uses black/white theme.
 */
export function SignInDialog({ open, onClose, onSignIn }: Props) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    if (open) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="signin-dialog-title"
    >
      <div
        className="bg-white border-2 border-black rounded-2xl shadow-xl max-w-sm w-full p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="signin-dialog-title" className="text-lg font-semibold text-black">
          Sign in required
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          Sign in with Google to access your dashboard.
        </p>
        <div className="mt-6 flex flex-col gap-3">
          <button
            type="button"
            onClick={onSignIn}
            className="w-full py-3 px-4 bg-black text-white text-sm font-medium rounded-xl hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
          >
            Sign in with Google
          </button>
          <button
            type="button"
            onClick={onClose}
            className="w-full py-2 text-sm text-gray-600 hover:text-black transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
