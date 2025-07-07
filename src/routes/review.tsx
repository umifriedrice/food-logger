import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useCapturedImage } from "../context/CapturedImageContext";
import { Button } from "../components/ui/button";
import { calculateFoodCalories, openai } from "../ai/index";

export const Route = createFileRoute("/review")({
  component: ReviewPage,
});

function ReviewPage() {
  const { capturedImage } = useCapturedImage();
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);

  if (!capturedImage) {
    return (
      <div className="text-center mt-8">
        No image to review. Please take a picture first.
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccess(false);
    setAiResponse(null);
    setAiLoading(true);
    try {
      // Call AI model only if capturedImage is not null
      let aiResult = "";
      if (capturedImage) {
        aiResult = await calculateFoodCalories(capturedImage, openai, note);
      }
      setAiResponse(aiResult);
      setAiLoading(false);

      setSuccess(true);
      setNote("");
    } catch (err: any) {
      setError(err.message || "Unknown error");
      setAiLoading(false);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="container mx-auto flex flex-col items-center gap-6 p-4 max-w-md">
      <h2 className="text-2xl font-bold">Review Your Food Log</h2>
      <img
        src={capturedImage}
        alt="Captured food"
        className="w-full rounded-lg shadow-lg"
      />
      <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
        <textarea
          className="w-full p-2 border rounded min-h-[100px]"
          placeholder="Add a note about your meal..."
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
        <Button type="submit" disabled={submitting || aiLoading}>
          {submitting || aiLoading ? "Submitting..." : "Submit"}
        </Button>
        {error && <div className="text-red-500">{error}</div>}
        {success && (
          <div className="text-green-600">Submitted successfully!</div>
        )}
      </form>
      {aiLoading && <div className="text-blue-600">Checking with AI...</div>}
      {aiResponse && (
        <div className="mt-4 p-4 border rounded bg-gray-50 w-full text-center">
          <strong>AI Response:</strong> {aiResponse}
        </div>
      )}
    </div>
  );
}
