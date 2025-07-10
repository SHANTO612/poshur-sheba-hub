import { Star, StarOff } from 'lucide-react';

interface StarRatingProps {
  rating: number;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

const StarRating = ({ rating, size = 'md', showText = false }: StarRatingProps) => {
  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-lg',
    lg: 'text-xl',
  };

  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} className={`${sizeClasses[size]} ${i <= rating ? 'text-yellow-400' : 'text-gray-300'}`}>
          {i <= rating ? <Star className="fill-current" /> : <StarOff className="fill-current" />}
        </span>
      );
    }
    return stars;
  };

  return (
    <div className="flex items-center gap-1">
      {renderStars()}
      {showText && (
        <span className="text-sm text-gray-600 ml-2">
          {rating > 0 ? `${rating.toFixed(1)}/5` : 'No ratings'}
        </span>
      )}
    </div>
  );
};

export default StarRating; 