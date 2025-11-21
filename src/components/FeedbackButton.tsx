import { useState } from 'react';
import { MessageSquare, Star } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { z } from 'zod';

const feedbackSchema = z.object({
  rating: z.number().min(1).max(5),
  feedback_text: z.string().max(1000, 'Feedback must be 1000 characters or less').optional()
});

const FeedbackButton = () => {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [hoveredStar, setHoveredStar] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  // Don't show on auth page
  if (location.pathname === '/auth') {
    return null;
  }

  const handleSubmit = async () => {
    if (rating === 0) {
      toast.error('Please select a rating');
      return;
    }

    // Validate input
    try {
      feedbackSchema.parse({ rating, feedback_text: feedback });
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast.error(error.errors[0].message);
      }
      return;
    }

    setSubmitting(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        toast.error('Please sign in to submit feedback');
        setSubmitting(false);
        return;
      }

      const { error } = await supabase.from('feedback').insert({
        user_id: user.id,
        rating,
        feedback_text: feedback || null,
      });

      if (error) {
        toast.error('Unable to submit feedback. Please try again.');
        setSubmitting(false);
        return;
      }

      toast.success('Thank you for your feedback!');
      setOpen(false);
      setRating(0);
      setFeedback('');
    } catch (error) {
      toast.error('Unable to submit feedback. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          size="lg"
          className="fixed bottom-6 left-6 rounded-full shadow-lg z-40"
          aria-label="Provide feedback"
        >
          <MessageSquare className="mr-2 h-5 w-5" />
          Feedback
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Help Us Improve AI SafeScape</DialogTitle>
          <DialogDescription>
            Your feedback helps us build a better platform for everyone
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6 py-4">
          {/* Star Rating */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Rating</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredStar(star)}
                  onMouseLeave={() => setHoveredStar(0)}
                  className="transition-transform hover:scale-110"
                >
                  <Star
                    className={`h-8 w-8 ${
                      star <= (hoveredStar || rating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Feedback Text */}
          <div className="space-y-2">
            <label htmlFor="feedback" className="text-sm font-medium">
              Your Feedback
            </label>
            <Textarea
              id="feedback"
              placeholder="Please share your suggestions or report any issues... (max 1000 characters)"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              rows={5}
              className="resize-none"
              maxLength={1000}
            />
            <p className="text-xs text-muted-foreground text-right">
              {feedback.length}/1000 characters
            </p>
          </div>

          {/* Submit Button */}
          <Button
            onClick={handleSubmit}
            disabled={submitting}
            className="w-full"
          >
            {submitting ? 'Submitting...' : 'Submit Feedback'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FeedbackButton;
