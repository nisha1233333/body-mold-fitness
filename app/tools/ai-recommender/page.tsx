'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import ProductCard from '@/components/product-card';
import { Button } from '@/components/ui/button';
import { Product } from '@/lib/types';
import { Sparkles, ArrowRight, ArrowLeft, CircleCheck as CheckCircle2 } from 'lucide-react';

type TrainingGoal = 'powerlifting' | 'crossfit' | 'olympic' | 'general';
type ExperienceLevel = 'beginner' | 'intermediate' | 'advanced';
type BeltPreference = 'lever' | 'prong' | 'velcro' | 'no_preference';
type Budget = 'budget' | 'mid' | 'premium' | 'no_preference';

interface QuestionnaireAnswers {
  goal: TrainingGoal | null;
  experience: ExperienceLevel | null;
  preference: BeltPreference | null;
  budget: Budget | null;
}

const STEPS = [
  {
    key: 'goal' as const,
    title: 'What is your primary training style?',
    subtitle: 'This helps us recommend the right belt for your sport.',
    options: [
      { value: 'powerlifting' as TrainingGoal, label: 'Powerlifting', description: 'Heavy squats, deadlifts, bench press' },
      { value: 'crossfit' as TrainingGoal, label: 'CrossFit / Functional', description: 'WODs, varied movements, quick transitions' },
      { value: 'olympic' as TrainingGoal, label: 'Olympic Weightlifting', description: 'Cleans, snatches, overhead work' },
      { value: 'general' as TrainingGoal, label: 'General Training', description: 'Mix of strength, conditioning, and accessories' },
    ],
  },
  {
    key: 'experience' as const,
    title: 'What is your lifting experience?',
    subtitle: 'We will match belt thickness and rigidity to your level.',
    options: [
      { value: 'beginner' as ExperienceLevel, label: 'Beginner', description: 'Less than 1 year of consistent training' },
      { value: 'intermediate' as ExperienceLevel, label: 'Intermediate', description: '1-3 years of consistent training' },
      { value: 'advanced' as ExperienceLevel, label: 'Advanced', description: '3+ years of consistent training' },
    ],
  },
  {
    key: 'preference' as const,
    title: 'What closure type do you prefer?',
    subtitle: 'Each has pros and cons depending on your training style.',
    options: [
      { value: 'lever' as BeltPreference, label: 'Lever Buckle', description: 'Fastest on/off, most convenient' },
      { value: 'prong' as BeltPreference, label: 'Prong Buckle', description: 'Most precise fit, nearly indestructible' },
      { value: 'velcro' as BeltPreference, label: 'Velcro Closure', description: 'Lightweight, quick transitions' },
      { value: 'no_preference' as BeltPreference, label: 'No Preference', description: 'Let us decide based on your other answers' },
    ],
  },
  {
    key: 'budget' as const,
    title: 'What is your budget range?',
    subtitle: 'We have quality options at every price point.',
    options: [
      { value: 'budget' as Budget, label: 'Under $50', description: 'Great value belts for beginners' },
      { value: 'mid' as Budget, label: '$50 - $100', description: 'Premium quality at a fair price' },
      { value: 'premium' as Budget, label: '$100+', description: 'Competition-grade, built for life' },
      { value: 'no_preference' as Budget, label: 'No Preference', description: 'Show me the best regardless of price' },
    ],
  },
];

function getTagFilters(answers: QuestionnaireAnswers): string[] {
  const tags: string[] = [];

  switch (answers.goal) {
    case 'powerlifting':
      tags.push('powerlifting', 'ipf', 'lever', 'prong', 'leather', 'rigid');
      break;
    case 'crossfit':
      tags.push('velcro', 'crossfit', 'neoprene', 'lightweight', 'contoured');
      break;
    case 'olympic':
      tags.push('tapered', 'olympic', 'leather', 'versatile');
      break;
    case 'general':
      tags.push('versatile', 'lever', 'leather', 'nylon');
      break;
  }

  if (answers.experience === 'beginner') {
    tags.push('lightweight', 'beginner', 'nylon', 'velcro');
  } else if (answers.experience === 'advanced') {
    tags.push('premium', 'elite', '13mm', 'competition');
  }

  if (answers.preference === 'lever') tags.push('lever');
  else if (answers.preference === 'prong') tags.push('prong');
  else if (answers.preference === 'velcro') tags.push('velcro', 'neoprene');

  return tags;
}

