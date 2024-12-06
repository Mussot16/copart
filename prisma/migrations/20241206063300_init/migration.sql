BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[Bid] (
    [id] INT NOT NULL IDENTITY(1,1),
    [amount] FLOAT(53) NOT NULL,
    [userId] INT NOT NULL,
    [carId] INT NOT NULL,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [Bid_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [Bid_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[Car] (
    [id] INT NOT NULL IDENTITY(1,1),
    [make] NVARCHAR(1000) NOT NULL,
    [model] NVARCHAR(1000) NOT NULL,
    [year] INT NOT NULL,
    [price] FLOAT(53) NOT NULL,
    [color] NVARCHAR(1000),
    [mileage] INT,
    [ownerId] INT NOT NULL,
    [description] NVARCHAR(1000),
    [imageUrl] NVARCHAR(1000),
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [Car_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [Car_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[Transaction] (
    [id] INT NOT NULL IDENTITY(1,1),
    [amount] FLOAT(53) NOT NULL,
    [carId] INT NOT NULL,
    [buyerId] INT NOT NULL,
    [sellerId] INT NOT NULL,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [Transaction_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [Transaction_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[User] (
    [id] INT NOT NULL IDENTITY(1,1),
    [name] NVARCHAR(1000) NOT NULL,
    [email] NVARCHAR(1000) NOT NULL,
    [password] NVARCHAR(1000) NOT NULL,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [User_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [User_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [User_email_key] UNIQUE NONCLUSTERED ([email])
);

-- AddForeignKey
ALTER TABLE [dbo].[Bid] ADD CONSTRAINT [Bid_userId_fkey] FOREIGN KEY ([userId]) REFERENCES [dbo].[User]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Bid] ADD CONSTRAINT [Bid_carId_fkey] FOREIGN KEY ([carId]) REFERENCES [dbo].[Car]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Car] ADD CONSTRAINT [Car_ownerId_fkey] FOREIGN KEY ([ownerId]) REFERENCES [dbo].[User]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Transaction] ADD CONSTRAINT [Transaction_carId_fkey] FOREIGN KEY ([carId]) REFERENCES [dbo].[Car]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Transaction] ADD CONSTRAINT [Transaction_buyerId_fkey] FOREIGN KEY ([buyerId]) REFERENCES [dbo].[User]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Transaction] ADD CONSTRAINT [Transaction_sellerId_fkey] FOREIGN KEY ([sellerId]) REFERENCES [dbo].[User]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
