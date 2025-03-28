const fs = require('fs');
const puppeteer = require('puppeteer');
const inquirer = require('inquirer');
const configPath = `${__dirname}/config.json`;
let config = require(configPath);

if (
  !config.recettes ||
  !Array.isArray(config.recettes) ||
  config.recettes.length === 0 ||
  !config.profils ||
  !Array.isArray(config.profils)
) {
  console.error('❌ Erreur : Le fichier config.json est mal structuré.');
  process.exit(1);
}

async function choisirProfil() {
  const profiles = config.profils.map((profil, index) => ({
    name: profil.login,
    value: index,
  }));
  profiles.push({
    name: '🔑 Saisir un nouveau login/mot de passe',
    value: 'new',
  });

  const profilAnswer = await inquirer.prompt([
    {
      type: 'list',
      name: 'profilIndex',
      message: '📌 Sélectionnez un profil :',
      choices: profiles,
    },
  ]);

  if (profilAnswer.profilIndex === 'new') {
    const newCredentials = await inquirer.prompt([
      { type: 'input', name: 'login', message: '🆕 Entrez le login :' },
      {
        type: 'password',
        name: 'password',
        message: '🔒 Entrez le mot de passe :',
      },
    ]);
    return { ...newCredentials, isNew: true };
  }
  return config.profils[profilAnswer.profilIndex];
}

(async () => {
  let selectedRecette;

  if (config.recettes.length === 1) {
    selectedRecette = config.recettes[0];
    console.log(
      `✅ Une seule recette détectée, utilisation de : ${selectedRecette}`,
    );
  } else {
    const recetteAnswer = await inquirer.prompt([
      {
        type: 'list',
        name: 'recette',
        message: '📌 Sélectionnez une recette :',
        choices: config.recettes,
      },
    ]);
    selectedRecette = recetteAnswer.recette;
  }

  let selectedProfil;
  while (true) {
    selectedProfil = await choisirProfil();
    const { login, password, isNew } = selectedProfil;

    if (!login || !password) {
      console.error('❌ Erreur : Informations du profil incomplètes !');
      continue;
    }

    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    console.log(`🌍 Connexion en tant que ${login} sur ${selectedRecette}`);
    await page.goto(selectedRecette, { waitUntil: 'networkidle2' });

    await page.type('#email', login);
    await page.type('#password', password);
    await page.click('button.flex-magnet-bottom-right');
    await page.waitForNavigation().catch(() => {});

    const cookies = await page.cookies();
    const xsrfToken = cookies.find((c) => c.name === 'XSRF-TOKEN')?.value || '';
    const sessionId =
      cookies.find((c) => c.name === 'oneSessionId')?.value || '';

    if (!xsrfToken || !sessionId) {
      console.error(
        '❌ Échec de la connexion. Vérifiez les identifiants et réessayez.',
      );
      await browser.close();
      continue;
    }

    console.log('🔑 Connexion réussie, récupération des cookies...');
    const now = new Date();
    const timestamp = now.toLocaleString('fr-FR', { timeZone: 'Europe/Paris' });
    const envContent =
      `# Connected as: ${login}\n# Date: ${timestamp}\n\n` +
      `VITE_XSRF_TOKEN=${xsrfToken}\n` +
      `VITE_ONE_SESSION_ID=${sessionId}\n` +
      `VITE_RECETTE=${selectedRecette}\n`;

    fs.writeFileSync('.env', envContent);
    console.log('✅ Cookies enregistrés dans .env');

    if (isNew) {
      console.log('📝 Ajout du nouvel identifiant dans config.json...');
      config.profils.push({ login, password });
      try {
        fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
        console.log('✅ Nouvel identifiant enregistré dans config.json');
      } catch (error) {
        console.error("❌ Erreur lors de l'écriture dans config.json :", error);
      }
    }

    await browser.close();
    break;
  }
})();
