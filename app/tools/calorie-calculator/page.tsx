'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calculator, Flame, Utensils } from 'lucide-react';

type Gender = 'male' | 'female';
type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
type Goal = 'lose' | 'maintain' | 'gain';

interface CalorieResult {
  bmr: number;
  tdee: number;
  goalCalories: number;
  goalLabel: string;
  macros: {
    protein: { grams: number; calories: number; percent: number };
    carbs: { grams: number; calories: number; percent: number };
    fat: { grams: number; calories: number; percent: number };
  };
  beltRecommendations: { name: string; slug: string; reason: string }[];
}

const ACTIVITY_MULTIPLIERS: Record<ActivityLevel, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  very_active: 1.9,
};

const ACTIVITY_LABELS: Record<ActivityLevel, string> = {
  sedentary: 'Sedentary (little or no exercise)',
  light: 'Lightly Active (1-3 days/week)',
  moderate: 'Moderately Active (3-5 days/week)',
  active: 'Active (6-7 days/week)',
  very_active: 'Very Active (intense daily exercise)',
};

const GOAL_ADJUSTMENTS: Record<Goal, { modifier: number; label: string }> = {
  lose: { modifier: -500, label: 'Lose Weight' },
  maintain: { modifier: 0, label: 'Maintain Weight' },
  gain: { modifier: 400, label: 'Gain Muscle' },
};

function calculateMifflinStJeor(
  gender: Gender,
  weightKg: number,
  heightCm: number,
  age: number,
  activity: ActivityLevel,
  goal: Goal
): CalorieResult {
  // Mifflin-St Jeor equation
  const bmr =
    gender === 'male'
      ? 10 * weightKg + 6.25 * heightCm - 5 * age + 5
      : 10 * weightKg + 6.25 * heightCm - 5 * age - 161;

  const tdee = Math.round(bmr * ACTIVITY_MULTIPLIERS[activity]);
  const goalAdjustment = GOAL_ADJUSTMENTS[goal].modifier;
  const goalCalories = Math.round(tdee + goalAdjustment);

  // Macro breakdown based on goal
  let proteinRatio: number;
  let carbRatio: number;
  let fatRatio: number;

  if (goal === 'lose') {
    proteinRatio = 0.35;
    carbRatio = 0.35;
    fatRatio = 0.30;
  } else if (goal === 'gain') {
    proteinRatio = 0.30;
    carbRatio = 0.45;
    fatRatio = 0.25;
  } else {
    proteinRatio = 0.30;
    carbRatio = 0.40;
    fatRatio = 0.30;
  }

  const macros = {
    protein: {
      grams: Math.round((goalCalories * proteinRatio) / 4),
      calories: Math.round(goalCalories * proteinRatio),
      percent: Math.round(proteinRatio * 100),
    },
    carbs: {
      grams: Math.round((goalCalories * carbRatio) / 4),
      calories: Math.round(goalCalories * carbRatio),
      percent: Math.round(carbRatio * 100),
    },
    fat: {
      grams: Math.round((goalCalories * fatRatio) / 9),
      calories: Math.round(goalCalories * fatRatio),
      percent: Math.round(fatRatio * 100),
    },
  };

  const beltMap: Record<Goal, { name: string; slug: string; reason: string }[]> = {
    lose: [
      { name: 'FlexCore Velcro Belt', slug: 'flexcore-velcro-belt', reason: 'Lightweight support for high-rep cutting workouts' },
      { name: 'Nylon Training Belt', slug: 'nylon-training-belt', reason: 'Flexible and breathable for cardio-intense sessions' },
    ],
    maintain: [
      { name: 'Stealth Tapered Belt', slug: 'stealth-tapered-belt', reason: 'Versatile for all training styles and movements' },
      { name: 'Titan Pro Lever Belt', slug: 'titan-pro-lever-belt', reason: 'All-around support for consistent training' },
    ],
    gain: [
      { name: 'Forge Lever Belt 13mm', slug: 'forge-lever-belt-13mm', reason: 'Maximum rigidity for heavy compound lifts' },
      { name: 'Ironclad Single Prong Belt', slug: 'ironclad-single-prong-belt', reason: 'Classic support for progressive overload' },
    ],
  };

  return {
    bmr: Math.round(bmr),
    tdee,
    goalCalories,
    goalLabel: GOAL_ADJUSTMENTS[goal].label,
    macros,
    beltRecommendations: beltMap[goal],
  };
}

