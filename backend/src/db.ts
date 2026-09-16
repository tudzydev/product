import "dotenv/config";
import { Sequelize, DataTypes, Model, CreationOptional, InferAttributes, InferCreationAttributes } from 'sequelize';

const dbUrl = process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL || process.env.POSTGRES_URL;
const host = process.env.PGHOST || process.env.PGHOST_UNPOOLED || process.env.DB_HOST || "localhost";
const isRemote = Boolean((dbUrl && !dbUrl.includes("localhost") && !dbUrl.includes("127.0.0.1")) || (host && host !== "localhost" && host !== "127.0.0.1"));

const sslConfig = isRemote
  ? {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    }
  : {};

const sequelize = dbUrl
  ? new Sequelize(dbUrl, {
      dialect: "postgres",
      logging: false,
      dialectOptions: sslConfig,
    })
  : new Sequelize(
      process.env.PGDATABASE || process.env.DB_NAME || "product_db",
      process.env.PGUSER || process.env.DB_USER || "postgres",
      process.env.PGPASSWORD || process.env.DB_PASSWORD || "postgres",
      {
        host,
        port: Number(process.env.PGPORT || process.env.DB_PORT) || (isRemote ? 5432 : 5433),
        dialect: "postgres",
        logging: false,
        dialectOptions: sslConfig,
      }
    );

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
