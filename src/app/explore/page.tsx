"use client";

import { Compass, Rocket, ArrowLeft } from "lucide-react";
import Link from "next/link";
import Header from "@/components/layout/Header";

export default function ExplorePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="max-w-3xl mx-auto px-4 py-6">
        {/* Mobile Back Button */}
        <div className="lg:hidden mb-4">
          <Link href="/">
            <button className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
              <ArrowLeft size={20} />
              <span>Back</span>
            </button>
          </Link>
        </div>

        {/* Coming Soon Card */}
        <div className="glass-card rounded-2xl p-8 md:p-12 text-center">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                <Compass size={40} className="text-primary" />
              </div>
              <div className="absolute -top-1 -right-1 w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-pink-500 flex items-center justify-center shadow-lg animate-bounce">
                <Rocket size={18} className="text-white" />
              </div>
            </div>
          </div>

          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
            Explore is Coming Soon!
          </h1>
          <p className="text-muted-foreground text-base md:text-lg max-w-md mx-auto mb-8">
            We&apos;re working hard to bring you an amazing Explore experience.
            Discover trending posts, popular creators, and new communities — all
            in one place.
          </p>

          {/* Feature Preview */}
          <div className="grid sm:grid-cols-3 gap-4 mb-8">
            {[
              {
                icon: "🔥",
                title: "Trending",
                desc: "Discover what's popular right now",
              },
              {
                icon: "🎯",
                title: "For You",
                desc: "Personalized content recommendations",
              },
              {
                icon: "🌍",
                title: "Communities",
                desc: "Find and join communities you love",
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="p-4 rounded-xl bg-muted/50 border border-border"
              >
                <div className="text-3xl mb-2">{feature.icon}</div>
                <h3 className="font-semibold text-foreground text-sm mb-1">
                  {feature.title}
                </h3>
                <p className="text-xs text-muted-foreground">{feature.desc}</p>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="flex flex-col items-center gap-3">
            <p className="text-sm text-muted-foreground">
              Stay tuned for updates!
            </p>
            <Link href="/">
              <button className="px-6 py-2.5 bg-primary text-primary-foreground font-semibold rounded-xl hover:bg-primary/90 transition-colors cursor-pointer">
                Back to Home
              </button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
