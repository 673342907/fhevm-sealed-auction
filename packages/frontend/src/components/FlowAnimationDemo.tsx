'use client';

import { useState, useEffect, useRef } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

interface Step {
  title: string;
  description: string;
  icon: string;
  duration: number;
}

export default function FlowAnimationDemo() {
  const { t } = useLanguage();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; delay: number }>>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  const steps: Step[] = [
    {
      title: t.home.stepConnectWallet || 'Connect Wallet',
      description: t.home.stepConnectWalletDesc || 'Click "Connect Wallet" button, confirm connection in MetaMask to enable encrypted voting',
      icon: '🔗',
      duration: 3500,
    },
    {
      title: t.home.stepSelectContract || 'Select Contract Address',
      description: t.home.stepSelectContractDesc || 'Click "Quick Experience" button to use the deployed contract, or select another preset address',
      icon: '📝',
      duration: 3500,
    },
    {
      title: t.home.stepCreateProposal || 'Create Proposal',
      description: t.home.stepCreateProposalDesc || 'Fill in the proposal title and description, set voting duration, optionally enable weighted voting, then click "Create Proposal"',
      icon: '📋',
      duration: 4000,
    },
    {
      title: t.home.stepVote || 'Participate in Voting',
      description: t.home.stepVoteDesc || 'Select "Support" or "Oppose" for active proposals. Your vote will be encrypted using FHEVM and stored on-chain',
      icon: '🗳️',
      duration: 4000,
    },
    {
      title: t.home.stepViewResults || 'View Results',
      description: t.home.stepViewResultsDesc || 'After voting ends, click "View Results" to decrypt and view the voting results. All votes are automatically decrypted in batch',
      icon: '📊',
      duration: 3500,
    },
  ];

  // Generate particles for visual effects
  useEffect(() => {
    if (isPlaying && currentStep < steps.length) {
      const newParticles = Array.from({ length: 20 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        delay: Math.random() * 2,
      }));
      setParticles(newParticles);
    }
  }, [isPlaying, currentStep]);

  useEffect(() => {
    if (!isPlaying) {
      setParticles([]);
      return;
    }

    const step = steps[currentStep];
    if (!step) {
      // All steps completed, auto stop
      setIsPlaying(false);
      setCurrentStep(0);
      setProgress(0);
      setParticles([]);
      return;
    }

    // Progress bar animation with smooth easing
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        const increment = 100 / (step.duration / 20);
        const newProgress = Math.min(prev + increment, 100);
        if (newProgress >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return newProgress;
      });
    }, 20);

    // Step transition timer with celebration effect
    const stepTimer = setTimeout(() => {
      clearInterval(progressInterval);
      if (currentStep < steps.length - 1) {
        // Create celebration particles
        const celebrationParticles = Array.from({ length: 30 }, (_, i) => ({
          id: Date.now() + i,
          x: 50 + (Math.random() - 0.5) * 40,
          y: 50 + (Math.random() - 0.5) * 40,
          delay: Math.random() * 0.5,
        }));
        setParticles(celebrationParticles);
        
        // Auto advance to next step with delay for celebration
        setTimeout(() => {
          setCurrentStep((prev) => prev + 1);
          setProgress(0);
        }, 300);
      } else {
        // All steps completed, stop playing
        setTimeout(() => {
          setIsPlaying(false);
          setCurrentStep(0);
          setProgress(0);
          setParticles([]);
        }, 500);
      }
    }, step.duration);

    return () => {
      clearInterval(progressInterval);
      clearTimeout(stepTimer);
    };
  }, [isPlaying, currentStep, steps]);

  const handlePlay = () => {
    setIsPlaying(true);
    setCurrentStep(0);
    setProgress(0);
  };

  const handleStop = () => {
    setIsPlaying(false);
    setCurrentStep(0);
    setProgress(0);
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
      setProgress(0);
    } else {
      handleStop();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      setProgress(0);
    }
  };

  return (
    <div 
      ref={containerRef}
      className="relative bg-gradient-to-br from-zama-950/40 via-zama-900/20 to-zama-950/40 dark:from-zama-950/60 dark:via-zama-900/40 dark:to-zama-950/60 rounded-xl shadow-lg border-2 border-zama-500/50 dark:border-zama-500/60 p-6 backdrop-blur-sm overflow-hidden"
    >
      {/* Animated background particles */}
      {isPlaying && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-xl">
          {particles.map((particle) => (
            <div
              key={particle.id}
              className="absolute w-2 h-2 bg-zama-500 rounded-full animate-particle-float opacity-70"
              style={{
                left: `${particle.x}%`,
                top: `${particle.y}%`,
                animationDelay: `${particle.delay}s`,
                boxShadow: '0 0 10px rgba(245, 158, 11, 0.8), 0 0 20px rgba(245, 158, 11, 0.4)',
              }}
            />
          ))}
          {/* Flowing light effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-zama-500/20 to-transparent animate-flow-light" />
        </div>
      )}
      <div className="relative z-10 flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
          <span className={`text-2xl transition-all duration-300 ${isPlaying ? 'animate-spin-slow scale-110' : ''}`}>🎬</span>
          <span className="bg-gradient-to-r from-zama-400 via-zama-500 to-zama-400 bg-clip-text text-transparent">
            {t.home.flowDemo || 'Full Flow Animation Demo'}
          </span>
        </h3>
        <div className="flex gap-2">
          {!isPlaying ? (
            <button
              onClick={handlePlay}
              className="relative px-6 py-3 bg-gradient-to-r from-zama-500 via-zama-400 to-zama-500 text-black rounded-lg font-bold hover:from-zama-400 hover:via-zama-300 hover:to-zama-400 transition-all shadow-lg shadow-zama-500/50 flex items-center gap-2 overflow-hidden group"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
              <span className="relative z-10 text-xl animate-pulse">▶️</span>
              <span className="relative z-10">{t.home.playDemo || 'Play Demo'}</span>
            </button>
          ) : (
            <button
              onClick={handleStop}
              className="px-4 py-2 bg-zinc-700 text-white rounded-lg font-bold hover:bg-zinc-600 transition-all flex items-center gap-2 shadow-lg"
            >
              <span>⏹️</span>
              <span>{t.home.stopDemo || 'Stop'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Step indicators with enhanced animations */}
      <div className="relative z-10 flex items-center justify-between mb-6">
        {steps.map((step, index) => (
          <div key={index} className="flex-1 flex flex-col items-center">
            <div className="relative w-full flex items-center">
              {/* Connection line with enhanced animation */}
              {index < steps.length - 1 && (
                <div
                  className={`absolute left-1/2 top-1/2 w-full h-1.5 transform -translate-y-1/2 transition-all duration-700 rounded-full ${
                    index < currentStep
                      ? 'bg-gradient-to-r from-zama-500 via-zama-400 to-zama-500 shadow-lg shadow-zama-500/50'
                      : index === currentStep && isPlaying
                      ? 'bg-gradient-to-r from-zama-500/50 via-zama-400/30 to-zama-500/50 animate-pulse'
                      : 'bg-zinc-700'
                  }`}
                  style={{
                    width: 'calc(100% - 2rem)',
                    left: 'calc(50% + 1rem)',
                  }}
                >
                  {index < currentStep && isPlaying && (
                    <>
                      <div className="absolute inset-0 bg-zama-400 animate-ping opacity-75 rounded-full" />
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent animate-shimmer rounded-full" />
                    </>
                  )}
                  {index === currentStep && isPlaying && (
                    <div className="absolute inset-0 bg-gradient-to-r from-zama-400 via-zama-500 to-zama-400 animate-flow-line rounded-full" />
                  )}
                </div>
              )}
              {/* Step circle with stunning animation */}
              <div
                className={`relative z-10 w-16 h-16 rounded-full flex items-center justify-center text-3xl font-bold transition-all duration-700 ${
                  index < currentStep
                    ? 'bg-gradient-to-br from-zama-400 via-zama-500 to-zama-600 text-black scale-110 shadow-2xl shadow-zama-500/60 ring-4 ring-zama-500/40 animate-pulse-glow'
                    : index === currentStep
                    ? isPlaying
                      ? 'bg-gradient-to-br from-zama-400 via-zama-500 to-zama-600 text-black scale-125 animate-bounce ring-4 ring-zama-500/60 shadow-2xl shadow-zama-500/80 animate-pulse-glow'
                      : 'bg-zama-500/50 text-zinc-300 scale-100'
                    : 'bg-zinc-700 text-zinc-400 scale-100'
                }`}
                style={{
                  transform: index === currentStep && isPlaying 
                    ? 'scale(1.25) rotate(360deg)' 
                    : index < currentStep 
                    ? 'scale(1.1)' 
                    : 'scale(1)',
                  transition: 'all 0.7s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
                }}
              >
                {/* Glowing effect */}
                {(index === currentStep && isPlaying) && (
                  <div className="absolute inset-0 rounded-full bg-zama-400 animate-ping opacity-50" />
                )}
                {index < currentStep ? (
                  <span className="relative z-10 text-3xl animate-scale-in drop-shadow-lg">✓</span>
                ) : (
                  <span 
                    className={`relative z-10 ${index === currentStep && isPlaying ? 'animate-spin-slow scale-110' : ''}`}
                    style={{
                      filter: index === currentStep && isPlaying ? 'drop-shadow(0 0 10px rgba(245, 158, 11, 0.8))' : 'none',
                    }}
                  >
                    {step.icon}
                  </span>
                )}
              </div>
            </div>
            <div className="mt-2 text-center">
              <div
                className={`text-xs font-semibold ${
                  index === currentStep ? 'text-zama-500' : 'text-zinc-500'
                }`}
              >
                {step.title}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Current step details with stunning animation */}
      {steps[currentStep] && (
        <div 
          className={`relative z-10 bg-black/95 dark:bg-black rounded-xl border-2 border-zama-500/50 dark:border-zama-500/60 p-8 mb-4 transition-all duration-700 overflow-hidden ${
            isPlaying ? 'animate-pulse-glow shadow-2xl shadow-zama-500/40 scale-[1.02]' : ''
          }`}
          style={{
            background: isPlaying 
              ? 'linear-gradient(135deg, rgba(0,0,0,0.95) 0%, rgba(245,158,11,0.1) 50%, rgba(0,0,0,0.95) 100%)'
              : 'rgba(0,0,0,0.95)',
          }}
        >
          {/* Animated background gradient */}
          {isPlaying && (
            <div className="absolute inset-0 bg-gradient-to-r from-zama-500/10 via-zama-400/20 to-zama-500/10 animate-flow-gradient" />
          )}
          
          <div className="relative z-10 flex items-start gap-6">
            <div 
              className={`text-6xl transition-all duration-700 relative ${
                isPlaying ? 'animate-bounce scale-125' : ''
              }`}
              style={{
                filter: isPlaying ? 'drop-shadow(0 0 20px rgba(245, 158, 11, 0.8))' : 'none',
                transform: isPlaying ? 'rotate(360deg) scale(1.25)' : 'rotate(0deg) scale(1)',
              }}
            >
              {steps[currentStep].icon}
              {isPlaying && (
                <div className="absolute inset-0 text-6xl animate-ping opacity-30">
                  {steps[currentStep].icon}
                </div>
              )}
            </div>
            <div className="flex-1">
              <h4 
                className={`text-3xl font-bold mb-4 transition-all duration-500 ${
                  isPlaying 
                    ? 'text-transparent bg-clip-text bg-gradient-to-r from-zama-400 via-zama-300 to-zama-400 animate-shimmer-text' 
                    : 'text-zinc-100'
                }`}
              >
                {steps[currentStep].title}
              </h4>
              <p className="text-zinc-300 text-base leading-relaxed">
                {steps[currentStep].description}
              </p>
            </div>
          </div>

          {/* Stunning progress bar */}
          {isPlaying && (
            <div className="relative z-10 mt-8">
              <div className="w-full bg-zinc-900 rounded-full h-4 overflow-hidden shadow-inner border border-zama-500/30">
                <div
                  className="bg-gradient-to-r from-zama-400 via-zama-500 via-zama-400 to-zama-600 h-full rounded-full transition-all duration-200 ease-out relative overflow-hidden"
                  style={{ width: `${progress}%` }}
                >
                  {/* Multiple shimmer layers */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer" />
                  <div className="absolute inset-0 bg-gradient-to-r from-zama-300/50 via-transparent to-zama-300/50 animate-shimmer-delayed" />
                  
                  {/* Glowing edge */}
                  <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-zama-500 via-zama-400 to-transparent blur-sm" />
                  
                  {/* Sparkle particles */}
                  {progress > 10 && (
                    <div 
                      className="absolute top-1/2 right-2 w-2 h-2 bg-white rounded-full animate-pulse"
                      style={{ 
                        transform: 'translateY(-50%)',
                        boxShadow: '0 0 10px rgba(255,255,255,0.8), 0 0 20px rgba(245,158,11,0.6)',
                      }}
                    />
                  )}
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between">
                <div className="text-sm font-bold text-zama-400 animate-pulse">
                  {Math.round(progress)}%
                </div>
                <div className="text-xs text-zinc-500">
                  Step {currentStep + 1} of {steps.length}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Control buttons */}
      <div className="relative z-10 flex items-center justify-between">
        <button
          onClick={handlePrev}
          disabled={currentStep === 0 || isPlaying}
          className="px-4 py-2 bg-zinc-700 text-white rounded-lg font-medium hover:bg-zinc-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
        >
          <span>◀️</span>
          <span>{t.home.prev || 'Previous'}</span>
        </button>

        <div className="text-sm text-zinc-400">
          {currentStep + 1} / {steps.length}
        </div>

        <button
          onClick={handleNext}
          disabled={currentStep === steps.length - 1 || isPlaying}
          className="px-4 py-2 bg-zinc-700 text-white rounded-lg font-medium hover:bg-zinc-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
        >
          <span>{t.home.next || 'Next'}</span>
          <span>▶️</span>
        </button>
      </div>
    </div>
  );
}

