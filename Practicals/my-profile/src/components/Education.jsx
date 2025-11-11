export default function Education() {
  const education = [
    {
      degree: "B.Tech in Computer Science & Engineering",
      college: "D.Y. Patil College of Engineering & Technology, Kolhapur",
      year: "2023 – Present",
      score: "CGPA: 8.3"
    },
    {
      degree: "Diploma in Information Technology",
      college: "Government Polytechnic, Kolhapur",
      year: "2020 – 2023",
      score: "Percentage: 91.06%"
    }
  ];

  return (
    <section className="py-12 px-8 text-center">
      <h2 className="text-2xl font-bold mb-6">Education</h2>
      <div className="max-w-3xl mx-auto space-y-6">
        {education.map((edu, i) => (
          <div key={i} className="border border-gray-300 p-5 rounded-md">
            <h3 className="font-semibold text-lg">{edu.degree}</h3>
            <p className="text-gray-600">{edu.college}</p>
            <p className="text-gray-700">{edu.year} — {edu.score}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
