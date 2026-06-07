# 📋 Plan de Migración y Temas Pendientes

Este documento detalla los pasos necesarios para pasar de la versión de desarrollo (Mocks) a la versión de producción real con Firebase y otras integraciones externas.

## 1. Conexión Real a Firebase

Actualmente la app tiene `useMock: true`. Para activar el backend real:

### Paso 1: Configuración de Entorno
1. Cambiar `useMock: false` en `src/environments/environment.ts` y `environment.development.ts`.
2. Verificar que las credenciales de Firebase en dichos archivos coincidan exactamente con tu proyecto en el Firebase Console.

### Paso 2: Configuración de Firestore
1. En Firebase Console, crea la base de datos de **Firestore**.
2. Define las colecciones: `tasks`, `categories` y `users`.
3. Configura las **Security Rules** para proteger los datos. Ejemplo básico:
   ```javascript
   service cloud.firestore {
     match /databases/{database}/documents {
       match /{collectionName}/{docId} {
         allow read, write: if request.auth != null && request.auth.uid == data.userId;
       }
     }
   }
   ```

### Paso 3: Remote Config (Flags)
1. En Firebase Console, ve a **Remote Config**.
2. Crea un parámetro llamado `categoryFeatureEnabled` de tipo booleano.
3. Establece su valor en `true` y publica los cambios.

---

## 2. Temas Externos y "Mobile-First"

### Paso 4: Push Notifications (FCM)
1. Instalar el plugin de Capacitor: `@capacitor/push-notifications`.
2. Generar el archivo `google-services.json` (Android) y `GoogleService-Info.plist` (iOS) desde el Firebase Console e incluirlos en las carpetas nativas correspondientes.
3. Implementar el listener en `app.ts` para capturar el token de registro del dispositivo.

### Paso 5: Generación de Assets Nativos
1. Instalar `@capacitor/assets`.
2. Preparar una imagen `logo.png` de alta resolución.
3. Ejecutar: `npx capacitor-assets generate` para crear iconos y splash screens para Android e iOS.

### Paso 6: Persistencia Segura
1. Reemplazar `localStorage` en los repositorios por `@capacitor/preferences`. Esto es vital para asegurar que los datos no se borren cuando el sistema operativo necesite liberar espacio en el móvil.

---

## 3. Calidad y Pruebas

### Paso 7: Pruebas de Estrés
1. Validar el comportamiento de la app en modo offline (especialmente el flujo de carga inicial). Actualmente la app requiere conexión para cargar desde Firestore si `useMock` es false.

### Paso 8: Despliegue
1. Configurar **Firebase Hosting** para la versión web: `firebase init hosting`.
2. Ejecutar `npm run build` y luego `firebase deploy`.
