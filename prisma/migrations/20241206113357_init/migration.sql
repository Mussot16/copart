BEGIN TRY

BEGIN TRAN;

-- DropForeignKey
ALTER TABLE [dbo].[Bid] DROP CONSTRAINT [Bid_carId_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[Car] DROP CONSTRAINT [Car_ownerId_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[Transaction] DROP CONSTRAINT [Transaction_carId_fkey];

-- AlterTable
ALTER TABLE [dbo].[Car] ADD [buyNowPrice] FLOAT(53),
[buyerId] INT,
[sold] BIT NOT NULL CONSTRAINT [Car_sold_df] DEFAULT 0;

-- AddForeignKey
ALTER TABLE [dbo].[Bid] ADD CONSTRAINT [Bid_carId_fkey] FOREIGN KEY ([carId]) REFERENCES [dbo].[Car]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Car] ADD CONSTRAINT [Car_buyerId_fkey] FOREIGN KEY ([buyerId]) REFERENCES [dbo].[User]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Car] ADD CONSTRAINT [Car_ownerId_fkey] FOREIGN KEY ([ownerId]) REFERENCES [dbo].[User]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Transaction] ADD CONSTRAINT [Transaction_carId_fkey] FOREIGN KEY ([carId]) REFERENCES [dbo].[Car]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
