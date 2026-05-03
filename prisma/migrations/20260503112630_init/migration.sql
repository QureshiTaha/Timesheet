-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `role` ENUM('EMPLOYEE', 'MANAGER') NOT NULL DEFAULT 'EMPLOYEE',
    `employeeCode` VARCHAR(191) NOT NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `User_email_key`(`email`),
    UNIQUE INDEX `User_employeeCode_key`(`employeeCode`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Client` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `clientCode` VARCHAR(191) NOT NULL,
    `clientName` VARCHAR(191) NOT NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Client_clientCode_key`(`clientCode`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Project` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `activityId` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `clientId` INTEGER NOT NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Project_activityId_key`(`activityId`),
    INDEX `Project_clientId_idx`(`clientId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Task` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `taskId` VARCHAR(191) NOT NULL,
    `taskName` VARCHAR(191) NOT NULL,
    `poRef` VARCHAR(191) NULL,
    `projectId` INTEGER NOT NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `Task_projectId_idx`(`projectId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Timesheet` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `clientId` INTEGER NOT NULL,
    `projectId` INTEGER NOT NULL,
    `taskId` INTEGER NOT NULL,
    `date` DATETIME(3) NOT NULL,
    `weekNo` INTEGER NOT NULL,
    `weekLabel` VARCHAR(191) NOT NULL,
    `description` TEXT NOT NULL,
    `hours` DECIMAL(5, 2) NOT NULL,
    `minutes` INTEGER NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `sat` DECIMAL(5, 2) NOT NULL DEFAULT 0,
    `sun` DECIMAL(5, 2) NOT NULL DEFAULT 0,
    `mon` DECIMAL(5, 2) NOT NULL DEFAULT 0,
    `tue` DECIMAL(5, 2) NOT NULL DEFAULT 0,
    `wed` DECIMAL(5, 2) NOT NULL DEFAULT 0,
    `thu` DECIMAL(5, 2) NOT NULL DEFAULT 0,
    `fri` DECIMAL(5, 2) NOT NULL DEFAULT 0,
    `status` ENUM('DRAFT', 'SUBMITTED', 'APPROVED', 'REJECTED') NOT NULL DEFAULT 'DRAFT',
    `submittedAt` DATETIME(3) NULL,
    `approvedAt` DATETIME(3) NULL,
    `rejectionNote` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `Timesheet_userId_idx`(`userId`),
    INDEX `Timesheet_date_idx`(`date`),
    INDEX `Timesheet_status_idx`(`status`),
    INDEX `Timesheet_clientId_idx`(`clientId`),
    INDEX `Timesheet_projectId_idx`(`projectId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SandboxEntry` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `originalId` INTEGER NULL,
    `userId` INTEGER NOT NULL,
    `clientId` INTEGER NOT NULL,
    `projectId` INTEGER NOT NULL,
    `taskId` INTEGER NOT NULL,
    `date` DATETIME(3) NOT NULL,
    `weekNo` INTEGER NOT NULL,
    `weekLabel` VARCHAR(191) NOT NULL,
    `description` TEXT NOT NULL,
    `hours` DECIMAL(5, 2) NOT NULL,
    `minutes` INTEGER NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `sat` DECIMAL(5, 2) NOT NULL DEFAULT 0,
    `sun` DECIMAL(5, 2) NOT NULL DEFAULT 0,
    `mon` DECIMAL(5, 2) NOT NULL DEFAULT 0,
    `tue` DECIMAL(5, 2) NOT NULL DEFAULT 0,
    `wed` DECIMAL(5, 2) NOT NULL DEFAULT 0,
    `thu` DECIMAL(5, 2) NOT NULL DEFAULT 0,
    `fri` DECIMAL(5, 2) NOT NULL DEFAULT 0,
    `sandboxLabel` VARCHAR(191) NOT NULL,
    `isDeleted` BOOLEAN NOT NULL DEFAULT false,
    `isAdded` BOOLEAN NOT NULL DEFAULT false,
    `isModified` BOOLEAN NOT NULL DEFAULT false,
    `managerNote` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `SandboxEntry_sandboxLabel_idx`(`sandboxLabel`),
    INDEX `SandboxEntry_userId_idx`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `MISReport` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(191) NOT NULL,
    `periodStart` DATETIME(3) NOT NULL,
    `periodEnd` DATETIME(3) NOT NULL,
    `sandboxLabel` VARCHAR(191) NULL,
    `isFinal` BOOLEAN NOT NULL DEFAULT false,
    `createdById` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `data` JSON NOT NULL,

    INDEX `MISReport_createdById_idx`(`createdById`),
    INDEX `MISReport_periodStart_periodEnd_idx`(`periodStart`, `periodEnd`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Session` (
    `id` VARCHAR(191) NOT NULL,
    `userId` INTEGER NOT NULL,
    `expiresAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AuditLog` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `action` VARCHAR(191) NOT NULL,
    `entity` VARCHAR(191) NOT NULL,
    `entityId` VARCHAR(191) NULL,
    `meta` JSON NULL,
    `ip` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `AuditLog_userId_idx`(`userId`),
    INDEX `AuditLog_createdAt_idx`(`createdAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Project` ADD CONSTRAINT `Project_clientId_fkey` FOREIGN KEY (`clientId`) REFERENCES `Client`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Task` ADD CONSTRAINT `Task_projectId_fkey` FOREIGN KEY (`projectId`) REFERENCES `Project`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Timesheet` ADD CONSTRAINT `Timesheet_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Timesheet` ADD CONSTRAINT `Timesheet_clientId_fkey` FOREIGN KEY (`clientId`) REFERENCES `Client`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Timesheet` ADD CONSTRAINT `Timesheet_projectId_fkey` FOREIGN KEY (`projectId`) REFERENCES `Project`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Timesheet` ADD CONSTRAINT `Timesheet_taskId_fkey` FOREIGN KEY (`taskId`) REFERENCES `Task`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SandboxEntry` ADD CONSTRAINT `SandboxEntry_originalId_fkey` FOREIGN KEY (`originalId`) REFERENCES `Timesheet`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MISReport` ADD CONSTRAINT `MISReport_createdById_fkey` FOREIGN KEY (`createdById`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Session` ADD CONSTRAINT `Session_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AuditLog` ADD CONSTRAINT `AuditLog_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
