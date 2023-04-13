import { StarIcon } from "@heroicons/react/20/solid";

export default function Rating({
  rating,
  rateCount,
}: {
  rating: number;
  rateCount?: number;
}) {
  if (rateCount === 0) {
    return <div className="text-gray-500 text-sm"></div>;
  }

  let roundedRating = Math.round(rating * 2) / 2;
  const stars: JSX.Element[] = [];

  for (let i = 0; i < 5; i++) {
    if (roundedRating >= 1) {
      stars.push(<StarIcon className="w-5 h-5 text-yellow-400" />);
    } else if (roundedRating === 0.5) {
      stars.push(<StarIcon className="w-5 h-5 text-yellow-400" />); // TODO: replace with half star
    } else {
      // empty star
      stars.push(<StarIcon className="w-5 h-5 text-gray-300" />);
    }

    roundedRating -= 1;
  }

  return (
    <div className="flex items-center">
      {stars.map((star) => star)}
      {rateCount && <div className="text-gray-500 ml-1">({rateCount})</div>}
    </div>
  );
}
