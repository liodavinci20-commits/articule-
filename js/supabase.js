/* =============================================================
   SUPABASE.JS — Client Supabase (initialisation unique)
============================================================= */

const SUPA_URL = 'https://syicydnsjthkyptnlrsm.supabase.co';
const SUPA_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN5aWN5ZG5zanRoa3lwdG5scnNtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY5ODI3MTMsImV4cCI6MjA5MjU1ODcxM30.HkX01jEe2dyJH1-v95NxR9f-s5v_o66L7fp9aL3YDC0';

const DB = window.supabase.createClient(SUPA_URL, SUPA_KEY);
