"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, limit, query, setDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase/config";

export default function TestDB() {
  const [status, setStatus] = useState<string>("Testing connection...");
  const [error, setError] = useState<string>("");

  useEffect(() => {
    async function testConnection() {
      try {
        // Attempt a very simple read
        setStatus("Testing read access...");
        const q = query(collection(db, "jobs"), limit(1));
        await getDocs(q);
        
        setStatus("Read successful! Testing write access...");
        
        // Attempt a simple write
        await setDoc(doc(db, "test", "ping"), { timestamp: Date.now() });
        
        setStatus("✅ Database Connection is PERFECT!");
      } catch (err: any) {
        console.error("Test DB Error:", err);
        setStatus("❌ Connection Failed");
        setError(err.message || err.toString());
      }
    }
    
    testConnection();
  }, []);

  return (
    <div className="min-h-screen pt-32 px-8">
      <h1 className="text-3xl font-bold mb-4">Firestore Diagnostic Test</h1>
      
      <div className="p-6 bg-slate-100 rounded-xl border border-slate-200">
        <p className="text-xl font-medium mb-2">Status: {status}</p>
        
        {error && (
          <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-lg whitespace-pre-wrap">
            <span className="font-bold">Error Details:</span><br/>
            {error}
          </div>
        )}
      </div>
    </div>
  );
}
