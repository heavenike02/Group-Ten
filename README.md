# Cloutchasers

Cloutchasers is a cutting-edge fintech platform that leverages the power of social media and AI to unlock credit opportunities for influencers.<br><br> By combining nontraditional data (such as social metrics, influencer proposals, and bank statements) with advanced underwriting techniques, Cloutchasers aims to empower digital creators by offering them tailored loan products and financial services.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Architecture](#architecture)
- [How It Works](#how-it-works)
- [Usage](#usage)
- [Challenges and Future Work](#challenges-and-future-work)


## Overview

Influencers often struggle to access credit due to their lack of traditional credit history. Cloutchasers changes that by:
- **Integrating Social Data:** Consolidating metrics from various social platforms.
- **AI-Powered Underwriting:** Leveraging OpenAI to validate loan applications by analyzing influencer profiles, bank statements, and proposals.
- **Secure Transactions:** Utilizing Stripe to handle all transactions and backend operations securely.

The project is built as a startup venture with a focus on simplicity, scalability, and transparency.

## Features

- **Alternative Credit Assessment:**
  Utilizes nontraditional data to determine creditworthiness.

- **OpenAI Integration:**
  Leverages state-of-the-art natural language processing to validate and analyze influencer data.

- **YouTube API Integration:** Uses the YouTube Data API to gather comprehensive influencer data.

- **Stripe Integration:**
  Facilitates secure, end-to-end payment processing and transaction management.

- **TypeScript-Powered Codebase:**
  Provides a robust, maintainable, and scalable code foundation.

## Technology Stack

- **Language:** TypeScript
- **AI:** OpenAI API for application validation and risk assessment.
- **Data API:** YouTube API for collecting influencer data.
- **Database:** Supabase for storing user data and loan information.
- **Payments & Transactions:** Stripe API for managing backend financial operations.
- **Version Control:** Git & GitHub for collaboration and code management.
- **Deployment:** (Include deployment details if applicable, e.g., Docker, AWS, etc.)

## Architecture

Cloutchasers' architecture is modular, separating concerns between data ingestion, AI-based underwriting, and transaction management. The main modules include:
- **Data Aggregation Module:** Collects and normalizes data from social media platforms and financial records.
- **Underwriting Engine:** Implements the credit scoring model using a combination of traditional metrics and influencer-specific KPIs.
- **Transaction Manager:** Integrates with Stripe to manage disbursements and repayments.

## How It Works

1. **Data Collection:**
   - Social metrics (followers, engagement, etc.) are aggregated.
   - Financial data such as bank statements and loan proposals are ingested.

2. **Application Validation:**
   - The OpenAI API analyzes textual and numerical data of videos to generate a brand safety score.
   - The algorithm analyzes data from YouTube Data API to determine the content creator score.

3. **Loan Decision & Disbursement:**
   - Based on the computed score, the system determines the loan amount and terms.
   - Once approved, funds are securely disbursed using Stripe's payment infrastructure.


## Usage

1. **User Onboarding**
    - User submits channel link
    - API fetches engagement metrics
    - Engine assesses whether the user is eligible for a credit
2. **Credit Limit Assessment**
    - The credit decision engine calculates the credit limit
    - If a user requests a loan beyond their eligible limit, the engine suggests a lower credit amount.
    - Once a user accepts a credit, Stripe Issuing generates a virtual or a physical card
## Challenges and Future Work

**Current Challenges:**
- Ensuring data consistency across various social media platforms.
- Balancing between traditional credit metrics and alternative influencer data.
- Managing privacy and compliance issues when using nontraditional data sources.

**Future Enhancements:**
- Implementation of the Stripe Cards with Credit Options once the feature exits beta.
- Introduction of YouTube Validation and Authorization for content creators requesting credit.
- Integration of additional data sources for a more comprehensive risk assessment.
- Enhancement the AI models with machine learning to improve prediction accuracy.
- Real-time tracking of user activity for risk assessment adjustment and enablement of potential credit limit increase
- Brand partnership opportunities based on their YouTube data and financial spending

