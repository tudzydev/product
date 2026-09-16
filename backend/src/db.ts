import { Sequelize, DataTypes, Model, CreationOptional, InferAttributes, InferCreationAttributes } from 'sequelize';

const sequelize = new Sequelize('product_db', 'postgres', 'postgres', {
    host: 'localhost',
    port: 5433,
    dialect: 'postgres',
    logging: false,
});

export interface ProductModel extends Model<InferAttributes<ProductModel>, InferCreationAttributes<ProductModel>> {
    id: CreationOptional<number>;
    name: string;
    price: number;
}

const Product = sequelize.define<ProductModel>('Product', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    price: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
}, {
    tableName: 'products',
    timestamps: false,
});

const connectDB = async (): Promise<void> => {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
        await sequelize.sync({ alter: true });
        console.log('Database synchronized successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
        process.exit(1);
    }
};

export { sequelize, Product, connectDB };
