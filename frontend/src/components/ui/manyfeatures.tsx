'use client';

import { useState, useEffect } from 'react';
import clsx from 'clsx';
import { motion, type MotionValue, useMotionTemplate,  useMotionValue, } from 'framer-motion';
import { useTheme } from 'next-themes';
import Image from 'next/image';
import { Button } from './Button';
import { CheckCheckIcon, CheckIcon, ReplyIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from './badge';
import { DifficultyBadge } from './difficulty-badge';
import { useInView } from "react-intersection-observer";


interface Step {
  id: string;
  name: string;
}

const steps = [
  { id: '1', name: '💳' },
  { id: '2', name: '📄' },
  { id: '3', name: '📔' },
  { id: '4', name: '🚀' },
];

type WrapperStyle = React.CSSProperties & {
  '--x': MotionValue<string>; 
  '--y': MotionValue<string>; 
};

interface CardProps {
  title: string;
  description: string;
  bgClass?: string;
}

interface Challenge {
  id: number;
  name: string;
  difficulty: string;
}

function FeatureCard({
  title,
  description,
  bgClass,
  children,
}: CardProps & {
  children: React.ReactNode;
}) {
  const [mounted, setMounted] = useState(false);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const isMobile = false;

  function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
    if (isMobile) return;
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <motion.div
      className="animated-feature-cards relative w-full drop-shadow-[0_0_15px_rgba(49,49,49,0.2)] dark:drop-shadow-[0_0_15px_rgba(49,49,49,0.2)]"
      onMouseMove={handleMouseMove}
      style={
        {
          '--x': useMotionTemplate`${mouseX}px`,
          '--y': useMotionTemplate`${mouseY}px`,
        } as WrapperStyle
      }
    >
      <div
        className={clsx(
          'group relative w-full overflow-hidden rounded-3xl border bg-gradient-to-b from-neutral-50/90 to-neutral-100/90 transition duration-300 dark:from-neutral-950/90 dark:to-neutral-800/90',
          'md:hover:border-transparent',
          bgClass,
        )}
      >
        <div className=" min-h-[330px] w-full sm:m-10 md:min-h-[450px]">
          <div className="flex w-5/6 flex-col gap-3 sm:w-4/6 md:w-4/5 xl:w-4/6 items-center justify-center">
            <h2 className="ml-16 text-xl  font-bold tracking-tight md:text-xl text-center">{title}</h2>
            <p className="ml-16 text-sm leading-5 text-zinc-600 dark:text-zinc-400 sm:text-base sm:leading-7 text-center">
              {description}
            </p>
          </div>
          {mounted ? children : null}
        </div>
      </div>
    </motion.div>
  );
}

export function ImageCard({
  image,
  imgClass1,
  imgClass2,
  ...props
}: CardProps & {
  imgClass1?: string;
  imgClass2?: string;
  image: {
    dark1: string;
    dark2: string;
    light1: string;
    light2: string;
    alt: string;
  };
}) {
  const { resolvedTheme } = useTheme();
  return (
    <FeatureCard {...props}>
      <>
        {resolvedTheme === 'light' && (
          <>
            <Image
             width={500}
             height={300}
              alt={image.alt}
              className={imgClass1}
              src={image.light1}
              style={{
                position: 'absolute',
                userSelect: 'none',
                maxWidth: 'unset',
              }}
            />

            <Image
             width={500}
             height={300}
              alt={image.alt}
              className={imgClass2}
              src={image.light2}
              style={{
                position: 'absolute',
                userSelect: 'none',
                maxWidth: 'unset',
              }}
            />
          </>
        )}
        {resolvedTheme === 'dark' && (
          <>
            <Image
             width={500}
             height={300}
              alt={image.alt}
              className={imgClass1}
              src={image.dark1}
              style={{
                position: 'absolute',
                userSelect: 'none',
                maxWidth: 'unset',
              }}
            />
            <Image
             width={500}
             height={300}
              alt={image.alt}
              className={imgClass2}
              src={image.dark2}
              style={{
                position: 'absolute',
                userSelect: 'none',
                maxWidth: 'unset',
              }}
            />
          </>
        )}
      </>
    </FeatureCard>
  );
}

