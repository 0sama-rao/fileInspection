'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('users', {
            id: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
                allowNull: false,
                primaryKey: true,
            },
            role_id: {
                type: Sequelize.INTEGER.UNSIGNED,
                allowNull: true,  // ✅ Allow NULL to prevent constraint errors
                references: {
                    model: 'roles',
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'SET NULL',
            },
            full_name: {
                type: Sequelize.STRING(100),
                allowNull: false,
            },
            email: {
                type: Sequelize.STRING(100),
                allowNull: false,
                unique: true,
            },
            password: {
                type: Sequelize.STRING(255),
                allowNull: false,
            },
            subscription_type: {
                type: Sequelize.ENUM('free', 'basic', 'premium'),
                defaultValue: 'free',
                allowNull: false,
            },
            status: {
                type: Sequelize.ENUM('pending', 'active', 'blocked'),
                defaultValue: 'active',
                allowNull: false,
            },
            verified_at: {
                type: Sequelize.DATE,
                allowNull: true,
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

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('users');
    },
};
