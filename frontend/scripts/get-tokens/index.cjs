const fs = require('fs');
const fetch = require('node-fetch');
const inquirer = require('inquirer');
const { URLSearchParams } = require('url');
const configPath = `${__dirname}/config.json`;

const isAutoMode = process.argv.includes('--auto');

if (!fs.existsSync(configPath)) {
  console.log('⚠️  Aucun fichier config.json trouvé. Création en cours...');
  fs.writeFileSync(
    configPath,
    JSON.stringify({ recettes: [], profils: [] }, null, 2),
  );
  console.log('✅ Fichier config.json créé.');
}

let config = require(configPath);

async function initConfig() {
  if (!config.recettes || config.recettes.length === 0) {
    if (isAutoMode) {
      console.error(
        '❌ Aucune recette disponible en mode auto. Ajoutez-en une dans config.json.',
      );
      process.exit(1);
    }
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
}

async function choisirProfil() {
  if (config.profils.length === 0 || isAutoMode) {
    if (config.profils.length === 0) {
      const newProfil = await inquirer.prompt([
        { type: 'input', name: 'login', message: '🆕 Entrez le login :' },
        {
          type: 'password',
          name: 'password',
          message: '🔒 Entrez le mot de passe :',
        },
      ]);
      return newProfil;
    }
    return config.profils[0];
  }

  const profiles = config.profils.map((profil, index) => ({
    name: profil.login,
    value: index,
  }));
  profiles.push({ name: '🔑 Ajouter un nouveau profil', value: 'new' });

  const profilAnswer = await inquirer.prompt([
    {
      type: 'list',
      name: 'profilIndex',
      message: '📌 Sélectionnez un profil :',
      choices: profiles,
    },
  ]);

  if (profilAnswer.profilIndex === 'new') {
    return await inquirer.prompt([
      { type: 'input', name: 'login', message: '🆕 Entrez le login :' },
      {
        type: 'password',
        name: 'password',
        message: '🔒 Entrez le mot de passe :',
      },
    ]);
  }

  return config.profils[profilAnswer.profilIndex];
}

(async () => {
  try {
    await initConfig();
    config = require(configPath);

    let selectedRecette =
      config.recettes.length === 1 || isAutoMode
        ? config.recettes[0]
        : (
            await inquirer.prompt([
              {
                type: 'list',
                name: 'recette',
                message: '📌 Sélectionnez une recette :',
                choices: config.recettes,
              },
            ])
          ).recette;

    selectedRecette = selectedRecette.endsWith('/')
      ? selectedRecette.slice(0, -1)
      : selectedRecette;

    console.log(`✅ Recette sélectionnée : ${selectedRecette}`);

    let selectedProfil = await choisirProfil();
    console.log(
      `🌍 Connexion en tant que ${selectedProfil.login} sur ${selectedRecette}`,
    );

    const payload = new URLSearchParams({
      email: selectedProfil.login,
      password: selectedProfil.password,
      callBack: `${selectedRecette}/timeline/timeline`,
      details: '',
      rememberMe: 'true',
    });

    const res = await fetch(`${selectedRecette}/auth/login`, {
      method: 'POST',
      body: payload,
      redirect: 'manual',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    const rawCookies = res.headers.raw()['set-cookie'];
    if (!rawCookies) {
      console.error('❌ Aucun cookie reçu. Échec probable de la connexion.');
      return;
    }

    const xsrf = rawCookies
      .find((c) => c.startsWith('XSRF-TOKEN='))
      ?.split(';')[0]
      .split('=')[1];
    const session = rawCookies
      .find((c) => c.startsWith('oneSessionId='))
      ?.split(';')[0]
      .split('=')[1];

    if (!xsrf || !session) {
      console.error('❌ Cookies XSRF-TOKEN ou oneSessionId introuvables.');
      return;
    }

    console.log('🔑 Connexion réussie, récupération des cookies...');
    const now = new Date();
    const timestamp = now.toLocaleString('fr-FR', { timeZone: 'Europe/Paris' });
    const envContent = `# Connected as: ${selectedProfil.login}\n# Date: ${timestamp}\n\nVITE_XSRF_TOKEN=${xsrf}\nVITE_ONE_SESSION_ID=${session}\nVITE_RECETTE=${selectedRecette}\n`;
    fs.writeFileSync('.env', envContent);
    console.log('✅ Cookies enregistrés dans .env');

    if (
      !config.profils.some((profil) => profil.login === selectedProfil.login) &&
      !isAutoMode
    ) {
      console.log('🔑 Nouveau profil ajouté à la configuration.');
      config.profils.push(selectedProfil);
      fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
    }
  } catch (error) {
    console.error('❌ Une erreur est survenue lors de la connexion:', error);
  } finally {
    process.exit(0);
  }
})();