export default function CalorieCalculatorPage() {
  const [age, setAge] = useState('');
  const [gender, setGender] = useState<Gender>('male');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [activity, setActivity] = useState<ActivityLevel>('moderate');
  const [goal, setGoal] = useState<Goal>('maintain');
  const [result, setResult] = useState<CalorieResult | null>(null);
  const [error, setError] = useState('');

  const handleCalculate = () => {
    setError('');
    setResult(null);

    const ageNum = parseInt(age);
    const weightNum = parseFloat(weight);
    const heightNum = parseFloat(height);

    if (isNaN(ageNum) || isNaN(weightNum) || isNaN(heightNum)) {
      setError('Please fill in all fields with valid numbers.');
      return;
    }

    if (ageNum < 15 || ageNum > 100) {
      setError('Please enter an age between 15 and 100.');
      return;
    }

    if (weightNum <= 0 || heightNum <= 0) {
      setError('Weight and height must be positive values.');
      return;
    }

    setResult(calculateMifflinStJeor(gender, weightNum, heightNum, ageNum, activity, goal));
  };

  const resetForm = () => {
    setAge('');
    setGender('male');
    setWeight('');
    setHeight('');
    setActivity('moderate');
    setGoal('maintain');
    setResult(null);
    setError('');
  };

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative py-16 sm:py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-background" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Flame className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold mb-3">
              Calorie <span className="gradient-text">Calculator</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Calculate your daily caloric needs using the Mifflin-St Jeor equation. Get personalized macro breakdowns and belt recommendations.
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {/* Calculator Card */}
        <div className="glass-card p-6 sm:p-8">
          {/* Gender */}
          <div className="mb-6">
            <Label className="text-sm font-medium mb-3 block">Gender</Label>
            <div className="flex gap-3">
              <button
                onClick={() => setGender('male')}
                className={`flex-1 py-3 rounded-lg text-sm font-medium transition-all border ${
                  gender === 'male'
                    ? 'bg-primary/10 text-primary border-primary/20'
                    : 'text-muted-foreground hover:text-foreground hover:bg-white/5 border-white/10'
                }`}
              >
                Male
              </button>
              <button
                onClick={() => setGender('female')}
                className={`flex-1 py-3 rounded-lg text-sm font-medium transition-all border ${
                  gender === 'female'
                    ? 'bg-primary/10 text-primary border-primary/20'
                    : 'text-muted-foreground hover:text-foreground hover:bg-white/5 border-white/10'
                }`}
              >
                Female
              </button>
            </div>
          </div>

          {/* Age, Weight, Height */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div>
              <Label className="text-sm font-medium mb-2 block">Age</Label>
              <Input
                type="number"
                placeholder="Years"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                min="15"
                max="100"
                className="bg-white/5 border-white/10 h-12"
              />
            </div>
            <div>
              <Label className="text-sm font-medium mb-2 block">Weight (kg)</Label>
              <Input
                type="number"
                placeholder="kg"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                min="1"
                className="bg-white/5 border-white/10 h-12"
              />
            </div>
            <div>
              <Label className="text-sm font-medium mb-2 block">Height (cm)</Label>
              <Input
                type="number"
                placeholder="cm"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                min="1"
                className="bg-white/5 border-white/10 h-12"
              />
            </div>
          </div>

          {/* Activity Level */}
          <div className="mb-6">
            <Label className="text-sm font-medium mb-2 block">Activity Level</Label>
            <Select value={activity} onValueChange={(v) => setActivity(v as ActivityLevel)}>
              <SelectTrigger className="bg-white/5 border-white/10 h-12">
                <SelectValue placeholder="Select activity level" />
              </SelectTrigger>
              <SelectContent className="bg-popover border-white/10">
                {(Object.keys(ACTIVITY_LABELS) as ActivityLevel[]).map((key) => (
                  <SelectItem key={key} value={key}>
                    {ACTIVITY_LABELS[key]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Goal */}
          <div className="mb-6">
            <Label className="text-sm font-medium mb-3 block">Goal</Label>
            <div className="flex gap-3">
              {(['lose', 'maintain', 'gain'] as Goal[]).map((g) => (
                <button
                  key={g}
                  onClick={() => setGoal(g)}
                  className={`flex-1 py-3 rounded-lg text-sm font-medium transition-all border ${
                    goal === g
                      ? 'bg-primary/10 text-primary border-primary/20'
                      : 'text-muted-foreground hover:text-foreground hover:bg-white/5 border-white/10'
                  }`}
                >
                  {GOAL_ADJUSTMENTS[g].label}
                </button>
              ))}
            </div>
          </div>

          {/* Error */}
          {error && (
            <p className="text-sm text-destructive mb-4">{error}</p>
          )}

          {/* Buttons */}
          <div className="flex gap-3">
            <Button
              onClick={handleCalculate}
              className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground h-12 text-base"
            >
              <Calculator className="h-5 w-5 mr-2" />
              Calculate Calories
            </Button>
            <Button
              onClick={resetForm}
              variant="outline"
              className="border-white/10 hover:bg-white/5 h-12"
            >
              Reset
            </Button>
          </div>
        </div>

        {/* Results */}
        {result && (
          <div className="mt-8 space-y-6">
            {/* Calorie Summary */}
            <div className="glass-card p-6 sm:p-8">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
                {/* BMR */}
                <div className="p-4 rounded-lg bg-white/5">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Basal Metabolic Rate</p>
                  <p className="text-3xl font-bold text-muted-foreground">{result.bmr}</p>
                  <p className="text-xs text-muted-foreground mt-1">cal/day at rest</p>
                </div>
                {/* TDEE */}
                <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Total Daily Energy</p>
                  <p className="text-3xl font-bold text-primary">{result.tdee}</p>
                  <p className="text-xs text-muted-foreground mt-1">cal/day (maintenance)</p>
                </div>
                {/* Goal */}
                <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">{result.goalLabel}</p>
                  <p className="text-3xl font-bold text-emerald-400">{result.goalCalories}</p>
                  <p className="text-xs text-muted-foreground mt-1">cal/day target</p>
                </div>
              </div>
            </div>

            {/* Macro Breakdown */}
            <div className="glass-card p-6 sm:p-8">
              <div className="flex items-center gap-2 mb-6">
                <Utensils className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-semibold">Macro Breakdown</h2>
                <span className="text-xs text-muted-foreground ml-auto">
                  Based on {result.goalCalories} cal/day
                </span>
              </div>

              <div className="space-y-5">
                {/* Protein */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Protein</span>
                    <span className="text-sm text-primary">{result.macros.protein.grams}g <span className="text-muted-foreground">({result.macros.protein.percent}%)</span></span>
                  </div>
                  <div className="h-3 rounded-full bg-white/5 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-primary transition-all duration-700"
                      style={{ width: `${result.macros.protein.percent}%` }}
                    />
                  </div>
                </div>

                {/* Carbs */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Carbohydrates</span>
                    <span className="text-sm text-amber-400">{result.macros.carbs.grams}g <span className="text-muted-foreground">({result.macros.carbs.percent}%)</span></span>
                  </div>
                  <div className="h-3 rounded-full bg-white/5 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-amber-400 transition-all duration-700"
                      style={{ width: `${result.macros.carbs.percent}%` }}
                    />
                  </div>
                </div>

                {/* Fat */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Fat</span>
                    <span className="text-sm text-sky-400">{result.macros.fat.grams}g <span className="text-muted-foreground">({result.macros.fat.percent}%)</span></span>
                  </div>
                  <div className="h-3 rounded-full bg-white/5 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-sky-400 transition-all duration-700"
                      style={{ width: `${result.macros.fat.percent}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Macro visual ring summary */}
              <div className="mt-6 flex items-center justify-center gap-6 text-xs text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <div className="h-3 w-3 rounded-full bg-primary" />
                  <span>Protein: 4 cal/g</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="h-3 w-3 rounded-full bg-amber-400" />
                  <span>Carbs: 4 cal/g</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="h-3 w-3 rounded-full bg-sky-400" />
                  <span>Fat: 9 cal/g</span>
                </div>
              </div>
            </div>

            {/* Supplement Recommendations */}
            <div className="glass-card p-6 sm:p-8">
              <div className="flex items-center gap-2 mb-4">
                <Flame className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-semibold">Recommended Belts</h2>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Based on your goal ({result.goalLabel}), these belts may suit your needs:
              </p>
              <div className="space-y-3">
                {result.beltRecommendations.map((rec, i) => (
                  <Link
                    key={i}
                    href={`/shop?search=${encodeURIComponent(rec.name)}`}
                    className="flex items-center justify-between p-4 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 hover:border-primary/20 transition-all group"
                  >
                    <div>
                      <p className="font-medium text-sm group-hover:text-primary transition-colors">{rec.name}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{rec.reason}</p>
                    </div>
                    <span className="text-xs text-primary opacity-0 group-hover:opacity-100 transition-opacity">View &rarr;</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Disclaimer */}
            <p className="text-xs text-muted-foreground text-center px-4">
              These calculations are estimates based on the Mifflin-St Jeor equation. Individual needs vary. Consult a registered dietitian for personalized advice.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
