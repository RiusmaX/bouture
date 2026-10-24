-- CreateEnum
CREATE TYPE "Category" AS ENUM ('tree', 'shrub', 'perennial', 'climber', 'hedge', 'fruit', 'aromatic');

-- CreateTable
CREATE TABLE "plants" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(120) NOT NULL,
    "latin_name" VARCHAR(120) NOT NULL,
    "category" "Category" NOT NULL,
    "pot_size" VARCHAR(30) NOT NULL,
    "price_cents" INTEGER NOT NULL,
    "stock" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "plants_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "plants_category_idx" ON "plants"("category");
