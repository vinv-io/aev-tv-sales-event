# AQUA VN - Event and Product Promotion Platform

**Khơi nguồn cảm hứng sống**

This is a comprehensive web application designed for managing promotional events and product orders. It features a public-facing site for shop owners to place orders and track their performance, as well as a secure admin panel for complete management of the platform's data.

---

## 🌟 Features

### Public-Facing Application

* **User Check-in:** Shop owners can check in using their phone number and select an active promotional event.
* **Product Ordering:** Browse a paginated and searchable product catalog, manage a shopping cart, and place orders.
* **Live Leaderboards:** View real-time rankings of top-performing shops for different events to foster competition.
* **Bilingual Support:** The user interface supports Vietnamese (default) and English languages.

### Admin Panel

* **Secure Login:** The admin dashboard is protected by a login page.
* **Central Dashboard:** Get an at-a-glance overview of key metrics, including sales trends and top performers.
* **Full CRUD Management:**
  * **Events:** Create, edit, and delete promotional events.
  * **Products:** Manage product details, including names, descriptions, and image URLs.
  * **Shops:** View and manage all registered customer accounts.
* **Reporting & Data Export:** Generate reports for check-ins and sales orders by event, and export the data to Excel.

---

## 🚀 Tech Stack

* **Framework:** [Next.js 14](https://nextjs.org/) (with App Router)
* **Language:** [TypeScript](https://www.typescriptlang.org/)
* **Styling:** [Tailwind CSS](https://tailwindcss.com/) & [shadcn/ui](https://ui.shadcn.com/)
* **Database:** [PostgreSQL](https://www.postgresql.org/)
* **ORM:** [Prisma ORM](https://www.prisma.io/)
* **Internationalization:** [next-intl](https://next-intl-docs.vercel.app/)
* **Deployment:** [Docker](https://www.docker.com/)

---

## 🌐 Language Configuration

The application defaults to **Vietnamese (vi)** as the primary language:
* **Default URL:** `http://localhost:9002` → redirects to `/vi`
* **Vietnamese:** `http://localhost:9002/vi` (default)
* **English:** `http://localhost:9002/en`
* **Language switching:** Available via the language switcher component

---

## 🛠️ Getting Started

Follow these instructions to set up and run the project locally for development or to deploy it in production.

### Prerequisites

* [Node.js](https://nodejs.org/en) (version 20.x or later)
* [Docker](https://www.docker.com/products/docker-desktop/) and Docker Compose

### Local Development Setup

1. **Download and extract the project:**

   Download the project files and extract them to your desired directory.

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Set up environment variables:**

   Create environment files in the root of the project:
   
   `.env.local` (for Next.js):
   
   ```env
   DATA_SOURCE=prisma
   DATABASE_URL="file:./prisma/dev.db"
   ```
   
   `.env` (for Prisma CLI):
   
   ```env
   DATABASE_URL="file:./prisma/dev.db"
   ```

4. **Set up the database:**

   ```bash
   npx prisma db push
   npx prisma db seed
   ```

5. **Run the development server:**

   ```bash
   npm run dev
   ```

   The application will be available at [http://localhost:9002](http://localhost:9002) (Vietnamese) or [http://localhost:9002/en](http://localhost:9002/en) (English).

---

## 🐳 Deployment with Docker

The project is pre-configured with a `docker-compose.yml` file for easy deployment. This will create two containers: one for the Next.js application and one for the PostgreSQL database.

1. **Set up environment variables:**

   Create a file named `.env` in the root of the project and add the following line. This tells the application to connect to the PostgreSQL database in the Docker container.
   
   ```env
   DATA_SOURCE=postgres
   ```

2. **Build and run the Docker containers:**

   This command will build the images and start the containers in the background.
   
   ```bash
   docker-compose up --build -d
   ```

3. **Run database migrations:**

   After the containers have started, execute the following command to set up the database schema.
   
   ```bash
   docker-compose exec app npm run db:migrate
   ```

4. **Access the application:**

   The application will be running and accessible at [http://localhost:3000](http://localhost:3000).

---

## 📁 Project Structure

```text
src/
├── app/                    # Next.js App Router
│   ├── [locale]/          # Internationalized routes
│   │   ├── page.tsx       # Homepage
│   │   ├── checkout/      # Checkout page
│   │   ├── leaderboard/   # Leaderboard pages
│   │   └── order/         # Product ordering
│   └── admin/             # Admin dashboard
├── components/            # Reusable UI components
│   └── ui/               # shadcn/ui components
├── hooks/                # Custom React hooks
├── i18n/                 # Internationalization config
├── lib/                  # Utility functions and data layer
│   └── data/             # Database operations
└── messages/             # Translation files
```

---

## 🌍 Internationalization

The application supports full internationalization with:

* **Supported Languages:** Vietnamese (vi), English (en)
* **Default Language:** Vietnamese (vi)
* **URL Structure:**
  * Vietnamese: `/vi/...` (default)
  * English: `/en/...`
* **Translation Files:** Located in `/messages/` directory
* **Framework:** [next-intl](https://next-intl-docs.vercel.app/)

---

## 🔧 Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Database operations
npx prisma db push        # Push schema changes
npx prisma db seed        # Seed database with mock data
npx prisma generate       # Generate Prisma client
npx prisma studio         # Open Prisma Studio

# Docker operations
docker-compose up -d      # Start containers
docker-compose down       # Stop containers
docker-compose logs       # View logs
```

---

## 📝 Recent Updates

* ✅ **Migrated from Drizzle to Prisma ORM** for better TypeScript support
* ✅ **Set Vietnamese as default language** with disabled browser detection
* ✅ **Comprehensive project cleanup** - removed test files and unused code
* ✅ **Updated project structure** following Next.js 14 best practices
* ✅ **Fixed internationalization routing** for proper locale handling

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 📞 Support

For support, email [support@aquavn.com](mailto:support@aquavn.com) or create an issue in this repository.

---

Made with ❤️ by AQUA VN Team
