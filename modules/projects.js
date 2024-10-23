const projectData = require("../data/projectData.json");
const sectorData = require("../data/sectorData.json"); // Make sure this file exists and is correctly formatted

let projects = [];

function initialize() {
    return new Promise((resolve, reject) => {
        try {
            // Map projectData and find matching sector from sectorData
            projects = projectData.map(project => {
                const sector = sectorData.find(s => s.id === project.sector_id);
                return {
                    ...project,
                    sector: sector ? sector.sector_name : "Unknown"
                };
            });
            // Resolve the promise when done
            resolve();
        } catch (err) {
            // Reject the promise in case of an error
            reject(err);
        }
    });
}

function getAllProjects() {
    return projects;
}

function getProjectById(id) {
    return projects.find(project => project.id === id);
}

function getProjectsBySector(sector) {
    const lowerSector = sector.toLowerCase();
    return projects.filter(project =>
        project.sector.toLowerCase().includes(lowerSector)
    );
}

module.exports = {
    initialize,
    getAllProjects,
    getProjectById,
    getProjectsBySector
};