export default function AIRecommenderPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<QuestionnaireAnswers>({
    goal: null, experience: null, preference: null, budget: null,
  });
  const [recommendations, setRecommendations] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [completed, setCompleted] = useState(false);

  const currentQuestion = STEPS[currentStep];
  const isLastStep = currentStep === STEPS.length - 1;
  const canProceed = answers[currentQuestion.key] !== null;

  const handleSelect = (key: keyof QuestionnaireAnswers, value: string) => {
    setAnswers((prev) => ({ ...prev, [key]: value }));
  };

  const handleNext = () => {
    if (isLastStep) {
      fetchRecommendations();
    } else {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) setCurrentStep((prev) => prev - 1);
  };

  const handleRestart = () => {
    setCurrentStep(0);
    setAnswers({ goal: null, experience: null, preference: null, budget: null });
    setRecommendations([]);
    setCompleted(false);
  };

  const fetchRecommendations = async () => {
    setLoading(true);
    try {
      const tags = getTagFilters(answers);
      const { data } = await supabase.from('products').select('*, category:categories(*)').eq('is_active', true);

      if (data) {
        let filtered = data.filter((product: Product) => {
          const productTags = (product.tags || []).map((t: string) => t.toLowerCase());
          return productTags.some((tag: string) =>
            tags.some((t) => tag.includes(t.toLowerCase()) || t.toLowerCase().includes(tag))
          );
        });

        // Budget filter
        if (answers.budget === 'budget') {
          filtered = filtered.filter((p: Product) => p.price < 50);
        } else if (answers.budget === 'mid') {
          filtered = filtered.filter((p: Product) => p.price >= 50 && p.price <= 100);
        } else if (answers.budget === 'premium') {
          filtered = filtered.filter((p: Product) => p.price > 100);
        }

        // Sort by relevance
        filtered.sort((a: Product, b: Product) => {
          const aTags = (a.tags || []).map((t: string) => t.toLowerCase());
          const bTags = (b.tags || []).map((t: string) => t.toLowerCase());
          const aScore = tags.filter((t) => aTags.some((at: string) => at.includes(t.toLowerCase()) || t.toLowerCase().includes(at))).length;
          const bScore = tags.filter((t) => bTags.some((bt: string) => bt.includes(t.toLowerCase()) || t.toLowerCase().includes(bt))).length;
          return bScore - aScore;
        });

        setRecommendations(filtered.slice(0, 4));
      }
    } catch {
      setRecommendations([]);
    } finally {
      setLoading(false);
      setCompleted(true);
    }
  };

  const labelMap = (val: string | null, map: Record<string, string>) => val ? map[val] || val : '';

  return (
    <div className="min-h-screen">
      <section className="relative py-16 sm:py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-background" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Sparkles className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold mb-3">
              Find Your <span className="gradient-text">Perfect Belt</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Answer a few questions and we will recommend the best gym belt tailored to your training style, experience, and preferences.
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {!completed ? (
          <div className="glass-card p-6 sm:p-8">
            <div className="mb-8">
              <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                <span>Step {currentStep + 1} of {STEPS.length}</span>
                <span>{Math.round(((currentStep + 1) / STEPS.length) * 100)}%</span>
              </div>
              <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                <div className="h-full rounded-full bg-primary transition-all duration-500" style={{ width: `${((currentStep + 1) / STEPS.length) * 100}%` }} />
              </div>
            </div>

            <div className="flex items-center justify-center gap-2 mb-8">
              {STEPS.map((_, i) => (
                <div key={i} className={`h-2 w-2 rounded-full transition-all ${i < currentStep ? 'bg-primary' : i === currentStep ? 'bg-primary scale-125' : 'bg-white/20'}`} />
              ))}
            </div>

            <div className="text-center mb-6">
              <h2 className="text-xl font-semibold mb-1">{currentQuestion.title}</h2>
              <p className="text-sm text-muted-foreground">{currentQuestion.subtitle}</p>
            </div>

            <div className="space-y-3 mb-8">
              {currentQuestion.options.map((option) => {
                const isSelected = answers[currentQuestion.key] === option.value;
                return (
                  <button key={option.value} onClick={() => handleSelect(currentQuestion.key, option.value)} className={`w-full text-left p-4 rounded-lg border transition-all ${isSelected ? 'bg-primary/10 border-primary/30 text-primary' : 'bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/10'}`}>
                    <div className="flex items-center gap-3">
                      <div className={`h-5 w-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${isSelected ? 'border-primary bg-primary' : 'border-white/30'}`}>
                        {isSelected && <CheckCircle2 className="h-3.5 w-3.5 text-primary-foreground" />}
                      </div>
                      <div>
                        <p className="font-medium text-sm">{option.label}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{option.description}</p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="flex items-center justify-between">
              <Button variant="outline" onClick={handleBack} disabled={currentStep === 0} className="border-white/10 hover:bg-white/5">
                <ArrowLeft className="h-4 w-4 mr-2" /> Back
              </Button>
              <Button onClick={handleNext} disabled={!canProceed} className="bg-primary hover:bg-primary/90 text-primary-foreground">
                {isLastStep ? <><Sparkles className="h-4 w-4 mr-2" /> Find My Belt</> : <>Next <ArrowRight className="h-4 w-4 ml-2" /></>}
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="glass-card p-6 sm:p-8">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-semibold">Your Profile</h2>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: 'Training Style', value: labelMap(answers.goal, { powerlifting: 'Powerlifting', crossfit: 'CrossFit', olympic: 'Olympic Weightlifting', general: 'General Training' }) },
                  { label: 'Experience', value: labelMap(answers.experience, { beginner: 'Beginner', intermediate: 'Intermediate', advanced: 'Advanced' }) },
                  { label: 'Closure Type', value: labelMap(answers.preference, { lever: 'Lever Buckle', prong: 'Prong Buckle', velcro: 'Velcro', no_preference: 'No Preference' }) },
                  { label: 'Budget', value: labelMap(answers.budget, { budget: 'Under $50', mid: '$50-$100', premium: '$100+', no_preference: 'No Preference' }) },
                ].map((item) => (
                  <div key={item.label} className="p-3 rounded-lg bg-white/5">
                    <p className="text-xs text-muted-foreground mb-1">{item.label}</p>
                    <p className="text-sm font-medium">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>

            {loading && (
              <div className="glass-card p-12 text-center">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4 animate-pulse">
                  <Sparkles className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Analyzing your profile...</h3>
                <p className="text-sm text-muted-foreground">Finding the best belts for your needs.</p>
              </div>
            )}

            {!loading && (
              <>
                {recommendations.length > 0 ? (
                  <>
                    <div className="text-center mb-2">
                      <h2 className="text-xl font-semibold">Recommended Belts For You</h2>
                      <p className="text-sm text-muted-foreground mt-1">Based on your profile, these belts are a great fit:</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      {recommendations.map((product) => (
                        <ProductCard key={product.id} product={product} />
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="glass-card p-12 text-center">
                    <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                      <Sparkles className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">No exact matches found</h3>
                    <p className="text-sm text-muted-foreground mb-6 max-w-md mx-auto">
                      We could not find belts matching all your criteria. Browse our full catalog to find what works for you.
                    </p>
                    <Link href="/shop">
                      <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">Browse All Belts</Button>
                    </Link>
                  </div>
                )}
              </>
            )}

            <div className="text-center">
              <Button variant="outline" onClick={handleRestart} className="border-white/10 hover:bg-white/5">
                <ArrowLeft className="h-4 w-4 mr-2" /> Retake Questionnaire
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
