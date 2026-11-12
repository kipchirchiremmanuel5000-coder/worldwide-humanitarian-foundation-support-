/**
 * WHFS Firebase Initialization & Cloud Firestore Bridge
 *
 * Uses the provisioned Firebase configuration for project `whfs-3f347`
 * loaded from `firebase-applet-config.json`.
 */

import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore, doc, getDocFromServer } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export const PRIMARY_ADMIN_EMAIL = 'kipchirchiremmanuel5000@gmail.com';
export const ADMIN_EMAILS = [
  'kipchirchiremmanuel5000@gmail.com',
  'admin@whfs.org'
] as const;

export const isAdminEmail = (email?: string | null): boolean => {
  if (!email) return false;
  return ADMIN_EMAILS.includes(email.trim().toLowerCase() as (typeof ADMIN_EMAILS)[number]);
};

export const FIRESTORE_COLLECTIONS = {
  USERS: 'users',
  APPLICATIONS: 'applications',
  APPLICATION_STATUS: 'application_status',
  PAYMENTS: 'payments',
  DONATIONS: 'donations',
  WITHDRAWALS: 'withdrawals',
  SETTINGS: 'settings',
  ADMINS: 'admins'
} as const;

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write'
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(
  error: unknown,
  operationType: OperationType,
  path: string | null
): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo:
        auth.currentUser?.providerData?.map((provider) => ({
          providerId: provider.providerId,
          email: provider.email
        })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Validate live Cloud Firestore connection on boot
async function testConnection() {
  try {
    await getDocFromServer(doc(db, FIRESTORE_COLLECTIONS.SETTINGS, 'payout'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error('Please check your Firebase configuration.');
    }
  }
}

if (typeof window !== 'undefined') {
  testConnection();
}

export interface FirebaseClientConfig {
  apiKey?: string;
  authDomain?: string;
  projectId?: string;
  storageBucket?: string;
  messagingSenderId?: string;
  appId?: string;
  firestoreDatabaseId?: string;
}

export const getFirebaseConfig = (): FirebaseClientConfig => {
  return {
    apiKey: firebaseConfig.apiKey,
    authDomain: firebaseConfig.authDomain,
    projectId: firebaseConfig.projectId,
    storageBucket: firebaseConfig.storageBucket,
    messagingSenderId: firebaseConfig.messagingSenderId,
    appId: firebaseConfig.appId,
    firestoreDatabaseId: firebaseConfig.firestoreDatabaseId
  };
};

export const isFirebaseConfigured = (): boolean => {
  return Boolean(firebaseConfig.apiKey && firebaseConfig.projectId && firebaseConfig.authDomain);
};

export const FIRESTORE_SECURITY_RULES_PREVIEW = `rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    function isSignedIn() {
      return request.auth != null;
    }
    function isAdmin() {
      return isSignedIn() && (
        exists(/databases/$(database)/documents/admins/$(request.auth.uid)) ||
        request.auth.token.email == 'kipchirchiremmanuel5000@gmail.com'
      );
    }

    match /applications/{applicationId} {
      allow get, list: if isAdmin() || (isSignedIn() && resource.data.userId == request.auth.uid);
      allow create: if request.resource.data.status == 'pending';
      allow update, delete: if isAdmin();
    }

    match /application_status/{applicationId} {
      allow get: if true;
      allow list, update, delete: if isAdmin();
      allow create: if request.resource.data.status == 'pending';
    }

    match /payments/{paymentId} {
      allow read, update, delete: if isAdmin();
      allow create: if true;
    }

    match /donations/{donationId} {
      allow read, update, delete: if isAdmin();
      allow create: if true;
    }

    match /withdrawals/{withdrawalId} {
      allow read, write: if isAdmin();
    }

    match /settings/{settingId} {
      allow get: if settingId == 'payout';
      allow list, write: if isAdmin();
    }
  }
}`;
