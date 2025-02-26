'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('files', {
            id: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
                allowNull: false,
                primaryKey: true,
            },
            userId: {
                type: Sequelize.UUID,
                allowNull: true,
                references: {
                    model: 'users',
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'SET NULL',
            },
            sessionId: {
                type: Sequelize.STRING,
                allowNull: true, // Tracks anonymous users
            },
            originalName: {
                type: Sequelize.STRING(255),
                allowNull: false,
            },
            filename: {
                type: Sequelize.STRING(255),
                allowNull: false,
            },
            size: {
                type: Sequelize.BIGINT,
                allowNull: false,
            },
            mimeType: {
                type: Sequelize.STRING(100),
                allowNull: false,
            },
            fileHash: {
                type: Sequelize.STRING(64),
                allowNull: false, // SHA-256 file integrity hash
            },
            dimensions: {
                type: Sequelize.JSON,
                allowNull: true, // Only for images
            },
            createdAt: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            },
            updatedAt: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
            },
        });
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('files');
    },
};
