const fs = require('fs');
const puppeteer = require('puppeteer');
const inquirer = require('inquirer');
const configPath = `${__dirname}/config.json`;

// Vérification et création de config.json si nécessaire
if (!fs.existsSync(configPath)) {
  console.log("⚠️  Aucun fichier config.json trouvé. Création en cours...");
  fs.writeFileSync(configPath, JSON.stringify({ recettes: [], profils: [] }, null, 2));
  console.log("✅ Fichier config.json créé.");
}

let config = require(configPath);

async function initialiserConfig() {
  if (!config.recettes || config.recettes.length === 0) {
    const recetteAnswer = await inquirer.prompt([
      {
        type: 'input',
        name: 'recette',
        message: "🌍 Entrez l'URL de la recette :",
      },
    ]);
    config.recettes = [recetteAnswer.recette];
  }

  fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
  console.log('✅ Configuration mise à jour !');
}

async function choisirProfil() {
  const profiles = config.profils.map((profil, index) => ({
    name: profil.login,
    value: index,
  }));
  profiles.push({ name: '🔑 Ajouter un nouveau profil', value: 'new' });

  const profilAnswer = await inquirer.prompt([
    {
      type: "list",
      name: "profilIndex",
      message: "📌 Sélectionnez un profil :",
      choices: profiles,
    },
  ]);

  if (profilAnswer.profilIndex === "new") {
    const newProfil = await inquirer.prompt([
      { type: "input", name: "login", message: "🆕 Entrez le login :" },
      { type: "password", name: "password", message: "🔒 Entrez le mot de passe :" },
    ]);
    config.profils.push(newProfil);
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
    console.log('✅ Nouveau profil enregistré dans config.json');
    return newProfil;
  }

  return config.profils[profilAnswer.profilIndex];
}

(async () => {
  await initialiserConfig();
  config = require(configPath); // Recharge la config après création

  // Sélection de la recette
  let selectedRecette = config.recettes.length === 1
    ? config.recettes[0]
    : (await inquirer.prompt([{ type: "list", name: "recette", message: "📌 Sélectionnez une recette :", choices: config.recettes }])).recette;

  // Sélection du profil
  let selectedProfil = await choisirProfil();

  console.log(
    `🌍 Connexion en tant que ${selectedProfil.login} sur ${selectedRecette}`,
  );
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  await page.goto(selectedRecette, { waitUntil: "networkidle2" });
  await page.type("#email", selectedProfil.login);
  await page.type("#password", selectedProfil.password);
  await page.click("button.flex-magnet-bottom-right");
  await page.waitForNavigation().catch(() => {});

  const cookies = await page.cookies();
  const xsrfToken = cookies.find((c) => c.name === 'XSRF-TOKEN')?.value || '';
  const sessionId = cookies.find((c) => c.name === 'oneSessionId')?.value || '';

  if (!xsrfToken || !sessionId) {
    console.error("❌ Échec de la connexion. Vérifiez les identifiants et réessayez.");
    await browser.close();
    return;
  }

  console.log('🔑 Connexion réussie, récupération des cookies...');
  const envContent = `VITE_XSRF_TOKEN=${xsrfToken}\nVITE_ONE_SESSION_ID=${sessionId}\nVITE_RECETTE=${selectedRecette}\n`;
  fs.writeFileSync('.env', envContent);
  console.log('✅ Cookies enregistrés dans .env');
  await browser.close();
})();
