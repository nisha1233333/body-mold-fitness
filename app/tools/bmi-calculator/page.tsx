'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calculator, Activity, Heart } from 'lucide-react';

type UnitSystem = 'imperial' | 'metric';

interface BMIResult {
  bmi: number;
  category: string;
  color: string;
  tips: string[];
  beltRecommendations: { name: string; slug: string; reason: string }[];
}

const BMI_CATEGORIES = [
  { min: 0, max: 18.5, label: 'Underweight', color: 'text-blue-400', bg: 'bg-blue-400' },
  { min: 18.5, max: 25, label: 'Normal', color: 'text-emerald-400', bg: 'bg-emerald-400' },
  { min: 25, max: 30, label: 'Overweight', color: 'text-amber-400', bg: 'bg-amber-400' },
  { min: 30, max: Infinity, label: 'Obese', color: 'text-red-400', bg: 'bg-red-400' },
];

function getBMIData(bmi: number): BMIResult {
  const category = BMI_CATEGORIES.find(c => bmi >= c.min && bmi < c.max) || BMI_CATEGORIES[3];

  const tipsMap: Record<string, string[]> = {
    Underweight: [
      'Focus on strength training to build healthy muscle mass',
      'Eat frequent, nutrient-dense meals throughout the day',
      'Start with a lightweight velcro belt for general support',
      'Consult a healthcare provider for a personalized plan',
    ],
    Normal: [
      'Maintain your balanced diet and regular exercise routine',
      'Continue monitoring your weight and body composition',
      'A 10mm leather belt is ideal for your training level',
      'Stay hydrated and get 7-9 hours of sleep nightly',
    ],
    Overweight: [
      'Aim for a moderate caloric deficit of 300-500 calories per day',
      'Incorporate both cardio and strength training',
      'A velcro or nylon belt provides support without rigidity',
      'Increase daily movement - aim for 8,000-10,000 steps',
    ],
    Obese: [
      'Consult a healthcare provider for a personalized plan',
      'Start with low-impact exercises like walking or swimming',
      'A flexible velcro belt is best for starting your lifting journey',
      'Consider working with a trainer for proper form guidance',
    ],
  };

  const beltMap: Record<string, { name: string; slug: string; reason: string }[]> = {
    Underweight: [
      { name: 'Nylon Training Belt', slug: 'nylon-training-belt', reason: 'Lightweight and flexible for beginners building strength' },
      { name: 'FlexCore Velcro Belt', slug: 'flexcore-velcro-belt', reason: 'Comfortable support while building muscle mass' },
    ],
    Normal: [
      { name: 'Titan Pro Lever Belt', slug: 'titan-pro-lever-belt', reason: '10mm leather for maximum support at any training level' },
      { name: 'Stealth Tapered Belt', slug: 'stealth-tapered-belt', reason: 'Versatile for all training styles' },
    ],
    Overweight: [
      { name: 'FlexCore Velcro Belt', slug: 'flexcore-velcro-belt', reason: 'Adjustable and comfortable for varied training' },
      { name: 'Nylon Training Belt', slug: 'nylon-training-belt', reason: 'Flexible support without the rigidity of leather' },
    ],
    Obese: [
      { name: 'Nylon Training Belt', slug: 'nylon-training-belt', reason: 'Beginner-friendly and breathable for new lifters' },
      { name: 'FlexCore Velcro Belt', slug: 'flexcore-velcro-belt', reason: 'Lightweight with quick velcro transitions' },
    ],
  };

  return {
    bmi,
    category: category.label,
    color: category.color,
    tips: tipsMap[category.label] || [],
    beltRecommendations: beltMap[category.label] || [],
  };
}

