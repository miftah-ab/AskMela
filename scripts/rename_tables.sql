-- Run this in Supabase SQL Editor to migrate from Abet to AskMela
-- This renames existing tables to preserve your data and enforces case-sensitivity.

ALTER TABLE IF EXISTS AbetBusinesses RENAME TO "AskMelaBusinesses";
ALTER TABLE IF EXISTS AbetDocuments RENAME TO "AskMelaDocuments";
ALTER TABLE IF EXISTS AbetConversations RENAME TO "AskMelaConversations";
ALTER TABLE IF EXISTS AbetNotifications RENAME TO "AskMelaNotifications";
ALTER TABLE IF EXISTS AbetStats RENAME TO "AskMelaStats";
ALTER TABLE IF EXISTS AbetErrorLogs RENAME TO "AskMelaErrorLogs";
ALTER TABLE IF EXISTS AbetAnnouncements RENAME TO "AskMelaAnnouncements";
ALTER TABLE IF EXISTS AbetSystemStats RENAME TO "AskMelaSystemStats";
