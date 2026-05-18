'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Dumbbell, Shield, Hammer, Users, Target, Award } from 'lucide-react';

const values = [
  {
    icon: Shield,
    title: 'Quality',
    description: 'Every belt is hand-inspected and crafted from premium materials. We never compromise on leather quality, stitching, or hardware.',
  },
  {
    icon: Hammer,
    title: 'Craftsmanship',
    description: 'Our belts are built by skilled artisans using time-tested techniques. Each belt is individually inspected before leaving our workshop.',
  },
  {
    icon: Users,
    title: 'Community',
    description: 'We are building a global community of lifters who push boundaries and support each other in the pursuit of strength.',
  },
  {
    icon: Target,
    title: 'Performance',
    description: 'Everything we do is measured by the real results our athletes achieve. Your PRs are our benchmark for success.',
  },
];

const stats = [
  { value: '50K+', label: 'Athletes Equipped' },
  { value: '100+', label: 'Competition Wins' },
  { value: '3M+', label: 'Belts Shipped' },
  { value: '99.2%', label: 'Customer Satisfaction' },
];

const team = [
  {
    name: 'Jake Morrison',
    role: 'Founder & CEO',
    bio: 'Former competitive powerlifter with 15+ years in the fitness equipment industry. Founded Body Mold Fitness to build the belts he wished existed.',
    avatar: 'JM',
  },
  {
    name: 'Elena Vasquez',
    role: 'Head of Design',
    bio: 'Industrial designer specializing in sports equipment. Ensures every belt provides optimal support, comfort, and durability for athletes.',
    avatar: 'EV',
  },
  {
    name: 'Marcus Cole',
    role: 'Director of Operations',
    bio: 'Supply chain veteran with a passion for quality. Ensures every belt meets our strict standards from raw leather to your gym bag.',
    avatar: 'MC',
  },
  {
    name: 'Aisha Patel',
    role: 'Community Manager',
    bio: 'Certified strength coach and powerlifting referee. Connects our brand with the athletes and lifters who inspire us daily.',
    avatar: 'AP',
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative py-20 sm:py-28 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-background" />
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6">
              <Dumbbell className="h-4 w-4" /> Our Story
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              Built by Lifters,{' '}
              <span className="gradient-text">For Lifters</span>
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed">
              Body Mold Fitness was born from a simple frustration: most gym belts were either
              cheap and flimsy or overpriced and overhyped. We set out to build belts that
              actually deliver on their promises - rigid where it matters, comfortable where
              it counts, and built to last a lifetime.
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="glass-card p-8 sm:p-10">
              <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                <Target className="h-6 w-6 text-primary" />
              </div>
              <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
              <p className="text-muted-foreground leading-relaxed">
                To empower every lifter with premium, competition-grade belts that provide
                maximum support and durability. We believe the right belt can add pounds to
                your lifts and years to your training, and we are committed to making every
                stitch, every layer, and every buckle count.
              </p>
            </div>
            <div className="glass-card p-8 sm:p-10">
              <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                <Award className="h-6 w-6 text-primary" />
              </div>
              <h2 className="text-2xl font-bold mb-4">Our Vision</h2>
              <p className="text-muted-foreground leading-relaxed">
                To become the most trusted name in lifting belts worldwide. We envision
                a future where every athlete has access to properly crafted, IPF-approved
                belts at fair prices, eliminating the guesswork and false promises that
                have long plagued the industry.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Brand Values */}
      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              What We <span className="gradient-text">Stand For</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Our core values are the foundation of every decision we make, from
              leather sourcing to customer support.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value) => (
              <div key={value.title} className="glass-card p-6 sm:p-8 text-center group hover:border-primary/30 transition-colors">
                <div className="h-14 w-14 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-5 group-hover:bg-primary/20 transition-colors">
                  <value.icon className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{value.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              The <span className="gradient-text">Team</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Passionate lifters and craftsmen dedicated to building the best belts in the world.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member) => (
              <div key={member.name} className="glass-card p-6 text-center group hover:border-primary/30 transition-colors">
                <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-primary group-hover:bg-primary/20 transition-colors">
                  {member.avatar}
                </div>
                <h3 className="text-lg font-semibold mb-1">{member.name}</h3>
                <p className="text-primary text-sm font-medium mb-3">{member.role}</p>
                <p className="text-muted-foreground text-sm leading-relaxed">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Lifestyle Section */}
      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold mb-6">
                More Than a Belt.{' '}
                <span className="gradient-text">A Lifeline.</span>
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                At Body Mold Fitness, we believe a lifting belt is not just an accessory -
                it is a critical piece of equipment that protects your spine and enables
                you to lift heavier with confidence. Every belt we make is designed with
                this responsibility in mind.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-8">
                That is why we go beyond selling belts. We provide free training guides,
                sizing consultations, break-in tips, and access to our thriving community
                of over 50,000 lifters who share your drive and dedication.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="glass-card p-4 text-center">
                  <p className="text-2xl font-bold text-primary">500+</p>
                  <p className="text-sm text-muted-foreground">Free Training Plans</p>
                </div>
                <div className="glass-card p-4 text-center">
                  <p className="text-2xl font-bold text-primary">200+</p>
                  <p className="text-sm text-muted-foreground">Sizing Guides</p>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="glass-card overflow-hidden aspect-[3/4]">
                  <img src="https://images.pexels.com/photos/416778/pexels-photo-416778.jpeg?auto=compress&cs=tinysrgb&w=600" alt="Powerlifter training" className="w-full h-full object-cover" />
                </div>
                <div className="glass-card overflow-hidden aspect-square">
                  <img src="https://images.pexels.com/photos/1552252/pexels-photo-1552252.jpeg?auto=compress&cs=tinysrgb&w=600" alt="Gym equipment" className="w-full h-full object-cover" />
                </div>
              </div>
              <div className="space-y-4 pt-8">
                <div className="glass-card overflow-hidden aspect-square">
                  <img src="https://images.pexels.com/photos/3735045/pexels-photo-3735045.jpeg?auto=compress&cs=tinysrgb&w=600" alt="Training session" className="w-full h-full object-cover" />
                </div>
                <div className="glass-card overflow-hidden aspect-[3/4]">
                  <img src="https://images.pexels.com/photos/1120922/pexels-photo-1120922.jpeg?auto=compress&cs=tinysrgb&w=600" alt="Competition lifting" className="w-full h-full object-cover" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="glass-card p-8 sm:p-12">
            <div className="text-center mb-10">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                Numbers That <span className="gradient-text">Speak</span>
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Since our launch, athletes around the world have trusted Body Mold
                Fitness belts for their heaviest lifts.
              </p>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <p className="text-3xl sm:text-4xl lg:text-5xl font-bold gradient-text mb-2">{stat.value}</p>
                  <p className="text-muted-foreground text-sm sm:text-base">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="glass-card p-8 sm:p-12 text-center relative overflow-hidden">
            <div className="absolute top-0 left-1/3 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
            <div className="relative">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                Ready to Lift <span className="gradient-text">Heavier</span>?
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-8">
                Join thousands of athletes who trust Body Mold Fitness belts for maximum
                support. Shop our collection and experience the difference.
              </p>
              <Link href="/shop">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground text-base px-8 py-6">
                  Shop Belts
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
