import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../ui/dialog';
import { Button } from '../../ui/button';
import { Label } from '../../ui/label';
import { Textarea } from '../../ui/textarea';
import { useAuth } from '../../../contexts/AuthContext';
import { Star, StarOff } from 'lucide-react';
import { toast } from '../../ui/sonner';

interface RatingDialogProps {
  veterinarianId: string;
  veterinarianName: string;
  onRatingSubmitted?: () => void;
}

interface RatingData {
  rating: number;
  review: string;
  experience: string;
}

const RatingDialog = ({ veterinarianId, veterinarianName, onRatingSubmitted }: RatingDialogProps) => {
  const { user, token } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [existingRating, setExistingRating] = useState<any>(null);
  const [ratingData, setRatingData] = useState<RatingData>({
    rating: 0,
    review: '',
    experience: '',
  });

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

  // Check if farmer has already rated this veterinarian
  useEffect(() => {
    if (isOpen && user && user.userType === 'farmer') {
      fetch(`${API_BASE_URL}/ratings/farmer/${veterinarianId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })
        .then(res => res.json())
        .then(result => {
          if (result.success && result.data) {
            setExistingRating(result.data);
            setRatingData({
              rating: result.data.rating,
              review: result.data.review || '',
              experience: result.data.experience,
            });
          }
        })
        .catch(error => {
          console.error('Error fetching existing rating:', error);
        });
    }
  }, [isOpen, veterinarianId, user, token]);

  const handleStarClick = (starNumber: number) => {
    setRatingData(prev => ({ ...prev, rating: starNumber }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || user.userType !== 'farmer') {
      toast.error('Only farmers can rate veterinarians');
      return;
    }

    if (ratingData.rating === 0) {
      toast.error('Please select a rating');
      return;
    }

    if (!ratingData.experience.trim()) {
      toast.error('Please describe your experience');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/ratings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          veterinarianId,
          rating: ratingData.rating,
          review: ratingData.review,
          experience: ratingData.experience,
        }),
      });

      const result = await response.json();

      if (result.success) {
        toast.success(existingRating ? 'Rating updated successfully!' : 'Rating submitted successfully!');
        setIsOpen(false);
        onRatingSubmitted && onRatingSubmitted();
      } else {
        toast.error(result.message || 'Failed to submit rating');
      }
    } catch (error) {
      console.error('Error submitting rating:', error);
      toast.error('Failed to submit rating. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      setRatingData({
        rating: 0,
        review: '',
        experience: '',
      });
      setExistingRating(null);
    }
  };

  // Only show for farmers
  if (!user || user.userType !== 'farmer') {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          {existingRating ? 'Update Rating' : 'Rate Veterinarian'}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {existingRating ? 'Update Rating' : 'Rate Veterinarian'}
          </DialogTitle>
          <p className="text-sm text-gray-600">
            Rate Dr. {veterinarianName}
          </p>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Star Rating */}
          <div>
            <Label>Rating *</Label>
            <div className="flex gap-1 mt-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => handleStarClick(star)}
                  className="text-2xl text-yellow-400 hover:text-yellow-500 transition-colors"
                >
                  {star <= ratingData.rating ? (
                    <Star className="fill-current" />
                  ) : (
                    <StarOff className="fill-current" />
                  )}
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {ratingData.rating > 0 ? `${ratingData.rating} star${ratingData.rating > 1 ? 's' : ''}` : 'Click to rate'}
            </p>
          </div>

          {/* Experience Description */}
          <div>
            <Label htmlFor="experience">Describe your experience *</Label>
            <Textarea
              id="experience"
              value={ratingData.experience}
              onChange={(e) => setRatingData(prev => ({ ...prev, experience: e.target.value }))}
              placeholder="Describe your experience with this veterinarian..."
              rows={3}
              required
            />
          </div>

          {/* Optional Review */}
          <div>
            <Label htmlFor="review">Review (Optional)</Label>
            <Textarea
              id="review"
              value={ratingData.review}
              onChange={(e) => setRatingData(prev => ({ ...prev, review: e.target.value }))}
              placeholder="Share your detailed review..."
              rows={3}
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Submitting...' : (existingRating ? 'Update Rating' : 'Submit Rating')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default RatingDialog; 