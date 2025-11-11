import React from "react";
import styles from "../styles/DanceStyles.module.css";

const DanceStyles = () => {
  const danceStyles = ["Kathak", "Hip Hop", "Ballet", "Salsa", "Contemporary"];

  return (
    <section className={styles.section}>
      <h2>Our Dance Styles</h2>
      <div className={styles.cardContainer}>
        {danceStyles.map((style, index) => (
          <div key={index} className={styles.card}>
            <h3>{style}</h3>
            <p>Learn the art of {style} from professional dancers.</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default DanceStyles;
    