export function CuratedTracksCard(props: CardProps) {
  const TrackChallengeComponent: React.ComponentType<
    React.PropsWithChildren<{ challenge: Challenge }>
  > = MockTrackChallenge;

  return (
    <FeatureCard {...props}>
      <div className="absolute inset-0 top-[60%] flex flex-col items-center justify-center sm:top-[69%] lg:top-[38%]">
        <div className="flex w-[69%] items-center justify-between gap-3 rounded-b-lg rounded-t-xl bg-neutral-500/10 p-2 pl-3 md:w-[82%] xl:w-[69%]">
          <span className="flex items-center gap-1 text-xs font-semibold tracking-wide">
            Golang Challenges
          </span>
        </div>
        <div className="flex w-[69%] flex-col md:w-[82%] xl:w-[69%]">
          {/* mock challenges */}
          {mockChallenges.map((mockChallenge) => (
            <TrackChallengeComponent
              key={`mock-${mockChallenge.id}`}
              challenge={mockChallenge}
            />
          ))}
        </div>
      </div>
    </FeatureCard>
  );
}





export function ChallengeCreationCard({
  image,
  step1img1Class,
  step1img2Class,
  step2img1Class,
  step2img2Class,
  step3imgClass,
  ...props
}: CardProps & {
  step1img1Class?: string;
  step1img2Class?: string;
  step2img1Class?: string;
  step2img2Class?: string;
  step3imgClass?: string;
  image: {
    step1dark1: string;
    step1dark2: string;
    step1light1: string;
    step1light2: string;
    step2dark1: string;
    step2dark2: string;
    step2light1: string;
    step2light2: string;
    step3dark: string;
    step3light: string;
    alt: string;
  };
}) {
  const { resolvedTheme } = useTheme();
  const { currentNumber: step, increment } = useNumberCycler();
 
  return (
    <FeatureCard {...props}>
      <div
        className={clsx(
          { 'translate-x-0 opacity-0': step < 3 },
          'absolute left-1/2 top-1/2 flex w-[80%] -translate-x-1/2 -translate-y-[33%] flex-col gap-12 text-center text-2xl font-bold transition-all duration-500 md:w-[50%]',
        )}
      >
        <div>🎉</div>
        <div className="opacity-80">Thanks for creating a challenge!</div>
      </div>
      {resolvedTheme === 'light' && (
        <>
          {/* step 1 */}
          <Image
  width={500}
  height={300}
  alt={image.alt}
  className={clsx(step1img1Class, { '-translate-x-36 opacity-0': step > 0 })}
  src={image.step1dark1}
  style={{
    position: 'absolute',
    userSelect: 'none',
    maxWidth: 'unset',
  }}
/>
          <Image
         width={500}
         height={300}
            alt={image.alt}
            className={clsx(step1img2Class, { '-translate-x-24 opacity-0': step > 0 })}
            src={image.step1light2}
            style={{
              position: 'absolute',
              userSelect: 'none',
              maxWidth: 'unset',
            }}
          />

          {/* step 2 */}
          <Image
           width={500}
           height={300}
            alt={image.alt}
            className={clsx(
              step2img1Class,
              { 'translate-x-36 opacity-0': step < 1 },
              { '-translate-x-36 opacity-0': step > 1 },
            )}
            src={image.step2light1}
            style={{
              position: 'absolute',
              userSelect: 'none',
              maxWidth: 'unset',
            }}
          />
          <Image
          width={500}
          height={300}
            alt={image.alt}
            className={clsx(
              step2img2Class,
              { 'translate-x-24 opacity-0': step < 1 },
              { '-translate-x-24 opacity-0': step > 1 },
            )}
            src={image.step2light2}
            style={{
              position: 'absolute',
              userSelect: 'none',
              maxWidth: 'unset',
            }}
          />
          {/* step 3 */}
          <Image
           width={500}
           height={300}
            alt={image.alt}
            className={clsx(
              step3imgClass,
              { 'translate-x-36 opacity-0': step < 2 },
              { '-translate-x-36 opacity-0': step > 2 },
              { 'opacity-90': step === 2 },
            )}
            src={image.step3light}
            style={{
              position: 'absolute',
              userSelect: 'none',
              maxWidth: 'unset',
            }}
          />
          <div className="absolute -right-4 bottom-4 w-full">
            <Steps current={step} onChange={() => {}} steps={steps} />
          </div>
        </>
      )}
      {resolvedTheme === 'dark' && (
        <>
          {/* step 1 */}
          <Image
          width={500}
          height={300}
            alt={image.alt}
            className={clsx(step1img1Class, { '-translate-x-36 opacity-0': step > 0 })}
            src={image.step1dark1}
            style={{
              position: 'absolute',
              userSelect: 'none',
              maxWidth: 'unset',
            }}
          />
          <Image
          width={500}
          height={300}
            alt={image.alt}
            className={clsx(step1img2Class, { '-translate-x-24 opacity-0': step > 0 })}
            src={image.step1dark2}
            style={{
              position: 'absolute',
              userSelect: 'none',
              maxWidth: 'unset',
            }}
          />

          {/* step 2 */}
          <Image
          width={500}
          height={300}
            alt={image.alt}
            className={clsx(
              step2img1Class,
              { 'translate-x-36 opacity-0': step < 1 },
              { '-translate-x-36 opacity-0': step > 1 },
            )}
            src={image.step2dark1}
            style={{
              position: 'absolute',
              userSelect: 'none',
              maxWidth: 'unset',
            }}
          />
          <Image
           width={500}
           height={300}
            alt={image.alt}
            className={clsx(
              step2img2Class,
              { 'translate-x-24 opacity-0': step < 1 },
              { '-translate-x-24 opacity-0': step > 1 },
            )}
            src={image.step2dark2}
            style={{
              position: 'absolute',
              userSelect: 'none',
              maxWidth: 'unset',
            }}
          />

          {/* step 3 */}
          <Image
           width={500}
           height={300}
            alt={image.alt}
            className={clsx(
              step3imgClass,
              { 'translate-x-36 opacity-0': step < 2 },
              { '-translate-x-36 opacity-0': step > 2 },
              { 'opacity-90': step === 2 },
            )}
            src={image.step3dark}
            style={{
              position: 'absolute',
              userSelect: 'none',
              maxWidth: 'unset',
            }}
          />
          <div className="absolute -right-4 bottom-4 w-full">
            <Steps current={step} onChange={() => {}} steps={steps} />
          </div>
        </>
      )}
      <div
        className="absolute left-0 top-0 z-50 h-full w-full cursor-pointer"
        onClick={() => increment()}
      />
    </FeatureCard>
  );
}



