# Project Setup and Run Guide

This project is built using Next.js.

## Prerequisites

Before you begin, ensure you have met the following requirements:
- You have installed Node.js and npm.
- You have a running instance of a PostgreSQL database.

## Setup

1. Clone the repository
2. Run the db.sql in postgres to create the required tables
3. Create an .env file for DB credentials and API path (refer: example.env)
4. Run npm install followed by npm run build and npm run start
5. By default app will run at localhost:3000

## Query Design Decisions

The app is very simple and most of the queries are just to satisfy the CRUD operations except the one query to disply the hierarchical team structures

### Recursive Queries for Team Structure

To efficiently manage hierarchical team structures, we use recursive queries. This allows me to fetch nested team data in a single query, reducing the need for multiple database calls. The recursive query is implemented in the 'src/pages/api/teams/index.ts' file.

## Technical choices rationale
I choose nextJs as the framework because am familiarize with it and to do the assignment quickly. and can have api also in the same project.
I used mix of server side rendering and client rendering just to demo the features
used package 'pg' for database raw querying

## Notes on Production Deployment
Using more secure method of storing secrets such as AWS secrets manager
Moving to container based approach for easy distribution and scaling