-- DropForeignKey
ALTER TABLE "cart" DROP CONSTRAINT "cart_product_id_fkey";

-- DropForeignKey
ALTER TABLE "order_items" DROP CONSTRAINT "order_items_product_id_fkey";

-- AlterTable
ALTER TABLE "products" ALTER COLUMN "description" SET DATA TYPE VARCHAR(500),
ALTER COLUMN "image" SET DATA TYPE VARCHAR(300);

-- AddForeignKey
ALTER TABLE "cart" ADD CONSTRAINT "cart_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
