import React from "react";
import { AppBar, 
         Toolbar, 
         Typography, 
         Button, 
         Box, 
         Container,
         Card, 
         CardContent, 
         CardMedia, 
         Grid } from "@mui/material";

import SchoolIcon from "@mui/icons-material/School";

function Navbar() {
  return (
    <AppBar position="static" color="primary">
      <Toolbar>
        <SchoolIcon sx={{ mr: 1 }} />
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          EduLearn
        </Typography>
        <Button color="inherit">Home</Button>
        <Button color="inherit">Courses</Button>
        <Button color="inherit">About</Button>
        <Button color="inherit">Contact</Button>
      </Toolbar>
    </AppBar>
  );
}

function HeroSection() {
  return (
    <Box sx={{ bgcolor: "#f5f5f5", py: 8, textAlign: "center" }}>
      <Typography variant="h3" gutterBottom>
        Welcome to EduLearn
      </Typography>
      <Typography variant="h6" color="text.secondary" gutterBottom>
        Learn from the best educators and enhance your skills anytime, anywhere.
      </Typography>
      <Button variant="contained" color="primary" size="large">
        Get Started
      </Button>
    </Box>
  );
}

function CourseCard({ title, description, image }) {
  return (
    <Card sx={{ maxWidth: 345, mx: "auto" }}>
      <CardMedia component="img" height="180" image={image} alt={title} />
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
      </CardContent>
    </Card>
  );
}

function CoursesSection() {
  const courses = [
    { title: "Web Development", description: "Learn HTML, CSS, JavaScript, and modern frameworks.", image: "/images/webdev.jpg" },
    { title: "Data Science", description: "Master data analysis, visualization, and machine learning.", image: "/images/ds.jpg" },
    { title: "UI/UX Design", description: "Design beautiful and user-friendly digital experiences.", image: "/images/ui-ux.png" },
  ];

  return (
    <Container sx={{ py: 8 }}>
      <Typography variant="h4" textAlign="center" gutterBottom>
        Our Popular Courses
      </Typography>
      <Grid container spacing={4} justifyContent="center">
        {courses.map((course, index) => (
          <Grid item key={index} xs={12} sm={6} md={4}>
            <CourseCard {...course} />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

function Footer() {
  return (
    <Box sx={{ bgcolor: "primary.main", color: "white", py: 3, textAlign: "center", mt: 5 }}>
      <Typography variant="body1">© 2025 EduLearn. All rights reserved.</Typography>
    </Box>
  );
}

function App() {
  return (
    <>
      <Navbar />
      <HeroSection />
      <CoursesSection />
      <Footer />
    </>
  );
}

export default App;
