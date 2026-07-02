import { initializeApp } from "firebase/app";
import { getFirestore, collection, doc, setDoc } from "firebase/firestore";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const products = require("../products.json");

const firebaseConfig = {
  apiKey: "AIzaSyDomUqea4ldY0IOVYucMnBy77JnxUFzBEM",
  authDomain: "vividtechhub-545d3.firebaseapp.com",
  projectId: "vividtechhub-545d3",
  storageBucket: "vividtechhub-545d3.firebasestorage.app",
  messagingSenderId: "39573263973",
  appId: "1:39573263973:web:16c0c4d2ff88ea1c4d988c",
};

const app = initializeApp(firebaseConfig);
const db  = getFirestore(app);

async function migrate() {
  console.log(`Migrating ${products.length} products to Firestore…`);
  for (const product of products) {
    await setDoc(doc(collection(db, "products"), String(product.id)), product);
    console.log(`✓ Uploaded: ${product.title}`);
  }
  console.log("Migration complete!");
  process.exit(0);
}

migrate().catch((err) => { console.error(err); process.exit(1); });