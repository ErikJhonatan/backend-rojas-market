const { Model, DataTypes, Sequelize } = require('sequelize');
const ORDER_PRODUCT_TABLE = 'order_product';

const OrderProductSchema =  {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER
  },
  orderId: {
    allowNull: false,
    type: DataTypes.INTEGER,
    references: {
      model: 'orders',
      key: 'id'
    },
    field: 'order_id',
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE'
  },
  productId: {
    allowNull: false,
    type: DataTypes.INTEGER,
    field: 'product_id',
    references: {
      model: 'products',
      key: 'id'
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE'
  },
  amount: {
    field: 'amount',
    allowNull: false,
    type: DataTypes.INTEGER
  },
  createdAt: {
    allowNull: false,
    field: 'created_at',
    type: DataTypes.DATE,
    defaultValue: Sequelize.NOW
  }
};

class OrderProduct extends Model {
  static associate(models) {
    this.belongsTo(models.Order, { as: 'order' });
    this.belongsTo(models.Product, { as: 'product' });
  }

  static config(sequelize) {
    return {
      sequelize,
      tableName: ORDER_PRODUCT_TABLE,
      modelName: 'OrderProduct',
      timestamps: false
    }
  }
}

module.exports = { OrderProduct, OrderProductSchema, ORDER_PRODUCT_TABLE };
