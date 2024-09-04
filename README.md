# Wardi Project

## Overview

Wardi is a web application designed to provide Users with access to various Islamic resources, including the Quran, Hadith, and Tafsir. The application is built using Node.js, Express, and MongoDB, and it follows a modular architecture to ensure scalability and maintainability.

**This is a Temporary Readme that I just made to not get bored, nothing's Over yet 🙂**

## Features

### 1. Quran
- **View All Chapters**: Users can view all chapters of the Quran.
- **View Specific Chapter**: Users can view a specific chapter by its number.
- **View Pages**: Users can view pages of the Quran.
- **View Juzs**: Users can view different Juzs (sections) of the Quran.
- **Chapter Information**: Users can view detailed information about each chapter.

### 2. Hadith
- **View All Hadiths**: Users can view all Hadiths.
- **View Specific Hadith**: Users can view a specific Hadith by its ID.

### 3. Tafsir
- **View All Tafsirs**: Users can view all Tafsirs.
- **View Specific Tafsir**: Users can view a specific Tafsir by its ID.

### 4. User Authentication
- **User Registration**: Users can register for an account.
- **User Login**: Users can log in to their account.
- **User Profile**: Users can view and update their profile information.

### 5. Security Features
- **Rate Limiting**: Limits the number of requests from a single IP to prevent abuse.
- **Data Sanitization**: Sanitizes user input to prevent NoSQL injection and XSS attacks.
- **HTTP Headers**: Uses Helmet to set secure HTTP headers.

### 6. Error Handling
- **Global Error Handling**: Centralized error handling for all routes and controllers.
- **Custom Error Messages**: Provides custom error messages for different types of errors.

## Project Structure
