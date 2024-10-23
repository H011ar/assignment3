/********************************************************************************
*  WEB322 – Assignment 02
* 
*  I declare that this assignment is my own work in accordance with Seneca's
*  Academic Integrity Policy:
* 
*  https://www.senecapolytechnic.ca/about/policies/academic-integrity-policy.html
* 
*  Name:TOYIN ODOFIN Student ID: ___152522223___________ Date: __10/04/2024____________
*
********************************************************************************/



const express = require("express");
const projectData = require("./modules/projects");
const path = require("path");

const app = express();

// Serve static files from the "public" directory
app.use(express.static('public'));


// Update the "/" route to respond with home.html
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "/views/home.html"));
});

// Add an "/about" route to serve the about page
app.get("/about", (req, res) => {
    res.sendFile(path.join(__dirname, "/views/about.html"));
});

// Update "/solutions/projects" to support sector filtering
app.get("/solutions/projects", (req, res) => {
    const { sector } = req.query;
    if (sector) {
        const projects = projectData.getProjectsBySector(sector);
        if (projects.length > 0) {
            res.json(projects);
        } else {
            res.status(404).send("No projects found for the specified sector.");
        }
    } else {
        res.json(projectData.getAllProjects());
    }
});

// Dynamic route to get project by id
app.get("/solutions/projects/:id", (req, res) => {
    const project = projectData.getProjectById(parseInt(req.params.id));
    if (project) {
        res.json(project);
    } else {
        res.status(404).send("Project not found.");
    }
});

// Custom 404 page
app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, "/views/404.html"));
});

// Initialize the project data and start the server
projectData.initialize().then(() => {
    app.listen(3000, () => {
        console.log("Server running at http://localhost:3000");
    });
}).catch(err => {
    console.error("Failed to initialize project data:", err);
});
