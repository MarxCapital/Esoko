/**
 * E-Soko Burundi - Script d'initialisation (Seed) du Premier Compte Administrateur
 * Exécuté côté serveur / backend pour provisionner le rôle 'admin' dans Firestore.
 */
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { readFileSync } from 'fs';
import { join } from 'path';

// Charger la configuration Firebase du projet
const configPath = join(process.cwd(), 'firebase-applet-config.json');
const firebaseConfig = JSON.parse(readFileSync(configPath, 'utf8'));

const app = initializeApp(firebaseConfig);
const db = getFirestore(app, firebaseConfig.firestoreDatabaseId || '(default)');

async function seedAdmin() {
  console.log('--- Initialisation du Premier Compte Administrateur E-Soko ---');

  const rootAdminUser = {
    id: 'admin_esoko_root',
    name: 'Administrateur Général E-Soko',
    email: 'admin@esoka.com',
    phone: '+257 69 00 00 00',
    role: 'admin',
    status: 'active',
    sellerStatus: 'approved',
    address: 'Bujumbura Mairie, Burundi',
    createdAt: new Date().toISOString(),
  };

  const projectOwnerUser = {
    id: 'admin_ttrfamilypro',
    name: 'Super Administrateur E-Soko',
    email: 'ttrfamilypro@gmail.com',
    phone: '+257 69 11 22 33',
    role: 'admin',
    status: 'active',
    sellerStatus: 'approved',
    address: 'Bujumbura, Burundi',
    createdAt: new Date().toISOString(),
  };

  try {
    // 1. Enregistrer dans la collection /users
    await setDoc(doc(db, 'users', rootAdminUser.id), rootAdminUser);
    console.log('Compte racine users/admin_esoko_root créé avec rôle "admin".');

    await setDoc(doc(db, 'users', projectOwnerUser.id), projectOwnerUser);
    console.log('Compte propriétaire users/admin_ttrfamilypro créé avec rôle "admin".');

    // 2. Enregistrer dans la collection /admins pour les règles de sécurité Firestore
    await setDoc(doc(db, 'admins', rootAdminUser.id), {
      email: rootAdminUser.email,
      role: 'admin',
      assignedAt: new Date().toISOString(),
    });
    console.log('Entrée admins/admin_esoko_root créée.');

    await setDoc(doc(db, 'admins', projectOwnerUser.id), {
      email: projectOwnerUser.email,
      role: 'admin',
      assignedAt: new Date().toISOString(),
    });
    console.log('Entrée admins/admin_ttrfamilypro créée.');

    // 3. Initialiser le premier log d'audit dans audit_logs
    const initialLogId = `log_${Date.now()}`;
    await setDoc(doc(db, 'audit_logs', initialLogId), {
      id: initialLogId,
      userId: rootAdminUser.id,
      userName: rootAdminUser.name,
      userRole: 'admin',
      action: 'INITIALISATION_ADMIN_ROOT',
      details: 'Provisionnement initial du compte administrateur racine via script seed serveur.',
      severity: 'info',
      timestamp: new Date().toISOString(),
    });
    console.log('Log initial audit_logs créé avec succès.');

    console.log('Initialisation terminée avec succès !');
    process.exit(0);
  } catch (error) {
    console.error('Erreur lors de l’initialisation de l’administrateur :', error);
    process.exit(1);
  }
}

seedAdmin();
