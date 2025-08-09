-- CreateTable
CREATE TABLE "events" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "start_date" TEXT NOT NULL,
    "end_date" TEXT NOT NULL,
    "status" BOOLEAN NOT NULL
);

-- CreateTable
CREATE TABLE "products" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "ai_hint" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "customers" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "phone" TEXT NOT NULL,
    "shop_name" TEXT NOT NULL,
    "joined" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "orders" (
    "order_id" TEXT NOT NULL PRIMARY KEY,
    "shop_name" TEXT NOT NULL,
    "event_id" TEXT NOT NULL,
    "products" TEXT NOT NULL,
    "total" INTEGER NOT NULL,
    "order_date" TEXT NOT NULL,
    CONSTRAINT "orders_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "events" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "check_ins" (
    "customer_id" TEXT NOT NULL,
    "shop_name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "event_id" TEXT NOT NULL,
    "check_in_time" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("customer_id", "event_id"),
    CONSTRAINT "check_ins_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customers" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "check_ins_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "events" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "customers_phone_key" ON "customers"("phone");
