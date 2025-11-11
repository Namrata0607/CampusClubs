export default function Skills() {
  const skills = [
    "Java", "JavaScript", "React", "Node.js", "Express.js",
    "MongoDB", "MySQL", "Firebase", "Tailwind CSS", "Flutter"
  ];

  return (
    <section className="py-12 px-8 text-center">
      <h2 className="text-2xl font-bold mb-6">Skills</h2>
      <div className="flex flex-wrap justify-center gap-4">
        {skills.map((s, i) => (
          <span key={i} className="border border-black px-4 py-2 rounded-full text-sm hover:bg-black hover:text-white transition">
            {s}
          </span>
        ))}
      </div>
    </section>
  );
}
