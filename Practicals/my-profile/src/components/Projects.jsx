export default function Projects() {
  const projects = [
    { name: "GATEPrep", tech: "MERN", desc: "Full-stack web platform for GATE aspirants with quizzes and dashboards." },
    { name: "DSARapid", tech: "Flutter + Firebase", desc: "Virtual DSA lab with visualizers and tests." },
    { name: "Book Store Management", tech: "Java + MySQL", desc: "Desktop app for book management with admin controls." },
  ];

  return (
    <section className="py-12 px-8 text-center">
      <h2 className="text-2xl font-bold mb-6">Projects</h2>
      <div className="grid gap-6 md:grid-cols-3 max-w-5xl mx-auto">
        {projects.map((p, i) => (
          <div key={i} className="border border-gray-300 p-5 rounded-md hover:bg-gray-100 transition">
            <h3 className="font-semibold text-lg mb-2">{p.name}</h3>
            <p className="text-sm mb-2">{p.tech}</p>
            <p className="text-gray-700 dark:text-gray-500">{p.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
