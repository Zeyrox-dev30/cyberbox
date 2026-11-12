// 1. NAVIGATION ENTRE LES 4 ONGLETS
function ouvrirOnglet(nomOnglet, boutonClique) {
    document.querySelectorAll('.tool-card').forEach(section => {
        section.classList.add('hidden');
    });
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    document.getElementById('tab-' + nomOnglet).classList.remove('hidden');
    boutonClique.classList.add('active');
}

// Bouton Copier universel
function copierTexte(idInput, bouton) {
    const champ = document.getElementById(idInput);
    if (!champ || !champ.value || champ.value.startsWith("Clique")) return;

    navigator.clipboard.writeText(champ.value);
    const texteOriginal = bouton.innerText;
    bouton.innerText = "✅";
    setTimeout(() => {
        bouton.innerText = texteOriginal;
    }, 1500);
}

// 2. OUTIL 1 : GÉNÉRATEUR DE MOTS DE PASSE SÉCURISÉS
function majLongueur() {
    const val = document.getElementById('mdp-longueur').value;
    document.getElementById('mdp-longueur-val').innerText = val;
}

function genererMDP() {
    const longueur = parseInt(document.getElementById('mdp-longueur').value);
    const avecMaj = document.getElementById('chk-maj').checked;
    const avecMin = document.getElementById('chk-min').checked;
    const avecNum = document.getElementById('chk-num').checked;
    const avecSym = document.getElementById('chk-sym').checked;

    let caracteres = "";
    if (avecMaj) caracteres += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    if (avecMin) caracteres += "abcdefghijklmnopqrstuvwxyz";
    if (avecNum) caracteres += "0123456789";
    if (avecSym) caracteres += "!@#$%^&*()_+-=[]{}|;:,.<>?";

    if (caracteres === "") {
        alert("Coche au moins une option de caractères !");
        return;
    }

    // Utilisation de crypto.getRandomValues pour une sécurité maximale
    const array = new Uint32Array(longueur);
    window.crypto.getRandomValues(array);

    let motDePasse = "";
    for (let i = 0; i < longueur; i++) {
        motDePasse += caracteres[array[i] % caracteres.length];
    }

    document.getElementById('mdp-resultat').value = motDePasse;
    evaluerSecurite(longueur, avecMaj, avecMin, avecNum, avecSym);
}

function evaluerSecurite(longueur, maj, min, num, sym) {
    const barre = document.getElementById('strength-bar');
    const texte = document.getElementById('strength-text');
    let score = 0;

    if (longueur >= 12) score += 2;
    else if (longueur >= 8) score += 1;
    if (maj) score++;
    if (min) score++;
    if (num) score++;
    if (sym) score++;

    if (score <= 3) {
        barre.style.width = "35%";
        barre.style.background = "#f87171";
        texte.innerText = "Sécurité : Faible (augmente la longueur)";
        texte.style.color = "#f87171";
    } else if (score <= 5) {
        barre.style.width = "70%";
        barre.style.background = "#facc15";
        texte.innerText = "Sécurité : Bonne";
        texte.style.color = "#facc15";
    } else {
        barre.style.width = "100%";
        barre.style.background = "#34d399";
        texte.innerText = "Sécurité : Inviolable (Niveau Cyber)";
        texte.style.color = "#34d399";
    }
}

// 3. OUTIL 2 : GÉNÉRATEUR DE QR CODE INSTANTANÉ
function genererQR() {
    const contenu = document.getElementById('qr-input').value.trim();
    if (contenu === "") {
        alert("Écris un lien ou un texte d'abord !");
        return;
    }

       const sousDomaine = "api.";
    const baseApi = "https://" + sousDomaine + "qrserver.com";
    const cheminApi = "/v1/create-qr-code/?size=220x220&data=";
    const urlQR = baseApi + cheminApi + encodeURIComponent(contenu);

    const img = document.getElementById('qr-img');
    img.src = urlQR;
    document.getElementById('qr-zone').classList.remove('hidden');
}

// 4. OUTIL 3 : ENCODEUR / DÉCODEUR SECRET (BASE64 UTF-8)
function coderMessage() {
    const texte = document.getElementById('crypto-input').value;
    if (!texte) return;
    // Encodage compatible avec les accents et emojis
    const code = btoa(unescape(encodeURIComponent(texte)));
    document.getElementById('crypto-resultat').value = code;
}

function decoderMessage() {
    const code = document.getElementById('crypto-input').value.trim();
    if (!code) return;
    try {
        const decode = decodeURIComponent(escape(atob(code)));
        document.getElementById('crypto-resultat').value = decode;
    } catch (e) {
        document.getElementById('crypto-resultat').value = "❌ Code invalide ou corrompu !";
    }
}

// 5. OUTIL 4 : ANALYSEUR DE TEXTE EN TEMPS RÉEL
function analyserTexte() {
    const texte = document.getElementById('analyse-input').value;
    const chars = texte.length;
    const mots = texte.trim() === "" ? 0 : texte.trim().split(/\s+/).length;
    const secondes = Math.ceil((mots / 200) * 60);

    document.getElementById('stat-chars').innerText = chars;
    document.getElementById('stat-mots').innerText = mots;
    document.getElementById('stat-temps').innerText = secondes < 60 
        ? secondes + "s" 
        : Math.ceil(secondes / 60) + " min";
}

// Générer un premier mot de passe dès l'ouverture
window.onload = genererMDP;
