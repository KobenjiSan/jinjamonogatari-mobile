# JinjaMonogatari Mobile ⛩️📱

**JinjaMonogatari** is a cultural discovery mobile app that helps users
explore **Shinto shrines, traditions, and history across Japan** through
an interactive map and research-backed content.

This repository contains the **public-facing React Native mobile
application**.\
The companion CMS and backend API are planned but not yet deployed.

The project began as a capstone and is being built toward a real
cultural learning platform.

------------------------------------------------------------------------

# 🌸 Concept

Many visitors encounter shrines without understanding their history,
associated kami, or proper etiquette.

JinjaMonogatari aims to:

-   Encourage respectful shrine visits
-   Provide reliable cultural context
-   Promote research-backed learning
-   Make shrine discovery engaging and accessible

Content is designed to be **curated, cited, and culturally sensitive.**

------------------------------------------------------------------------

# 📱 Current Features (Implemented)

## 🗺️ Shrine Discovery

-   Interactive map with shrine markers
-   Custom shrine icons with selected states
-   Map panning & zooming
-   Map popup preview cards
-   List-based shrine browsing
-   Dynamic distance calculation from user location

------------------------------------------------------------------------

## ⛩️ Shrine Detail Experience

Each shrine supports structured cultural content:

-   Shrine overview info
-   Associated kami
-   Historical entries
-   Folklore stories
-   Image gallery
-   Per-section citations and attribution

Navigation from map or list directly into shrine pages.

------------------------------------------------------------------------

## 🙏 Etiquette Guide

Fully implemented etiquette learning system:

-   Glance cards with icons and short titles
-   Accordion sections with steps and citations
-   Highlight cards for key practices
-   Research-backed etiquette fixtures
-   Reusable citation components

Accessible without authentication.

------------------------------------------------------------------------

## 🖼️ Gallery System

-   Pinterest-style image layout
-   Dynamic modal viewing
-   Image titles, descriptions, and citations
-   Consistent attribution display

------------------------------------------------------------------------

## 📚 Citation System

Reusable citation pipeline across the app:

-   Citation blocks
-   Citation items
-   Image citation overlays
-   External link support

Designed for research transparency and source credibility.

------------------------------------------------------------------------

## 🎨 Global Styling System

Custom token-based styling system:

-   `tokens.ts`
-   `text.ts`
-   `global.ts`

Ensures consistency, scalability, and maintainability.

------------------------------------------------------------------------

# 🚧 In Progress / Planned

## Core Screens

-   Profile screen
-   Saved shrines screen
-   Login & signup
-   App loading / startup flow

------------------------------------------------------------------------

## Feature Improvements

-   Map & list search
-   Gesture-based navigation in shrine sheet
-   Font size refinements
-   API integration for real data
-   Authentication system

------------------------------------------------------------------------

# 🧩 Architecture (Planned)

## Mobile App (This Repo)

-   React Native (Expo)
-   TypeScript
-   Map-based discovery
-   Cultural content consumption

------------------------------------------------------------------------

## CMS (Planned)
-   Editorial workflows
-   Shrine and content management
-   Citation enforcement
-   Role-based access

------------------------------------------------------------------------

## Backend API (Planned)

-   Structured cultural data delivery
-   Authentication & JWT
-   Relational database storage
-   Image metadata handling

------------------------------------------------------------------------

# 🎯 Target Users

-   Study abroad students
-   Travelers in Japan
-   Cultural learners
-   Educators

------------------------------------------------------------------------

# 🌏 Long-Term Vision

-   Expand shrine coverage across Japan
-   Bilingual EN/JP content
-   Student research participation
-   Cultural education partnerships
-   Respectful technology for cultural heritage

------------------------------------------------------------------------

# ⚠️ Cultural Respect

This app is built with respect for Shinto traditions.\
Content prioritizes accuracy, attribution, and cultural sensitivity.

------------------------------------------------------------------------

# ⚙️ Setup & Running Locally

## Prerequisites

-   Node.js (LTS recommended)
-   npm or yarn
-   Expo CLI
-   iOS Simulator (Mac) or Android Studio Emulator
-   Expo Go app (optional)

------------------------------------------------------------------------

## Clone
```bash
git clone https://github.com/yourusername/jinjamonogatari-mobile.git
cd jinjamonogatari-mobile
```
------------------------------------------------------------------------

## Install
```bash
npm install
or
yarn install
```

------------------------------------------------------------------------

## Run
```bash
npx expo start
```
Press i for iOS\
Press a for Android\
Scan QR for device

------------------------------------------------------------------------

# 👤 Author

**Samuel Keller**\
B.S. Information Technology\
Software Development & Digital Media\
Georgia Gwinnett College

------------------------------------------------------------------------

# 📌 Project Status

Active development (MVP stage).\
Mobile app is functionally far along; CMS and API are upcoming phases.
