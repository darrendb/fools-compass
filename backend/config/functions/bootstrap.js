"use strict";
console.log('bootstrap.js');

const fs = require("fs");
const path = require("path");
const mime = require("mime-types");
const seedDataFile = "bootstrap-data.json";
const {
  categories,
  homepage,
  writers,
  articles,
  global,
  readings,
  spreads,
  positions,
} = require(`../../data/${seedDataFile}`);

async function isFirstRun() {
  console.log('--isFirstRun()');
  const pluginStore = strapi.store({
    environment: strapi.config.environment,
    type: "type",
    name: "setup",
  });
  const initHasRun = await pluginStore.get({ key: "initHasRun" });
  await pluginStore.set({ key: "initHasRun", value: true });
  const rv = !initHasRun;
  console.log(`--rv: ${rv}`);
  return rv;
}

async function setPublicPermissions(newPermissions) {
  console.log('setPublicPermissions()');
  // Find the ID of the public role
  const publicRole = await strapi
    .query("role", "users-permissions")
    .findOne({ type: "public" });

  // List all available permissions
  const publicPermissions = await strapi
    .query("permission", "users-permissions")
    .find({
      type: ["users-permissions", "application"],
      role: publicRole.id,
    });

  // Update permission to match new config
  const controllersToUpdate = Object.keys(newPermissions);
  const updatePromises = publicPermissions
    .filter((permission) => {
      // Only update permissions included in newConfig
      if (!controllersToUpdate.includes(permission.controller)) {
        return false;
      }
      if (!newPermissions[permission.controller].includes(permission.action)) {
        return false;
      }
      return true;
    })
    .map((permission) => {
      // Enable the selected permissions
      return strapi
        .query("permission", "users-permissions")
        .update({ id: permission.id }, { enabled: true });
    });
  await Promise.all(updatePromises);
}

function getFileSizeInBytes(filePath) {
  const stats = fs.statSync(filePath);
  const fileSizeInBytes = stats["size"];
  return fileSizeInBytes;
}

function getFileData(fileName) {
  console.log('getFileData()');
  const filePath = `./data/uploads/${fileName}`;

  // Parse the file metadata
  const size = getFileSizeInBytes(filePath);
  const ext = fileName.split(".").pop();
  const mimeType = mime.lookup(ext);

  return {
    path: filePath,
    name: fileName,
    size,
    type: mimeType,
  };
}

// Create an entry and attach files if there are any
async function createEntry({ model, entry, files }) {
  console.log('createEntry()');
  try {
    const createdEntry = await strapi.query(model).create(entry);
    if (files) {
      await strapi.entityService.uploadFiles(createdEntry, files, {
        model,
      });
    }
  } catch (e) {
    console.log("model", entry, e);
  }
}

// readings
async function importReadings() {
  console.log('importReadings()');
  return Promise.all(
    readings.map(async (reading) => {
      const files = {
        picture: getFileData(`${reading.image.url}`),
      };
      return createEntry({
        model: "reading",
        entry: reading,
        files,
      });
    })
  );
}
// spreads
async function importSpreads() {
  console.log('importSpreads()');
  return Promise.all(
    spreads.map(async (spread) => {
      const files = {
        picture: getFileData(`${spread.image.url}`),
      };
      return createEntry({
        model: "spread",
        entry: spread,
        files,
      });
    })
  );
}
// positions
async function importPositions() {
  console.log('importPositions()');
  return Promise.all(
    positions.map(async (position) => {
      const files = {
        picture: getFileData(`${position.image.url}`),
      };
      return createEntry({
        model: "position",
        entry: position,
        files,
      });
    })
  );
}



async function importCategories() {
  return Promise.all(
    categories.map((category) => {
      return createEntry({ model: "category", entry: category });
    })
  );
}

async function importHomepage() {
  console.log('importHomepage()');
  const files = {
    "seo.shareImage": getFileData("default-image.png"),
  };
  await createEntry({ model: "homepage", entry: homepage, files });
}

async function importWriters() {
  return Promise.all(
    writers.map(async (writer) => {
      const files = {
        picture: getFileData(`${writer.email}.jpg`),
      };
      return createEntry({
        model: "writer",
        entry: writer,
        files,
      });
    })
  );
}

// Randomly set relations on Article to avoid error with MongoDB
function getEntryWithRelations(article, categories, authors) {
  console.log('getEntryWithRelations()');
  const isMongoose = strapi.config.connections.default.connector == "mongoose";

  if (isMongoose) {
    const randomRelation = (relation) =>
      relation[Math.floor(Math.random() * relation.length)].id;
    delete article.category.id;
    delete article.author.id;

    return {
      ...article,
      category: {
        _id: randomRelation(categories),
      },
      author: {
        _id: randomRelation(authors),
      },
    };
  }

  return article;
}

async function importArticles() {
  const categories = await strapi.query("category").find();
  const authors = await strapi.query("writer").find();

  return Promise.all(
    articles.map((article) => {
      // Get relations for each article
      const entry = getEntryWithRelations(article, categories, authors);

      const files = {
        image: getFileData(`${article.slug}.jpg`),
      };

      return createEntry({
        model: "article",
        entry,
        files,
      });
    })
  );
}

async function importGlobal() {
  console.log('importGlobal()');
  const files = {
    favicon: getFileData("favicon.png"),
    "defaultSeo.shareImage": getFileData("default-image.png"),
  };
  return createEntry({ model: "global", entry: global, files });
}

async function importSeedData() {
  console.log('importSeedData()');
  // Allow read of application content types
  await setPublicPermissions({
    global: ["find"],
    homepage: ["find"],
    article: ["find", "findone"],
    category: ["find", "findone"],
    writer: ["find", "findone"],
    reading: ["find", "findone"],
    spread: ["find", "findone"],
    position: ["find", "findone"],
  });

  // Create all entries
  await importCategories();
  await importHomepage();
  await importWriters();
  await importArticles();
  await importGlobal();
  await importReadings();
  await importSpreads();
  await importPositions();
}

module.exports = async () => {
  console.log("--async()");
  const shouldImportSeedData = await isFirstRun();
  console.log(`----shouldImportSeedData: ${shouldImportSeedData}`);

  if (shouldImportSeedData) {
    console.log("Bootstrapping Data...")
    try {
      console.log("--Setting up the template...");
      await importSeedData();
      console.log("--Ready to go!");
    } catch (error) {
      console.log("--Could not import seed data.");
      console.error(error);
    }
  }
};
