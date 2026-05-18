'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Mail, Phone, MapPin, Clock, Send } from 'lucide-react';

const contactInfo = [
  {
    icon: Mail,
    label: 'Email',
    value: 'support@bodymoldfitness.com',
    href: 'mailto:support@bodymoldfitness.com',
  },
  {
    icon: Phone,
    label: 'Phone',
    value: '(310) 555-0192',
    href: 'tel:+13105550192',
  },
  {
    icon: MapPin,
    label: 'Address',
    value: '1245 Venice Blvd, Los Angeles, CA 90015',
    href: null,
  },
  {
    icon: Clock,
    label: 'Business Hours',
    value: 'Mon-Fri: 9AM - 6PM PST',
    href: null,
  },
];

const socials = [
  { name: 'Instagram', url: 'https://instagram.com/bodymoldfitness' },
  { name: 'Twitter', url: 'https://twitter.com/bodymoldfit' },
  { name: 'YouTube', url: 'https://youtube.com/@bodymoldfitness' },
  { name: 'Facebook', url: 'https://facebook.com/bodymoldfitness' },
];

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    // Simulate a brief delay for UX
    await new Promise((resolve) => setTimeout(resolve, 800));
    setSubmitting(false);
    setSubmitted(true);
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative py-20 sm:py-28 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-background" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4">
            Get in <span className="gradient-text">Touch</span>
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Have a question, suggestion, or need support? We would love to hear from
            you. Our team typically responds within 24 hours.
          </p>
        </div>
      </section>

      {/* Contact Form + Info */}
      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* Form */}
            <div className="lg:col-span-3">
              <div className="glass-card p-6 sm:p-8">
                <h2 className="text-2xl font-bold mb-6">Send Us a Message</h2>

                {submitted ? (
                  <div className="text-center py-12">
                    <div className="h-16 w-16 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-4">
                      <Send className="h-8 w-8 text-emerald-500" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Message Sent!</h3>
                    <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                      Thank you for reaching out. Our team will get back to you within
                      24 hours.
                    </p>
                    <Button
                      onClick={() => setSubmitted(false)}
                      variant="outline"
                      className="border-white/10 hover:bg-white/5"
                    >
                      Send Another Message
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Name</Label>
                        <Input
                          id="name"
                          name="name"
                          placeholder="Your name"
                          required
                          value={formData.name}
                          onChange={handleChange}
                          className="bg-white/5 border-white/10 placeholder:text-muted-foreground/60 focus-visible:ring-primary/50"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          placeholder="you@example.com"
                          required
                          value={formData.email}
                          onChange={handleChange}
                          className="bg-white/5 border-white/10 placeholder:text-muted-foreground/60 focus-visible:ring-primary/50"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="subject">Subject</Label>
                      <Input
                        id="subject"
                        name="subject"
                        placeholder="What is this about?"
                        required
                        value={formData.subject}
                        onChange={handleChange}
                        className="bg-white/5 border-white/10 placeholder:text-muted-foreground/60 focus-visible:ring-primary/50"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message">Message</Label>
                      <Textarea
                        id="message"
                        name="message"
                        placeholder="Tell us more..."
                        required
                        rows={6}
                        value={formData.message}
                        onChange={handleChange}
                        className="bg-white/5 border-white/10 placeholder:text-muted-foreground/60 focus-visible:ring-primary/50 resize-none"
                      />
                    </div>

                    <Button
                      type="submit"
                      size="lg"
                      disabled={submitting}
                      className="bg-primary hover:bg-primary/90 text-primary-foreground w-full sm:w-auto"
                    >
                      {submitting ? (
                        <span className="flex items-center gap-2">
                          <span className="h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                          Sending...
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          <Send className="h-4 w-4" />
                          Send Message
                        </span>
                      )}
                    </Button>
                  </form>
                )}
              </div>
            </div>

            {/* Contact Info Sidebar */}
            <div className="lg:col-span-2 space-y-6">
              <div className="glass-card p-6 sm:p-8">
                <h2 className="text-2xl font-bold mb-6">Contact Info</h2>
                <div className="space-y-5">
                  {contactInfo.map((item) => (
                    <div key={item.label} className="flex items-start gap-4">
                      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <item.icon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">{item.label}</p>
                        {item.href ? (
                          <a
                            href={item.href}
                            className="text-foreground hover:text-primary transition-colors"
                          >
                            {item.value}
                          </a>
                        ) : (
                          <p className="text-foreground">{item.value}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Social Links */}
              <div className="glass-card p-6 sm:p-8">
                <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
                <div className="flex flex-wrap gap-3">
                  {socials.map((social) => (
                    <a
                      key={social.name}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-muted-foreground hover:text-primary hover:border-primary/30 transition-all"
                    >
                      {social.name}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map */}
      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="glass-card overflow-hidden">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3305.7!2d-118.385!3d34.03!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80c2b9d1a5a0a5a1%3A0x1!2sVenice+Blvd%2C+Los+Angeles%2C+CA!5e0!3m2!1sen!2sus!4v1700000000000!5m2!1sen!2sus"
              width="100%"
              height="400"
              style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg)' }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Body Mold Fitness Location"
              className="w-full"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
