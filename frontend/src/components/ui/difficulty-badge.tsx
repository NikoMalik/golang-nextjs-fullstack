
import { Badge } from './badge';
import { cn } from '@/lib/utils';

interface Props {
  difficulty: keyof typeof COLORS_BY_DIFFICULTY;
  className?: string;
}

const COLORS_BY_DIFFICULTY = {
    BEGINNER: 'bg-orange-500 text-foreground shadow-[0px_5px_30px_0px_#ed8936]',
    EASY: 'bg-green-500 text-white shadow-[0px_5px_30px_0px_#48bb78]',
    MEDIUM: 'bg-blue-500 text-white shadow-[0px_5px_30px_0px_#4299e1]',
    HARD: 'bg-indigo-500 text-white shadow-[0px_5px_30px_0px_#667eea]',
    EXTREME: 'bg-red-500 text-white shadow-[0px_5px_30px_0px_#f56565]   ',
    
} as const;
export function DifficultyBadge({ className, difficulty }: Props) {
  return (
    <Badge
      className={cn(
        `duration-300 ${COLORS_BY_DIFFICULTY[difficulty]} text-white dark:text-black`,
        className,
      )}
    >
      {difficulty}
    </Badge>
  );
}