export default function BMICalculatorPage() {
  const [unitSystem, setUnitSystem] = useState<UnitSystem>('imperial');
  const [feet, setFeet] = useState('');
  const [inches, setInches] = useState('');
  const [cm, setCm] = useState('');
  const [lbs, setLbs] = useState('');
  const [kg, setKg] = useState('');
  const [result, setResult] = useState<BMIResult | null>(null);
  const [error, setError] = useState('');

  const calculateBMI = () => {
    setError('');
    setResult(null);

    let heightM: number;
    let weightKg: number;

    if (unitSystem === 'imperial') {
      const f = parseFloat(feet);
      const i = parseFloat(inches);
      const w = parseFloat(lbs);

      if (isNaN(f) || isNaN(i) || isNaN(w) || f <= 0 || w <= 0) {
        setError('Please enter valid height and weight values.');
        return;
      }

      heightM = (f * 12 + i) * 0.0254;
      weightKg = w * 0.453592;
    } else {
      const h = parseFloat(cm);
      const w = parseFloat(kg);

      if (isNaN(h) || isNaN(w) || h <= 0 || w <= 0) {
        setError('Please enter valid height and weight values.');
        return;
      }

      heightM = h / 100;
      weightKg = w;
    }

    if (heightM <= 0 || weightKg <= 0) {
      setError('Please enter valid positive values.');
      return;
    }

    const bmi = weightKg / (heightM * heightM);
    setResult(getBMIData(Math.round(bmi * 10) / 10));
  };

  const resetForm = () => {
    setFeet('');
    setInches('');
    setCm('');
    setLbs('');
    setKg('');
    setResult(null);
    setError('');
  };

  const gaugePosition = result ? Math.min(Math.max(((result.bmi - 10) / 30) * 100, 0), 100) : 0;

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
              <Calculator className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold mb-3">
              BMI <span className="gradient-text">Calculator</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Calculate your Body Mass Index and get personalized health tips and belt recommendations.
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {/* Calculator Card */}
        <div className="glass-card p-6 sm:p-8">
          {/* Unit Toggle */}
          <div className="flex items-center justify-center gap-2 mb-8">
            <button
              onClick={() => { setUnitSystem('imperial'); resetForm(); }}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                unitSystem === 'imperial'
                  ? 'bg-primary/10 text-primary border border-primary/20'
                  : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
              }`}
            >
              Imperial (ft/lbs)
            </button>
            <button
              onClick={() => { setUnitSystem('metric'); resetForm(); }}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                unitSystem === 'metric'
                  ? 'bg-primary/10 text-primary border border-primary/20'
                  : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
              }`}
            >
              Metric (cm/kg)
            </button>
          </div>

          {/* Height Input */}
          <div className="mb-6">
            <Label className="text-sm font-medium mb-3 block">Height</Label>
            {unitSystem === 'imperial' ? (
              <div className="flex gap-3">
                <div className="flex-1">
                  <Input
                    type="number"
                    placeholder="Feet"
                    value={feet}
                    onChange={(e) => setFeet(e.target.value)}
                    min="1"
                    max="8"
                    className="bg-white/5 border-white/10 h-12 text-lg"
                  />
                  <span className="text-xs text-muted-foreground mt-1 block">Feet</span>
                </div>
                <div className="flex-1">
                  <Input
                    type="number"
                    placeholder="Inches"
                    value={inches}
                    onChange={(e) => setInches(e.target.value)}
                    min="0"
                    max="11"
                    className="bg-white/5 border-white/10 h-12 text-lg"
                  />
                  <span className="text-xs text-muted-foreground mt-1 block">Inches</span>
                </div>
              </div>
            ) : (
              <div>
                <Input
                  type="number"
                  placeholder="Height in centimeters"
                  value={cm}
                  onChange={(e) => setCm(e.target.value)}
                  min="50"
                  max="300"
                  className="bg-white/5 border-white/10 h-12 text-lg"
                />
                <span className="text-xs text-muted-foreground mt-1 block">Centimeters</span>
              </div>
            )}
          </div>

          {/* Weight Input */}
          <div className="mb-6">
            <Label className="text-sm font-medium mb-3 block">Weight</Label>
            {unitSystem === 'imperial' ? (
              <div>
                <Input
                  type="number"
                  placeholder="Weight in pounds"
                  value={lbs}
                  onChange={(e) => setLbs(e.target.value)}
                  min="1"
                  max="1000"
                  className="bg-white/5 border-white/10 h-12 text-lg"
                />
                <span className="text-xs text-muted-foreground mt-1 block">Pounds</span>
              </div>
            ) : (
              <div>
                <Input
                  type="number"
                  placeholder="Weight in kilograms"
                  value={kg}
                  onChange={(e) => setKg(e.target.value)}
                  min="1"
                  max="500"
                  className="bg-white/5 border-white/10 h-12 text-lg"
                />
                <span className="text-xs text-muted-foreground mt-1 block">Kilograms</span>
              </div>
            )}
          </div>

          {/* Error */}
          {error && (
            <p className="text-sm text-destructive mb-4">{error}</p>
          )}

          {/* Buttons */}
          <div className="flex gap-3">
            <Button
              onClick={calculateBMI}
              className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground h-12 text-base"
            >
              <Calculator className="h-5 w-5 mr-2" />
              Calculate BMI
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
            {/* BMI Score & Category */}
            <div className="glass-card p-6 sm:p-8 text-center">
              <div className="mb-6">
                <p className="text-sm text-muted-foreground mb-2 uppercase tracking-wider">Your BMI</p>
                <p className={`text-6xl font-bold ${result.color}`}>{result.bmi}</p>
                <p className={`text-xl font-semibold mt-2 ${result.color}`}>{result.category}</p>
              </div>

              {/* Visual BMI Gauge */}
              <div className="mt-8">
                <div className="relative h-4 rounded-full overflow-hidden bg-white/5">
                  {/* Gradient background representing BMI scale */}
                  <div className="absolute inset-0 flex">
                    <div className="flex-1 bg-blue-400/30" />
                    <div className="flex-1 bg-emerald-400/30" />
                    <div className="flex-1 bg-amber-400/30" />
                    <div className="flex-1 bg-red-400/30" />
                  </div>
                  {/* Indicator */}
                  <div
                    className="absolute top-1/2 -translate-y-1/2 w-4 h-6 rounded-sm bg-white shadow-lg border-2 border-white/80 transition-all duration-700 ease-out"
                    style={{ left: `calc(${gaugePosition}% - 8px)` }}
                  />
                </div>
                {/* Scale labels */}
                <div className="flex justify-between text-xs text-muted-foreground mt-2">
                  <span>10</span>
                  <span className="text-blue-400">18.5</span>
                  <span className="text-emerald-400">25</span>
                  <span className="text-amber-400">30</span>
                  <span>40+</span>
                </div>
                {/* Category Labels */}
                <div className="flex justify-between text-xs mt-1">
                  <span className="text-blue-400/70">Underweight</span>
                  <span className="text-emerald-400/70">Normal</span>
                  <span className="text-amber-400/70">Overweight</span>
                  <span className="text-red-400/70">Obese</span>
                </div>
              </div>
            </div>

            {/* Health Tips */}
            <div className="glass-card p-6 sm:p-8">
              <div className="flex items-center gap-2 mb-4">
                <Activity className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-semibold">Health Tips</h2>
              </div>
              <ul className="space-y-3">
                {result.tips.map((tip, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                      <span className="text-xs text-primary font-semibold">{i + 1}</span>
                    </div>
                    <span className="text-sm text-muted-foreground leading-relaxed">{tip}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Supplement Recommendations */}
            <div className="glass-card p-6 sm:p-8">
              <div className="flex items-center gap-2 mb-4">
                <Heart className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-semibold">Recommended Belts</h2>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Based on your BMI category ({result.category}), these belts may suit your needs:
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
              BMI is a screening tool and does not diagnose body fatness or health. Consult a healthcare provider for a comprehensive assessment.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
