# Lost & Found - Campus Item Recovery Application

A web application to help campus users report and find lost or found items.

## Project Setup

### Prerequisites

Before setting up the project, make sure you have the following installed:

1. **Node.js and npm** - [Install Node.js](https://nodejs.org/) (v16 or newer recommended)
2. **MongoDB** - [Install MongoDB Community Edition](https://www.mongodb.com/try/download/community)
3. **Git** - [Install Git](https://git-scm.com/downloads) (optional, for version control)

### Installation Steps

1. **Clone the repository**

```bash
git clone <repository_url>
cd lost-and-found
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up MongoDB**

- Start MongoDB service on your machine
- Create a new database named `lostfound`

```bash
mongod --dbpath /path/to/data/directory
```

4. **Configure environment variables**

Create a `.env` file in the project root with the following variables:

```
MONGODB_URI=mongodb://localhost:27017/lostfound
```

5. **Start the development server**

```bash
npm run dev
```

6. **Access the application**

Open your browser and navigate to:

```
http://localhost:5173/
```

## Application Structure

The application is built using:

- React with TypeScript
- Vite as the build tool
- Tailwind CSS and shadcn/ui for styling
- MongoDB for database storage
- React Router for navigation

### Key Features

1. **User Authentication**

   - Register with name, email, and password
   - Login/logout functionality
   - Dashboard to view personal items

2. **Lost Items Management**

   - Report lost items with details and images
   - Browse and filter lost items

3. **Found Items Management**

   - Report found items with details and images
   - Browse and filter found items

4. **Matching System**
   - Algorithm to match lost and found items
   - Request to claim functionality

## Data Models

### User

- id: string
- email: string
- name: string
- password: string (hashed)

### Item

- id: string
- name: string
- category: string
- location: string
- date: string
- description: string
- imageUrl: string
- userId: string
- userName: string
- contactInfo: string
- createdAt: string
- type: "lost" | "found"
- status: "searching" | "matched" | "claimed" | "resolved"

## MongoDB Collections

- `users` - User accounts and authentication
- `lostItems` - Items reported as lost
- `foundItems` - Items reported as found
- `images` - GridFS storage for image files

## Customization

You can customize the application by modifying:

- Theme colors in the Tailwind configuration
- Component styles in the respective component files
- MongoDB connection settings in the `src/config/mongodb.ts` file

## Deployment

For production deployment:

1. Build the application

```bash
npm run build
```

2. Serve the built files using a static file server

```bash
npm run preview
```
