"use client";

import React from "react";

const shorts = [
  "aasfIys9oDI",
  "qO8VdJ33sJY",
  "Jy-31Kbs920",
  "67We2T4shoE"
];

export default function ShortsGallery() {
  return (
    <section className="py-16 bg-white px-4 md:px-8">
      <h2 className="text-2xl sm:text-3xl font-bold text-center mb-10 text-[#ff6f00]">
        Découvrez nos Shorts
      </h2>

      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
        {shorts.map((id) => (
          <div key={id} className="aspect-video rounded-xl overflow-hidden shadow-md">
            <iframe
              className="w-full h-full"
              src={`https://www.youtube.com/embed/${id}`}
              title="YouTube Short"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        ))}
      </div>
    </section>
  );
}
