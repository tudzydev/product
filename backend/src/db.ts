import "dotenv/config";
import { Sequelize, DataTypes, Model, CreationOptional, InferAttributes, InferCreationAttributes } from 'sequelize';
import * as neon from '@neondatabase/serverless';
import ws from 'ws';

neon.neonConfig.webSocketConstructor = ws;

const rawDbUrl = process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL || process.env.POSTGRES_URL;
const host = process.env.PGHOST || process.env.PGHOST_UNPOOLED || process.env.DB_HOST || "localhost";
const isNeon = Boolean((rawDbUrl && rawDbUrl.includes("neon.tech")) || (host && host.includes("neon.tech")));
const isRemote = Boolean(isNeon || (rawDbUrl && !rawDbUrl.includes("localhost") && !rawDbUrl.includes("127.0.0.1")) || (host && host !== "localhost" && host !== "127.0.0.1"));

// Construct connection URL if not provided directly
const dbUrl = rawDbUrl || (
  isRemote
    ? `postgresql://${process.env.PGUSER}:${process.env.PGPASSWORD}@${host}:${process.env.PGPORT || 5432}/${process.env.PGDATABASE}?sslmode=require`
    : undefined
);

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
      ...(isNeon ? { dialectModule: neon } : {}),
      logging: false,
      dialectOptions: sslConfig,
    })
  : new Sequelize(
      process.env.PGDATABASE || process.env.DB_NAME || "product_db",
      process.env.PGUSER || process.env.DB_USER || "postgres",
      process.env.PGPASSWORD || process.env.DB_PASSWORD || "postgres",
      {
        host,
        port: Number(process.env.PGPORT || process.env.DB_PORT) || 5433,
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
        console.log('✅ Connection to database has been established successfully.');
        await sequelize.sync();
        console.log('✅ Database synchronized successfully.');
    } catch (error) {
        console.error('❌ Unable to connect to the database:', error);
        throw error;
    }
};

export { sequelize, Product, connectDB };