export function CollaborativeEnvironmentCard(props: CardProps) {
  const { ref, inView } = useInView({
    triggerOnce: true,
  });

  return (
    <FeatureCard {...props}>
      <motion.div
        ref={ref}
        className="absolute inset-0 flex w-full flex-col gap-3 pt-4 max-md:scale-90 sm:left-[33px] sm:top-[35%] md:left-[37px] md:top-[30%]"
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : { opacity: 0 }}
      >
        <motion.div
          className="rounded-l-3xl bg-neutral-500/10 p-4 pt-3 md:hover:bg-neutral-500/20"
        >
          <div className="flex items-center gap-2">
            <Badge variant="default" >@nikita</Badge>
            <div className="text-xs text-neutral-500">5 years ago</div>
          </div>
          <span >Golang is hard, can anyone help?</span>
        </motion.div>
        <motion.div
          className="ml-12 rounded-l-3xl bg-neutral-500/10 p-4 pt-3 md:hover:bg-neutral-500/20"
        >
          <ReplyIcon className="absolute -left-8 h-4 w-4 opacity-50" />
          <div className="flex items-center gap-2">
            <Badge  variant="secondary">@Niko</Badge>
            <div className="text-xs text-neutral-500">just now</div>
          </div>
          ez, the answer is
          SHUT DOWN BRO
        </motion.div>
        <motion.div
          className="ml-12 rounded-tl-3xl bg-neutral-500/10 p-4 pt-3 md:hover:bg-neutral-500/20"
        >
          <ReplyIcon className="absolute -left-8 h-4 w-4 opacity-50" />
          <div className="flex items-center gap-2">
            <Badge variant="secondary" >@Niko</Badge>
            <div className="text-xs text-neutral-500">just now</div>
          </div>
          <Image
           
            alt="amoguwuawa"
            src="/images/aggresive.png"
            height="198"
            width="150"
          />
         
        </motion.div>
      </motion.div>
    </FeatureCard>
  );
}







type ChallengeDifficulty = 'BEGINNER' | 'EASY' | 'MEDIUM' | 'HARD' | 'EXTREME' | 'EVENT';

interface MockTrackChallenge {
  difficulty: ChallengeDifficulty;
  id: number;
  name: string;
}

const mockChallenges: MockTrackChallenge[] = [
  {
    id: 1,
    name: 'Generics',
    difficulty: 'BEGINNER',
  },
  {
    id: 2,
    name: 'Infer',
    difficulty: 'EASY',
  },
  {
    id: 3,
    name: 'Map Types',
    difficulty: 'MEDIUM',
  },
  {
    id: 4,
    name: 'Array/Object',
    difficulty: 'HARD',
  },
  {
    id: 5,
    name: 'Classes',
    difficulty: 'EXTREME',
  },
];

