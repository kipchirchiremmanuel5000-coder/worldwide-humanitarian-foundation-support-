/**
 * WHFS Firebase Configuration & Integration Bridge
 * 
 * This module prepares WHFS for live integration with Firebase Authentication
 * and Cloud Firestore. If Firebase credentials or configuration are provided in the environment,
 * it boots the live Firebase SDK; otherwise, it seamlessly routes through the reactive
 * local persistence engine with full schema compliance.
 */

export interface FirebaseClientConfig {
  apiKey?: string;
  authDomain?: string;
  projectId?: string;
  storageBucket?: string;
  messagingSenderId?: string;
  appId?: string;
}

export const getFirebaseConfig = (): FirebaseClientConfig => {
  return {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'whfs-humanitarian-portal',
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
    appId: import.meta.env.VITE_FIREBASE_APP_ID || ''
  };
};

export const isFirebaseConfigured = (): boolean => {
  const config = getFirebaseConfig();
  return Boolean(config.apiKey && config.projectId && config.authDomain);
};

export const FIRESTORE_COLLECTIONS = {
  USERS: 'users',
  APPLICATIONS: 'humanitarian_applications',
  DONATIONS: 'donations',
  PROGRAMMES: 'programmes',
  ACTIVITY_LOGS: 'activity_logs'
} as const;

export const FIRESTORE_SECURITY_RULES_PREVIEW = `rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Helper functions
    function isAuthenticated() {
      return request.auth != null;
    }
    function isOwner(userId) {
      return isAuthenticated() && request.auth.uid == userId;
    }
    function isAdmin() {
      return isAuthenticated() && 
        (request.auth.token.role == 'admin' || 
         get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin');
    }

    // Users collection
    match /users/{userId} {
      allow read: if isAuthenticated();
      allow write: if isOwner(userId) || isAdmin();
    }

    // Applications collection
    match /humanitarian_applications/{applicationId} {
      allow read: if isOwner(resource.data.userId) || isAdmin();
      allow create: if isAuthenticated() && request.resource.data.userId == request.auth.uid;
      allow update, delete: if isAdmin();
    }

    // Donations (public record with masked private data, or admin access)
    match /donations/{donationId} {
      allow read: if true;
      allow create: if true;
      allow update, delete: if isAdmin();
    }
  }
}`;
