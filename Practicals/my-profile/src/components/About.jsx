import profile from "../assets/profile.png";

export default function About() {
  return (
    <section className="flex flex-col md:flex-row items-center justify-center py-16 px-8 text-center md:text-left">
      <img
        src={profile}
        alt="Profile"
        className="w-40 h-40 rounded-full object-cover mb-6 md:mb-0 md:mr-10 border-4 border-black"
      />
      <div className="max-w-xl">
        <h2 className="text-3xl font-bold mb-4">Hello, I’m Namrata Daphale</h2>
        <p className="text-gray-700 leading-relaxed">
          B.Tech student passionate about full-stack web development. Skilled
          in MERN stack, building scalable and user-friendly applications.
          Strong communicator and a collaborative team player.
        </p>
      </div>
    </section>
  );
}