function useNumberCycler() {
  const [currentNumber, setCurrentNumber] = useState(0);
  const [dummy, setDummy] = useState(0);

  const increment = () => {
    setCurrentNumber((prevNumber) => {
      return (prevNumber + 1) % 4;
    });

    setDummy((prev) => prev + 1);
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentNumber((prevNumber) => {
        return (prevNumber + 1) % 4;
      });
    }, 5000);

    return () => {
      clearInterval(intervalId);
    };
  }, [dummy]);

  return {
    increment,
    currentNumber,
  };
}



export function MockTrackChallenge({ challenge }: { challenge: MockTrackChallenge }) {
  
  return (
    <label
      htmlFor={challenge.id.toString()}
      className="group/challenge flex cursor-pointer flex-col items-center pt-2"
    >
      <div
        className={cn(
          'relative',
          'flex w-full items-center justify-between gap-3 overflow-hidden rounded-lg',
          'bg-gradient-to-r from-neutral-500/10 from-70% to-100% dark:from-neutral-500/20',
          'p-2 pl-3 text-black/90 duration-300 group-active/challenge:bg-neutral-500/40 group-active/challenge:duration-75 dark:text-white/90 md:p-4',
          
             
          
        )}
      >
        <div className="relative flex flex-row items-center gap-3 text-sm sm:text-base">
          <input
            className="peer absolute appearance-none"
            type="checkbox"
            id={challenge.id.toString()}
            tabIndex={-1}
          />
          <div className="h-4 w-4 rounded-full border border-black/70 bg-black/10 duration-75 peer-checked:border-transparent peer-checked:bg-green-600/80 dark:border-white/50 dark:bg-white/10 peer-checked:dark:bg-green-300/80 sm:h-5 sm:w-5" />
          <CheckIcon className="absolute left-1 my-auto h-2 w-2 scale-0 stroke-[4] text-white duration-300 peer-checked:scale-100 dark:text-black sm:h-3 sm:w-3" />
          {challenge.name}
        </div>
        <div className="translate-x-1 scale-75 sm:translate-x-0 sm:scale-100">
        <DifficultyBadge difficulty={challenge.difficulty} />
        </div>
      </div>
    </label>
  );
}




interface Props<T extends Step> {
  current: number;
  steps: T[];
  onChange: (index: number) => void;
}

export function Steps<T extends Step>({ steps, current, onChange }: Props<T>) {
  return (
    <nav aria-label="Progress" className="flex justify-center px-4 lg:-mt-[56px]">
      <ol
        className="flex w-full flex-wrap items-start justify-start gap-2 divide-y sm:justify-center md:w-10/12 md:divide-y-0"
        role="list"
      >
        {steps.map((step, stepIdx) => {
          const isCompleted = current > stepIdx;
          const isCurrent = current === stepIdx;
          const isFuture = !isCompleted && !isCurrent;
          return (
            // z-50 makes it sit above navbar.tsx for pointer-events to work since the <nav> container is -mt-[56px]
            <li
              className={clsx(
                'relative z-50 rounded-full py-1 pl-[0.4rem] pr-3 transition-all duration-300 ease-in-out md:flex',
                isCompleted ? 'bg-emerald-500/20' : 'bg-gray-500/10',
              )}
              key={step.name}
            >
              <div
                className={clsx(
                  'group flex w-full cursor-pointer items-center focus:outline-none focus-visible:ring-2',
                  (isFuture || isCurrent) && 'pointer-events-none',
                )}
                onClick={() => onChange(stepIdx)}
              >
                <span className="flex items-center gap-2 text-sm font-medium">
                  <span
                    className={clsx(
                      'flex flex-shrink-0 items-center justify-center rounded-full duration-300',
                      isCompleted && 'h-4 w-4 bg-emerald-700 text-white dark:bg-emerald-400',
                      isCurrent && 'h-5 w-8 bg-gray-500/30 p-2 dark:bg-gray-500/50',
                      isFuture && 'h-5 w-5 bg-gray-500/10 p-2 dark:bg-gray-500/20',
                    )}
                  >
                    {isCompleted ? (
                      <CheckCheckIcon
                        className="h-3 w-3 stroke-white stroke-[3] dark:stroke-black"
                        size={20}
                      />
                    ) : (
                      <span className={clsx('text-xs', !isCurrent && 'text-gray-500')}>
                        {stepIdx + 1}
                      </span>
                    )}
                  </span>
                  <span
                    className={clsx(
                      'text-sm font-medium duration-300',
                      isCompleted && 'text-emerald-700 dark:text-emerald-500',
                      isFuture && 'text-gray-500',
                    )}
                  >
                    {step.name}
                  </span>
                </span>
              </div>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}





