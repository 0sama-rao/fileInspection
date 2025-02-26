import { AbstractModel } from './AbstractModel';
import translate from '../helpers/translate';

export default (sequelize, DataTypes) => {
    class User extends AbstractModel {
        static associate(models) {}
    }

    User.init(
        {
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                allowNull: false,
                primaryKey: true,
            },
            role_id: {
                type: DataTypes.INTEGER.UNSIGNED,
                allowNull: false,
                validate: {
                    notNull: {
                        args: true,
                        msg: translate('validations', 'required', {
                            ':attribute': 'Role Id',
                        }),
                    },
                },
            },
            full_name: {
                type: DataTypes.STRING(100),
                allowNull: false,
            },
            email: {
                type: DataTypes.STRING(100),
                allowNull: false,
                unique: true,
            },
            password: {
                type: DataTypes.STRING(255),
                allowNull: false,
            },
            subscription_type: {
                type: DataTypes.ENUM('free', 'basic', 'premium'),
                defaultValue: 'free',
                allowNull: false,
            },
            status: {
                type: DataTypes.ENUM('pending', 'active', 'blocked'),
                defaultValue: 'active',
                allowNull: false,
            },
            verified_at: {
                type: DataTypes.DATE,
                allowNull: true,
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
            modelName: 'users',
            timestamps: true,
        }
    );

    return User;
};
