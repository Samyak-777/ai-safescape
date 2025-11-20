import { useState } from "react";
import { MessageSquare, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { toast } from "sonner";

const FeedbackButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [feedbackText, setFeedbackText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (rating === 0) {
      toast.error("Please provide a rating");
      return;
    }

    if (!feedbackText.trim()) {
      toast.error("Please share your feedback");
      return;
    }

    setIsSubmitting(true);

    try {
      await addDoc(collection(db, "feedback"), {
        rating,
        feedback: feedbackText,
        timestamp: serverTimestamp(),
      });

      toast.success("Thank you for your feedback!");
      setIsOpen(false);
      setRating(0);
      setFeedbackText("");
    } catch (error) {
      console.error("Error submitting feedback:", error);
      toast.error("Failed to submit feedback. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        size="lg"
        className="fixed bottom-4 right-4 z-40 rounded-full h-14 w-14 shadow-lg"
        title="Give Feedback"
      >
        <MessageSquare className="h-6 w-6" />
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Help Us Improve AI SafeScape</DialogTitle>
            <DialogDescription>
              Your feedback helps us make the platform better for everyone
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Star Rating */}
            <div className="flex flex-col items-center space-y-2">
              <label className="text-sm font-medium">Rate your experience</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                    className="transition-transform hover:scale-110"
                  >
                    <Star
                      className={`h-8 w-8 ${
                        star <= (hoveredRating || rating)
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Feedback Text */}
            <div className="space-y-2">
              <label htmlFor="feedback" className="text-sm font-medium">
                Your feedback
              </label>
              <Textarea
                id="feedback"
                placeholder="Please share your suggestions or report any issues..."
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                rows={5}
                className="resize-none"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit Feedback"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default FeedbackButton;
