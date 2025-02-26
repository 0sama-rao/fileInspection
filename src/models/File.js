import { AbstractModel } from './AbstractModel';

export default (sequelize, DataTypes) => {
    class File extends AbstractModel {
        static associate(models) {}
    }

    File.init(
        {
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                allowNull: false,
                primaryKey: true,
            },
            userId: {
                type: DataTypes.UUID,
                allowNull: true,
            },
            sessionId: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            originalName: {
                type: DataTypes.STRING(255),
                allowNull: false,
            },
            filename: {
                type: DataTypes.STRING(255),
                allowNull: false,
            },
            size: {
                type: DataTypes.BIGINT,
                allowNull: false,
            },
            mimeType: {
                type: DataTypes.STRING(100),
                allowNull: false,
            },
            fileHash: {
                type: DataTypes.STRING(64),
                allowNull: false,
            },
            createdAt: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: DataTypes.NOW,
            },
            updatedAt: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: DataTypes.NOW,
            },
        },
        {
            sequelize,
            modelName: 'files',
            timestamps: true,
        }
    );

    return File;
};
