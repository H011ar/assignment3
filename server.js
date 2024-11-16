const express = require("express");
const path = require("path");
const projectsModule = require("./modules/projects"); // Ensure your projects module is correctly defined

const app = express();
const PORT = 3000;

// Middleware
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

// Initialize the projects module
projectsModule.Initialize()
    .then(() => {
        console.log("Projects initialized successfully.");
    })
    .catch(err => {
        console.error("Error initializing projects:", err);
    });

// Routes
app.get("/", (req, res) => {
    res.render("home", { page: "/" });
});

app.get("/about", (req, res) => {
    res.render("about", { page: "/about" });
});

app.get("/solutions/projects", (req, res) => {
    const sector = req.query.sector;

    projectsModule.getAllProjects()
        .then(projects => {
            if (sector && projects.filter(project => project.sector === sector).length === 0) {
                return res.status(404).render("404", { message: "No projects found for the selected sector." });
            }
            res.render("projects", { projects, page: "/solutions/projects" });
        })
        .catch(err => {
            res.status(500).send("Error retrieving projects: " + err);
        });
});

app.get("/solutions/projects/:id", (req, res) => {
    const projectId = parseInt(req.params.id, 10);
    console.log(`Looking for project with ID: ${projectId}`); // Debugging log

    projectsModule.getProjectById(projectId)
        .then(project => {
            console.log('Found project:', project); // Debugging log
            if (!project) {
                return res.status(404).render("404", { message: `Project with ID ${projectId} not found.` });
            }
            res.render("projectDetail", { project, page: `/solutions/projects/${projectId}` });
        })
        .catch(err => {
            console.error('Error in getProjectById:', err); // Debugging log
            res.status(404).render("404", { message: `Project with ID ${projectId} not found.` });
        });
});


// 404 Handler for undefined routes
app.use((req, res) => {
    res.status(404).render("404", { message: "Sorry, we couldn't find the page you're looking for." });
});

projectsModule.Initialize()
    .then(() => {
        console.log("Projects initialized successfully.");
        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
        });
    })
    .catch(err => {
        console.error("Error initializing projects:", err);
    });



