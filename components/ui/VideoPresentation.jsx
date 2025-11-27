import React from "react";

export default function VideoPresentation() {
  return (
    <section className="py-16 bg-white px-4 md:px-8">
      <h2 className="text-2xl sm:text-3xl font-bold text-center mb-10 text-[#ff6f00]">
        Découvrez Monmarché en vidéo
      </h2>
      <div className="max-w-4xl mx-auto aspect-video">
        <iframe
          className="w-full h-full rounded-xl shadow-md"
          src="https://www.youtube.com/embed/GtOa9sVWL0o"
          title="Présentation vidéo de Monmarché"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          loading="lazy"
          allowFullScreen
        ></iframe>
      </div>
    </section>
  );
}
