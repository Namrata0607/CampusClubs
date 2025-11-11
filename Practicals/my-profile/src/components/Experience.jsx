export default function Experience() {
  const experience = [
    {
      role: "Full Stack Web Development Intern",
      company: "IIT Bombay EdTech Society",
      time: "June 2025 – Present",
      desc: "Developing a real-time EdTech solution with polls, quizzes, live Q&A, and gamified learning features."
    },
    {
      role: "Software Trainee Intern",
      company: "INet Solutions, Kolhapur",
      time: "Jan 2023 – Feb 2023",
      desc: "Built a Flutter app for online Kathak classes with student and exam management."
    }
  ];

  return (
    <section className="py-12 px-8">
      <h2 className="text-2xl font-bold mb-6 text-center">Experience</h2>
      <div className="max-w-3xl mx-auto space-y-6">
        {experience.map((exp, i) => (
          <div key={i} className="border border-gray-300 p-5 rounded-md">
            <h3 className="font-semibold text-lg">{exp.role}</h3>
            <p className="text-gray-600">{exp.company} — {exp.time}</p>
            <p className="mt-2 text-gray-700">{exp.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
