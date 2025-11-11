import React from "react";

const HeroSection = () => {
  const heroStyle = {
    backgroundImage: "url('https://source.unsplash.com/1200x500/?dance,stage')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    color: "white",
    textAlign: "center",
    padding: "10px 10px",
  };

  const headingStyle = {
    fontSize: "3rem",
    fontWeight: "bold",
    color: "#1a237e",
    marginBottom: "0px",
  };

  const buttonStyle = {
    marginBottom: "15px",
    padding: "10px 25px",
    backgroundColor: "#1a237e",
    border: "none",
    color: "white",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "1rem",
  };

  return (
    <section style={heroStyle}>
      <h1 style={headingStyle}>Feel the Beat. Learn the Moves.</h1>
      <p>Join our academy to express yourself through dance!</p>
      <button style={buttonStyle}>Join Now</button>
      
      {/* CSS Styling Information */}
      <div style={{ 
        backgroundColor: "#e8eaf6",
        padding: "20px", 
        borderRadius: "8px",
        fontSize: "0.9rem",
        border: "2px solid #1a237e",
        width: "60%",
        margin: "30px auto 0 auto",
      }}>
        {/* <h3 style={{ color: "#1a237e", marginBottom: "15px" }}>Frontend/UI CSS Styling Methods Used:</h3> */}
        <div style={{ textAlign: "left", maxWidth: "600px", margin: "0 auto", color: "#1a237e" }}>
          <p style={{ marginTop: "10px", textAlign: "center", color: "#1a237e" , fontWeight: "bold", fontSize: "1.1rem" }}>
            Demonstrating three different CSS approaches in React!
          </p>
          <p><strong>Navbar Component:</strong> External CSS - Uses separate CSS file (Navbar.css) for styling</p>
          <p><strong>Hero Section Component:</strong> Internal CSS - Uses inline JavaScript object styles</p>
          <p><strong>Dance Styles Component:</strong> CSS Modules - Uses modular CSS (DanceStyles.module.css)</p>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
